package com.p_project.user;

import com.p_project.jwt.JWTUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.support.ResourcePatternResolver;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service //스프링이 관리해주는 객체
@RequiredArgsConstructor //controller 와 같이 final 멤버변수 생성자 만드는 역할
public class UserService {

    private final UserRepository userRepository; //디펜던시 추가
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JWTUtil jwtUtil;
    private final ResourcePatternResolver resourcePatternResolver;

    public Optional<UserEntity> findById(Long userId){
        return userRepository.findById(userId);
    }

    public void resetPassword(PasswordResetDTO dto) {
        UserEntity user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("해당 이메일의 사용자를 찾을 수 없습니다."));

        // 새 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(dto.getNewPassword());
        user.setPwd(encodedPassword);

        userRepository.save(user);
    }

    public void clearSecurityContext(){
        SecurityContextHolder.clearContext();
    }

    public void clearAccessToken(HttpServletResponse response){
        Cookie accessCookie = new Cookie("Authorization", null);
        accessCookie.setMaxAge(0);
        accessCookie.setPath("/");
        response.addCookie(accessCookie);
    }

    public void clearRefreshToken(HttpServletResponse response){
        Cookie refreshCookie = new Cookie("RefreshToken", null);
        refreshCookie.setMaxAge(0);
        refreshCookie.setPath("/");
        response.addCookie(refreshCookie);
    }

    public Map<String, String> responseMessage(String message){
        Map<String, String> response = new HashMap<>();
        response.put("message", message);
        return response;
    }


    public String logoutUser(HttpServletRequest request, HttpServletResponse response) {
        String userEmail = null;

        try {
            String accessToken = jwtUtil.extractAccessToken(request);

            if (accessToken != null && !jwtUtil.isExpired(accessToken)) {
                userEmail = jwtUtil.getEmail(accessToken);
            }

        } catch (Exception e) {
            //jwt 파싱중오류처리
            log.warn("JWT 토큰 파싱 중 오류 발생: {}", e.getMessage());
        }

        //토큰 삭제 로직
        clearSecurityContext();
        clearAccessToken(response);
        clearRefreshToken(response);

        if (userEmail != null) {
            log.info("{} 님이 로그아웃했습니다.", userEmail);
            return userEmail + " 님이 로그아웃했습니다.";
        } else {
            log.info("로그아웃되었습니다. (사용자 정보 없음)");
            return "로그아웃되었습니다.";
        }
    }

    public ResponseEntity<?> login(UserDTO userDTO) {

        try {
            String email = userDTO.getEmail();
            String password = userDTO.getPwd();

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password)
            );

            Optional<UserEntity> user = userRepository.findByEmail(email);

            String role = authentication.getAuthorities().iterator().next().getAuthority().toUpperCase();
            Long userId = user.get().getId();

            // 2. Access/Refresh Token 생성 (기존 로직 유지)
            String accessToken = jwtUtil.createJwt(userId, email, role, 1000L * 60 * 60); // 1시간
            String refreshToken = jwtUtil.createJwt(userId, email, role, 1000L * 60 * 60 * 24 * 14); // 14일


            // 4. JWT를 JSON 응답 본문으로 반환
            LoginResponseDTO responseDto = new LoginResponseDTO(
                    accessToken,
                    refreshToken,
                    userId
            );

            // 200 OK와 함께 JWT 토큰을 JSON 본문으로 반환
            return ResponseEntity.ok(responseDto);

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("아이디 또는 비밀번호가 올바르지 않습니다.");
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("인증 실패");
        }
    }

    public ResponseEntity<?> register(UserDTO userDTO) {
        if (userRepository.findByEmail(userDTO.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("이미 사용 중인 이메일입니다.");
        }

        if (userRepository.findByNickname(userDTO.getNickname()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("이미 사용 중인 닉네임입니다.");
        }

        String encodedPwd = passwordEncoder.encode(userDTO.getPwd());
        userDTO.setPwd(encodedPwd);

        UserEntity userEntity = UserEntity.toUserEntity(userDTO);
        userRepository.save(userEntity);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body("회원가입이 완료되었습니다.");
    }


    public void findByNickname(UserDTO userDTO){
        //repository 의 save 메서드 호출
        System.out.println("\n\n\n\nuserDTO in userService : " + userDTO);
        UserEntity userEntity = UserEntity.toUserEntity(userDTO);
        System.out.println("\n\n\n\nUserEntity in userService" + userEntity);
        userRepository.save(userEntity);
    }

    public Map<String, String> findNameAndNickNameByUserId(Long userId){

        return userRepository.findById(userId)
                .map(user -> Map.of(
                        "name", user.getName(),
                        "nickName", user.getNickname()
                ))
                .orElse(Map.of(
                        "name", "Unknown",
                        "nickName", "Unknown"
                ));
    }

    public Optional<UserEntity> findByNickname(String nickName){

        return userRepository.findByNickname(nickName);
    }

    public boolean existsEmailExceptUser(String email, Long userId) {
        return userRepository.existsByEmailAndIdNot(email, userId);
    }

    public boolean existsNicknameExceptUser(String nickname, Long userId) {
        return userRepository.existsByNicknameAndIdNot(nickname, userId);
    }

    public Long findUserIdByEmail (String email) {

            Optional<UserEntity> userEntity  = userRepository.findByEmail(email);
        return userEntity.get().getId();
    }

}
