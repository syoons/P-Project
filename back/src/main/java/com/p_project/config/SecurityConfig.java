package com.p_project.config;

import com.p_project.jwt.JWTFilter;
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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final CustomOAuth2UserService customOAuth2UserService;
    private final CustomSuccessHandler customSuccessHandler;
    private final JWTFilter jwtFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        // CSRF 비활성화
        http.csrf(csrf -> csrf.disable())
        .cors(cors -> cors.configurationSource(corsConfigurationSource()));

        // 기본 로그인(formLogin) 활성화 -> jwt 기반 프로젝트는 formLogin 방식 절대 사용 안함
        /*http.formLogin(form -> form
                .loginPage("/api/users/login")               // 커스텀 로그인 페이지 URL (없으면 스프링 기본 로그인폼)
                .loginProcessingUrl("/loginProc")  // 로그인 요청 처리 URL
                .defaultSuccessUrl("/", true)      // 로그인 성공 시 이동할 페이지
                .permitAll()
        );*/

        http.formLogin(form -> form.disable());

        // Basic 인증 비활성화 (JWT와 form만 사용)
        http.httpBasic(basic -> basic.disable());

        // JWT 기반 API용 요청은 세션 사용 X (Stateless)
        http.sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        );


        // 접근 권한 설정
        http.authorizeHttpRequests(auth -> auth
                .requestMatchers(
                        "/swagger-ui/**",
                        "/swagger-resources/**",
                        "/swagger-resources",
                        "/v3/api-docs/**",
                        "/webjars/**",
                        "/api/users/login",
                        "/oauth2/authorization/**"
                ).permitAll()
                .anyRequest().authenticated()
        );
        // JWT 필터 추가
        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

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

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(List.of("http://localhost:8080")); // Swagger UI origin 허용
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        configuration.setExposedHeaders(List.of("Authorization"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

}

