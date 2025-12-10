package com.p_project.writing;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class StartResponseDTO {
    private Long sessionId;
    private String question;
}
