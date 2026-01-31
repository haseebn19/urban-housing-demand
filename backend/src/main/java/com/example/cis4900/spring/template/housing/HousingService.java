package com.example.cis4900.spring.template.housing;

import com.example.cis4900.spring.template.housing.dto.*;
import java.util.List;

/**
 * Service interface for housing and labour market data operations.
 */
public interface HousingService {

    /**
     * Get housing totals (starts and completions) for all cities.
     */
    List<HousingTotalDto> getHousingTotals();

    /**
     * Get housing completion ratios for all cities.
     */
    List<HousingRatioDto> getHousingRatios();

    /**
     * Get labour market occupation distribution.
     */
    List<OccupationDto> getLabourMarketOccupations();

    /**
     * Get labour market family type distribution.
     */
    List<FamilyTypeDto> getLabourMarketFamilyTypes();

    /**
     * Get immigration data from labour market.
     */
    List<ImmigrationDto> getImmigrationData();
}
