// src/api/statsApi.ts
import axiosInstance from './axiosInstance';

// 시간대별 분포 인터페이스
export interface TimeDistribution {
    hour: number;
    count: number;
}

// 연령대별 분포 인터페이스
export interface AgeGroupDistribution {
    ageGroup: string;
    count: number;
}

// 유저 통계 응답 인터페이스
export interface GetUserStatsResponse {
    timeDistribution: TimeDistribution[];
    ageGroupDistribution: AgeGroupDistribution[];
}

// 독서 장르 통계 아이템 인터페이스
export interface BookGenreStat {
    genre: string | null;
    count: number;
}

// 독서 장르 통계 응답 인터페이스 (배열 형태)
export type GetBookGenreStatsResponse = BookGenreStat[];

/**
 * 유저 통계 대시보드 데이터를 조회합니다.
 * GET /admin/dashboard/userStats
 */
export const getUserStats = async (): Promise<GetUserStatsResponse> => {
    const response = await axiosInstance.get<GetUserStatsResponse>('/admin/dashboard/userStats');
    return response.data;
};

/**
 * 독서 장르 통계 데이터를 조회합니다.
 * GET /admin/dashboard/bookGenreStats
 */
export const getBookGenreStats = async (): Promise<GetBookGenreStatsResponse> => {
    const response = await axiosInstance.get<GetBookGenreStatsResponse>('/admin/dashboard/bookGenreStats');
    return response.data;
};
