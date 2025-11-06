package com.p_project.user;

import com.p_project.jwt.JWTUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository repo;
    private final UserService userService;
    private final JWTUtil jWTUtil;
    private final AuthenticationManager authenticationManager;


    @GetMapping("/list")
    public List<UserEntity> list() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public UserEntity get(@PathVariable Integer id) {
        return repo.findById(id).orElseThrow();
    }

    @PostMapping
    public UserEntity create(@RequestBody UserEntity req) { return repo.save(req); }

    @PostMapping("/save")
    public String save(@ModelAttribute UserDTO userDTO){

        log.info("user controller : user save");

        userService.save(userDTO);

        return "test index";
    }

    @GetMapping("/logout")
    public String logout(HttpServletResponse response) {

        log.info("user controller : user logout");

        // SecurityContext 초기화
        userService.clearSecurityContext();

        // Access Token 쿠키 삭제
        userService.clearAccessToken(response);

        // Refresh Token 쿠키 삭제
        userService.clearRefreshToken(response);

        return "로그아웃되었습니다.";
    }


//    //일반회원 로그인시
//    @PostMapping("/login")
//    public ResponseEntity<?> login(@RequestParam String username,
//                                   @RequestParam String password,
//                                   HttpServletResponse response) {
//
//        try {
//            Authentication authentication = authenticationManager.authenticate(
//                    new UsernamePasswordAuthenticationToken(username, password)
//            );
//
//            String role = authentication.getAuthorities().iterator().next().getAuthority();
//
//            String accessToken = jWTUtil.createJwt(username, role, 1000L * 60 * 60);
//
//            String refreshToken = jWTUtil.createJwt(username, role, 1000L * 60 * 60 * 24 * 14);
//
//            // 쿠키에 저장
//            Cookie accessCookie = new Cookie("Authorization", "Bearer " + accessToken);
//            accessCookie.setHttpOnly(true);
//            accessCookie.setPath("/");
//            accessCookie.setMaxAge(60 * 60); // 1시간
//
//            Cookie refreshCookie = new Cookie("RefreshToken", refreshToken);
//            refreshCookie.setHttpOnly(true);
//            refreshCookie.setPath("/");
//            refreshCookie.setMaxAge(60 * 60 * 24 * 14); // 14일
//
//            response.addCookie(accessCookie);
//            response.addCookie(refreshCookie);
//
//            return ResponseEntity.ok("로그인 성공");
//
//        } catch (BadCredentialsException e) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("아이디 또는 비밀번호가 올바르지 않습니다.");
//        } catch (AuthenticationException e) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증 실패");
//        }
//    }

    @GetMapping("/login")
    public ResponseEntity<Map<String, String>> loginCheck() {

        Map<String, String> response = userService.responseMessage("로그인 API.");

        return ResponseEntity.ok(response);
    }

    @GetMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPasswordPage() {

        Map<String, String> response = userService.responseMessage("user reset password page API");

        return ResponseEntity.ok(response);
    }


    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@RequestBody PasswordResetDTO dto) {

        userService.resetPassword(dto);

        Map<String, String> response = userService.responseMessage("비밀번호가 성공적으로 변경되었습니다.");

        return ResponseEntity.ok(response);
    }



}
