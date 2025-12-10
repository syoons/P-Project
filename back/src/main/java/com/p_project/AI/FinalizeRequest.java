package com.p_project.AI;

import com.p_project.message.MessagesEntity;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class FinalizeRequest {
    private String mode;
    private List<NextQuestionRequest.MessageDTO> messages;

    public static FinalizeRequest from(String mode, List<MessagesEntity> entities) {
        return FinalizeRequest.builder()
                .mode(mode)
                .messages(
                        entities.stream()
                                .map(NextQuestionRequest.MessageDTO::fromEntity)
                                .toList()
                )
                .build();
    }
}

