import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { globalStyles, colors } from '../../styles/globalStyles';
import { getFriends, getFriendRequests, sendFriendRequest, acceptFriendRequest, rejectFriendRequest, removeFriend } from '../../api/services';

export default function FriendsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('list');
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFriendUsername, setNewFriendUsername] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        // API 호출 - 친구 목록과 친구 요청 목록 가져오기
        const friendsData = await getFriends(user.id);
        const requestsData = await getFriendRequests(user.id);
        
        setFriends(friendsData);
        setFriendRequests(requestsData);
      }
    } catch (error) {
      console.error('친구 데이터 로드 실패:', error);
      Alert.alert("오류", "데이터 로드 실패");
    }
  };

  // 친구 추가 요청
  const addFriend = async () => {
    if (!newFriendUsername.trim()) {
      Alert.alert('알림', '친구의 닉네임을 입력해주세요.');
      return;
    }

    try {
      const userData = await AsyncStorage.getItem('user');
      const user = JSON.parse(userData);
      await sendFriendRequest(user.id, newFriendUsername);
      Alert.alert('완료', `${newFriendUsername}님께 친구 요청을 보냈습니다.`);
      setNewFriendUsername('');
      setShowAddModal(false);
      loadData(); // 친구 목록과 요청 목록을 다시 불러오기
    } catch (error) {
      console.error('친구 요청 보내기 실패:', error);
      Alert.alert('오류', '친구 요청 보내기 실패');
    }
  };

  // 친구 삭제
  const removeFriendHandler = async (friendId) => {
    try {
      const userData = await AsyncStorage.getItem('user');
      const user = JSON.parse(userData);
      await removeFriend(user.id, friendId); // 친구 삭제 API
      loadData(); // 친구 목록 갱신
      Alert.alert('완료', '친구가 삭제되었습니다.');
    } catch (error) {
      console.error('친구 삭제 실패:', error);
      Alert.alert('오류', '친구 삭제 실패');
    }
  };

  // 친구 요청 수락
  const acceptRequestHandler = async (requestId) => {
    try {
      const request = friendRequests.find(r => r.id === requestId);
      if (request) {
        const userData = await AsyncStorage.getItem('user');
        const user = JSON.parse(userData);
        await acceptFriendRequest(user.id, request.id);
        loadData(); // 친구 목록과 요청 목록 갱신
        Alert.alert('완료', `${request.username}님과 친구가 되었습니다!`);
      }
    } catch (error) {
      console.error('친구 요청 수락 실패:', error);
      Alert.alert('오류', '친구 요청 수락 실패');
    }
  };

  // 친구 요청 거절
  const rejectRequestHandler = async (requestId) => {
    try {
      const userData = await AsyncStorage.getItem('user');
      const user = JSON.parse(userData);
      await rejectFriendRequest(user.id, requestId);
      loadData(); // 친구 요청 목록 갱신
      Alert.alert('완료', '친구 요청을 거절했습니다.');
    } catch (error) {
      console.error('친구 요청 거절 실패:', error);
      Alert.alert('오류', '친구 요청 거절 실패');
    }
  };

  // 친구 목록 탭
  const FriendListTab = () => {
    return (
      <View>
        <View style={styles.friendActions}>
          <TextInput
            style={globalStyles.searchInput}
            placeholder="친구 검색..."
            value={searchText}
            onChangeText={setSearchText}
          />
          <TouchableOpacity onPress={() => setShowAddModal(true)} style={styles.addButton}>
            <Text style={styles.addButtonText}>+ 추가</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={globalStyles.scrollView}>
          {friends.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>👥</Text>
              <Text style={globalStyles.emptyText}>
                {searchText ? '검색 결과가 없습니다.' : '아직 친구가 없습니다.'}
              </Text>
            </View>
          ) : (
            friends.map((friend) => (
              <View key={friend.id} style={styles.friendCard}>
                <View style={styles.friendInfo}>
                  <Text>{friend.username}</Text>
                </View>
                <TouchableOpacity onPress={() => removeFriendHandler(friend.id)}>
                  <Text>삭제</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    );
  };

  // 친구 요청 탭
  const FriendRequestsTab = () => {
    return (
      <ScrollView style={globalStyles.scrollView}>
        {friendRequests.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📬</Text>
            <Text style={globalStyles.emptyText}>새로운 요청이 없습니다.</Text>
          </View>
        ) : (
          friendRequests.map((request) => (
            <View key={request.id} style={styles.requestCard}>
              <Text>{request.username}</Text>
              <TouchableOpacity onPress={() => acceptRequestHandler(request.id)}>
                <Text>수락</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => rejectRequestHandler(request.id)}>
                <Text>거절</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    );
  };

  return (
    <View style={globalStyles.screen}>
      <View style={globalStyles.header}>
        <Text style={globalStyles.title}>친구</Text>
      </View>
      <View style={styles.tabHeader}>
        <TouchableOpacity onPress={() => setActiveTab('list')} style={[styles.tab, activeTab === 'list' && styles.activeTab]}>
          <Text style={styles.tabText}>친구 목록</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('requests')} style={[styles.tab, activeTab === 'requests' && styles.activeTab]}>
          <Text style={styles.tabText}>친구 요청</Text>
        </TouchableOpacity>
      </View>
      {activeTab === 'list' ? <FriendListTab /> : <FriendRequestsTab />}
      <Modal visible={showAddModal}>
        <View>
          <TextInput
            placeholder="친구의 닉네임을 입력하세요"
            value={newFriendUsername}
            onChangeText={setNewFriendUsername}
          />
          <TouchableOpacity onPress={addFriend}>
            <Text>요청 보내기</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowAddModal(false)}>
            <Text>취소</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = {
  friendActions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 25,
  },
  addButtonText: {
    color: colors.white,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyIcon: {
    fontSize: 50,
    marginBottom: 20,
  },
  friendCard: {
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  friendInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  tabHeader: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: colors.light,
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    color: colors.dark,
  },
  requestCard: {
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
};
