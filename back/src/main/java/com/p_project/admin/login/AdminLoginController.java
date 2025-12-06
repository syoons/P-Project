package com.p_project.admin.login;

import com.p_project.user.UserDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin")
public class AdminLoginController {

    private final AdminLoginService adminLoginService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserDTO dto) {
        return adminLoginService.adminLogin(dto);
    }

    @PostMapping("/create")
    public ResponseEntity<?> createAdmin(@RequestBody UserDTO dto) {
        return adminLoginService.createAdmin(dto);
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody UserDTO dto) {
        return adminLoginService.changeAdminPassword(dto);
    }
}
