package com.p_project.admin.book;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminBookService {

    private final AdminBookRepository adminBookRepository;

    public List<GenreStatsDTO> getBookGenreStats() {
        return adminBookRepository.getBookCountByGenre().stream()
                .map(row -> new GenreStatsDTO(
                        (String) row[0],
                        ((Number) row[1]).longValue()
                ))
                .toList();
    }
}
