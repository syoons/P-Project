package com.p_project.AI;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AiResponseDTO {
    private String nextQuestion;
    private String emotion;
}
