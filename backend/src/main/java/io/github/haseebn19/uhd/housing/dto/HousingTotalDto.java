package io.github.haseebn19.uhd.housing.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.Year;

/** The year is sent as a number, like the other endpoints. */
public record HousingTotalDto(
        String city,
        @JsonFormat(shape = JsonFormat.Shape.NUMBER_INT) Year year,
        int month,
        int totalStarts,
        int totalCompletions) {}
