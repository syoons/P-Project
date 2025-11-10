package com.p_project.calendar;

import com.p_project.diary.DiaryDTO;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CalendarDTO {

    private Long userId;
    private Long friendId;
    private Integer countDiary;
    private Integer countBook;
    private Integer totalNum;
    private String freindNickName;
    private List<DiaryDTO> diaries;

}
