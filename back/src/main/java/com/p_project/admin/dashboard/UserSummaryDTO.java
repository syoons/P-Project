package com.p_project.admin.dashboard;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSummaryDTO {
    private Long id;
    private String nickname;
    private String email;
    private String birthGroup;  // 10대 / 20대 ...
    private int postCount;      // 작성한 글 수
    private LocalDate lastActive; // 최근 활동일
    private LocalDate createdAt;  // 가입일
}
