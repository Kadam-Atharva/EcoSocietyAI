package com.ecosocietyai.backend.repositories;

import com.ecosocietyai.backend.domain.entities.VendorCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VendorCategoryRepository extends JpaRepository<VendorCategory, Integer> {
    Optional<VendorCategory> findByCategoryName(String categoryName);
}
