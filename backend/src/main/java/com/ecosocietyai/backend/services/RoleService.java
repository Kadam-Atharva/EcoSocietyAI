package com.ecosocietyai.backend.services;

import com.ecosocietyai.backend.domain.entities.Role;
import com.ecosocietyai.backend.repositories.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RoleService {
    private final RoleRepository roleRepository;

    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    public Optional<Role> getRoleById(Integer id) {
        return roleRepository.findById(id);
    }

    public Optional<Role> getRoleByName(String name) {
        return roleRepository.findByRoleName(name);
    }

    public Role saveRole(Role role) {
        return roleRepository.save(role);
    }
}
