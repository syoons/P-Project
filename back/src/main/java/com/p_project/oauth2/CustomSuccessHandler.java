package com.p_project.oauth2;

import com.p_project.jwt.JWTUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class CustomSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JWTUtil jwtUtil;

    public CustomSuccessHandler(JWTUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public void onAuthenticationSuccess(jakarta.servlet.http.HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication)
            throws IOException, ServletException {

        CustomOAuth2User customUserDetails = (CustomOAuth2User) authentication.getPrincipal();
        String userEmail = customUserDetails.getUserEmail();
        String role = authentication.getAuthorities().iterator().next().getAuthority();

        // Access Token (1시간)
        String accessToken = jwtUtil.createJwt(userEmail, role, 1000L * 60 * 60);

        // Refresh Token (14일)
        String refreshToken = jwtUtil.createJwt(userEmail, role, 1000L * 60 * 60 * 24 * 14);

        response.addCookie(createCookie("Authorization", accessToken));
        response.addCookie(createCookie("RefreshToken", refreshToken));

        response.sendRedirect("/main");
    }

    private Cookie createCookie(String key, String value) {
        Cookie cookie = new Cookie(key, value);
        cookie.setMaxAge(60 * 60 * 60); // 60시간
        cookie.setHttpOnly(true);       // JS 접근 차단
        cookie.setPath("/");            // 전체 경로에 적용
        // cookie.setSecure(true);      // HTTPS일 경우에만 설정
        return cookie;
    }
}
