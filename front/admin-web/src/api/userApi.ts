// src/api/userApi.ts
import axiosInstance from './axiosInstance';

// 회원 목록 조회 요청 파라미터 인터페이스
export interface GetUsersParams {
    searchType?: 'name' | 'email'; // 검색 타입 (이름, 이메일)
    keyword?: string; // 검색어
    page?: number; // 페이지 수 (0부터 시작)
    size?: number; // 한 페이지 사이즈
}

// 회원 정보 인터페이스
export interface User {
    id: number;
    nickname: string;
    email: string;
    birthGroup: string;
    postCount: number;
    lastActive: string;
    createdAt: string;
    deletedAt?: string | null; // 탈퇴 여부 확인용
}

// 페이징 정보 인터페이스
export interface Pageable {
    pageNumber: number;
    pageSize: number;
    sort: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
}

// 회원 목록 조회 응답 인터페이스
export interface GetUsersResponse {
    content: User[];
    pageable: Pageable;
    last: boolean;
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    sort: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
    };
    first: boolean;
    numberOfElements: number; // 문서에는 "numberOfElements":"empty":false 로 되어있으나 오타로 추정되어 수정함
    empty: boolean;
}

/**
 * 회원 목록을 조회합니다.
 * GET /admin/dashboard/users
 */
export const getUsers = async (params: GetUsersParams): Promise<GetUsersResponse> => {
    const response = await axiosInstance.get<GetUsersResponse>('/admin/dashboard/users', {
        params,
    });
    return response.data;
};

// 로그인 요청 인터페이스
export interface LoginRequest {
    email: string;
    pwd?: string;
    password?: string;
}

/**
 * 관리자 로그인을 요청합니다.
 * POST /api/admin/login
 */
export const loginAdmin = async (data: LoginRequest): Promise<string> => {
    // pwd 필드로 전송 시도
    const payload = {
        email: data.email,
        pwd: data.password || data.pwd
    };

    const response = await axiosInstance.post('/api/admin/login', payload);

    // 응답 처리는 실제 데이터 구조에 따라 달라질 수 있음
    // 1. 응답 본문이 바로 토큰 문자열인 경우
    if (typeof response.data === 'string') {
        return response.data;
    }

    // 2. 객체 내부에 토큰이 있는 경우 (예: token, accessToken)
    if (response.data.token) {
        return response.data.token;
    }

    if (response.data.accessToken) {
        return response.data.accessToken;
    }

    // 3. 응답이 단순 OK이고 토큰이 없는 경우 (예외적 상황)
    console.warn('Response data:', response.data);
    throw new Error('서버 응답에서 토큰을 찾을 수 없습니다.');
};


// 비밀번호 변경 요청 인터페이스
export interface ChangePasswordRequest {
    email: string;
    currentPassword?: string; // 기존 비밀번호 (필수일 수 있음)
    newPassword: string;
}



/**
 * 관리자 비밀번호를 변경합니다.
 * POST /api/admin/change-password
 */
export const changePassword = async (data: ChangePasswordRequest): Promise<void> => {
    // Swagger API 명세 확인 결과: Request Body가 UserDTO 구조임
    // UserDTO: { email, pwd, ... }
    // 별도의 newPassword 필드가 없으므로, pwd 필드에 새 비밀번호를 담아서 보냄.
    // 또한 전체 필드 업데이트 로직일 수 있어 필수 필드 누락 방지를 위해 더미 데이터 추가
    const payload = {
        email: data.email,
        pwd: data.newPassword,
        name: 'admin',
        nickname: 'admin', // 필수값일 가능성 대비
        role: 'ADMIN',     // 필수값일 가능성 대비
        gender: 'UNKNOWN'  // 필수값일 가능성 대비
    };

    // 응답이 UserDTO 또는 성공시 200 OK
    await axiosInstance.post('/api/admin/change-password', payload);
};
