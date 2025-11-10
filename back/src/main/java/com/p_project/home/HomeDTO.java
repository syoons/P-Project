package com.p_project.home;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HomeDTO {

    private String nickName;
    private String writing;
    private Integer diaryNum;
    private Integer bookReportNum;
    private Integer totalNum;

}
