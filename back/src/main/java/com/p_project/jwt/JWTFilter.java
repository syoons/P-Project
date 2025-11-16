package com.p_project.jwt;

import com.p_project.oauth2.CustomOAuth2User;
import com.p_project.user.UserDTO;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j
public class JWTFilter extends OncePerRequestFilter {

    private final JWTUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String uri = request.getRequestURI();

        if (uri.startsWith("/oauth2") ||
                uri.startsWith("/login/oauth2") ||
                uri.startsWith("/login") ||
                uri.startsWith("/error") ||
                uri.startsWith("/favicon") ||
                uri.startsWith("/swagger") ||
                uri.startsWith("/v3") ||
                uri.startsWith("/webjars")) {

            filterChain.doFilter(request, response);
            return;
        }

        Cookie[] cookies = request.getCookies();
        log.info(">>> [JWTFilter] 요청 경로: {}", request.getRequestURI());
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                log.info(">>> Cookie: {} = {}", cookie.getName(), cookie.getValue());
            }
        } else {
            log.info(">>> 쿠키 없음 (Cookie[] is null)");
        }

        String accessToken = null;

        // 1. 헤더에서 Access Token 추출
        String headerAuth = request.getHeader("Authorization");
        if (headerAuth != null && headerAuth.startsWith("Bearer ")) {
            accessToken = headerAuth.substring(7);
        }

        // 2. 헤더에 없으면 쿠키에서 추출 (쿠키 이름: accessToken)
        if (accessToken == null || accessToken.isBlank()) {
            accessToken = getCookieValue(request, "accessToken");
        }

        if (accessToken == null || accessToken.isBlank()) {
            filterChain.doFilter(request, response);
            return;
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
            log.error("JWT 처리 중 오류 발생: {}", ex.getMessage());
            writeUnauthorizedJson(response, "TOKEN_INVALID", "Invalid JWT");
        }
    }

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
            String email = jwtUtil.getEmail(refreshToken);
            String role = jwtUtil.getRole(refreshToken);

            // 새 Access Token 생성
            String newAccessToken = jwtUtil.createToken(email, role);

            // 새 Access Token 쿠키 저장 (쿠키 이름: accessToken)
            Cookie newAccessCookie = new Cookie("accessToken", newAccessToken);
            newAccessCookie.setHttpOnly(true);
            newAccessCookie.setPath("/");
            newAccessCookie.setMaxAge(60 * 60); // 1시간
            response.addCookie(newAccessCookie);

            // SecurityContext 재설정 후 다음 필터 진행
            setAuthentication(newAccessToken);
            filterChain.doFilter(request, response);


        } catch (JwtException e) {
            log.error("Refresh JWT 처리 중 오류 발생: {}", e.getMessage());
            clearAuthCookies(response);
            writeUnauthorizedJson(response, "REFRESH_INVALID", "Invalid refresh token");
        }
    }

    private void setAuthentication(String token) {
        String email = jwtUtil.getEmail(token);
        String role = jwtUtil.getRole(token);

        UserDTO userDTO = new UserDTO();

        // 🌟 CRITICAL FIX: 이메일을 UserDTO의 email 필드에 저장
        userDTO.setEmail(email);
        // 기존 코드에 따라 닉네임에도 이메일을 설정 (필요에 따라 수정 가능)
        userDTO.setNickname(email);
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
        // 💡 FIX: Access Token 쿠키 이름 'accessToken'으로 통일
        Cookie accessCookie = new Cookie("accessToken", null);
        accessCookie.setMaxAge(0);
        accessCookie.setPath("/");
        response.addCookie(accessCookie);

        Cookie refreshCookie = new Cookie("RefreshToken", null);
        refreshCookie.setMaxAge(0);
        refreshCookie.setPath("/");
        response.addCookie(refreshCookie);
    }
}