package com.ecosocietyai.backend.domain.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "vendor_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VendorProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "vendor_id")
    private Long vendorId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "company_name")
    private String companyName;

    @Column(name = "gst_number")
    private String gstNumber;

    @Column(name = "is_verified")
    private Boolean isVerified;
}
