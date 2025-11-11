package com.p_project.admin.book;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/admin/dashboard")
@RequiredArgsConstructor
public class AdminBookController {

    private final AdminBookService adminBookService;

    @GetMapping("/bookGenreStats")
    public ResponseEntity<List<GenreStatsDTO>> getBookGenreStats() {
        return ResponseEntity.ok(adminBookService.getBookGenreStats());
    }

}
