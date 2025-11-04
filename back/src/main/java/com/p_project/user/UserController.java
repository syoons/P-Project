package com.p_project.user;

import com.p_project.jwt.JWTUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

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
    public UserEntity create(@RequestBody UserEntity req) {
        // id/created_at/updated_at은 DB가 채움
        return repo.save(req);
    }


    @PostMapping("/save")
    public String save(@ModelAttribute UserDTO userDTO){
        System.out.println("UserController.save");
        System.out.println("userDTO = " + userDTO);
        userService.save(userDTO);

        return "test index";
    }

    @PutMapping("/{id}")
    public UserEntity update(@PathVariable Integer id, @RequestBody UserEntity req) {
        UserEntity u = repo.findById(id).orElseThrow();
        u.setName(req.getName());
        u.setGender(req.getGender());
        u.setNickname(req.getNickname());
        u.setDeletedAt(req.getDeletedAt());
        return repo.save(u);
    }

    @GetMapping("/my")
    @ResponseBody
    public String myAPI(){

        return "my route";
    }

    @GetMapping("/logout")
    public String logout(HttpServletResponse response) {

        System.out.println("UserController.logout");

        // SecurityContext 초기화
        SecurityContextHolder.clearContext();

        // Access Token 쿠키 삭제
        Cookie accessCookie = new Cookie("Authorization", null);
        accessCookie.setMaxAge(0);
        accessCookie.setPath("/");
        response.addCookie(accessCookie);

        // Refresh Token 쿠키 삭제
        Cookie refreshCookie = new Cookie("RefreshToken", null);
        refreshCookie.setMaxAge(0);
        refreshCookie.setPath("/");
        response.addCookie(refreshCookie);

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
    public String loginPage() {
        return "login";
    }

    @GetMapping("/reset-password")
    public String resetPasswordPage() {
        return "reset-password"; // reset-password.html
    }

    @PostMapping("/reset-password")
    @ResponseBody
    public ResponseEntity<String> resetPassword(@RequestBody PasswordResetDTO dto) {
        userService.resetPassword(dto);
        return ResponseEntity.ok("비밀번호가 성공적으로 변경되었습니다.");
    }



}
