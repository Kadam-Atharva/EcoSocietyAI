package com.ecosocietyai.backend.repositories;

import com.ecosocietyai.backend.domain.entities.HousingSociety;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HousingSocietyRepository extends JpaRepository<HousingSociety, Long> {
    Optional<HousingSociety> findByRegistrationNumber(String registrationNumber);
    List<HousingSociety> findByCity(String city);
    List<HousingSociety> findByAdminUser_UserId(Long adminUserId);
}
