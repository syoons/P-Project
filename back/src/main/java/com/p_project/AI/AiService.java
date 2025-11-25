package com.p_project.AI;

import com.p_project.message.MessagesEntity;
import com.p_project.writing.WritingSessionEntity;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AiService {

    public String generateFirstQuestion(WritingSessionEntity.Type type) {

        if (type == WritingSessionEntity.Type.diary) {
            return "오늘 하루 중 가장 기억에 남는 순간은 무엇이었나요?";
        } else {
            return "최근 읽은 책은 무엇이며, 선택한 이유는 무엇인가요?";
        }

        // 실제 구현 시 → 프롬프트 넣고 OpenAI API 호출
    }

    public AiResponseDTO generateNextQuestion(List<MessagesEntity> messages) {

        // TODO: 실제 AI API 연동 부분

        // 임시 Mock 로직
        return AiResponseDTO.builder()
                .nextQuestion("그 일은 당신에게 어떤 감정을 느끼게 했나요?")
                .emotion("neutral")
                .build();
    }

    public AiFinalizeResponseDTO generateFinalText(List<MessagesEntity> messages) {

        // TODO: 실제 OpenAI API 호출 구현

        return AiFinalizeResponseDTO.builder()
                .content("당신의 하루는 ... (AI가 정리한 완성글)")
                .emotion("행복")
                .recommendTitle("Happy - Pharrell Williams")
                .recommendGenre("Pop")
                .build();
    }

    public AiAdditionalQuestionsDTO generateAdditionalQuestions(List<MessagesEntity> messages, int n) {

        // TODO: 실제 AI API 연동

        // 임시 Mock
        List<String> list = new ArrayList<>();
        for (int i = 1; i <= n; i++) {
            list.add("추가 질문 " + i + "을 생성했습니다. 더 자세히 이야기해 줄 수 있나요?");
        }

        return AiAdditionalQuestionsDTO.builder()
                .questions(list)
                .build();
    }

}
