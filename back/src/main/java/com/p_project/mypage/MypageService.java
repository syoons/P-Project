package com.p_project.mypage;

import com.p_project.profile.ProfileDTO;
import com.p_project.profile.ProfileEntity;
import com.p_project.profile.ProfileService;
import com.p_project.user.UserEntity;
import com.p_project.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@Service
@RequiredArgsConstructor
public class MypageService {

    private final ProfileService profileService;
    private final UserRepository userRepository;

    public ProfileDTO updateProfile(Long userId, MultipartFile file) {

        String imageURL = profileService.uploadProfile(userId, file);

        ProfileDTO profileDTO = new ProfileDTO();
        profileDTO.setUserId(userId);
        profileDTO.setProfileURL(imageURL);

        return profileDTO;
    }

    public MyPageDTO getMyPage(Long userId) {

       MyPageDTO myPageDTO = new MyPageDTO();

        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String profileUrl = profileService.getProfile(userId)
                .map(ProfileEntity::getImageUrl)
                .orElse(null);

        myPageDTO.updateProfile(user.getNickname(),user.getEmail(), profileUrl);

        return myPageDTO;
    }

    @Transactional
    public void updateMyPage(MyPageUpdateDTO myPageUpdateDTO) {

        UserEntity user = userRepository.findById(myPageUpdateDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.updateProfile(myPageUpdateDTO.getNickName(), myPageUpdateDTO.getEmail(), myPageUpdateDTO.getGender());

    }



}
