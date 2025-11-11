package com.p_project.admin.stats;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/admin/dashboard")
public class AdminStatsController {
    private final AdminStatsService adminStatsService;

    @GetMapping("/userStats")
    public ResponseEntity<UserStatisticsDTO> getUserStatistics() {
        UserStatisticsDTO result = adminStatsService.getUserStatistics();
        return ResponseEntity.ok(result);
    }

}
