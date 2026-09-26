package com.ecosocietyai.backend.domain.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "utility_types")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UtilityType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "utility_type_id")
    private Integer utilityTypeId;

    @Column(name = "type_name", nullable = false)
    private String typeName;
}
