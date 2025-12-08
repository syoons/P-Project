// src/utils/auth.ts

/**
 * 인증 토큰을 가져오는 함수입니다.
 * 현재는 임시로 null을 반환하거나 하드코딩된 값을 반환하도록 설정할 수 있습니다.
 * 추후 localStorage 또는 상태 관리 라이브러리와 연동하여 구현해야 합니다.
 */
export const getToken = (): string | null => {
    // 예: return localStorage.getItem('accessToken');
    return null;
};
