package com.p_project.writing;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "writing_sessions")
public class WritingSessionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Type type;

    @Enumerated(EnumType.STRING)
    @Column(length = 45)
    private WritingStatus status;

    @Column(length = 45)
    private String genre;

    @Column(length = 45)
    private String emotion;

    @Column(length = 100)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(name = "recommend_title", length = 100)
    private String recommendTitle;

    @Column(name = "recommend_genre",length = 45)
    private String recommendGenre;

    @Column(name = "extra_questions")
    private Integer extraQuestions = 0;   // 추가 질문 개수

    @Column(name = "created_at",
            columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createdAt;

    @Column(name = "updated_at",
            columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    // Enum 정의 (DB의 enum('diary','book')과 매핑)
    public enum Type {
        diary,
        book
    }

    public enum WritingStatus {
        COMPLETE,   // 완료
        DRAFT,      // 작성 중
        DELETED    // 삭제
    }


    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
