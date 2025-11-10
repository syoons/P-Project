package com.p_project.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@OpenAPIDefinition(
        info = @Info(title = "P-Project API 명세서",
        description = "API 서버",
        version = "vl")
)

@Configuration
public class SwaggerConfig {

    @Bean
    public GroupedOpenApi chatOpenApi(){
        String[] paths = {"/**"};

        return GroupedOpenApi.builder()
                .group("코드 기록사의 Swagger-vi")
                .pathsToMatch(paths)
                .build();

    }
}
