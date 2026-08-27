package com.ecosocietyai.backend.domain;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    private Long userId;
    private String fullName;
    private String email;
    private String passwordHash;
    private String phoneNumber;
    private Integer roleId;
}
