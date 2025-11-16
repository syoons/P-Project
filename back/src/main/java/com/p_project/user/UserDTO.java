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

    private Long id;

    private String name;

    private String pwd;

    /** 'M' / 'F' / 'U' 등 1글자 권장 */
    private String gender;

    private String nickname;

    private String email;

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
                .email(e.getEmail())
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
                .build();
    }
}
