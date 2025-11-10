// app/profile/edit.tsx - 프로필 편집 화면
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { globalStyles, colors } from '../styles/globalStyles';

// User 타입을 수정하여 id를 선택적으로 변경
interface User {
  id?: number;
  username: string;
  email: string;
  gender: string;
  birthDate: string;
  name: string;
  joinDate?: string; // joinDate를 string | undefined로 수정
  profileImage?: string | null;
}

export default function ProfileEditScreen() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null); // user 상태
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [birthDate, setBirthDate] = useState('');

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

    // name이 undefined일 경우 빈 문자열로 처리
    const updatedUser: User = {
      ...(user || {}),
      username,
      email,
      gender,
      birthDate,
      name: user?.name || '', // name이 없으면 빈 문자열로 설정
    };

    try {
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      Alert.alert('성공', '프로필이 업데이트되었습니다.');
      router.back(); // 마이페이지로 돌아가기
    } catch (error) {
      console.error('사용자 데이터 저장 실패:', error);
      Alert.alert('오류', '프로필 업데이트 중 오류가 발생했습니다.');
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
        >
          <Text style={styles.buttonText}>저장</Text>
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
