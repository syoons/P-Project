package com.p_project.friend;

import com.p_project.user.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface FriendRepository extends JpaRepository<FriendEntity, Long> {

    @Query(value = """
    SELECT u.*
    FROM users u
    WHERE u.id IN (
      SELECT DISTINCT 
        CASE
          WHEN f1.from_user_id = :userId THEN f1.to_user_id
          ELSE f1.from_user_id
        END
      FROM friends f1
      JOIN friends f2
        ON f1.from_user_id = f2.to_user_id
       AND f1.to_user_id = f2.from_user_id
      WHERE :userId IN (f1.from_user_id, f1.to_user_id)
    )
    """, nativeQuery = true)
    List<UserEntity> findMutualFriends(@Param("userId") Long userId);

    @Query(value = """
        SELECT u.*
        FROM friends f
        JOIN users u ON u.id = f.from_user_id
        WHERE f.to_user_id = :userId
              AND f.deleted_at IS NULL
          AND NOT EXISTS (
            SELECT 1
            FROM friends f2
            WHERE f2.from_user_id = f.to_user_id
              AND f2.to_user_id = f.from_user_id
          )
        """, nativeQuery = true)
    List<UserEntity> findPendingRequestSenders(@Param("userId") Long userId);

    @Modifying
    @Transactional
    @Query(value = """
        INSERT INTO friends (from_user_id, to_user_id)
        VALUES (:toUserId, :fromUserId)
        """, nativeQuery = true)
    void acceptFriendRequest(@Param("fromUserId") Long fromUserId,
                             @Param("toUserId") Long toUserId);

    @Query(value = """
    SELECT COUNT(*) > 0
    FROM friends
    WHERE from_user_id = :toUserId
      AND to_user_id = :fromUserId
      AND deleted_at is null
    """, nativeQuery = true)
    Integer existsFriendship(@Param("fromUserId") Long fromUserId,
                             @Param("toUserId") Long toUserId);


    @Modifying
    @Transactional
    @Query(value = """
    INSERT INTO friends (from_user_id, to_user_id)
    SELECT :fromUserId, u.id
    FROM users u
    WHERE u.email = :email
      AND NOT EXISTS (
        SELECT 1 FROM friends f
        WHERE f.from_user_id = :fromUserId
          AND f.to_user_id = u.id
      )
    """, nativeQuery = true)
    void sendFriendRequest(@Param("fromUserId") Long fromUserId,
                           @Param("email") String email);

    @Modifying
    @Transactional
    @Query(value = """
        UPDATE friends
        SET deleted_at = NOW()
        WHERE from_user_id = :fromUserId
          AND to_user_id = :toUserId
          AND deleted_at IS NULL
        """, nativeQuery = true)
    void deleteFriendRequest(@Param("fromUserId") Long fromUserId,
                             @Param("toUserId") Long toUserId);
}
