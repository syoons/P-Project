// app.js
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { globalStyles } from '../styles/globalStyles'; // 글로벌 스타일

// 앱 초기화 및 라우팅 설정
export default function App() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
        router.push('/home');  // 로그인된 사용자는 홈 화면으로 이동
      } else {
        router.push('/login'); // 로그인되지 않은 사용자는 로그인 화면으로 이동
      }
    } catch (error) {
      console.error('데이터 불러오기 실패:', error);
    }
  };

  return null; // 실제 화면은 expo-router에서 관리
}
