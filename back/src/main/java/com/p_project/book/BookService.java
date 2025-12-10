package com.p_project.book;

import com.p_project.diary.DiaryDTO;
import com.p_project.writing.WritingSessionEntity;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookService {

    private final BookRepository bookRepository;

    public int countActiveBookSession(Long userId){
        return bookRepository.countByUserIdAndTypeAndStatusAndDeletedAtIsNull(userId, WritingSessionEntity.Type.book, WritingSessionEntity.WritingStatus.COMPLETE);
    }

    public List<DiaryDTO> getAllReports() {
        return bookRepository.findAll()
                .stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt())) // 최신순 정렬
                .map(DiaryDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public WritingSessionEntity complete(Long id) {
        WritingSessionEntity entity = bookRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, // 404 상태 코드
                        "Writing not found with id: " + id));

        entity.setStatus(WritingSessionEntity.WritingStatus.COMPLETE);
        return bookRepository.save(entity);
    }

    public List<BookDTO> getMyBookSessions() {

        // 1. SecurityContext에서 현재 인증된 사용자 ID를 추출
        Long currentUserId = Long.valueOf(SecurityContextHolder.getContext().getAuthentication().getName());

        log.info(">>> Current User ID from JWT : {}", currentUserId);

        // 2. Repository를 통해 독후감 세션(Type.BOOK) 목록을 조회합니다.
        //    (삭제되지 않은 COMPLETE, DRAFT 상태만 조회하도록 가정)
        List<WritingSessionEntity> sessions = bookRepository.findByUserIdAndTypeAndStatusNotOrderByCreatedAtDesc(
                currentUserId,
                WritingSessionEntity.Type.book,
                WritingSessionEntity.WritingStatus.DELETED
        );

        // 3. 조회된 Entity 목록을 BookDTO 목록으로 변환합니다.
        return sessions.stream()
                .map(session -> BookDTO.builder()
                        .sessionId(session.getId())
                        .title(session.getTitle())
                        .emotion(session.getEmotion())
                        .genre(session.getGenre())
                        .status(session.getStatus().name()) // Enum을 String으로 변환
                        .createdAt(session.getCreatedAt())
                        .recommendTitle(session.getRecommendTitle())
                        .build())
                .collect(Collectors.toList());
    }

}
