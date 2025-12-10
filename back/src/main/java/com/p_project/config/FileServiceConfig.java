package com.p_project.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@Getter
public class FileServiceConfig {
    @Value("${file.upload-dir}")
    private String uploadDir;

    @Value("${file.base-url}")
    private String baseUrl;

}
