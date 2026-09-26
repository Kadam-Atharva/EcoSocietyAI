package com.ecosocietyai.backend.services;

import com.ecosocietyai.backend.domain.entities.VendorCategory;
import com.ecosocietyai.backend.repositories.VendorCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class VendorCategoryService {
    private final VendorCategoryRepository categoryRepository;

    public List<VendorCategory> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Optional<VendorCategory> getCategoryById(Integer id) {
        return categoryRepository.findById(id);
    }

    public VendorCategory saveCategory(VendorCategory category) {
        return categoryRepository.save(category);
    }
}
