package com.p_project.message.feedback;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FeedbackRequestDTO {
    private Long sessionId;
    private boolean satisfied;
    private int addN; // 추가 질문 개수
}
