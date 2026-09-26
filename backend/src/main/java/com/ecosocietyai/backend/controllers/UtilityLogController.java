package com.ecosocietyai.backend.controllers;

import com.ecosocietyai.backend.domain.entities.UtilityLog;
import com.ecosocietyai.backend.services.UtilityLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/utility-logs")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UtilityLogController {
    private final UtilityLogService logService;

    @GetMapping("/society/{societyId}")
    public ResponseEntity<List<UtilityLog>> getLogsBySocietyId(@PathVariable Long societyId) {
        return ResponseEntity.ok(logService.getLogsBySocietyId(societyId));
    }

    @GetMapping("/society/{societyId}/type/{typeId}")
    public ResponseEntity<List<UtilityLog>> getLogsBySocietyAndType(
            @PathVariable Long societyId,
            @PathVariable Integer typeId) {
        return ResponseEntity.ok(logService.getLogsBySocietyAndType(societyId, typeId));
    }

    @GetMapping("/society/{societyId}/range")
    public ResponseEntity<List<UtilityLog>> getLogsByDateRange(
            @PathVariable Long societyId,
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {
        return ResponseEntity.ok(logService.getLogsByDateRange(societyId, startDate, endDate));
    }

    @PostMapping
    public ResponseEntity<UtilityLog> createUtilityLog(@RequestBody UtilityLog log) {
        return ResponseEntity.ok(logService.saveUtilityLog(log));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUtilityLog(@PathVariable Long id) {
        logService.deleteUtilityLog(id);
        return ResponseEntity.noContent().build();
    }
}
