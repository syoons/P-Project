package com.p_project.config;

import com.p_project.jwt.JWTFilter;
import com.p_project.jwt.JWTUtil;
import com.p_project.oauth2.CustomSuccessHandler;
import com.p_project.sociaLogin.CustomOAuth2UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final CustomOAuth2UserService customOAuth2UserService;
    private final CustomSuccessHandler customSuccessHandler;
    private final JWTUtil jwtUtil;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        System.out.println("\n SecurityFilterChain initialized\n");

        // CSRF 비활성화
        http.csrf(csrf -> csrf.disable());

        // 기본 로그인(formLogin) 활성화
        http.formLogin(form -> form
                .loginPage("/api/users/login")               // 커스텀 로그인 페이지 URL (없으면 스프링 기본 로그인폼)
                .loginProcessingUrl("/loginProc")  // 로그인 요청 처리 URL
                .defaultSuccessUrl("/", true)      // 로그인 성공 시 이동할 페이지
                .permitAll()
        );

        // Basic 인증 비활성화 (JWT와 form만 사용)
        http.httpBasic(basic -> basic.disable());

        // JWT 기반 API용 요청은 세션 사용 X (Stateless)
        http.sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        );

        // JWT 필터 추가
        http.addFilterBefore(new JWTFilter(jwtUtil), UsernamePasswordAuthenticationFilter.class);

        // 접근 권한 설정
        http.authorizeHttpRequests(auth -> auth
                //.requestMatchers("/", "/login", "/loginProc", "/oauth2/**", "/css/**", "/js/**").permitAll()
                .anyRequest().permitAll()
        );

        // OAuth2 소셜 로그인 설정
        http.oauth2Login(oauth2 -> oauth2
                .loginPage("/login")   // 같은 로그인 페이지에서 시작
                .userInfoEndpoint(user -> user.userService(customOAuth2UserService))
                .successHandler(customSuccessHandler)
        );

        // 로그아웃 활성화 (선택)
        http.logout(logout -> logout
                .logoutUrl("/logout")
                .logoutSuccessUrl("/")
        );

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
