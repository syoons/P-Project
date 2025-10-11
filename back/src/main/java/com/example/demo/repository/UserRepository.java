package com.example.demo.repository;

import com.example.demo.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Integer> {
    // 필요한 쿼리 메서드를 추가 가능 (예: findByNickname(String nickname))
    Optional<UserEntity> findByProviderAndProviderUserId(String provider, String providerUserId);
}