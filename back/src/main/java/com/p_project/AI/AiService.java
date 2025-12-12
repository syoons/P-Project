package com.p_project.AI;

import com.p_project.message.MessagesEntity;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class AiService {

    private final RestTemplate restTemplate;

    // 내부 FastAPI 서버 포트 (다른 팀이 안 쓰는 포트로 사용)
    private final String AI_SERVER_URL = "http://127.0.0.1:61299";

    // -----------------------------
    // 첫 질문
    // -----------------------------
    public String getFirstQuestion(String mode) {

        String url = AI_SERVER_URL + "/api/ai/start?mode=" + mode;

        Map res = restTemplate.getForObject(url, Map.class);

        return (String) res.get("question");
    }


    // -----------------------------
    // 다음 질문 생성
    // -----------------------------
    public AiResponseDTO generateNextQuestion(String mode, List<MessagesEntity> messages) {

        NextQuestionRequest req = NextQuestionRequest.from(mode, messages);

        NextQuestionResponse res = restTemplate.postForObject(
                AI_SERVER_URL + "/api/ai/next-question",
                req,
                NextQuestionResponse.class
        );

        return AiResponseDTO.builder()
                .nextQuestion(res.getNextQuestion())
                .emotion(res.getEmotion())
                .build();
    }

    // -----------------------------
    // 최종 글 생성
    // -----------------------------
    public AiFinalizeResponseDTO generateFinalText(String mode, List<MessagesEntity> messages) {

        FinalizeRequest req = FinalizeRequest.from(mode, messages);

        FinalizeResponse res = restTemplate.postForObject(
                AI_SERVER_URL + "/api/ai/finalize",
                req,
                FinalizeResponse.class
        );

        String recommendTitle = null;
        String recommendGenre = null;

        RecommendDTO recommend = res.getRecommend();

        if (recommend != null) {
            recommendTitle = recommend.getRecommend();

            // type 기반으로 genre 비슷한 개념 만들어줌
            // (음악 / 도서 구분용)
            recommendGenre = recommend.getType();
        }

        return AiFinalizeResponseDTO.builder()
                .content(res.getFinalText())
                .emotion(res.getDominantEmotion())
                .recommendTitle(recommendTitle)
                .recommendGenre(recommendGenre)
                .build();
    }
}
