package com.ecosocietyai.backend.repositories;

import com.ecosocietyai.backend.domain.entities.BuilderProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BuilderProfileRepository extends JpaRepository<BuilderProfile, Long> {
    Optional<BuilderProfile> findByUser_UserId(Long userId);
    Optional<BuilderProfile> findByReraRegistrationNumber(String reraRegistrationNumber);
    List<BuilderProfile> findByIsVerified(Boolean isVerified);
}
