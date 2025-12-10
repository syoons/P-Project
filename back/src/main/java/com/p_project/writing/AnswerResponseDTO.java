package com.p_project.writing;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AnswerResponseDTO {
    private String nextQuestion;
    private String emotion;
    private boolean finalize;  // 마지막 질문인지 여부
    private int currentIndex;      // 현재 질문 번호
    private int totalQuestions;    // 전체 질문 수
}
