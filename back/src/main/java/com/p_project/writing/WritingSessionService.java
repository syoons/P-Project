package com.p_project.writing;

import jakarta.transaction.Transactional;
import com.p_project.AI.AiFinalizeResponseDTO;
import com.p_project.AI.AiResponseDTO;
import com.p_project.AI.AiService;
import com.p_project.message.MessageRepository;
import com.p_project.message.MessagesEntity;
import com.p_project.message.feedback.FeedbackRequestDTO;
import com.p_project.message.feedback.FeedbackResponseDTO;
import com.p_project.message.finalize.FinalizeRequestDTO;
import com.p_project.message.finalize.FinalizeResponseDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class WritingSessionService {

    private final WritingSessionRepository writingSessionRepository;
    private final MessageRepository messageRepository;
    private final AiService aiService; // AI 호출 담당 서비스

    public List<WritingSessionDTO> getRecentWritingSessions(Long userId) {
        Pageable limitFive = PageRequest.of(0, 5);
        return writingSessionRepository.findRecentWritingSessions(userId, limitFive)
                .stream()
                .map(w -> new WritingSessionDTO(
                        w.getUserId(),
                        w.getTitle(),
                        w.getType().name(),
                        w.getGenre(),
                        w.getEmotion(),
                        w.getContent(),
                        w.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }


    @Transactional
    public WritingSessionEntity complete(Long id) {
        WritingSessionEntity entity = writingSessionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, // 404 상태 코드
                        "Writing not found with id: " + id));

        entity.setStatus(WritingSessionEntity.WritingStatus.COMPLETE);
        return writingSessionRepository.save(entity);
    }
    public StartResponseDTO startWriting(StartRequestDTO request) {

        // 1) Session 생성
        WritingSessionEntity session = WritingSessionEntity.builder()
                .userId(request.getUserId())
                .type(request.getType())
                .status(WritingSessionEntity.WritingStatus.DRAFT)
                .build();

        writingSessionRepository.save(session);

        // 2) AI에게 첫 질문 요청
        String firstQuestion = aiService.generateFirstQuestion(request.getType());

        // 3) 메시지 저장 (role=AI)
        MessagesEntity aiMessage = MessagesEntity.builder()
                .sessionId(session.getId())
                .role(MessagesEntity.MessageRole.AI)
                .content(firstQuestion)
                .build();

        messageRepository.save(aiMessage);

        // 4) 프론트에 전달
        return StartResponseDTO.builder()
                .sessionId(session.getId())
                .question(firstQuestion)
                .build();
    }

    public AnswerResponseDTO submitAnswer(AnswerRequestDTO request) {

        WritingSessionEntity session = writingSessionRepository.findById(request.getSessionId())
                .orElseThrow(() -> new RuntimeException("Session not found"));

        // 1) 사용자 답변 저장
        messageRepository.save(
                MessagesEntity.builder()
                        .sessionId(request.getSessionId())
                        .role(MessagesEntity.MessageRole.USER)
                        .content(request.getAnswer())
                        .build()
        );

        // 2) 현재 AI 메시지 개수 = 현재 질문 번호
        int currentIndex = messageRepository.countBySessionIdAndRole(
                request.getSessionId(), MessagesEntity.MessageRole.AI
        );

        // 3) totalQuestions 계산
        int totalQuestions = 5;
        if(session.getExtraQuestions() != null) {
            totalQuestions = totalQuestions + session.getExtraQuestions();
        }
        // 4) 마지막 질문이면 finalize 단계로 안내
        if (currentIndex+1 >= totalQuestions) {
            return AnswerResponseDTO.builder()
                    .nextQuestion(null)
                    .finalize(true)
                    .currentIndex(currentIndex)
                    .totalQuestions(totalQuestions)
                    .build();
        }

        // 5) 다음 질문 1개 생성 (핵심)
        List<MessagesEntity> allMessages =
                messageRepository.findBySessionIdOrderByCreatedAtAsc(request.getSessionId());

        AiResponseDTO ai = aiService.generateNextQuestion(allMessages);

        // 6) AI 질문 저장
        messageRepository.save(
                MessagesEntity.builder()
                        .sessionId(request.getSessionId())
                        .role(MessagesEntity.MessageRole.AI)
                        .content(ai.getNextQuestion())
                        .build()
        );

        // 7) 응답
        return AnswerResponseDTO.builder()
                .nextQuestion(ai.getNextQuestion())
                .emotion(ai.getEmotion())
                .finalize(false)
                .currentIndex(currentIndex + 1)
                .totalQuestions(totalQuestions)
                .build();
    }

    public FinalizeResponseDTO finalizeWriting(FinalizeRequestDTO request) {

        // 1) 세션 조회
        WritingSessionEntity session = writingSessionRepository.findById(request.getSessionId())
                .orElseThrow(() -> new RuntimeException("Session not found"));

        // 2) 메시지 전부 불러오기
        List<MessagesEntity> messages = messageRepository.findBySessionIdOrderByCreatedAtAsc(request.getSessionId());

        // 3) AI에게 최종 글 생성 요청
        AiFinalizeResponseDTO aiResult = aiService.generateFinalText(messages);

        // 4) writing_session에 저장
        session.setContent(aiResult.getContent());
        session.setEmotion(aiResult.getEmotion());
        session.setRecommendTitle(aiResult.getRecommendTitle());
        session.setRecommendGenre(aiResult.getRecommendGenre());
        session.setStatus(WritingSessionEntity.WritingStatus.COMPLETE);

        writingSessionRepository.save(session);

        // 5) 같은 감정 count 조회
        int emotionCount = writingSessionRepository.countByEmotionAndCreatedAt(
                aiResult.getEmotion(),
                session.getCreatedAt().toLocalDate()
        );

        // 6) 프론트에 결과 반환
        return FinalizeResponseDTO.builder()
                .sessionId(session.getId())
                .title(session.getTitle())
                .content(aiResult.getContent())
                .emotion(aiResult.getEmotion())
                .emotionCount(emotionCount - 1)
                .recommendTitle(aiResult.getRecommendTitle())
                .recommendGenre(aiResult.getRecommendGenre())
                .date(session.getCreatedAt().toLocalDate())
                .build();
    }

    public FeedbackResponseDTO handleFeedback(FeedbackRequestDTO request) {

        WritingSessionEntity session = writingSessionRepository.findById(request.getSessionId())
                .orElseThrow(() -> new RuntimeException("Session not found"));

        if (request.isSatisfied()) {
            session.setStatus(WritingSessionEntity.WritingStatus.COMPLETE);
            writingSessionRepository.save(session);

            return FeedbackResponseDTO.builder()
                    .done(true)
                    .build();
        }

        // ❗ 추가 질문 개수만 저장하고, 질문은 answer API에서 생성함
        session.setExtraQuestions(request.getAddN());
        writingSessionRepository.save(session);

        return FeedbackResponseDTO.builder()
                .done(false)
                .build();
    }

}
