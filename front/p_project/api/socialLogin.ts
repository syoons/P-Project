import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

WebBrowser.maybeCompleteAuthSession();

const BACKEND_URL = "http://ceprj.gachon.ac.kr:60013";

export async function socialLogin(provider: "kakao" | "google" | "naver") {
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: "pproject",
  });

  const authUrl = `${BACKEND_URL}/oauth2/authorization/${provider}`;

  const result = await WebBrowser.openAuthSessionAsync(
    authUrl,
    redirectUri
  );

  // 🔥 로그인 성공 여부 확인
  if (result.type === "success" && result.url) {
    const url = new URL(result.url);

    // URL에서 token 파싱
    const token = url.searchParams.get("token");

    if (token) {
      // 🔥 JWT 저장
      await AsyncStorage.setItem("accessToken", token);

      console.log("소셜 로그인 성공! 토큰 저장됨:", token);

      // 홈 화면 이동
      router.replace("../(tabs)");

      return token;
    }
  }

  console.warn("소셜 로그인 실패 또는 사용자 취소");
  return null;
}
