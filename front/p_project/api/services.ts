import { api } from "./client";
import axios from 'axios';

// 로그인 API
export async function loginUser(email: string, password: string) {
  const response = await api.post(`/api/users/login`, null, {
    params: {
      email,
      password,
    },
  });

  return response.data;
}

export async function registerUser(payload: any) {
  console.log("📡 [API] registerUser() 호출됨");
  console.log("➡️ [API REQUEST BODY]:", payload);

  try {
    const res = await api.post("/api/users/register", payload);

    console.log("⬅️ [API RESPONSE registerUser]:", res.data);
    return res.data;
  } catch (error: any) {
    console.log("❌ [API ERROR registerUser]");
    console.log("❗ status:", error.response?.status);
    console.log("❗ data:", error.response?.data);
    console.log("❗ headers:", error.response?.headers);
    console.log("❗ message:", error.message);
    throw error;
  }
}

export async function sendResetEmail(email: string) {
  const res = await api.post("/api/email/send", null, {
    params: { email },
  });
  return res.data;
}

// 이메일 인증 코드 검증
export async function verifyResetCode(email: string, code: string) {
  const res = await api.post("/api/email/verify", null, {
    params: { email, code },
  });
  return res.data;
}

// 비밀번호 재설정
export const resetPassword = async (email: string, newPassword: string) => {
  const payload = {
    email: email.trim(),
    newPassword: newPassword.trim(),
  };

  // POST 요청을 통해 비밀번호 변경
  return api.post('/api/users/reset-password', payload);
};


export const getUserProfile = async (userId: number) => {  // userId를 number로 설정
  try {
    const response = await api.get(`/api/myapge/${userId}`);
    return response.data;  // 서버에서 받은 프로필 정보
  } catch (error) {
    console.error("프로필 정보 가져오기 실패:", error);
    throw error;  // 에러 발생 시 throw
  }
};


export async function updateUserProfile(userId: number, email: string, nickName: string, gender: string, birthDate: string) {
  const payload = {
    userId,
    email,
    nickName,
    gender,
    birthDate,
  };

  try {
    const response = await api.post(`/api/myapge/update/${userId}`, payload);
    return response.data;
  } catch (error) {
    console.error('프로필 업데이트 실패:', error);
    throw error; // 실패 시 에러 던지기
  }
}


export async function uploadProfileImage(userId: number, file: FormData) {
  const res = await api.post(`/api/myapge/profile`, file, {
    params: { userId },
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
}

// 친구 요청 조회
export async function getFriendRequests(userId: number) {
  const res = await api.get(`/api/friend/requests/${userId}`);
  return res.data;
}

// 친구 추가 요청 보내기
export async function sendFriendRequest(fromUserId: number, email: string) {
  const res = await api.post("/api/friend/request", null, {
    params: { fromUserId, email }
  });
  return res.data;
}

// 친구 요청 수락
export async function acceptFriendRequest(fromUserId: number, toUserId: number) {
  const res = await api.post("/api/friend/accept", null, {
    params: { fromUserId, toUserId }
  });
  return res.data;
}

// 친구 요청 거절
export async function rejectFriendRequest(fromUserId: number, toUserId: number) {
  const res = await api.post("/api/friend/request/delete", null, {
    params: { fromUserId, toUserId }
  });
  return res.data;
}

// 친구 삭제
export async function removeFriend(fromUserId: number, toUserId: number) {
  const res = await api.post("/api/friend/request/delete", null, {
    params: { fromUserId, toUserId }
  });
  return res.data;
}

