package com.example.demo.dto;

import java.util.Map;

public class KakaoResponse implements OAuth2Response {

    private final Map<String, Object> attribute;

    public KakaoResponse(Map<String, Object> attribute) {
        // null 들어와도 NPE 막기
        this.attribute = (attribute != null) ? attribute : Map.of();
    }

    @Override
    public String getProvider() {
        return "kakao";
    }

    @Override
    public String getProviderId() {
        // 카카오는 최상위 id
        Object id = attribute.get("id");
        return (id == null) ? null : String.valueOf(id);
    }

    @Override
    public String getEmail() {
        // email은 kakao_account 아래에 있음
        Map<String, Object> account = asMap(attribute.get("kakao_account"));
        Object email = account.get("email");
        return (email == null) ? null : String.valueOf(email);
    }

    @Override
    public String getName() {
        // name 우선, 없으면 profile.nickname 사용
        Map<String, Object> account = asMap(attribute.get("kakao_account"));
        Object name = account.get("name");
        if (name != null) return String.valueOf(name);

        Map<String, Object> profile = asMap(account.get("profile"));
        Object nickname = profile.get("nickname");
        return (nickname == null) ? null : String.valueOf(nickname);
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> asMap(Object o) {
        return (o instanceof Map) ? (Map<String, Object>) o : Map.of();
    }

    public String getGender() {
        Map<String, Object> account = asMap(attribute.get("kakao_account"));
        Object g = account.get("gender"); // "male" | "female" | null
        if (g == null) return null;
        return String.valueOf(g); // 그대로 반환, 서비스에서 M/F 변환
    }
}
