package com.ecosocietyai.backend.services;

import com.ecosocietyai.backend.domain.entities.UtilityType;
import com.ecosocietyai.backend.repositories.UtilityTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UtilityTypeService {
    private final UtilityTypeRepository utilityTypeRepository;

    public List<UtilityType> getAllUtilityTypes() {
        return utilityTypeRepository.findAll();
    }

    public Optional<UtilityType> getUtilityTypeById(Integer id) {
        return utilityTypeRepository.findById(id);
    }

    public UtilityType saveUtilityType(UtilityType utilityType) {
        return utilityTypeRepository.save(utilityType);
    }
}
