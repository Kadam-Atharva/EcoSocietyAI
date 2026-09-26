package com.ecosocietyai.backend.domain.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "vendor_categories")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VendorCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    private Integer categoryId;

    @Column(name = "category_name", nullable = false)
    private String categoryName;
}
