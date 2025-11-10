package com.p_project.user;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service //스프링이 관리해주는 객체
@RequiredArgsConstructor //controller 와 같이 final 멤버변수 생성자 만드는 역할
public class UserService {

    private final UserRepository userRepository; //디펜던시 추가
    private final PasswordEncoder passwordEncoder;

    public void save(UserDTO userDTO){
        //repository 의 save 메서드 호출
        System.out.println("\n\n\n\nuserDTO in userService : " + userDTO);
        UserEntity userEntity = UserEntity.toUserEntity(userDTO);
        System.out.println("\n\n\n\nUserEntity in userService" + userEntity);
        userRepository.save(userEntity);
    }

    public void resetPassword(PasswordResetDTO dto) {
        UserEntity user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("해당 이메일의 사용자를 찾을 수 없습니다."));

        // 새 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(dto.getNewPassword());
        user.setPwd(encodedPassword);

        userRepository.save(user);
    }
    public void findByNickname(UserDTO userDTO){
        //repository 의 save 메서드 호출
        System.out.println("\n\n\n\nuserDTO in userService : " + userDTO);
        UserEntity userEntity = UserEntity.toUserEntity(userDTO);
        System.out.println("\n\n\n\nUserEntity in userService" + userEntity);
        userRepository.save(userEntity);
    }

    public String findNickNameByUserId(Long userId){

        return userRepository.findById(userId).getNickname();
    }

    public Optional<UserEntity> findByNickname(String nickName){

        return userRepository.findByNickname(nickName);
    }

}
