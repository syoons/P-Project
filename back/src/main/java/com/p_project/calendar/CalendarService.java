package com.p_project.calendar;

import com.p_project.book.BookRepository;
import com.p_project.diary.DiaryDTO;
import com.p_project.diary.DiaryRepository;
import com.p_project.user.UserEntity;
import com.p_project.user.UserRepository;
import com.p_project.writing.WritingSessionEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CalendarService {

    private final DiaryRepository diaryRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    public CalendarDTO getCalendarSummary(Long userId, LocalDate date){

        int countDiary = diaryRepository.countByUserIdAndTypeAndStatusAndDeletedAtIsNull(userId, WritingSessionEntity.Type.diary, WritingSessionEntity.WritingStatus.COMPLETE);
        int countBook = bookRepository.countByUserIdAndTypeAndStatusAndDeletedAtIsNull(userId, WritingSessionEntity.Type.diary, WritingSessionEntity.WritingStatus.COMPLETE);
        int totalNum = countDiary + countBook;

//      date 값이 null이라면 오늘 날짜로 체크
        LocalDate targetDate = (date != null) ? date : LocalDate.now();
        List<DiaryDTO> diaryDto = diaryRepository.findActiveDiarySessionsByUserIdAndDate(userId, targetDate)
                    .stream()
                    .map(DiaryDTO::fromEntity)
                    .toList();


        return CalendarDTO.builder()
                .countDiary(countDiary)
                .countBook(countBook)
                .totalNum(totalNum)
                .diaries(diaryDto)
                .build();
    }

    public CalendarDTO getFriendCalendarSummary(Long userId, Long friendId, LocalDate date){

        int countDiary = diaryRepository.countByUserIdAndTypeAndStatusAndDeletedAtIsNull(userId, WritingSessionEntity.Type.diary, WritingSessionEntity.WritingStatus.COMPLETE);
        int countBook = bookRepository.countByUserIdAndTypeAndStatusAndDeletedAtIsNull(userId, WritingSessionEntity.Type.diary, WritingSessionEntity.WritingStatus.COMPLETE);
        int totalNum = countDiary + countBook;
        String friendNickName = userRepository.findById(friendId)
                .map(UserEntity::getNickname)
                .orElse("Unknown");


//      date 값이 null이라면 오늘 날짜로 체크
        LocalDate targetDate = (date != null) ? date : java.time.LocalDate.now();
        List<DiaryDTO> diaryDto = diaryRepository.findActiveDiarySessionsByUserIdAndDate(friendId, targetDate)
                .stream()
                .map(DiaryDTO::fromEntity)
                .toList();


        return CalendarDTO.builder()
                .countDiary(countDiary)
                .countBook(countBook)
                .totalNum(totalNum)
                .diaries(diaryDto)
                .freindNickName(friendNickName)
                .build();
    }

}
