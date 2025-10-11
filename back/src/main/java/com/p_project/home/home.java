package com.p_project.home;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
public class home {

    //  임시 홈
    @GetMapping("/")
    public String index() {
        log.info("Welcom Page 들어옴");
        return "Welcom";
    }

    // main
    @GetMapping("/main")
    @ResponseBody
    public String mainAPI(){

        return "main route";
    }

}
