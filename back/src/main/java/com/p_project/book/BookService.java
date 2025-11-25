package com.p_project.book;

import com.p_project.diary.DiaryDTO;
import com.p_project.writing.WritingSessionEntity;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
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

}
