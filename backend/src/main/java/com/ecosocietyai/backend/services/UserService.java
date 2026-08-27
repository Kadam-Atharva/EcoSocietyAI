package com.ecosocietyai.backend.services;

import com.ecosocietyai.backend.domain.CreateUserRequest;
import com.ecosocietyai.backend.domain.User;
import com.ecosocietyai.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User createUser(CreateUserRequest request) {
        // Simple validations
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new IllegalArgumentException("Email is required");
        }
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new IllegalArgumentException("Password is required");
        }
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalStateException("Email already in use");
        }

        // Mock password hashing (simulation since security starter is not configured)
        String passwordHash = "mock_hash_" + request.getPassword().hashCode();

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .passwordHash(passwordHash)
                .phoneNumber(request.getPhoneNumber())
                .roleId(request.getRoleId())
                .build();

        return userRepository.save(user);
    }
}
