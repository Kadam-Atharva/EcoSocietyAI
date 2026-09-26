package com.ecosocietyai.backend.domain.entities;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "housing_societies")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HousingSociety {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "society_id")
    private Long societyId;

    @Column(name = "society_name", nullable = false)
    private String societyName;

    @Column(name = "registration_number")
    private String registrationNumber;

    @Column(name = "address")
    private String address;

    @Column(name = "city")
    private String city;

    @Column(name = "pincode")
    private String pincode;

    @Column(name = "total_flats")
    private Integer totalFlats;

    @Column(name = "total_residents")
    private Integer totalResidents;

    @Column(name = "available_roof_area_sqft", precision = 10, scale = 2)
    private BigDecimal availableRoofAreaSqft;

    @Column(name = "available_ground_area_sqft", precision = 10, scale = 2)
    private BigDecimal availableGroundAreaSqft;

    @Column(name = "monthly_sustainability_budget", precision = 12, scale = 2)
    private BigDecimal monthlySustainabilityBudget;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_user_id")
    private User adminUser;
}
