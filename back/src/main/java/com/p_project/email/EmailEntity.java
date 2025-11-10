package com.p_project.email;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "email_val")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmailEntity{
    @Id
    private String email;

    private String code;
    private LocalDateTime expireTime;
    private boolean verified;
}
