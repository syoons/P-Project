package com.p_project.oauth2;

import com.fasterxml.jackson.databind.ObjectMapper; // ObjectMapper 추가
import com.p_project.jwt.JWTUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Component
public class CustomSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JWTUtil jwtUtil;
    private final ObjectMapper objectMapper = new ObjectMapper(); // ObjectMapper 인스턴스

    public CustomSuccessHandler(JWTUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public void onAuthenticationSuccess(jakarta.servlet.http.HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication)
            throws IOException, ServletException {

        CustomOAuth2User customUserDetails = (CustomOAuth2User) authentication.getPrincipal();
        Long userId = customUserDetails.getUserId();
        String userEmail = customUserDetails.getEmail();
        String role = authentication.getAuthorities().iterator().next().getAuthority();

        // Access Token (1시간)
        String accessToken = jwtUtil.createJwt(userId, userEmail, role, 1000L * 60 * 60);

        // Refresh Token (14일)
        String refreshToken = jwtUtil.createJwt(userId, userEmail, role, 1000L * 60 * 60 * 24 * 14);

        //  쿠키 생성 및 Redirect 대신 JSON 응답 본문에 토큰을 담아 전송 (핵심 변경)
        response.setStatus(HttpServletResponse.SC_OK);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");

        Map<String, String> tokens = new HashMap<>();
        tokens.put("accessToken", accessToken);
        tokens.put("refreshToken", refreshToken);
        tokens.put("userId", String.valueOf(userId)); // 유저 ID도 클라이언트에 전달 가능

        response.getWriter().write(objectMapper.writeValueAsString(tokens));
        response.getWriter().flush();

        // response.sendRedirect("/main"); // 리다이렉션 제거
    }

    // createCookie 메서드 제거
}