package com.ecosocietyai.backend.domain.entities;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "vendor_services")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VendorService {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "service_id")
    private Long serviceId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_id", nullable = false)
    private VendorProfile vendor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private VendorCategory category;

    @Column(name = "service_title", nullable = false)
    private String serviceTitle;

    @Column(name = "base_price", precision = 10, scale = 2)
    private BigDecimal basePrice;
}
