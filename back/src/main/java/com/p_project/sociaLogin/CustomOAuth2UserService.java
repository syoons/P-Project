package com.p_project.sociaLogin;

import com.p_project.oauth2.CustomOAuth2User;
import com.p_project.oauth2.OAuth2Response;
import com.p_project.user.UserEntity;
import com.p_project.user.UserRepository;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;
    private final SocialIdentityRepository socialRepo;

    public CustomOAuth2UserService(UserRepository userRepository, SocialIdentityRepository socialRepo) {
        this.userRepository = userRepository;
        this.socialRepo = socialRepo;
    }

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {

        OAuth2User oAuth2User = super.loadUser(userRequest);

        // Provider 구분
        String registrationId = userRequest.getClientRegistration().getRegistrationId();
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
        String providerUserId = oAuth2Response.getProviderId();
        if (providerUserId == null || providerUserId.isBlank()) {
            throw new OAuth2AuthenticationException("Invalid social provider user id");
        }

        Provider providerEnum = Provider.valueOf(registrationId.toLowerCase());

        // 1) social_identities에서 provider + providerUserId 조회
        SocialIdentityEntity social = socialRepo.findByProviderAndProviderId(providerEnum, providerUserId)
                .orElseThrow(() -> new OAuth2AuthenticationException("해당 소셜 계정은 회원가입이 필요합니다."));

        // 2) users 테이블 기존 회원 조회
        UserEntity user = userRepository.findById(social.getUserId())
                .orElseThrow(() -> new OAuth2AuthenticationException("연결된 회원 정보를 찾을 수 없습니다."));

        // 3) Security DTO 생성
        com.p_project.user.UserDTO userDTO = new com.p_project.user.UserDTO();
        userDTO.setId(user.getId());
        userDTO.setNickname(user.getNickname());
        userDTO.setName(user.getName());
        userDTO.setRole(user.getRole());
        userDTO.setEmail(user.getEmail());

        return new CustomOAuth2User(userDTO);
    }
}
