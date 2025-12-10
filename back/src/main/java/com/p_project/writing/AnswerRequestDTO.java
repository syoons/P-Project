package com.p_project.writing;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AnswerRequestDTO {
    private Long sessionId;
    private String answer;
}
