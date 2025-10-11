package com.example.demo.service;

import com.example.demo.dto.*;
import com.example.demo.entity.UserEntity;
import com.example.demo.oauth2.CustomOAuth2User;
import com.example.demo.repository.UserRepository;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    public CustomOAuth2UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {

        OAuth2User oAuth2User = super.loadUser(userRequest);
        // 디버깅용
        System.out.println(oAuth2User);

        String registrationId = userRequest.getClientRegistration().getRegistrationId(); // "kakao"|"google"|"naver"
        OAuth2Response oAuth2Response;

        if ("naver".equalsIgnoreCase(registrationId)) {
            oAuth2Response = new NaverResponse(oAuth2User.getAttributes());
        } else if ("google".equalsIgnoreCase(registrationId)) {
            oAuth2Response = new GoogleResponse(oAuth2User.getAttributes());
        } else if ("kakao".equalsIgnoreCase(registrationId)) {
            oAuth2Response = new KakaoResponse(oAuth2User.getAttributes());
        } else {
            throw new OAuth2AuthenticationException("Unsupported provider: " + registrationId);
        }

        // 소셜 고유키
        String provider       = oAuth2Response.getProvider();    // e.g. "kakao"
        String providerUserId = oAuth2Response.getProviderId();  // e.g. "3221064173"
        if (providerUserId == null || providerUserId.isBlank()) {
            throw new OAuth2AuthenticationException("providerUserId is null/blank");
        }

        // 표시용 닉네임(기존 로직 유지)
        String username = provider + " " + providerUserId;

        // 이메일/이름은 null일 수 있으니 방어
        String email = oAuth2Response.getEmail();
        String name  = oAuth2Response.getName();
        if (name == null || name.isBlank()) {
            name = username; // 최소한 비어있지 않게
        }

        // gender 매핑: KakaoResponse에 getGender()가 있다면 캐스팅, 없으면 'U'
        String gender = "U";
        if (oAuth2Response instanceof KakaoResponse kr) {
            String kakaoGender = kr.getGender(); // "male"|"female"|null
            if ("male".equalsIgnoreCase(kakaoGender)) gender = "M";
            else if ("female".equalsIgnoreCase(kakaoGender)) gender = "F";
            else gender = "U";
        }
        // (Google/Naver도 성별 파싱 메서드 있다면 동일하게 매핑)

        // 조회 기준 변경: name이 아니라 provider+providerUserId
        Optional<UserEntity> opt = userRepository.findByProviderAndProviderUserId(provider, providerUserId);

        UserEntity user = opt.orElseGet(UserEntity::new);

        // 필수 식별키
        user.setProvider(provider);
        user.setProviderUserId(providerUserId);

        // 표시용
        if (user.getNickname() == null || user.getNickname().isBlank()) {
            user.setNickname(username);
        }

        // 기본 정보
        user.setName(name);
        user.setEmail(email);

        // NOT NULL 컬럼 방어
        if (user.getGender() == null || user.getGender().isBlank()) {
            user.setGender(gender); // 'M'/'F'/'U'
        }

        // 최초 생성 시 ROLE 기본값
        if (user.getRole() == null || user.getRole().isBlank()) {
            user.setRole("ROLE_USER");
        }

        // 필요시 프로필 이미지/생일/폰번호 등도 매핑 가능
        // if (oAuth2Response instanceof KakaoResponse krr) { ... }

        userRepository.save(user);

        // Security 컨텍스트에 넣을 최소 정보
        UserDTO userDTO = new UserDTO();
        userDTO.setNickname(user.getNickname());
        userDTO.setName(user.getName());
        userDTO.setRole(user.getRole());

        return new CustomOAuth2User(userDTO);
    }
}
