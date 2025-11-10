package com.p_project.user;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class UserDTO {

    private Integer id;

    private String name;

    private String pwd;

    /** 'M' / 'F' / 'U' 등 1글자 권장 */
    private String gender;

    private String nickname;

    // ===== OAuth / 프로필 =====
    private String provider;        // GOOGLE / NAVER / KAKAO
    private String providerUserId;  // sub / id
    private String email;           // 있을 때만
    private String profileImage;    // 있을 때만

    @Builder.Default
    private String role = "USER";

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;

    public static UserDTO toUserDTO(UserEntity e){
        if (e == null) return null;
        return UserDTO.builder()
                .id(e.getId())
                .name(e.getName())
                .pwd(e.getPwd())
                .gender(e.getGender())
                .nickname(e.getNickname())
                .provider(e.getProvider())
                .providerUserId(e.getProviderUserId())
                .email(e.getEmail())
                .profileImage(e.getProfileImage())
                .role(e.getRole())
                .createdAt(e.getCreatedAt())
                .updatedAt(e.getUpdatedAt())
                .deletedAt(e.getDeletedAt())
                .build();
    }

    public static UserDTO fromEntity(UserEntity user) {
        return UserDTO.builder()
                .id(user.getId())
                .nickname(user.getNickname())
                .email(user.getEmail())
                .profileImage(user.getProfileImage())
                .build();
    }

}
