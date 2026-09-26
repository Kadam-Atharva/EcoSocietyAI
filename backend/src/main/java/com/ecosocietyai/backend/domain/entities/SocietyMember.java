package com.ecosocietyai.backend.domain.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "society_members")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SocietyMember {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "member_id")
    private Long memberId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "society_id", nullable = false)
    private HousingSociety society;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "flat_number")
    private String flatNumber;
}
