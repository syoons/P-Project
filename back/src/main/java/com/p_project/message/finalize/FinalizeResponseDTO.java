package com.p_project.message.finalize;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
@Getter
@Builder
public class FinalizeResponseDTO {
    private Long sessionId;
    private String title;
    private String content;
    private String emotion;
    private int emotionCount;

    private String recommendTitle;
    private String recommendGenre;

    private LocalDate date;
}
