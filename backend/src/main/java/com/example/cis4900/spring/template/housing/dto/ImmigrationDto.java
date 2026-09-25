package com.example.cis4900.spring.template.housing.dto;

/**
 * DTO for immigration data.
 */
public record ImmigrationDto(
        String city,
        int year,
        int month,
        String immigrantStatus) {
}
