package com.p_project.friend;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FriendSimpleDTO {

    private Long toUserId;
    private Long fromUserId;


}
