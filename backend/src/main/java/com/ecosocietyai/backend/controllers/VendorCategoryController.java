package com.ecosocietyai.backend.controllers;

import com.ecosocietyai.backend.domain.entities.VendorCategory;
import com.ecosocietyai.backend.services.VendorCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vendor-categories")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class VendorCategoryController {
    private final VendorCategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<VendorCategory>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    @GetMapping("/{id}")
    public ResponseEntity<VendorCategory> getCategoryById(@PathVariable Integer id) {
        return categoryService.getCategoryById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<VendorCategory> createCategory(@RequestBody VendorCategory category) {
        return ResponseEntity.ok(categoryService.saveCategory(category));
    }
}
