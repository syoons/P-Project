package com.p_project.home;

import com.p_project.book.BookService;
import com.p_project.diary.DiaryService;
import com.p_project.user.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class HomeService {

    private final DiaryService diaryService;
    private final BookService bookService;
    private final UserService userService;

    public HomeDTO getHome(Long userId){

        log.info("in HomeService: getHome");

        int diaryNum = diaryService.countActiveDiarySession(userId);
        int bookNum = bookService.countActiveBookSession(userId);
        String nickName = userService.findNickNameByUserId(userId);

        return HomeDTO.builder()
                .diaryNum(diaryNum)
                .bookReportNum(bookNum)
                .totalNum(diaryNum + bookNum)
                .nickName(nickName)
                .writing(null)  // TODO: 형식이 확실해지면 데이터 넣기
                .build();
    }

}
