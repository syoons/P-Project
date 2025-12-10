import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateUserProfile } from '../api/services';  // API 서비스 추가
import { globalStyles, colors } from '../styles/globalStyles';

interface User {
  id: number;
  username: string;
  email: string;
  gender: string;
  birthDate: string;
  name: string;
  joinDate?: string;
  profileImage?: string | null;
}

export default function ProfileEditScreen() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null); // user 상태
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  // 사용자 데이터 로드
  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const parsedUserData = JSON.parse(userData);
        setUser(parsedUserData); // user 상태에 기존 데이터를 저장
        setUsername(parsedUserData.username);
        setEmail(parsedUserData.email);
        setGender(parsedUserData.gender || ''); // 기본값 추가
        setBirthDate(parsedUserData.birthDate || ''); // 기본값 추가
      }
    } catch (error) {
      console.error('사용자 데이터 불러오기 실패:', error);
    }
  };

  // 저장 버튼 클릭 시
  const handleSave = async () => {
  if (!username.trim() || !email.trim() || !gender.trim() || !birthDate.trim()) {
    Alert.alert('알림', '모든 필드를 채워주세요.');
    return;
  }
  if (!user?.id) {
    Alert.alert('오류', '사용자 정보를 찾을 수 없습니다. 다시 로그인 해주세요.');
    return;
  }

  setLoading(true);
  try {

    const updatedUser = await updateUserProfile(user.id, email, username, gender, birthDate);
    await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    Alert.alert('성공', '프로필이 업데이트되었습니다.');
    router.back(); 
  } catch (error) {
    console.error('사용자 데이터 저장 실패:', error);
    Alert.alert('오류', '프로필 업데이트 중 오류가 발생했습니다.');
  } finally {
    setLoading(false);
  }
};

  return (
    <View style={globalStyles.screen}>
      <View style={globalStyles.header}>
        <Text style={globalStyles.title}>프로필 편집</Text>
      </View>

      <View style={styles.card}>
        {/* 사용자 이름 입력 */}
        <TextInput
          style={styles.textInput}
          value={username}
          onChangeText={setUsername}
          placeholder="사용자 이름"
        />

        {/* 이메일 입력 */}
        <TextInput
          style={styles.textInput}
          value={email}
          onChangeText={setEmail}
          placeholder="이메일"
          keyboardType="email-address"
        />

        {/* 성별 입력 */}
        <TextInput
          style={styles.textInput}
          value={gender}
          onChangeText={setGender}
          placeholder="성별"
        />

        {/* 생일 입력 */}
        <TextInput
          style={styles.textInput}
          value={birthDate}
          onChangeText={setBirthDate}
          placeholder="생일 (YYYY-MM-DD)"
        />

        {/* 저장 버튼 */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? '저장 중...' : '저장'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    padding: 25,
    borderRadius: 12,
    marginTop: 20,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
  },
  textInput: {
    backgroundColor: colors.light,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 18,
    fontSize: 16,
    marginBottom: 20,
    color: colors.dark,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    color: colors.white,
    fontWeight: '600',
  },
});
