package com.p_project.mypage;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MyPageDTO {

    private Long userId;
    private String email;
    private String nickName;
    private String profileURL;

    public void updateProfile(String nickname, String email, String profileURL) {
        this.nickName = nickname;
        this.email = email;
        this.profileURL = profileURL;
    }
}
