package com.ecosocietyai.backend.repositories;

import com.ecosocietyai.backend.domain.entities.UtilityType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UtilityTypeRepository extends JpaRepository<UtilityType, Integer> {
    Optional<UtilityType> findByTypeName(String typeName);
}
