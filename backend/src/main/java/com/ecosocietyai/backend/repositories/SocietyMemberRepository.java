package com.ecosocietyai.backend.repositories;

import com.ecosocietyai.backend.domain.entities.SocietyMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SocietyMemberRepository extends JpaRepository<SocietyMember, Long> {
    List<SocietyMember> findBySociety_SocietyId(Long societyId);
    List<SocietyMember> findByUser_UserId(Long userId);
    Optional<SocietyMember> findBySociety_SocietyIdAndFlatNumber(Long societyId, String flatNumber);
}
