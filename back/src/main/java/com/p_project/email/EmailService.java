package com.p_project.email;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final EmailRepository repository;
    private final JavaMailSender mailSender;

    public void sendVerificationCode(String email) {
        String code = createCode();

        // DB에 저장 (5분 유효)
        EmailEntity verification = EmailEntity.builder()
                .email(email)
                .code(code)
                .expireTime(LocalDateTime.now().plusMinutes(5))
                .verified(false)
                .build();

        repository.save(verification);

        // 이메일 전송
        sendEmail(email, code);
    }

    private String createCode() {
        return String.valueOf((int)(Math.random() * 900000) + 100000);
    }

    private void sendEmail(String email, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("이메일 인증 코드");
        message.setText("인증코드: " + code + " (5분 이내에 입력하세요)");
        mailSender.send(message);
    }

    public ResponseEntity<String> verifyEmailCode(String email, String code) {

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
