package com.p_project.book;

import com.p_project.diary.DiaryDTO;
import com.p_project.writing.WritingSessionEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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

}
