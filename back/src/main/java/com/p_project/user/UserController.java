package com.p_project.user;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository repo;
    private final UserService userService;


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

    @GetMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request, HttpServletResponse response) {
        String message = userService.logoutUser(request, response);
        return ResponseEntity.ok(message);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestParam String username,
                                   @RequestParam String password,
                                   HttpServletResponse response) {
        return userService.login(username, password, response);
    }


    //로그인 페이지 반환
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
