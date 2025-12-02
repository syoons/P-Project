package com.p_project.book;

import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
@Builder
public class BookDTO {

    // writing_sessions 테이블의 주요 필드
    private Long sessionId; // id
    private String title;
    private String emotion;
    private String genre;
    private String status;
    private LocalDateTime createdAt;

    // AI 추천 필드 (선택 사항)
    private String recommendTitle;
}