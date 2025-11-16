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
@Table(name = "users")
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 45)
    private String name;

    @Column(nullable = false, length = 120)
    private String email;

    @Column(nullable = false, length = 255)
    private String pwd;

    @Column(nullable = false, length = 1)
    private String gender; // 'M'/'F' 등

    @Column(nullable = false, length = 45)
    private String nickname;

    @Column(name = "birth_date")
    private LocalDate birthDate;

    @Column(nullable = false, columnDefinition = "enum('admin','user')")
    private String role;   // admin 또는 user

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
                .email(dto.getEmail())
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