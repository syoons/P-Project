package com.example.demo.entity;


import com.example.demo.dto.UserDTO;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "`user`") // ← 중요: user는 예약어 이슈 피하려고 백틱 사용
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

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;


    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    public static UserEntity toUserEntity(UserDTO userDTO){
        UserEntity UserEntity = new UserEntity();
        UserEntity.setName(userDTO.getName());
        UserEntity.setGender(userDTO.getGender());
        UserEntity.setNickname(userDTO.getNickname());
        UserEntity.setCreatedAt(userDTO.getCreatedAt());
        UserEntity.setUpdatedAt(userDTO.getUpdatedAt());
        UserEntity.setDeletedAt(userDTO.getDeletedAt());

        return UserEntity;
    }


}