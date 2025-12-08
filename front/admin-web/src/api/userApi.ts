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
