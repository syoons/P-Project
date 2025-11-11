package com.p_project.diary;

import com.p_project.writing.WritingSessionEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DiaryService {

    private final DiaryRepository diaryRepository;

    public int countActiveDiarySession(Long userId){
        return diaryRepository.countByUserIdAndTypeAndStatusAndDeletedAtIsNull(userId, WritingSessionEntity.Type.diary, WritingSessionEntity.WritingStatus.COMPLETE);
    }

}
