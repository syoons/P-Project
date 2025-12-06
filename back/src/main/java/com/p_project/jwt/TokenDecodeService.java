package com.p_project.jwt;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
@Service
@RequiredArgsConstructor
public class TokenDecodeService {
    private final JWTUtil jwtUtil;

    public Map<String, Object> decode(String token) {
        Map<String, Object> result = new HashMap<>();
        result.put("userId", jwtUtil.getUserId(token));
        result.put("email", jwtUtil.getEmail(token));
        result.put("role", jwtUtil.getRole(token));
        return result;
    }

}
