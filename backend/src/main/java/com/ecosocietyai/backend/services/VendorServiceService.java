package com.ecosocietyai.backend.services;

import com.ecosocietyai.backend.domain.entities.VendorService;
import com.ecosocietyai.backend.repositories.VendorServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class VendorServiceService {
    private final VendorServiceRepository serviceRepository;

    public List<VendorService> getAllServices() {
        return serviceRepository.findAll();
    }

    public Optional<VendorService> getServiceById(Long id) {
        return serviceRepository.findById(id);
    }

    public List<VendorService> getServicesByVendorId(Long vendorId) {
        return serviceRepository.findByVendor_VendorId(vendorId);
    }

    public List<VendorService> getServicesByCategoryId(Integer categoryId) {
        return serviceRepository.findByCategory_CategoryId(categoryId);
    }

    public VendorService saveService(VendorService vendorService) {
        return serviceRepository.save(vendorService);
    }

    public void deleteService(Long id) {
        serviceRepository.deleteById(id);
    }
}
