//index.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router'; // expo-router를 사용
import AsyncStorage from '@react-native-async-storage/async-storage';
import { globalStyles } from '../styles/globalStyles';


export default function LoginScreen() {
  const router = useRouter(); // expo-router의 router 훅 사용
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);


  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('알림', '이메일과 비밀번호를 입력해주세요.');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('알림', '올바른 이메일 주소를 입력해주세요.');
      return;
    }

    setLoading(true);

    // 실제 환경에서는 서버 API 호출
    setTimeout(async () => {
      try {
        const userData = {
          id: Date.now(),
          email: email.trim(),
          username: email.split('@')[0],
          name: email.split('@')[0],
          joinDate: new Date().toLocaleDateString(),
          profileImage: null
        };
        
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        router.replace('..//(tabs)'); // expo-router를 사용하여 경로 이동
      } catch (error) {
        Alert.alert('오류', '로그인 처리 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <View style={globalStyles.screen}>
      <View style={globalStyles.loginContainer}>
        <Text style={globalStyles.title}>끄적이조 📝</Text>

        <View style={globalStyles.inputContainer}>
          <Text style={globalStyles.inputLabel}>이메일</Text>
          <TextInput
            style={globalStyles.textInput}
            value={email}
            onChangeText={setEmail}
            placeholder="이메일을 입력하세요"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={globalStyles.inputContainer}>
          <Text style={globalStyles.inputLabel}>비밀번호</Text>
          <TextInput
            style={globalStyles.textInput}
            value={password}
            onChangeText={setPassword}
            placeholder="비밀번호를 입력하세요"
            secureTextEntry
          />
        </View>

        <TouchableOpacity 
          style={[globalStyles.button, globalStyles.primaryButton, loading && globalStyles.disabledButton]} 
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={globalStyles.buttonText}>
            {loading ? '로그인 중...' : '로그인'}
          </Text>
        </TouchableOpacity>

        {/* 간편 로그인 버튼 추가 */}
        <View style={globalStyles.socialLoginContainer}>
          <TouchableOpacity style={[globalStyles.socialButton, { backgroundColor: '#FEE500' }]} onPress={() => {}}>
            <Text style={globalStyles.socialButtonText}>카카오 로그인</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[globalStyles.socialButton, { backgroundColor: '#34b7f1' }]} onPress={() => {}}>
            <Text style={globalStyles.socialButtonText}>구글 로그인</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[globalStyles.socialButton, { backgroundColor: '#00C300' }]} onPress={() => {}}>
            <Text style={globalStyles.socialButtonText}>네이버 로그인</Text>
          </TouchableOpacity>
        </View>

        <View style={globalStyles.linkContainer}>
          <TouchableOpacity onPress={() => router.push('/signup')}>
            <Text style={globalStyles.linkText}>회원가입</Text>
          </TouchableOpacity>
          <Text style={globalStyles.linkSeparator}>|</Text>
          <TouchableOpacity onPress={() => router.push('/password-reset')}>
            <Text style={globalStyles.linkText}>비밀번호 재설정</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
