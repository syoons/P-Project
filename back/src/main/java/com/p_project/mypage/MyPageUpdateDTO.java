package com.p_project.mypage;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MyPageUpdateDTO {

    private Long userId;
    private String email;
    private String nickName;
    private String gender;
    private String token;


}
