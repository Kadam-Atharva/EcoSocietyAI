package com.ecosocietyai.backend.repositories;

import com.ecosocietyai.backend.domain.entities.VendorService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VendorServiceRepository extends JpaRepository<VendorService, Long> {
    List<VendorService> findByVendor_VendorId(Long vendorId);
    List<VendorService> findByCategory_CategoryId(Integer categoryId);
}