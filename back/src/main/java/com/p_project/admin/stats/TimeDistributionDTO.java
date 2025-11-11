package com.p_project.admin.stats;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TimeDistributionDTO {
    private int hour;
    private long count;
}
