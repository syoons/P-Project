package com.example.demo.service;

import com.example.demo.dto.UserDTO;
import com.example.demo.entity.UserEntity;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service //스프링이 관리해주는 객체
@RequiredArgsConstructor //controller 와 같이 final 멤버변수 생성자 만드는 역할
public class UserService {

    private final UserRepository userRepository; //디펜던시 추가

    public void save(UserDTO userDTO){
        //repository 의 save 메서드 호출
        System.out.println("\n\n\n\nuserDTO in userService : " + userDTO);
        UserEntity userEntity = UserEntity.toUserEntity(userDTO);
        System.out.println("\n\n\n\nUserEntity in userService" + userEntity);
        userRepository.save(userEntity);
    }

}
