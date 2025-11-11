// app/friends/index.js - 친구 화면
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { globalStyles, colors } from '../../styles/globalStyles';

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
      const [friendsData, requestsData] = await Promise.all([
        AsyncStorage.getItem('friends'),
        AsyncStorage.getItem('friendRequests')
      ]);

      if (friendsData) setFriends(JSON.parse(friendsData));
      if (requestsData) setFriendRequests(JSON.parse(requestsData));
    } catch (error) {
      console.error('친구 데이터 로드 실패:', error);
    }
  };

  const saveFriends = async (newFriends) => {
    try {
      await AsyncStorage.setItem('friends', JSON.stringify(newFriends));
      setFriends(newFriends);
    } catch (error) {
      console.error('친구 저장 실패:', error);
    }
  };

  const saveRequests = async (newRequests) => {
    try {
      await AsyncStorage.setItem('friendRequests', JSON.stringify(newRequests));
      setFriendRequests(newRequests);
    } catch (error) {
      console.error('요청 저장 실패:', error);
    }
  };

  const addFriend = () => {
    if (!newFriendUsername.trim()) {
      Alert.alert('알림', '친구의 닉네임을 입력해주세요.');
      return;
    }

    // 실제로는 서버에 친구 요청을 보냄
    Alert.alert('완료', `${newFriendUsername}님께 친구 요청을 보냈습니다.`);
    setNewFriendUsername('');
    setShowAddModal(false);

    // 데모용으로 요청 목록에 추가
    const newRequest = {
      id: Date.now(),
      username: newFriendUsername.trim(),
      date: new Date().toLocaleDateString(),
      status: 'pending'
    };
    saveRequests([...friendRequests, newRequest]);
  };

  const removeFriend = (friendId) => {
    Alert.alert(
      '친구 삭제',
      '정말 이 친구를 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        { 
          text: '삭제', 
          onPress: () => saveFriends(friends.filter(f => f.id !== friendId)),
          style: 'destructive' 
        }
      ]
    );
  };

  const acceptRequest = (requestId) => {
    const request = friendRequests.find(r => r.id === requestId);
    if (request) {
      const newFriend = {
        id: Date.now(),
        username: request.username,
        addedDate: new Date().toLocaleDateString(),
        status: 'active',
        lastActivity: '방금 전'
      };
      
      saveFriends([...friends, newFriend]);
      saveRequests(friendRequests.filter(r => r.id !== requestId));
      Alert.alert('완료', `${request.username}님과 친구가 되었습니다!`);
    }
  };

  const rejectRequest = (requestId) => {
    saveRequests(friendRequests.filter(r => r.id !== requestId));
  };

  const filteredFriends = friends.filter(friend => 
    friend.username.toLowerCase().includes(searchText.toLowerCase())
  );

  const tabs = [
    { key: 'list', label: '친구 목록', count: friends.length },
    { key: 'requests', label: '요청', count: friendRequests.length }
  ];

  return (
    <View style={globalStyles.screen}>
      {/* 헤더 */}
      <View style={globalStyles.header}>
        <Text style={globalStyles.title}>친구</Text>
      </View>

      {/* 탭 헤더 */}
      <View style={styles.tabHeader}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.activeTab]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>
              {tab.label} ({tab.count})
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === 'list' ? (
        <FriendListTab 
          friends={filteredFriends}
          searchText={searchText}
          setSearchText={setSearchText}
          removeFriend={removeFriend}
          setShowAddModal={setShowAddModal}
        />
      ) : (
        <FriendRequestsTab 
          friendRequests={friendRequests}
          acceptRequest={acceptRequest}
          rejectRequest={rejectRequest}
        />
      )}

      {/* 친구 추가 모달 */}
      <Modal
        visible={showAddModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={globalStyles.modalOverlay}>
          <View style={globalStyles.modalContent}>
            <Text style={globalStyles.modalTitle}>친구 추가</Text>
            <TextInput
              style={globalStyles.textInput}
              value={newFriendUsername}
              onChangeText={setNewFriendUsername}
              placeholder="친구의 닉네임을 입력하세요"
            />
            <View style={globalStyles.modalButtons}>
              <TouchableOpacity 
                style={[globalStyles.button, globalStyles.primaryButton, globalStyles.modalButton]}
                onPress={addFriend}
              >
                <Text style={globalStyles.buttonText}>요청 보내기</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[globalStyles.button, globalStyles.secondaryButton, globalStyles.modalButton]}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={globalStyles.secondaryButtonText}>취소</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// 친구 목록 탭 컴포넌트
