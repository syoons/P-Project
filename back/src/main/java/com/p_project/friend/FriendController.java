package com.p_project.friend;

import com.p_project.calendar.CalendarDTO;
import com.p_project.user.UserDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<Void> addFriend(@RequestBody FriendDTO friendDTO){
        log.info("in FriendController: addFriend");

        friendService.addFriend(friendDTO);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/accept")
    public ResponseEntity<Integer> acceptFriend(@RequestParam Long fromUserId,
                                               @RequestParam Long toUserId) {
        friendService.acceptFriend(fromUserId, toUserId);
        return ResponseEntity.ok(200);
    }

    @GetMapping("/list/{userId}")
    public ResponseEntity<List<UserDTO>> listFriendRequest(@PathVariable Long userId){
        log.info("in FriendController: aceptFriendRequest");

        List<UserDTO> users = friendService.getMutualFriends(userId);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/requests/{userId}")
    public ResponseEntity<List<UserDTO>> getPendingRequests(@PathVariable Long userId) {
        List<UserDTO> requests = friendService.getPendingRequests(userId);
        return ResponseEntity.ok(requests);
    }

    @PostMapping("/request")
    public ResponseEntity<Integer> sendFriendRequest(
            @RequestParam Long fromUserId,
            @RequestParam String email) {

        friendService.sendFriendRequest(fromUserId, email);
        return ResponseEntity.ok(200);
    }

    @PostMapping("/request/delete")
    public ResponseEntity<Integer> deleteFriendRequest(
            @RequestParam Long fromUserId,
            @RequestParam Long toUserId) {

        friendService.deleteFriendRequest(fromUserId, toUserId);
        return ResponseEntity.ok(200);
    }

    @GetMapping("/calendar/friend")
    public ResponseEntity<CalendarDTO> getFriendCalendarSummary(
            @RequestParam Long userId,
            @RequestParam Long friendId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        CalendarDTO calendar = friendService.getFriendCalendarSummary(userId, friendId, date);
        return ResponseEntity.ok(calendar);
    }
}
