package com.p_project.AI;

import com.p_project.message.MessagesEntity;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class NextQuestionRequest {

    private String mode;
    private List<MessageDTO> messages;

    public static NextQuestionRequest from(String mode, List<MessagesEntity> entities) {
        return NextQuestionRequest.builder()
                .mode(mode)
                .messages(
                        entities.stream()
                                .map(MessageDTO::fromEntity)
                                .toList()
                )
                .build();
    }

    @Getter
    @Builder
    public static class MessageDTO {
        private String role;
        private String content;

        public static MessageDTO fromEntity(MessagesEntity e) {
            return MessageDTO.builder()
                    .role(e.getRole().name())
                    .content(e.getContent())
                    .build();
        }
    }
}
