package com.ecosocietyai.backend.services;

import com.ecosocietyai.backend.domain.entities.User;
import com.ecosocietyai.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public List<User> getUsersByRoleId(Integer roleId) {
        return userRepository.findByRole_RoleId(roleId);
    }

    public User saveUser(User user) {
        if (userRepository.existsByEmail(user.getEmail()) && user.getUserId() == null) {
            throw new IllegalArgumentException("Email is already in use");
        }
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
