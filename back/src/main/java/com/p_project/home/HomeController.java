package com.p_project.home;

import com.p_project.jwt.TokenDecodeService;
import com.p_project.jwt.TokenRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/home")
public class HomeController {

    private final HomeService homeService;
    private final TokenDecodeService tokenDecodeService;

    @PostMapping
    public ResponseEntity<HomeDTO> getHome(@RequestBody TokenRequest request){
        log.info("in HomeController: getHome");
        HomeDTO response = homeService.getHome(
                (Long) tokenDecodeService.decode(request.getToken()).get("userId"));

        return ResponseEntity.ok(response);
    }

    // main
    @GetMapping("/main")
    @ResponseBody
    public String mainAPI(){

        return "main route";
    }

    @PostMapping("/test")
    @ResponseBody
    public ResponseEntity<Long> testAPI(@RequestBody TokenRequest request){
        log.info(">>> [Controller] 진입 성공");

        return ResponseEntity.ok((Long) tokenDecodeService.decode(request.getToken()).get("userId"));
    }



}
