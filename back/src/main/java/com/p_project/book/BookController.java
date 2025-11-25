package com.p_project.book;

import com.p_project.diary.DiaryDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/bookreport")
@CrossOrigin(origins = "*") // React 앱과 통신 허용
public class BookController {

    private final BookService bookService;

    // 전체 독후감 리스트 조회
    @GetMapping("/list")
    public ResponseEntity<List<DiaryDTO>> getAllReports() {
        List<DiaryDTO> reports = bookService.getAllReports();
        return ResponseEntity.ok(reports);
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<?> complete(@PathVariable Long id) {
        return ResponseEntity.ok(bookService.complete(id));
    }
}