const FriendListTab = ({ friends, searchText, setSearchText, removeFriend, setShowAddModal }) => {
  const router = useRouter();

  return (
    <>
      {/* 검색 및 추가 */}
      <View style={styles.friendActions}>
        <View style={styles.searchContainer}>
          <TextInput
            style={globalStyles.searchInput}
            placeholder="친구 검색..."
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
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
          friends.map((friend, index) => (
            <View key={index} style={styles.friendCard}>
              <View style={styles.friendInfo}>
                <View style={styles.friendAvatar}>
                  <Text style={styles.friendAvatarText}>👤</Text>
                </View>
                <View style={styles.friendDetails}>
                  <Text style={styles.friendName}>@{friend.username}</Text>
                  <Text style={styles.friendActivity}>최근 활동: {friend.lastActivity || '2일 전'}</Text>
                </View>
              </View>
              <View style={styles.friendActions}>
                <TouchableOpacity 
                  style={[globalStyles.button, globalStyles.dangerButton, globalStyles.smallButton]}
                  onPress={() => removeFriend(friend.id)}
                >
                  <Text style={globalStyles.buttonText}>삭제</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </>
  );
};

// 친구 요청 탭 컴포넌트
const FriendRequestsTab = ({ friendRequests, acceptRequest, rejectRequest }) => {
  return (
    <ScrollView style={globalStyles.scrollView}>
      {friendRequests.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📬</Text>
          <Text style={globalStyles.emptyText}>새로운 요청이 없습니다.</Text>
        </View>
      ) : (
        friendRequests.map((request, index) => (
          <View key={index} style={styles.requestCard}>
            <View style={styles.requestInfo}>
              <View style={styles.friendAvatar}>
                <Text style={styles.friendAvatarText}>👤</Text>
              </View>
              <View style={styles.requestDetails}>
                <Text style={styles.requestName}>@{request.username}</Text>
                <Text style={styles.requestDate}>{request.date}</Text>
              </View>
            </View>
            <View style={styles.requestActions}>
              <TouchableOpacity 
                style={[globalStyles.button, globalStyles.primaryButton, globalStyles.smallButton]}
                onPress={() => acceptRequest(request.id)}
              >
                <Text style={globalStyles.buttonText}>수락</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[globalStyles.button, globalStyles.secondaryButton, globalStyles.smallButton]}
                onPress={() => rejectRequest(request.id)}
              >
                <Text style={globalStyles.secondaryButtonText}>거절</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = {
  tabHeader: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 8,
    marginBottom: 20,
    overflow: 'hidden',
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
    color: colors.gray,
  },
  activeTabText: {
    color: colors.white,
    fontWeight: '600',
  },
  friendActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 10,
  },
  searchContainer: {
    flex: 1,
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 25,
  },
  addButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  friendInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  friendAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.light,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  friendAvatarText: {
    fontSize: 24,
  },
  friendDetails: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 4,
  },
  friendActivity: {
    fontSize: 12,
    color: colors.gray,
    marginBottom: 2,
  },
  friendActions: {
    flexDirection: 'row',
    gap: 8,
  },
  requestCard: {
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  requestInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  requestDetails: {
    flex: 1,
  },
  requestName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 4,
  },
  requestDate: {
    fontSize: 12,
    color: colors.gray,
  },
  requestActions: {
    flexDirection: 'row',
    gap: 8,
  },
};
