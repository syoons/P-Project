package com.p_project.AI;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AiFinalizeResponseDTO {
    private String content;
    private String emotion;
    private String recommendTitle;
    private String recommendGenre;
}
