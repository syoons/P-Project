package com.p_project.book;

import com.p_project.writing.WritingSessionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookRepository extends JpaRepository<WritingSessionEntity, Long> {

    int countByUserIdAndTypeAndStatusAndDeletedAtIsNull(Long userId, WritingSessionEntity.Type type, WritingSessionEntity.WritingStatus status);

}
