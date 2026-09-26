package com.ecosocietyai.backend.controllers;

import com.ecosocietyai.backend.domain.entities.VendorProfile;
import com.ecosocietyai.backend.services.VendorProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vendor-profiles")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class VendorProfileController {
    private final VendorProfileService profileService;

    @GetMapping
    public ResponseEntity<List<VendorProfile>> getAllProfiles() {
        return ResponseEntity.ok(profileService.getAllProfiles());
    }

    @GetMapping("/{id}")
    public ResponseEntity<VendorProfile> getProfileById(@PathVariable Long id) {
        return profileService.getProfileById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/verified")
    public ResponseEntity<List<VendorProfile>> getVerifiedProfiles() {
        return ResponseEntity.ok(profileService.getVerifiedProfiles());
    }

    @PostMapping
    public ResponseEntity<VendorProfile> createProfile(@RequestBody VendorProfile profile) {
        return ResponseEntity.ok(profileService.saveProfile(profile));
    }
}
