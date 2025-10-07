package com.example.demo.dto;

import com.example.demo.entity.UserEntity;
import jakarta.persistence.Column;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class UserDTO {

    private String name;
    private String gender;
    private String nickname;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;

    //Getter, Setter, 생성자, toString 은 Lombok 어노테이션으로 생략가능

    public static UserDTO toUserDTO(UserEntity userEntity){
        UserDTO userDTO = new UserDTO();
        userDTO.setName(userEntity.getName());
        userDTO.setGender(userEntity.getGender());
        userDTO.setNickname(userEntity.getNickname());
        userDTO.setCreatedAt(userEntity.getCreatedAt());
        userDTO.setUpdatedAt(userEntity.getUpdatedAt());
        userDTO.setDeletedAt(userDTO.getDeletedAt());

        return userDTO;
    }
}
