package com.p_project.message.feedback;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class FeedbackResponDTO {
    private Long sessionId;
    private Boolean done;
    private String question; // 추가 질문
}
