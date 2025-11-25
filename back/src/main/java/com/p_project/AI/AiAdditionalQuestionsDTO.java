package com.p_project.AI;

import lombok.Builder;
import lombok.Getter;

import java.util.List;
@Getter
@Builder
public class AiAdditionalQuestionsDTO {
    private List<String> questions;
}
