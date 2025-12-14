// src/utils/auth.ts

/**
 * 인증 토큰을 가져오는 함수입니다.
 * 현재는 임시로 null을 반환하거나 하드코딩된 값을 반환하도록 설정할 수 있습니다.
 * 추후 localStorage 또는 상태 관리 라이브러리와 연동하여 구현해야 합니다.
 */
const TOKEN_KEY = 'accessToken';

/**
 * 인증 토큰을 가져오는 함수입니다.
 */
export const getToken = (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
};

/**
 * 인증 토큰을 저장하는 함수입니다.
 */
export const setToken = (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
};

/**
 * 인증 토큰을 삭제하는 함수입니다. (로그아웃)
 */
export const removeToken = (): void => {
    localStorage.removeItem(TOKEN_KEY);
};

/**
 * 현재 로그인 여부를 확인하는 함수입니다.
 */
export const isAuthenticated = (): boolean => {
    return !!getToken();
};
