package com.ecosocietyai.backend.controllers;

import com.ecosocietyai.backend.domain.entities.HousingSociety;
import com.ecosocietyai.backend.services.HousingSocietyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/societies")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class HousingSocietyController {
    private final HousingSocietyService societyService;

    @GetMapping
    public ResponseEntity<List<HousingSociety>> getAllSocieties() {
        return ResponseEntity.ok(societyService.getAllSocieties());
    }

    @GetMapping("/{id}")
    public ResponseEntity<HousingSociety> getSocietyById(@PathVariable Long id) {
        return societyService.getSocietyById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/city/{city}")
    public ResponseEntity<List<HousingSociety>> getSocietiesByCity(@PathVariable String city) {
        return ResponseEntity.ok(societyService.getSocietiesByCity(city));
    }

    @PostMapping
    public ResponseEntity<HousingSociety> createSociety(@RequestBody HousingSociety society) {
        return ResponseEntity.ok(societyService.saveSociety(society));
    }
}
