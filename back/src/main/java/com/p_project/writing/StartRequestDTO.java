package com.p_project.writing;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StartRequestDTO {
    private WritingSessionEntity.Type type; // DIARY or BOOK
    private Long userId;
    private String token;
}
