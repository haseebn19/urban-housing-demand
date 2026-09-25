package com.example.cis4900.spring.template.controllers;

import com.example.cis4900.spring.template.housing.HousingService;
import com.example.cis4900.spring.template.housing.dto.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for housing and labour market data endpoints.
 * Exception handling is delegated to GlobalExceptionHandler.
 */
@RestController
@RequestMapping(path = "/api/housing")
@CrossOrigin(origins = { "http://localhost:3000", "http://frontend:3000" })
public class HousingController {

    private static final Logger logger = LoggerFactory.getLogger(HousingController.class);

    private final HousingService housingService;

    public HousingController(HousingService housingService) {
        this.housingService = housingService;
    }

    /**
     * Retrieves total starts and completions data from the
     * housing_starts_completions table.
     *
     * @return list of housing total DTOs
     */
    @GetMapping("/starts-completions/total")
    public ResponseEntity<List<HousingTotalDto>> getHousingTotals() {
        logger.info("GET /api/housing/starts-completions/total");
        List<HousingTotalDto> data = housingService.getHousingTotals();
        return ResponseEntity.ok(data);
    }

    /**
     * Retrieves completion ratio data calculated from starts and completions.
     *
     * @return list of housing ratio DTOs
     */
    @GetMapping("/starts-completions/ratio")
    public ResponseEntity<List<HousingRatioDto>> getHousingRatios() {
        logger.info("GET /api/housing/starts-completions/ratio");
        List<HousingRatioDto> data = housingService.getHousingRatios();
        return ResponseEntity.ok(data);
    }

    /**
     * Retrieves occupation distribution from labour market data.
     *
     * @return list of occupation DTOs
     */
    @GetMapping("/labour-market/occupation")
    public ResponseEntity<List<OccupationDto>> getLabourMarketOccupations() {
        logger.info("GET /api/housing/labour-market/occupation");
        List<OccupationDto> data = housingService.getLabourMarketOccupations();
        return ResponseEntity.ok(data);
    }

    /**
     * Retrieves family type distribution from labour market data.
     *
     * @return list of family type DTOs
     */
    @GetMapping("/labour-market/family-type")
    public ResponseEntity<List<FamilyTypeDto>> getLabourMarketFamilyTypes() {
        logger.info("GET /api/housing/labour-market/family-type");
        List<FamilyTypeDto> data = housingService.getLabourMarketFamilyTypes();
        return ResponseEntity.ok(data);
    }

    /**
     * Retrieves immigration data from labour market.
     *
     * @return list of immigration DTOs
     */
    @GetMapping("/labour-market/immigration-data")
    public ResponseEntity<List<ImmigrationDto>> getImmigrationData() {
        logger.info("GET /api/housing/labour-market/immigration-data");
        List<ImmigrationDto> data = housingService.getImmigrationData();
        return ResponseEntity.ok(data);
    }
}
