package com.p_project.diary;

import com.p_project.writing.WritingSessionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface DiaryRepository extends JpaRepository<WritingSessionEntity, Long> {

    int countByUserIdAndTypeAndStatusAndDeletedAtIsNull(Long userId, WritingSessionEntity.Type type, String status); // TODO: status도 조건문 추가 필요

    @Query(value = """
        SELECT *
        FROM writing_sessions
        WHERE user_id = :userId
          AND type = 'diary'
          AND DATE(created_at) = :date
          AND deleted_at IS NULL
        """, nativeQuery = true)
    List<WritingSessionEntity> findActiveDiarySessionsByUserIdAndDate(
            @Param("userId") Long userId,
            @Param("date") LocalDate date
    );
}
