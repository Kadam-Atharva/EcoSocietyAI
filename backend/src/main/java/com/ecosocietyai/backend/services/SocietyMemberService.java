package com.ecosocietyai.backend.services;

import com.ecosocietyai.backend.domain.entities.SocietyMember;
import com.ecosocietyai.backend.repositories.SocietyMemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SocietyMemberService {
    private final SocietyMemberRepository memberRepository;

    public List<SocietyMember> getMembersBySocietyId(Long societyId) {
        return memberRepository.findBySociety_SocietyId(societyId);
    }

    public List<SocietyMember> getMembersByUserId(Long userId) {
        return memberRepository.findByUser_UserId(userId);
    }

    public Optional<SocietyMember> getMemberBySocietyAndFlat(Long societyId, String flatNumber) {
        return memberRepository.findBySociety_SocietyIdAndFlatNumber(societyId, flatNumber);
    }

    public SocietyMember saveMember(SocietyMember member) {
        return memberRepository.save(member);
    }

    public void removeMember(Long id) {
        memberRepository.deleteById(id);
    }
}
