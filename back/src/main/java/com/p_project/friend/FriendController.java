package com.p_project.friend;

import com.p_project.calendar.CalendarDTO;
import com.p_project.oauth2.CustomOAuth2User;
import com.p_project.user.UserDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/friend")
public class FriendController {

    private final FriendService friendService;

    @PostMapping("/add")
    public ResponseEntity<Void> addFriend(@RequestBody FriendDTO friendDTO){ // TODO: 들어오는 리퀘스트 수정 필요
        log.info("in FriendController: addFriend");

        friendService.addFriend(friendDTO);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/accept")
    public ResponseEntity<Integer> acceptFriend(Authentication auth,
                                                @RequestParam Long fromUserId) {
        CustomOAuth2User principal = (CustomOAuth2User) auth.getPrincipal();
        friendService.acceptFriend(fromUserId, principal.getUserId());
        return ResponseEntity.ok(200);
    }

    @GetMapping("/list")
    public ResponseEntity<List<UserDTO>> listFriendRequest(Authentication auth){
        log.info("in FriendController: aceptFriendRequest");

        CustomOAuth2User principal = (CustomOAuth2User) auth.getPrincipal();
        List<UserDTO> users = friendService.getMutualFriends(principal.getUserId());
        return ResponseEntity.ok(users);
    }

    @GetMapping("/requests/list")
    public ResponseEntity<List<UserDTO>> getPendingRequests(Authentication auth) {
        CustomOAuth2User principal = (CustomOAuth2User) auth.getPrincipal();
        List<UserDTO> requests = friendService.getPendingRequests(principal.getUserId());

        return ResponseEntity.ok(requests);
    }

    @PostMapping("/request")
    public ResponseEntity<FriendSimpleDTO> sendFriendRequest(Authentication auth,
            @RequestParam String email) {

        CustomOAuth2User principal = (CustomOAuth2User) auth.getPrincipal();
        FriendSimpleDTO friendSimpleDTO = friendService.sendFriendRequest(principal.getUserId(), email);
        return ResponseEntity.ok(friendSimpleDTO);
    }

    @PostMapping("/request/delete")
    public ResponseEntity<Integer> deleteFriendRequest(Authentication auth,
            @RequestParam Long fromUserId) {

        CustomOAuth2User principal = (CustomOAuth2User) auth.getPrincipal();
        friendService.deleteFriendRequest(fromUserId, principal.getUserId());

        return ResponseEntity.ok(200);
    }

    @GetMapping("/calendar")
    public ResponseEntity<CalendarDTO> getFriendCalendarSummary(
            Authentication auth,
            @RequestParam Long friendId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        CustomOAuth2User principal = (CustomOAuth2User) auth.getPrincipal();
        CalendarDTO calendar = friendService.getFriendCalendarSummary(principal.getUserId(), friendId, date);
        return ResponseEntity.ok(calendar);
    }
}
