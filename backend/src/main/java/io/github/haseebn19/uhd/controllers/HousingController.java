package io.github.haseebn19.uhd.controllers;

import io.github.haseebn19.uhd.housing.HousingService;
import io.github.haseebn19.uhd.housing.dto.FamilyTypeDto;
import io.github.haseebn19.uhd.housing.dto.HousingRatioDto;
import io.github.haseebn19.uhd.housing.dto.HousingTotalDto;
import io.github.haseebn19.uhd.housing.dto.ImmigrationDto;
import io.github.haseebn19.uhd.housing.dto.OccupationDto;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * The housing and labour market data the dashboard charts. The frontend reaches it through its own
 * server's /api proxy, so requests are same-origin. Errors are answered by GlobalExceptionHandler.
 */
@RestController
@RequestMapping(path = "/api/housing")
public class HousingController {

    private final HousingService housingService;

    public HousingController(HousingService housingService) {
        this.housingService = housingService;
    }

    /** Total starts and completions for each city and month. */
    @GetMapping("/starts-completions/total")
    public List<HousingTotalDto> getHousingTotals() {
        return housingService.getHousingTotals();
    }

    /** Completions as a share of starts, for each city and month. */
    @GetMapping("/starts-completions/ratio")
    public List<HousingRatioDto> getHousingRatios() {
        return housingService.getHousingRatios();
    }

    /** The occupation of each surveyed worker. */
    @GetMapping("/labour-market/occupation")
    public List<OccupationDto> getLabourMarketOccupations() {
        return housingService.getLabourMarketOccupations();
    }

    /** The family type of each survey record. */
    @GetMapping("/labour-market/family-type")
    public List<FamilyTypeDto> getLabourMarketFamilyTypes() {
        return housingService.getLabourMarketFamilyTypes();
    }

    /** The immigrant status of each survey record, by month. */
    @GetMapping("/labour-market/immigration-data")
    public List<ImmigrationDto> getImmigrationData() {
        return housingService.getImmigrationData();
    }
}
