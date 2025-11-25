package com.p_project.writing;

import com.p_project.message.feedback.FeedbackRequestDTO;
import com.p_project.message.feedback.FeedbackResponseDTO;
import com.p_project.message.finalize.FinalizeRequestDTO;
import com.p_project.message.finalize.FinalizeResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/writing")
public class WritingController {

    private final WritingSessionService writingService;

    @PostMapping("/start")
    public StartResponseDTO start(@RequestBody StartRequestDTO request) {
        return writingService.startWriting(request);
    }

    @PostMapping("/answer")
    public AnswerResponseDTO answer(@RequestBody AnswerRequestDTO request) {
        return writingService.submitAnswer(request);
    }

    @PostMapping("/finalize")
    public FinalizeResponseDTO finalize(@RequestBody FinalizeRequestDTO request) {
        return writingService.finalizeWriting(request);
    }

    @PostMapping("/feedback")
    public FeedbackResponseDTO feedback(@RequestBody FeedbackRequestDTO request) {
        return writingService.handleFeedback(request);
    }
}