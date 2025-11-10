package com.p_project.book;

import com.p_project.writing.WritingSessionEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;

    public int countActiveBookSession(Long userId){
        return bookRepository.countByUserIdAndTypeAndStatusAndDeletedAtIsNull(userId, WritingSessionEntity.Type.book, "complete");
    }

}
