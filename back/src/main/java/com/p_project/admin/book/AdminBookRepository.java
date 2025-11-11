package com.p_project.admin.book;

import com.p_project.writing.WritingSessionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AdminBookRepository extends JpaRepository<WritingSessionEntity, Long> {

    @Query(value = """
        SELECT 
            genre AS genre,
            COUNT(*) AS count
        FROM writing_sessions
        WHERE type = 'book'
          AND deleted_at IS NULL
        GROUP BY genre
        ORDER BY count DESC
        """, nativeQuery = true)
    List<Object[]> getBookCountByGenre();

}
