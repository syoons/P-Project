import axios from "axios";

export const api = axios.create({
  baseURL: "http://ceprj.gachon.ac.kr:60013", // 🔥 여기에 백엔드 주소
  timeout: 5000,
});

console.log("🟩 [client.ts] api 객체 생성됨:", typeof api);

