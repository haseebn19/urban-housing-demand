package com.example.cis4900.spring.template.housing.dto;

import java.time.Year;

/**
 * DTO for housing totals data.
 */
public record HousingTotalDto(
        String city,
        Year year,
        int month,
        int totalStarts,
        int totalCompletions) {
}
