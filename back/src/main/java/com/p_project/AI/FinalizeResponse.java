package com.p_project.AI;

import lombok.Getter;

import java.util.Map;

@Getter
public class FinalizeResponse {
    private String finalText;
    private String dominantEmotion;
    private Map<String, String> music;
}
