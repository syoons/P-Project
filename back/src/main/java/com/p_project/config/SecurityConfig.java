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


        System.out.println("\nSecurityFilterChain\n");

        //CSRF 비활성화함
        http.csrf(csrf -> csrf.disable());

        //기본 로그인 방식 비활성화 -> 소셜만 가능함 지금은
        http.formLogin(form -> form.disable());
        http.httpBasic(basic -> basic.disable());

        //세션을 Stateless로 설정 (JWT 사용)
        http.sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        );

        //JWT 필터 등록 -> 여기서 jwt 인터셉터 느낌 필터가 인터셉터 이후에 작동
        http.addFilterBefore(new JWTFilter(jwtUtil), UsernamePasswordAuthenticationFilter.class);

        //경로별 인가 설정 (최신 문법) , spring 버전 확인필요
        http.authorizeHttpRequests(auth -> auth
                //.requestMatchers("/auth/clear").permitAll()
                //.requestMatchers("/", "/login/**", "/oauth2/**","/auth/**", "/css/**", "/js/**").permitAll()
                .anyRequest().permitAll()
        );

        //OAuth2 설정
        http.oauth2Login(oauth2 -> oauth2
                .userInfoEndpoint(user -> user.userService(customOAuth2UserService))
                .successHandler(customSuccessHandler)
        );

        http.logout(logout -> logout.disable());

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

