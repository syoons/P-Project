package com.p_project.writing;

import com.p_project.jwt.TokenDecodeService;
import com.p_project.message.feedback.FeedbackRequestDTO;
import com.p_project.message.feedback.FeedbackResponDTO;
import com.p_project.message.finalize.FinalizeRequestDTO;
import com.p_project.message.finalize.FinalizeResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/writing")
public class WritingController {

    private final WritingSessionService writingService;
    private final TokenDecodeService tokenDecodeService;

    @PostMapping("/start")
    public StartResponseDTO start(@RequestBody StartRequestDTO request) {
        request.setUserId((Long) tokenDecodeService.decode(request.getToken()).get("userId"));
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
    public FeedbackResponDTO feedback(@RequestBody FeedbackRequestDTO request) {
        return writingService.handleFeedback(request);
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<?> complete(@PathVariable Long id) {
        return ResponseEntity.ok(writingService.complete(id));
    }
}