package com.example.cis4900.spring.template.controllers;

import com.example.cis4900.spring.template.housing.HousingService;
import com.example.cis4900.spring.template.housing.dto.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for housing and labour market data endpoints.
 */
@RestController
@RequestMapping(path = "/api/housing")
@CrossOrigin(origins = { "http://localhost:3000", "http://frontend:3000" })
public class HousingController {

    private static final Logger logger = LoggerFactory.getLogger(HousingController.class);

    private final HousingService housingService;

    @Autowired
    public HousingController(HousingService housingService) {
        this.housingService = housingService;
    }

    /**
     * Retrieves total starts and completions data from the
     * housing_starts_completions table.
     */
    @GetMapping("/starts-completions/total")
    public ResponseEntity<List<HousingTotalDto>> getHousingTotals() {
        logger.info("GET /api/housing/starts-completions/total");
        try {
            List<HousingTotalDto> data = housingService.getHousingTotals();
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            logger.error("Error fetching housing totals", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Retrieves completion ratio data calculated from starts and completions.
     */
    @GetMapping("/starts-completions/ratio")
    public ResponseEntity<List<HousingRatioDto>> getHousingRatios() {
        logger.info("GET /api/housing/starts-completions/ratio");
        try {
            List<HousingRatioDto> data = housingService.getHousingRatios();
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            logger.error("Error fetching housing ratios", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Retrieves occupation distribution from labour market data.
     */
    @GetMapping("/labour-market/occupation")
    public ResponseEntity<List<OccupationDto>> getLabourMarketOccupations() {
        logger.info("GET /api/housing/labour-market/occupation");
        try {
            List<OccupationDto> data = housingService.getLabourMarketOccupations();
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            logger.error("Error fetching labour market occupations", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Retrieves family type distribution from labour market data.
     */
    @GetMapping("/labour-market/family-type")
    public ResponseEntity<List<FamilyTypeDto>> getLabourMarketFamilyTypes() {
        logger.info("GET /api/housing/labour-market/family-type");
        try {
            List<FamilyTypeDto> data = housingService.getLabourMarketFamilyTypes();
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            logger.error("Error fetching labour market family types", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Retrieves immigration data from labour market.
     */
    @GetMapping("/labour-market/immigration-data")
    public ResponseEntity<List<ImmigrationDto>> getImmigrationData() {
        logger.info("GET /api/housing/labour-market/immigration-data");
        try {
            List<ImmigrationDto> data = housingService.getImmigrationData();
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            logger.error("Error fetching immigration data", e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
