package com.p_project.admin.dashboard;

import com.p_project.user.UserEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminUserRepository extends JpaRepository<UserEntity, Long> {

    @Query(value = """
        SELECT 
            u.id,
            u.nickname,
            u.email,
            FLOOR(TIMESTAMPDIFF(YEAR, u.birth_date, CURDATE()) / 10) * 10 AS ageGroup,
            COUNT(w.id) AS postCount,
            MAX(w.created_at) AS lastActive,
            u.created_at
        FROM users u
        LEFT JOIN writing_sessions w ON w.user_id = u.id AND w.deleted_at IS NULL
        WHERE (:searchType IS NULL OR :keyword IS NULL OR
               (:searchType = 'name' AND u.nickname LIKE %:keyword%) OR
               (:searchType = 'email' AND u.email LIKE %:keyword%))
        GROUP BY u.id, u.nickname, u.email, u.birth_date, u.created_at
        ORDER BY u.created_at DESC
        """, nativeQuery = true)
    Page<Object[]> searchUsers(@Param("searchType") String searchType,
                               @Param("keyword") String keyword,
                               Pageable pageable);
}
