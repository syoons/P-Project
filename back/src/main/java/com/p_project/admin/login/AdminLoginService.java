package com.p_project.admin.login;

import com.p_project.user.LoginResponseDTO;
import com.p_project.user.UserDTO;
import com.p_project.user.UserEntity;
import com.p_project.user.UserRepository;
import com.p_project.jwt.JWTUtil;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AdminLoginService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JWTUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    //기본 어드민 비밀번호 -> 재설정 공지
    private final String DEFAULT_PASSWORD = "pwd1234!";


    public ResponseEntity<?> adminLogin(UserDTO userDTO) {

        try {
            String email = userDTO.getEmail();
            String password = userDTO.getPwd();

            // 로그인 인증 처리
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password)
            );

            Optional<UserEntity> user = userRepository.findByEmail(email);

            if (user.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("존재하지 않는 사용자입니다.");
            }

            //  관리자 권한 체크
            String role = user.get().getRole().toUpperCase();
            if (!role.equals("ADMIN")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("관리자 권한이 없습니다.");
            }

            Long userId = user.get().getId();

            // Token 생성


            String accessToken = jwtUtil.createJwt(userId, email, "ROLE_" + role, 1000L * 60 * 60);
            String refreshToken = jwtUtil.createJwt(userId, email, "ROLE_" + role, 1000L * 60 * 60 * 24 * 14);

            LoginResponseDTO responseDto = new LoginResponseDTO(
                    accessToken,
                    refreshToken,
                    userId
            );

            return ResponseEntity.ok(responseDto);

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("아이디 또는 비밀번호가 올바르지 않습니다.");
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("인증 실패");
        }
    }

    public ResponseEntity<?> createAdmin(UserDTO dto) {

        // 이메일 중복 체크
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("이미 존재하는 이메일입니다.");
        }

        UserEntity admin = new UserEntity();

        admin.setEmail(dto.getEmail());
        admin.setName(dto.getName());

        // 관리자 기본 비밀번호 설정
        admin.setPwd(passwordEncoder.encode(DEFAULT_PASSWORD));

        // REQUIRED 필드 기본값 설정
        admin.setGender("M");              // 기본값 (필요하면 변경 가능)
        admin.setNickname("관리자");         // 임시 닉네임
        admin.setBirthDate(null);          // 옵션 필드이므로 null 가능

        // ENUM(role) — 반드시 "admin"으로 저장해야 함
        admin.setRole("admin");

        userRepository.save(admin);

        return ResponseEntity.ok("관리자 계정이 생성되었습니다. 최초 로그인 비밀번호는 기본 비밀번호입니다.");
    }

    public ResponseEntity<?> changeAdminPassword(UserDTO dto) {

        Optional<UserEntity> userOpt = userRepository.findByEmail(dto.getEmail());

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("존재하지 않는 관리자 이메일입니다.");
        }

        UserEntity user = userOpt.get();

        // 관리자 권한 체크
        if (!user.getRole().equalsIgnoreCase("admin")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("관리자만 비밀번호를 변경할 수 있습니다.");
        }

        String oldPassword = dto.getName();  // DTO의 name 필드를 oldPassword 용도로 사용
        String newPassword = dto.getPwd();   // DTO의 pwd 필드를 newPassword 용도로 사용

        // 현재 비밀번호 검사 (기본 비밀번호 허용)
        boolean matchesOldPassword =
                passwordEncoder.matches(oldPassword, user.getPwd()) ||
                        oldPassword.equals(DEFAULT_PASSWORD);

        if (!matchesOldPassword) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("현재 비밀번호가 올바르지 않습니다.");
        }

        // 새 비밀번호 암호화 후 저장
        user.setPwd(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        return ResponseEntity.ok("관리자 비밀번호가 성공적으로 변경되었습니다.");
    }

    public String encodePwd(String raw) { return passwordEncoder.encode(raw); }

}
