package com.p_project.admin.stats;

import com.p_project.writing.WritingSessionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AdminStatsRepository extends JpaRepository<WritingSessionEntity, Long> {

    // 작성 시간대별 게시글 수
    @Query(value = """
        SELECT 
            HOUR(created_at) AS hour,
            COUNT(*) AS count
        FROM writing_sessions
        WHERE deleted_at IS NULL
          AND status = 'COMPLETE'
        GROUP BY HOUR(created_at)
        ORDER BY hour
        """, nativeQuery = true)
    List<Object[]> getWritingCountGroupedByHour();

    // 연령대별 회원 수
    @Query(value = """
            SELECT
        CASE
            WHEN TIMESTAMPDIFF(YEAR, birth_date, CURDATE()) < 50
                THEN CONCAT(FLOOR(TIMESTAMPDIFF(YEAR, birth_date, CURDATE()) / 10) * 10, '대')
            ELSE '50대 이상'
        END AS ageGroup,
        COUNT(*) AS count
    FROM users
    WHERE role = 'user'
      AND deleted_at IS NULL
      AND birth_date IS NOT NULL
    GROUP BY ageGroup
    ORDER BY ageGroup
    """, nativeQuery = true)
    List<Object[]> getUserCountByAgeGroupRaw();

}
