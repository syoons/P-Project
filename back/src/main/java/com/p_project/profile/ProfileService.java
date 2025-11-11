package com.p_project.profile;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProfileService {

    private final ProfileRepository profileRepository;

    // 실제 파일이 저장될 로컬 경로 (서버 환경에 맞게 조정) TODO: 서버 배포시 경로 수정
    private static final String UPLOAD_DIR = "C:/Users/CHOYEJI/Project/P-Project/Back/res/img/";
    // 접근 가능한 기본 URL (개발 중엔 localhost, 배포 시엔 도메인) TODO: 배포시 서버 수정
    private static final String BASE_URL = "http://localhost:8080/img/";

    public String uploadProfile(Long userId, MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("파일이 비어 있습니다.");
        }

        try {
            // 파일 이름 설정
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String newFileName = UUID.randomUUID() + extension;

            // 저장 경로 생성
            Path savePath = Paths.get(UPLOAD_DIR + newFileName);
            Files.createDirectories(savePath.getParent()); // 폴더 없으면 생성
            file.transferTo(savePath.toFile()); // 파일 저장

            // 접근 가능한 URL 생성
            String imageUrl = BASE_URL + newFileName;

            // DB에 저장 (이미 있으면 업데이트)
            Optional<ProfileEntity> existingProfile = getProfile(userId);
            ProfileEntity profile = existingProfile.orElseGet(() -> new ProfileEntity());
            profile.setUserId(userId);
            profile.setImageUrl(imageUrl);

            profileRepository.save(profile);

            // 최종 URL 반환
            return imageUrl;

        } catch (IOException e) {
            throw new RuntimeException("파일 업로드 실패: " + e.getMessage(), e);
        }
    }

    public Optional<ProfileEntity> getProfile(Long userId) {

            return profileRepository.findByUserId(userId);
    }

}
