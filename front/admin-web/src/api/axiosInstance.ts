// src/api/axiosInstance.ts
import axios from 'axios';
import { getToken } from '../utils/auth';

// 환경 변수에서 API 기본 URL을 가져옵니다. 설정되지 않은 경우 배포된 서버를 사용합니다.
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://ceprj.gachon.ac.kr:60013';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 요청 인터셉터: 모든 요청에 자동으로 토큰을 포함시킵니다.
axiosInstance.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터: 에러 처리를 공통화할 수 있습니다.
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // 예: 401 에러 시 로그아웃 처리 등
        if (error.response && error.response.status === 401) {
            console.warn('Unauthorized access - redirecting to login...');
            // window.location.href = '/login'; // 필요 시 주석 해제
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
