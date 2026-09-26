package com.ecosocietyai.backend.repositories;

import com.ecosocietyai.backend.domain.entities.UtilityLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface UtilityLogRepository extends JpaRepository<UtilityLog, Long> {
    List<UtilityLog> findBySociety_SocietyId(Long societyId);
    List<UtilityLog> findBySociety_SocietyIdAndUtilityType_UtilityTypeId(Long societyId, Integer utilityTypeId);
    List<UtilityLog> findBySociety_SocietyIdAndBillingPeriodStartBetween(Long societyId, LocalDate startDate, LocalDate endDate);
    List<UtilityLog> findByLoggedByUser_UserId(Long userId);
}
