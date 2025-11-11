package com.p_project.admin.stats;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserStatisticsDTO {
    private List<TimeDistributionDTO> timeDistribution;
    private List<AgeGroupStatsDTO> ageGroupDistribution;
}
