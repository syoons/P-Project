package com.p_project.book;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Getter
@Table(name = "writing_sessions")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class BookEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private Type type; // enum('diary', 'book')

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status; // enum('COMPLETE', 'DRAFT', 'DELETED')

    private String emotion;
    private String genre;
    private String title;

    @Lob
    private String content;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    // ... updated_at, deleted_at 생략

    @Column(name = "recommend_title")
    private String recommendTitle;

    // AI 추천 필드
    @Column(name = "recommend_genre")
    private String recommendGenre;

    @Column(name = "extra_questions")
    private Integer extraQuestions;

    // ENUM 정의 (테이블 스키마에 따라 정의)
    public enum Type { DIARY, BOOK }
    public enum Status { COMPLETE, DRAFT, DELETED }
}