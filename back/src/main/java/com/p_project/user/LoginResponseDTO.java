package com.p_project.user;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponseDTO {
    public LoginResponseDTO(String tokenType, String accessToken, String refreshToken) {
    }

    private String accessToken;
    private String refreshToken;
    private Long userID;


}
