package com.p_project.user;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "`user`") // user 예약어 회피
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 45)
    private String name;

    @Column(nullable = false, length = 120)
    private String email;

    @Column(nullable = false, length = 45)
    private String pwd;

    @Column(nullable = false, length = 1)
    private String gender; // 'M'/'F' 등

    @Column(nullable = false, length = 45)
    private String nickname;

    @Column(name = "birth_date")
    private LocalDate birthDate;

    // ====== OAuth 추가 필드 ======
    @Column(length = 20)    private String provider;        // GOOGLE/NAVER/KAKAO
    @Column(length = 80)    private String providerUserId;  // sub/id
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
                .pwd(dto.getPwd())
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

    public void updateProfile(String nickname, String email, String gender) {
        this.nickname = nickname;
        this.email = email;
        this.gender = gender;
    }

}