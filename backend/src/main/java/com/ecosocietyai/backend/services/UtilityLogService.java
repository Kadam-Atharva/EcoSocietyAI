package com.ecosocietyai.backend.services;

import com.ecosocietyai.backend.domain.entities.UtilityLog;
import com.ecosocietyai.backend.repositories.UtilityLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UtilityLogService {
    private final UtilityLogRepository utilityLogRepository;

    public List<UtilityLog> getLogsBySocietyId(Long societyId) {
        return utilityLogRepository.findBySociety_SocietyId(societyId);
    }

    public List<UtilityLog> getLogsBySocietyAndType(Long societyId, Integer utilityTypeId) {
        return utilityLogRepository.findBySociety_SocietyIdAndUtilityType_UtilityTypeId(societyId, utilityTypeId);
    }

    public List<UtilityLog> getLogsByDateRange(Long societyId, LocalDate start, LocalDate end) {
        return utilityLogRepository.findBySociety_SocietyIdAndBillingPeriodStartBetween(societyId, start, end);
    }

    public UtilityLog saveUtilityLog(UtilityLog log) {
        return utilityLogRepository.save(log);
    }

    public void deleteUtilityLog(Long id) {
        utilityLogRepository.deleteById(id);
    }
}
