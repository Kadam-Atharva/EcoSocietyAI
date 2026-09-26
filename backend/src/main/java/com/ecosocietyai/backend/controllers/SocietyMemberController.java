package com.ecosocietyai.backend.controllers;

import com.ecosocietyai.backend.domain.entities.SocietyMember;
import com.ecosocietyai.backend.services.SocietyMemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/society-members")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SocietyMemberController {
    private final SocietyMemberService memberService;

    @GetMapping("/society/{societyId}")
    public ResponseEntity<List<SocietyMember>> getMembersBySocietyId(@PathVariable Long societyId) {
        return ResponseEntity.ok(memberService.getMembersBySocietyId(societyId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<SocietyMember>> getMembersByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(memberService.getMembersByUserId(userId));
    }

    @PostMapping
    public ResponseEntity<SocietyMember> addMember(@RequestBody SocietyMember member) {
        return ResponseEntity.ok(memberService.saveMember(member));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeMember(@PathVariable Long id) {
        memberService.removeMember(id);
        return ResponseEntity.noContent().build();
    }
}
