package com.p_project.friend;

import com.p_project.calendar.CalendarDTO;
import com.p_project.jwt.TokenDecodeService;
import com.p_project.jwt.TokenRequest;
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
    private final TokenDecodeService tokenDecodeService;

    @PostMapping("/add")
    public ResponseEntity<Void> addFriend(@RequestBody FriendDTO friendDTO){ // TODO: 들어오는 리퀘스트 수정 필요
        log.info("in FriendController: addFriend");

        friendService.addFriend(friendDTO);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/accept")
    public ResponseEntity<Integer> acceptFriend(@RequestBody TokenRequest request,
                                                @RequestParam Long fromUserId) {
        friendService.acceptFriend(fromUserId,
                (Long) tokenDecodeService.decode(request.getToken()).get("userId"));
        return ResponseEntity.ok(200);
    }

    @PostMapping("/list")
    public ResponseEntity<List<UserDTO>> listFriendRequest(@RequestBody TokenRequest request){
        log.info("in FriendController: aceptFriendRequest");

        List<UserDTO> users = friendService.getMutualFriends(
                (Long) tokenDecodeService.decode(request.getToken()).get("userId"));
        return ResponseEntity.ok(users);
    }

    @PostMapping("/requests/list")
    public ResponseEntity<List<UserDTO>> getPendingRequests(@RequestBody TokenRequest request) {
        List<UserDTO> requests = friendService.getPendingRequests(
                (Long) tokenDecodeService.decode(request.getToken()).get("userId"));

        return ResponseEntity.ok(requests);
    }

    @PostMapping("/request")
    public ResponseEntity<FriendSimpleDTO> sendFriendRequest(@RequestBody TokenRequest request,
            @RequestParam String email) {

        FriendSimpleDTO friendSimpleDTO = friendService.sendFriendRequest(
                (Long) tokenDecodeService.decode(request.getToken()).get("userId"), email);
        return ResponseEntity.ok(friendSimpleDTO);
    }

    @PostMapping("/request/delete")
    public ResponseEntity<Integer> deleteFriendRequest(@RequestBody TokenRequest request,
            @RequestParam Long fromUserId) {

        friendService.deleteFriendRequest(fromUserId,
                (Long) tokenDecodeService.decode(request.getToken()).get("userId"));

        return ResponseEntity.ok(200);
    }

    @PostMapping("/calendar")
    public ResponseEntity<CalendarDTO> getFriendCalendarSummary(
            @RequestBody TokenRequest request,
            @RequestParam Long friendId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        CalendarDTO calendar = friendService.getFriendCalendarSummary(
                (Long) tokenDecodeService.decode(request.getToken()).get("userId"), friendId, date);
        return ResponseEntity.ok(calendar);
    }
}
