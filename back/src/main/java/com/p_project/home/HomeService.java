package com.p_project.home;

import com.p_project.book.BookService;
import com.p_project.diary.DiaryService;
import com.p_project.user.UserService;
import com.p_project.writing.WritingSessionDTO;
import com.p_project.writing.WritingSessionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class HomeService {

    private final DiaryService diaryService;
    private final BookService bookService;
    private final UserService userService;
    private final WritingSessionService writingSessionService;

    public HomeDTO getHome(Long userId){

        log.info("in HomeService: getHome");

        int diaryNum = diaryService.countActiveDiarySession(userId);
        int bookNum = bookService.countActiveBookSession(userId);
        Map<String, String> userInfo = userService.findNameAndNickNameByUserId(userId);
        List<WritingSessionDTO> writingSessionDTO = writingSessionService.getRecentWritingSessions(userId);

        LocalDateTime writingTime = writingSessionDTO.isEmpty()
                ? null
                : writingSessionDTO.get(0).getCreatedAt();

        return HomeDTO.builder()
                .diaryNum(diaryNum)
                .bookReportNum(bookNum)
                .totalNum(diaryNum + bookNum)
                .nickName(userInfo.get("nickName"))
                .name(userInfo.get("name"))
                .writingTime(writingTime)
                .writingSessionDTOS(writingSessionDTO)
                .build();
    }

}
