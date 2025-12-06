package com.p_project.jwt;

import com.p_project.oauth2.CustomOAuth2User;
import com.p_project.user.UserDTO;
import com.p_project.user.UserEntity;
import com.p_project.user.UserRepository;
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
    private final UserRepository userRepository;

    // Refresh Token을 위한 헤더 이름 상수 정의 (클라이언트와 약속)
    private static final String REFRESH_TOKEN_HEADER = "X-Refresh-Token";
    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String BEARER_PREFIX = "Bearer ";

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String uri = request.getRequestURI();
        String method = request.getMethod();

        String authHeader = request.getHeader("Authorization");
        log.debug("[JWTFilter] Authorization Header: {}", authHeader);


        log.debug("[JWTFilter] Incoming Request → METHOD: {}, URI: {}", method, uri);


        //로그인 문제로 추가
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            log.debug("[JWTFilter] Skip JWT Filter → OPTIONS Preflight Request");
            filterChain.doFilter(request, response);
            return;
        }



        if (uri.startsWith("/oauth2") ||
                uri.startsWith("/login/oauth2") ||
                uri.startsWith("/login") ||
                uri.startsWith("/error") ||
                uri.startsWith("/api/users/login") ||
                uri.startsWith("/api/users/register") ||
                uri.startsWith("/favicon") ||
                uri.startsWith("/swagger") ||
                uri.startsWith("/v3") ||
                uri.startsWith("/webjars")) {

            log.debug("[JWTFilter] Skip JWT Filter → Whitelisted URL");

            filterChain.doFilter(request, response);
            return;
        }

        // 1. Access Token 추출: 오직 Authorization 헤더만 사용
        String accessToken = resolveToken(request, AUTHORIZATION_HEADER, BEARER_PREFIX);

        if (accessToken == null || accessToken.isBlank()) {
            // 토큰이 없으면 익명으로 다음 필터로 이동
            filterChain.doFilter(request, response);
            return;
        }

        try {
            if (jwtUtil.isExpired(accessToken)) {
                // Access Token 만료 시 Refresh Token 확인 로직 호출
                handleExpiredAccessToken(request, response, filterChain);
                return;
            }

            // 유효한 Access Token → SecurityContext 설정
            setAuthentication(accessToken);
            filterChain.doFilter(request, response);

        } catch (ExpiredJwtException ex) {
            // Access Token 만료 예외 발생 시 Refresh Token 확인 로직 호출
            handleExpiredAccessToken(request, response, filterChain);
        } catch (JwtException | IllegalArgumentException ex) {
            log.error("JWT 처리 중 오류 발생: {}", ex.getMessage());
            // 토큰이 유효하지 않으면 401 JSON 응답
            writeUnauthorizedJson(response, "TOKEN_INVALID", "Invalid JWT");
        }
    }

    // 2. 토큰 추출 메서드: 헤더에서 'Bearer ' 접두사를 제거하고 토큰 추출
    private String resolveToken(HttpServletRequest request, String headerName, String prefix) {
        String token = request.getHeader(headerName);
        if (token != null && token.startsWith(prefix)) {
            return token.substring(prefix.length());
        }
        return null;
    }

    private void handleExpiredAccessToken(HttpServletRequest request,
                                          HttpServletResponse response,
                                          FilterChain filterChain) throws IOException, ServletException {
        // 3. Refresh Token 추출: X-Refresh-Token 헤더에서 추출 (클라이언트와 약속)
        String refreshToken = request.getHeader(REFRESH_TOKEN_HEADER);

        if (refreshToken == null || refreshToken.isBlank()) {
            // Refresh Token이 없으면 로그인 필요
            writeUnauthorizedJson(response, "TOKEN_EXPIRED", "Access token expired. Please login again.");
            return;
        }

        try {
            if (jwtUtil.isExpired(refreshToken)) {
                // Refresh Token도 만료되었으면 로그인 필요
                writeUnauthorizedJson(response, "REFRESH_EXPIRED", "Refresh token expired. Please login again.");
                return;
            }

            // Refresh Token 유효 → 새 Access Token 생성
            String email = jwtUtil.getEmail(refreshToken);
            String role = jwtUtil.getRole(refreshToken);
            UserEntity user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("유저 없음"));

            // 새 Access Token 생성 (기존 TTL 사용)
            String newAccessToken = jwtUtil.createToken(user.getId(), email, role);

            // 4. 새 Access Token을 응답 헤더에 담아 전송 (클라이언트가 저장하도록 유도)
            response.setHeader(AUTHORIZATION_HEADER, BEARER_PREFIX + newAccessToken);

            // SecurityContext 재설정 후 다음 필터 진행
            setAuthentication(newAccessToken);
            filterChain.doFilter(request, response);

        } catch (JwtException e) {
            log.error("Refresh JWT 처리 중 오류 발생: {}", e.getMessage());
            writeUnauthorizedJson(response, "REFRESH_INVALID", "Invalid refresh token");
        }
    }

    private void setAuthentication(String token) {
        Long userId = jwtUtil.getUserId(token);
        String email = jwtUtil.getEmail(token);
        String role = jwtUtil.getRole(token);

        UserDTO userDTO = new UserDTO();

        //  CRITICAL FIX: 이메일을 UserDTO의 email 필드에 저장
        userDTO.setEmail(email);
        userDTO.setId(userId);
        // 기존 코드에 따라 닉네임에도 이메일을 설정 (필요에 따라 수정 가능)
        userDTO.setNickname(email);
        userDTO.setRole(role);

        CustomOAuth2User customUser = new CustomOAuth2User(userDTO);

        Authentication authToken = new UsernamePasswordAuthenticationToken(
                customUser, null, customUser.getAuthorities());

        SecurityContextHolder.getContext().setAuthentication(authToken);
    }


    private void writeUnauthorizedJson(HttpServletResponse response, String code, String message) throws IOException {
        SecurityContextHolder.clearContext();
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write("{\"code\":\"" + code + "\",\"message\":\"" + message + "\"}");
    }

}