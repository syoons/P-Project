package com.p_project.admin.stats;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AgeGroupStatsDTO {
    private String ageGroup;
    private long count;
}
