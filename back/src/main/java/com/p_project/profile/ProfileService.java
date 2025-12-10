package com.p_project.profile;

import com.p_project.config.FileServiceConfig;
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
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final String UPLOAD_DIR;
    private final String BASE_URL;
    private final FileServiceConfig config;

    public ProfileService(ProfileRepository profileRepository,
                          FileServiceConfig config) {
        this.profileRepository = profileRepository;
        this.config = config;
        this.UPLOAD_DIR = config.getUploadDir();
        this.BASE_URL = config.getBaseUrl();
    }

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
            throw new FileUploadException("파일 업로드 중 오류가 발생했습니다.");
        }
    }

    public Optional<ProfileEntity> getProfile(Long userId) {

            return profileRepository.findByUserId(userId);
    }

    public static class FileUploadException extends RuntimeException {
        public FileUploadException(String message) {
            super(message);
        }
    }
}
