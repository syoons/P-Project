package com.p_project.home;

import com.p_project.oauth2.CustomOAuth2User;
import com.p_project.user.UserEntity;
import com.p_project.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/home")
public class HomeController {

    private final HomeService homeService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<HomeDTO> getHome(Authentication auth){
        log.info("in HomeController: getHome");
        CustomOAuth2User principal = (CustomOAuth2User) auth.getPrincipal();
        HomeDTO response = homeService.getHome(principal.getUserId());

        return ResponseEntity.ok(response);
    }

    // main
    @GetMapping("/main")
    @ResponseBody
    public String mainAPI(){

        return "main route";
    }

    @GetMapping("/test")
    @ResponseBody
    public ResponseEntity<Long> testAPI(Authentication authentication){
        log.info(">>> [Controller] 진입 성공");
        log.info("token = {}", authentication.getPrincipal());

        CustomOAuth2User customUser = (CustomOAuth2User) authentication.getPrincipal();
        String email = customUser.getEmail();

        Optional<UserEntity> userDTO = userRepository.findByEmail(email);

        Long userId = userDTO.get().getId();
        log.info(String.valueOf(userId));

        return ResponseEntity.ok(userId);
    }



}
