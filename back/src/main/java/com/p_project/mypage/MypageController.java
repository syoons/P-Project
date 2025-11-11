package com.p_project.mypage;

import com.p_project.profile.ProfileDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/myapge")
public class MyPageController {

    private final MypageService mypageService;

    @PostMapping(path = "/profile", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProfileDTO> updateProfile(
            @RequestParam("userId") Long userId,
            @RequestPart("file") MultipartFile file) {

        ProfileDTO result = mypageService.updateProfile(userId, file);
        return ResponseEntity.ok(result);
    }

    @GetMapping(path = "/{userId}")
    public ResponseEntity<MyPageDTO> getMyPage(
            @RequestParam("userId") Long userId) {

        MyPageDTO result = mypageService.getMyPage(userId);
        return ResponseEntity.ok(result);
    }

    @PostMapping(path = "update/{userId}")
    public ResponseEntity<Integer> updateMyPage(
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
