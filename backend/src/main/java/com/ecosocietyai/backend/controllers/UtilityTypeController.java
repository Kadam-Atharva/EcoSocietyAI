package com.ecosocietyai.backend.controllers;

import com.ecosocietyai.backend.domain.entities.UtilityType;
import com.ecosocietyai.backend.services.UtilityTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/utility-types")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UtilityTypeController {
    private final UtilityTypeService utilityTypeService;

    @GetMapping
    public ResponseEntity<List<UtilityType>> getAllUtilityTypes() {
        return ResponseEntity.ok(utilityTypeService.getAllUtilityTypes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UtilityType> getUtilityTypeById(@PathVariable Integer id) {
        return utilityTypeService.getUtilityTypeById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<UtilityType> createUtilityType(@RequestBody UtilityType type) {
        return ResponseEntity.ok(utilityTypeService.saveUtilityType(type));
    }
}
