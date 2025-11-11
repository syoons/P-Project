package com.p_project.admin.dashboard;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final AdminUserRepository adminUserRepository;

    public Page<UserSummaryDTO> searchUsers(String searchType, String keyword, Pageable pageable) {
        return adminUserRepository.searchUsers(searchType, keyword, pageable)
                .map(this::convertToDTO);
    }

    private UserSummaryDTO convertToDTO(Object[] row) {
        // DB 쿼리 select 순서에 맞게 매핑
        Long id = ((Number) row[0]).longValue();
        String nickname = (String) row[1];
        String email = (String) row[2];
        String birthGroup = (row[3] == null) ? "-" : ((Number) row[3]).intValue() + "대";
        int postCount = ((Number) row[4]).intValue();
        LocalDate lastActive = row[5] != null
                ? ((Timestamp) row[5]).toLocalDateTime().toLocalDate()
                : null;
        LocalDate createdAt = ((Timestamp) row[6]).toLocalDateTime().toLocalDate();

        return new UserSummaryDTO(id, nickname, email, birthGroup, postCount, lastActive, createdAt);
    }
}
