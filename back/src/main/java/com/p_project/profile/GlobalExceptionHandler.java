package com.p_project.profile;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MultipartException;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MultipartException.class)
    public ResponseEntity<Map<String, Object>> handleMultipart(MultipartException ex) {

        Map<String, Object> body = new HashMap<>();
        body.put("status", 413);
        body.put("error", "FILE_TOO_LARGE");
        body.put("message", "파일이 너무 큽니다. 최대 3MB까지 업로드 가능합니다.");

        return ResponseEntity.status(413).body(body);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneral(Exception ex) {

        Map<String, Object> body = new HashMap<>();
        body.put("status", 500);
        body.put("error", "INTERNAL_SERVER_ERROR");
        body.put("message", ex.getMessage());

        return ResponseEntity.internalServerError().body(body);
    }
}
