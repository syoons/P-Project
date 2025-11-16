package com.p_project.sociaLogin;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name="social_identities")
public class SocialIdentityEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Provider provider;   // kakao, google, naver

    @Column(name="provider_id", nullable = false, unique = true, length = 255)
    private String providerId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    private String email;

    @Column(nullable = false, columnDefinition = "enum('admin','user')")
    private String role;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    private LocalDateTime deletedAt;
}
