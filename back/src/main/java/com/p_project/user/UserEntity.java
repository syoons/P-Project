package com.p_project.user;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor  // ✅ 매개변수 없는 생성자
@AllArgsConstructor // ✅ 모든 필드를 받는 생성자
@Table(name = "`user`") // user 예약어 회피
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 45)
    private String name;

    @Column(nullable = false, length = 1)
    private String gender; // 'M'/'F' 등

    @Column(nullable = false, length = 45)
    private String nickname;

    // ====== OAuth 추가 필드 ======
    @Column(length = 20)    private String provider;        // GOOGLE/NAVER/KAKAO
    @Column(length = 80)    private String providerUserId;  // sub/id
    @Column(length = 120)   private String email;           // 있을 때만 세팅
    @Column(length = 200)   private String profileImage;    // 있을 때만 세팅
    @Column(length = 20)    private String role = "USER";   // 권한(간단히 문자열)

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;


    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    public static UserEntity toUserEntity(UserDTO dto) {
        if (dto == null) return null;
        return UserEntity.builder()
                .id(dto.getId())
                .name(dto.getName())
                .gender(dto.getGender())
                .nickname(dto.getNickname())
                .provider(dto.getProvider())
                .providerUserId(dto.getProviderUserId())
                .email(dto.getEmail())
                .profileImage(dto.getProfileImage())
                .role(dto.getRole())
                .createdAt(dto.getCreatedAt())
                .updatedAt(dto.getUpdatedAt())
                .deletedAt(dto.getDeletedAt())
                .build();
    }


}