package com.ecosocietyai.backend.repositories;

import com.ecosocietyai.backend.domain.entities.VendorProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VendorProfileRepository extends JpaRepository<VendorProfile, Long> {
    Optional<VendorProfile> findByUser_UserId(Long userId);
    List<VendorProfile> findByIsVerified(Boolean isVerified);
}
