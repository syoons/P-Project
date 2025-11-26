package com.p_project.mypage;

import com.p_project.oauth2.CustomOAuth2User;
import com.p_project.profile.ProfileDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/mypage")
public class MyPageController {

    private final MyPageService mypageService;
    private final UserService userService;

    @PostMapping(path = "/profile", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProfileDTO> updateProfile(
            Authentication auth,
            @RequestPart("file") MultipartFile file) throws FileUploadException {
        CustomOAuth2User principal = (CustomOAuth2User) auth.getPrincipal();
        ProfileDTO result = mypageService.updateProfile(principal.getUserId(), file);
        return ResponseEntity.ok(result);
    }

    @GetMapping
    public ResponseEntity<MyPageDTO> getMyPage(Authentication auth) {
        CustomOAuth2User principal = (CustomOAuth2User) auth.getPrincipal();
        MyPageDTO result = mypageService.getMyPage(principal.getUserId());
        return ResponseEntity.ok(result);
    }

    @PostMapping(path = "/update")
    public ResponseEntity<String> updateMyPage(
            Authentication auth,
            @RequestBody MyPageUpdateDTO myPageDTO) {

        try {
            mypageService.updateMyPage(myPageDTO);
        } catch (Exception e){
            log.error("마이페이지 업데이트 실패: {}",e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
            return ResponseEntity.ok(200);
    }

}
