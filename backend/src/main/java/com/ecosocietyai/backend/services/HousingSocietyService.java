package com.ecosocietyai.backend.services;

import com.ecosocietyai.backend.domain.entities.HousingSociety;
import com.ecosocietyai.backend.repositories.HousingSocietyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class HousingSocietyService {
    private final HousingSocietyRepository societyRepository;

    public List<HousingSociety> getAllSocieties() {
        return societyRepository.findAll();
    }

    public Optional<HousingSociety> getSocietyById(Long id) {
        return societyRepository.findById(id);
    }

    public List<HousingSociety> getSocietiesByCity(String city) {
        return societyRepository.findByCity(city);
    }

    public List<HousingSociety> getSocietiesByAdminId(Long adminId) {
        return societyRepository.findByAdminUser_UserId(adminId);
    }

    public HousingSociety saveSociety(HousingSociety society) {
        return societyRepository.save(society);
    }
}
