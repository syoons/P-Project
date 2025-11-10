package com.p_project.friend;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FriendDTO {

    private Long id;
    private Long toUserId;
    private Long fromUserId;
    private String friendNickName;
    private String friendEmail;

    public FriendEntity toEntity() {
        return FriendEntity.builder()
                .id(this.id)
                .fromUserId(fromUserId)
                .toUserId(toUserId)
                .build();
    }

}
