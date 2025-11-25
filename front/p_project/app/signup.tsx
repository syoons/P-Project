import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router'; // expo-router 사용
import AsyncStorage from '@react-native-async-storage/async-storage';
import { globalStyles } from '../styles/globalStyles';
import { registerUser } from '../api/services';

export default function SignupScreen() {
  const router = useRouter(); // expo-router의 router 훅 사용
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [gender, setGender] = useState(''); // 성별 추가
  const [birthDate, setBirthDate] = useState(''); // 생년월일 추가

  const handleSignup = async () => {
    console.log("🔥 [SIGNUP] 시작");
    console.log("📝 email:", email);
  console.log("📝 username:", username);
  console.log("📝 gender:", gender);
  console.log("📝 birthDate:", birthDate);

    // 모든 정보가 입력되었는지 확인
    if (!email.trim() || !password.trim() || !confirmPassword.trim() || !username.trim() || !gender || !birthDate) {
      Alert.alert('알림', '모든 정보를 입력해주세요.');
      return;
    }

    // 이메일 형식 검사
    if (!email.includes('@')) {
      Alert.alert('알림', '올바른 이메일 주소를 입력해주세요.');
      return;
    }

    // 비밀번호 확인
    if (password !== confirmPassword) {
      Alert.alert('알림', '비밀번호가 일치하지 않습니다.');
      return;
    }

    // 비밀번호 길이 검사
    if (password.length < 6) {
      Alert.alert('알림', '비밀번호는 6자 이상이어야 합니다.');
      return;
    }

    setLoading(true);

    try {
      // 🔥 백엔드에 보낼 Request Body 구성
      const payload = {
        name: username.trim(),          // 이름
        nickname: username.trim(),      // 닉네임
        email: email.trim(),
        pwd: password.trim(),           // 🔥 필드명 주의: pwd
        gender,
        birthDate,
        provider: "local",
        providerUserId: null,
        profileImage: null,
        role: "user",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null
      };
       console.log("📦 [SIGNUP PAYLOAD]:", payload);

      // 🔥 실제 회원가입 API 호출
      const data = await registerUser(payload);
       console.log("⬅️ [SIGNUP SUCCESS RESPONSE]:", data);

      // 🔥 응답 데이터 AsyncStorage에 저장 (로그인 유지)
      await AsyncStorage.setItem("user", JSON.stringify(data));

      Alert.alert("성공", "회원가입이 완료되었습니다!", [
        { text: "확인", onPress: () => router.replace("../(tabs)") },
      ]);
    } catch (error: any) {
      console.log("❌ [SIGNUP ERROR FRONT]", error);
    console.log("❗ error.response?.status:", error.response?.status);
    console.log("❗ error.response?.data:", error.response?.data);
    console.log("❗ error.message:", error.message);
      console.log(error.response?.data);
      Alert.alert("오류", "회원가입 중 문제가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={globalStyles.screen}>
      <View style={globalStyles.loginContainer}>
        <Text style={globalStyles.title}>회원가입</Text>

        {/* 이메일 */}
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

        {/* 닉네임 */}
        <View style={globalStyles.inputContainer}>
          <Text style={globalStyles.inputLabel}>닉네임</Text>
          <TextInput
            style={globalStyles.textInput}
            value={username}
            onChangeText={setUsername}
            placeholder="사용할 닉네임을 입력하세요"
          />
        </View>

        {/* 비밀번호 */}
        <View style={globalStyles.inputContainer}>
          <Text style={globalStyles.inputLabel}>비밀번호</Text>
          <TextInput
            style={globalStyles.textInput}
            value={password}
            onChangeText={setPassword}
            placeholder="비밀번호를 입력하세요 (6자 이상)"
            secureTextEntry
          />
        </View>

        {/* 비밀번호 확인 */}
        <View style={globalStyles.inputContainer}>
          <Text style={globalStyles.inputLabel}>비밀번호 확인</Text>
          <TextInput
            style={globalStyles.textInput}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="비밀번호를 다시 입력하세요"
            secureTextEntry
          />
        </View>

        {/* 성별 */}
        <View style={globalStyles.inputContainer}>
          <Text style={globalStyles.inputLabel}>성별</Text>
          <TextInput
            style={globalStyles.textInput}
            value={gender}
            onChangeText={setGender}
            placeholder="성별을 입력하세요"
          />
        </View>

        {/* 생년월일 */}
        <View style={globalStyles.inputContainer}>
          <Text style={globalStyles.inputLabel}>생년월일</Text>
          <TextInput
            style={globalStyles.textInput}
            value={birthDate}
            onChangeText={setBirthDate}
            placeholder="생년월일을 입력하세요 (YYYY-MM-DD)"
          />
        </View>

        {/* 가입 버튼 */}
        <TouchableOpacity 
          style={[globalStyles.button, globalStyles.primaryButton, loading && globalStyles.disabledButton]} 
          onPress={handleSignup}
          disabled={loading}
        >
          <Text style={globalStyles.buttonText}>
            {loading ? '가입 중...' : '가입하기'}
          </Text>
        </TouchableOpacity>

        {/* 버튼들 사이에 간격 추가 */}
        <View style={{ marginTop: 20 }}>
          <TouchableOpacity 
         style={[globalStyles.button, globalStyles.secondaryButton]} 
         onPress={() => router.push('/')} // 로그인 화면으로 이동
              >
           <Text style={globalStyles.secondaryButtonText}>로그인으로 돌아가기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
