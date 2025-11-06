package com.p_project.email;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/api/email")
@RequiredArgsConstructor
public class EmailController {

    private final EmailService emailService;
    private final EmailRepository repository;

    @PostMapping("/send")
    public ResponseEntity<String> sendCode(@RequestParam String email) {
        emailService.sendVerificationCode(email);
        return ResponseEntity.ok("인증 코드가 이메일로 전송되었습니다.");
    }

    @PostMapping("/verify")
    public ResponseEntity<String> verifyCode(@RequestParam String email, @RequestParam String code) {

        Optional<EmailEntity> optional = repository.findById(email);

        if (optional.isEmpty()) {
            return ResponseEntity.badRequest().body("인증 요청을 먼저 해주세요.");
        }

        EmailEntity verification = optional.get();

        if (verification.getExpireTime().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("인증 코드가 만료되었습니다.");
        }

        if (!verification.getCode().equals(code)) {
            return ResponseEntity.badRequest().body("인증 코드가 일치하지 않습니다.");
        }

        verification.setVerified(true);
        repository.save(verification);

        return ResponseEntity.ok("이메일 인증 성공!");
    }
}
