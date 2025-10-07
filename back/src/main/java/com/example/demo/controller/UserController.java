package com.example.demo.controller;


import com.example.demo.dto.UserDTO;
import com.example.demo.entity.UserEntity;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository repo;
    private final UserService userService;


    @GetMapping
    public List<UserEntity> list() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public UserEntity get(@PathVariable Integer id) {
        return repo.findById(id).orElseThrow();
    }

    @PostMapping
    public UserEntity create(@RequestBody UserEntity req) {
        // id/created_at/updated_at은 DB가 채움
        return repo.save(req);
    }


    @PostMapping("/save")
    public String save(@ModelAttribute UserDTO userDTO){
        System.out.println("UserController.save");
        System.out.println("userDTO = " + userDTO);
        userService.save(userDTO);

        return "test index";
    }

    @PutMapping("/{id}")
    public UserEntity update(@PathVariable Integer id, @RequestBody UserEntity req) {
        UserEntity u = repo.findById(id).orElseThrow();
        u.setName(req.getName());
        u.setGender(req.getGender());
        u.setNickname(req.getNickname());
        u.setDeletedAt(req.getDeletedAt());
        return repo.save(u);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        repo.deleteById(id);
    }
}
