package com.ecosocietyai.backend.services;

import com.ecosocietyai.backend.domain.entities.VendorProfile;
import com.ecosocietyai.backend.repositories.VendorProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class VendorProfileService {
    private final VendorProfileRepository profileRepository;

    public List<VendorProfile> getAllProfiles() {
        return profileRepository.findAll();
    }

    public Optional<VendorProfile> getProfileById(Long id) {
        return profileRepository.findById(id);
    }

    public Optional<VendorProfile> getProfileByUserId(Long userId) {
        return profileRepository.findByUser_UserId(userId);
    }

    public List<VendorProfile> getVerifiedProfiles() {
        return profileRepository.findByIsVerified(true);
    }

    public VendorProfile saveProfile(VendorProfile profile) {
        return profileRepository.save(profile);
    }
}
