package com.p_project.writing;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WritingSessionDTO {

    private Long userId;
    private String title;
    private String type;
    private String genre;
    private String emotion;
    private String content;
    private LocalDateTime createdAt;

}

