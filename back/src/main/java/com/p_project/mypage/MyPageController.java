package com.p_project.mypage;

import com.p_project.jwt.TokenDecodeService;
import com.p_project.jwt.TokenRequest;
import com.p_project.profile.ProfileDTO;
import com.p_project.user.UserEntity;
import com.p_project.user.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.tomcat.util.http.fileupload.FileUploadException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/mypage")
public class MyPageController {

    private final MyPageService mypageService;
    private final UserService userService;
    private final TokenDecodeService tokenDecodeService;

    @PostMapping(path = "/profile", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProfileDTO> updateProfile(
            @RequestPart("token") String token,
            @RequestPart("file") MultipartFile file) throws FileUploadException {
        ProfileDTO result = mypageService.updateProfile(
                (Long) tokenDecodeService.decode(token).get("userId"), file);
        return ResponseEntity.ok(result);
    }

    @PostMapping
    public ResponseEntity<MyPageDTO> getMyPage(@RequestBody TokenRequest request) {
        MyPageDTO result = mypageService.getMyPage(
                (Long) tokenDecodeService.decode(request.getToken()).get("userId"));
        return ResponseEntity.ok(result);
    }

    @PostMapping(path = "/update")
    public ResponseEntity<String> updateMyPage(
            @RequestBody MyPageUpdateDTO myPageDTO) {

        Long userId = (Long) tokenDecodeService.decode(myPageDTO.getToken()).get("userId");
        Optional<UserEntity> user = userService.findById(userId);

        try {
            if(myPageDTO.getEmail() != null && !myPageDTO.getEmail().equals(user.get().getEmail())){
                if (userService.exitsEmail(myPageDTO.getEmail())) {
                    return ResponseEntity.status(HttpStatus.CONFLICT)
                            .body("이미 사용 중인 이메일입니다.");
                }
            }
            if(myPageDTO.getNickName() != null && !myPageDTO.getNickName().equals(user.get().getNickname())) {
                if (userService.exitsNickName(myPageDTO.getNickName())) {
                    return ResponseEntity.status(HttpStatus.CONFLICT)
                            .body("이미 사용 중인 닉네임입니다.");
                }
            }
            myPageDTO.setUserId(userId);
            mypageService.updateMyPage(myPageDTO);
        } catch (Exception e){
            log.error("마이페이지 업데이트 실패: {}",e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
            return ResponseEntity.ok("마이페이지 업데이트 성공");
    }

}
