package com.p_project.admin.stats;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminStatsService {

    private final AdminStatsRepository adminStatsRepository;

    public UserStatisticsDTO getUserStatistics() {

        List<TimeDistributionDTO> timeStats = adminStatsRepository.getWritingCountGroupedByHour().stream()
                .map(row -> new TimeDistributionDTO(
                        ((Number) row[0]).intValue(),
                        ((Number) row[1]).longValue()
                ))
                .toList();

        List<AgeGroupStatsDTO> ageStats = adminStatsRepository.getUserCountByAgeGroupRaw().stream()
                .map(row -> new AgeGroupStatsDTO(
                        (String) row[0],
                        ((Number) row[1]).longValue()
                ))
                .toList();

        return new UserStatisticsDTO(timeStats, ageStats);
    }
}
