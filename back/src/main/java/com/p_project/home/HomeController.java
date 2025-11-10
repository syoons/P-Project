package com.p_project.home;

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

    @GetMapping("/{userId}")
    public ResponseEntity<HomeDTO> getHome(@PathVariable Long userId){
        log.info("in HomeController: getHome");
        HomeDTO response = homeService.getHome(userId);

        return ResponseEntity.ok(response);
    }

    // main
    @GetMapping("/main")
    @ResponseBody
    public String mainAPI(){

        return "main route";
    }

}
