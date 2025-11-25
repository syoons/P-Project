package com.p_project.message;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<MessagesEntity, Long> {
    List<MessagesEntity> findBySessionIdOrderByCreatedAtAsc(Long sessionId);
    int countBySessionIdAndRole(Long sessionId, MessagesEntity.MessageRole role);
}
