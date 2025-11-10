package com.p_project.user;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PasswordResetDTO {
    private String email;       // 이미 인증된 이메일
    private String newPassword; // 새 비밀번호
}
