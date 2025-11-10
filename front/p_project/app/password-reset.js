import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { globalStyles } from '../styles/globalStyles';

export default function PasswordResetScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async () => {
    if (!email.trim()) {
      Alert.alert('알림', '이메일을 입력해주세요.');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('알림', '올바른 이메일 주소를 입력해주세요.');
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      setSent(true);
      setLoading(false);
      Alert.alert('전송 완료', '비밀번호 재설정 링크를 이메일로 전송했습니다.');
    }, 1000);
  };

  return (
    <View style={globalStyles.screen}>
      <View style={globalStyles.loginContainer}>
        <Text style={globalStyles.title}>비밀번호 재설정</Text>
        <Text style={[globalStyles.subtitle, { marginBottom: 20 }]}>
          가입한 이메일 주소를 입력해주세요
        </Text>

        <View style={globalStyles.inputContainer}>
          <Text style={globalStyles.inputLabel}>이메일</Text>
          <TextInput
            style={globalStyles.textInput}
            value={email}
            onChangeText={setEmail}
            placeholder="가입한 이메일을 입력하세요"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {sent && (
          <View style={globalStyles.successMessage}>
            <Text style={globalStyles.successText}>
              ✅ 재설정 링크가 전송되었습니다!{'\n'}
              이메일을 확인해주세요.
            </Text>
          </View>
        )}

        {/* 간격 추가 */}
        <View style={{ marginTop: 20 }}>
          <TouchableOpacity 
            style={[globalStyles.button, globalStyles.primaryButton, (loading || sent) && globalStyles.disabledButton]} 
            onPress={handleReset}
            disabled={loading || sent}
          >
            <Text style={globalStyles.buttonText}>
              {loading ? '전송 중...' : sent ? '전송 완료' : '재설정 링크 보내기'}
            </Text>
          </TouchableOpacity>

          {/* 간격을 두고 버튼 추가 */}
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
    </View>
  );
}
