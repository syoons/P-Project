import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { globalStyles } from '../styles/globalStyles';
import { sendResetEmail, verifyResetCode, resetPassword } from '../api/services';

export default function PasswordResetScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [resetting, setResetting] = useState(false);

  const handleSendEmail = async () => {
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('알림', '올바른 이메일을 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      await sendResetEmail(email);
      Alert.alert("전송 완료", "인증 코드를 이메일로 보냈습니다.");
      setSent(true);
    } catch (err: any) {
      console.log(err.response?.data);
      Alert.alert("오류", "이메일 전송 중 문제가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!code.trim()) {
      Alert.alert("알림", "인증 코드를 입력해주세요.");
      return;
    }

    setLoading(true);
    try {
      await verifyResetCode(email, code);
      setVerified(true);
      Alert.alert("인증 성공", "이제 새 비밀번호를 설정할 수 있습니다.");
    } catch (err: any) {
      console.log(err.response?.data);
      Alert.alert("오류", "인증 코드가 올바르지 않습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
  if (!newPassword.trim()) {
    Alert.alert('알림', '새 비밀번호를 입력해주세요.');
    return;
  }

  setResetting(true);
  try {
    // 비밀번호 재설정을 위한 POST 요청 호출
    await resetPassword(email, newPassword);

    Alert.alert("비밀번호 재설정 완료", "새 비밀번호가 성공적으로 변경되었습니다.");
    router.replace('./index'); // 로그인 화면으로 돌아가기
  } catch (err: any) {
    console.log(err.response?.data);
    Alert.alert("오류", "비밀번호 변경 중 문제가 발생했습니다.");
  } finally {
    setResetting(false);
  }
};


  return (
    <View style={globalStyles.screen}>
      <View style={globalStyles.loginContainer}>
        <Text style={globalStyles.title}>비밀번호 재설정</Text>

        {!sent && (
          <>
            <Text style={[globalStyles.subtitle, { marginBottom: 20 }]}>
              가입한 이메일 주소를 입력해주세요
            </Text>

            <View style={globalStyles.inputContainer}>
              <Text style={globalStyles.inputLabel}>이메일</Text>
              <TextInput
                style={globalStyles.textInput}
                value={email}
                onChangeText={setEmail}
                placeholder="이메일 입력"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity
              style={[globalStyles.button, globalStyles.primaryButton, loading && globalStyles.disabledButton]}
              onPress={handleSendEmail}
              disabled={loading}
            >
              <Text style={globalStyles.buttonText}>
                {loading ? "전송 중..." : "재설정 코드 보내기"}
              </Text>
            </TouchableOpacity>
          </>
        )}

        {sent && !verified && (
          <>
            <Text style={[globalStyles.subtitle, { marginTop: 20, marginBottom: 20 }]}>
              이메일로 받은 인증 코드를 입력해주세요
            </Text>

            <View style={globalStyles.inputContainer}>
              <Text style={globalStyles.inputLabel}>인증 코드</Text>
              <TextInput
                style={globalStyles.textInput}
                value={code}
                onChangeText={setCode}
                placeholder="코드를 입력하세요"
              />
            </View>

            <TouchableOpacity
              style={[globalStyles.button, globalStyles.primaryButton, loading && globalStyles.disabledButton]}
              onPress={handleVerifyCode}
              disabled={loading}
            >
              <Text style={globalStyles.buttonText}>
                {loading ? "확인 중..." : "코드 확인하기"}
              </Text>
            </TouchableOpacity>
          </>
        )}

        {verified && (
          <>
            <Text style={[globalStyles.subtitle, { marginTop: 20, marginBottom: 20 }]}>
              새 비밀번호를 입력해주세요
            </Text>

            <View style={globalStyles.inputContainer}>
              <Text style={globalStyles.inputLabel}>새 비밀번호</Text>
              <TextInput
                style={globalStyles.textInput}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="새 비밀번호 입력"
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              style={[globalStyles.button, globalStyles.primaryButton, resetting && globalStyles.disabledButton]}
              onPress={handleResetPassword}
              disabled={resetting}
            >
              <Text style={globalStyles.buttonText}>
                {resetting ? "변경 중..." : "비밀번호 변경하기"}
              </Text>
            </TouchableOpacity>
          </>
        )}

        <View style={{ marginTop: 20 }}>
          <TouchableOpacity
            style={[globalStyles.button, globalStyles.secondaryButton]}
            onPress={() => router.back()}
          >
            <Text style={globalStyles.secondaryButtonText}>로그인으로 돌아가기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
