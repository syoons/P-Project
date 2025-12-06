package com.p_project.calendar;

import com.p_project.jwt.TokenDecodeService;
import com.p_project.jwt.TokenRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/calendar")
public class CalendarController {

    private final CalendarService calendarService;
    private final TokenDecodeService tokenDecodeService;

    @PostMapping("/get")
    public ResponseEntity<CalendarDTO> getCalendarSummary(@RequestBody TokenRequest request,
                                                          @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        CalendarDTO calendarDTO = calendarService.getCalendarSummary(
                (Long) tokenDecodeService.decode(request.getToken()).get("userId"), date);
        return ResponseEntity.ok(calendarDTO);
    }

}
