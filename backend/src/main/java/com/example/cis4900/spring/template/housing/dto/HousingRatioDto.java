package com.example.cis4900.spring.template.housing.dto;

import java.time.Year;

/**
 * DTO for housing completion ratio data.
 */
public record HousingRatioDto(
        String city,
        Year year,
        int month,
        double ratio) {
}
