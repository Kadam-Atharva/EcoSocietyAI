package com.ecosocietyai.backend.controllers;

import com.ecosocietyai.backend.domain.entities.VendorService;
import com.ecosocietyai.backend.services.VendorServiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vendor-services")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class VendorServiceController {
    private final VendorServiceService vendorServiceService;

    @GetMapping
    public ResponseEntity<List<VendorService>> getAllServices() {
        return ResponseEntity.ok(vendorServiceService.getAllServices());
    }

    @GetMapping("/{id}")
    public ResponseEntity<VendorService> getServiceById(@PathVariable Long id) {
        return vendorServiceService.getServiceById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/vendor/{vendorId}")
    public ResponseEntity<List<VendorService>> getServicesByVendorId(@PathVariable Long vendorId) {
        return ResponseEntity.ok(vendorServiceService.getServicesByVendorId(vendorId));
    }

    @PostMapping
    public ResponseEntity<VendorService> createService(@RequestBody VendorService service) {
        return ResponseEntity.ok(vendorServiceService.saveService(service));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteService(@PathVariable Long id) {
        vendorServiceService.deleteService(id);
        return ResponseEntity.noContent().build();
    }
}
