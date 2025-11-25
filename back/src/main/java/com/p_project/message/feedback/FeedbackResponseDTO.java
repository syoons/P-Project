package com.p_project.message.feedback;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class FeedbackResponseDTO {
    private boolean done; // true면 종료
    private List<String> questions; // 추가 질문들
}
