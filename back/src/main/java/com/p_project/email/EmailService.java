package com.p_project.email;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    // 메모리 저장소 (email → 인증정보)
    private final Map<String, VerificationInfo> verificationStore = new ConcurrentHashMap<>();

    private static class VerificationInfo {
        String code;
        long expireTime; // ms 단위

        VerificationInfo(String code, long expireTime) {
            this.code = code;
            this.expireTime = expireTime;
        }
    }

    // 인증 코드 생성 및 저장
    public void sendVerificationCode(String email) {

        String code = createCode();
        long expireTime = System.currentTimeMillis() + (5 * 60 * 1000); // 5분

        verificationStore.put(email, new VerificationInfo(code, expireTime));

        sendEmail(email, code);

        log.info(">>> 이메일 인증코드 = " + code);
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


    // 인증 코드 검증
    public ResponseEntity<String> verifyEmailCode(String email, String inputCode) {

        VerificationInfo info = verificationStore.get(email);

        if (info == null) {
            return ResponseEntity.badRequest().body("인증 요청을 먼저 해주세요.");
        }

        // 만료 확인
        if (System.currentTimeMillis() > info.expireTime) {
            verificationStore.remove(email);
            return ResponseEntity.badRequest().body("인증 코드가 만료되었습니다.");
        }

        // 코드 확인
        if (!info.code.equals(inputCode)) {
            return ResponseEntity.badRequest().body("인증 코드가 일치하지 않습니다.");
        }

        // 인증 성공 → 저장소에서 제거
        verificationStore.remove(email);

        return ResponseEntity.ok("이메일 인증 성공!");
    }
}
