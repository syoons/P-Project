package com.p_project.jwt;

import java.io.IOException;
import com.p_project.oauth2.CustomOAuth2User;
import com.p_project.user.UserDTO;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

public class JWTFilter extends OncePerRequestFilter {

    private final JWTUtil jwtUtil;

    public JWTFilter(JWTUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }
    
    

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {


        // Access Token 꺼내기
        String accessToken = getCookieValue(request, "Authorization");
        if (accessToken == null || accessToken.isBlank()) {
            filterChain.doFilter(request, response);
            return;
        }
        if (accessToken.startsWith("Bearer ")) {
            accessToken = accessToken.substring(7);
        }

        try {
            if (jwtUtil.isExpired(accessToken)) {
                // Access Token 만료 시 Refresh Token 확인
                handleExpiredAccessToken(request, response, filterChain);
                return;
            }

            // 유효한 Access Token → SecurityContext 설정
            setAuthentication(accessToken);
            filterChain.doFilter(request, response);

        } catch (ExpiredJwtException ex) {
            handleExpiredAccessToken(request, response, filterChain);
        } catch (JwtException | IllegalArgumentException ex) {
            writeUnauthorizedJson(response, "TOKEN_INVALID", "Invalid JWT");
        }
    }

    // ===========================================================제발 좀 되라

    private void handleExpiredAccessToken(HttpServletRequest request,
                                          HttpServletResponse response,
                                          FilterChain filterChain) throws IOException, ServletException {
        String refreshToken = getCookieValue(request, "RefreshToken");

        if (refreshToken == null || refreshToken.isBlank()) {
            clearAuthCookies(response);
            writeUnauthorizedJson(response, "TOKEN_EXPIRED", "Access token expired. Please login again.");
            return;
        }

        try {
            if (jwtUtil.isExpired(refreshToken)) {
                clearAuthCookies(response);
                writeUnauthorizedJson(response, "REFRESH_EXPIRED", "Refresh token expired. Please login again.");
                return;
            }

            // Refresh Token 유효 → Access Token 재발급
            String username = jwtUtil.getUsername(refreshToken);
            String role = jwtUtil.getRole(refreshToken);

            // 새 Access Token 생성 (예: 1시간)
            String newAccessToken = jwtUtil.createJwt(username, role, 1000L * 60 * 60);

            // Bearer 없이 순수 토큰만 쿠키에 저장 -> 쿠키에 저장할때 띄어쓰기있으면 http에러나기 때문
            Cookie newAccessCookie = new Cookie("Authorization", newAccessToken);
            newAccessCookie.setHttpOnly(true);
            newAccessCookie.setPath("/");
            newAccessCookie.setMaxAge(60 * 60); // 1시간
            response.addCookie(newAccessCookie);

            // SecurityContext 재설정 후 다음 필터 진행
            setAuthentication(newAccessToken);
            filterChain.doFilter(request, response);


        } catch (JwtException e) {
            clearAuthCookies(response);
            writeUnauthorizedJson(response, "REFRESH_INVALID", "Invalid refresh token");
        }
    }

    private void setAuthentication(String token) {
        String username = jwtUtil.getUsername(token);
        String role = jwtUtil.getRole(token);

        UserDTO userDTO = new UserDTO();
        userDTO.setNickname(username);
        userDTO.setRole(role);

        CustomOAuth2User customUser = new CustomOAuth2User(userDTO);
        Authentication authToken = new UsernamePasswordAuthenticationToken(
                customUser, null, customUser.getAuthorities());

        SecurityContextHolder.getContext().setAuthentication(authToken);
    }

    private String getCookieValue(HttpServletRequest request, String name) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) return null;
        for (Cookie c : cookies) {
            if (name.equals(c.getName())) {
                return c.getValue();
            }
        }
        return null;
    }

    private void writeUnauthorizedJson(HttpServletResponse response, String code, String message) throws IOException {
        SecurityContextHolder.clearContext();
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write("{\"code\":\"" + code + "\",\"message\":\"" + message + "\"}");
    }

    // 토큰 만료 시 쿠키 삭제
    private void clearAuthCookies(HttpServletResponse response) {
        Cookie accessCookie = new Cookie("Authorization", null);
        accessCookie.setMaxAge(0);
        accessCookie.setPath("/");
        response.addCookie(accessCookie);

        Cookie refreshCookie = new Cookie("RefreshToken", null);
        refreshCookie.setMaxAge(0);
        refreshCookie.setPath("/");
        response.addCookie(refreshCookie);
    }
}
