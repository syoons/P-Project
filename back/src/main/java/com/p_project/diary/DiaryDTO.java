package com.p_project.diary;

import com.p_project.writing.WritingSessionEntity;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DiaryDTO {

    private Long id;
    private String title;
    private String content;
    private String genre;
    private String emotion;
    private LocalDate createdAt;

    public static DiaryDTO fromEntity(WritingSessionEntity entity) {
        return DiaryDTO.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .content(entity.getContent())
                .genre(entity.getGenre())
                .emotion(entity.getEmotion())
                .createdAt(entity.getCreatedAt().toLocalDate()) // LocalDateTime → LocalDate 변환
                .build();
    }

}
