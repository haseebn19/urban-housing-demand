package io.github.haseebn19.uhd.housing;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import io.github.haseebn19.uhd.housing.dao.HousingStartsCompletionsDao;
import io.github.haseebn19.uhd.housing.dao.LabourMarketDao;
import io.github.haseebn19.uhd.housing.dto.FamilyTypeDto;
import io.github.haseebn19.uhd.housing.dto.HousingRatioDto;
import io.github.haseebn19.uhd.housing.dto.HousingTotalDto;
import io.github.haseebn19.uhd.housing.dto.ImmigrationDto;
import io.github.haseebn19.uhd.housing.dto.OccupationDto;
import io.github.haseebn19.uhd.housing.models.HousingStartsCompletions;
import io.github.haseebn19.uhd.housing.models.LabourMarket;
import java.time.Year;
import java.util.Collections;
import java.util.List;
import java.util.stream.IntStream;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
@DisplayName("HousingServiceImpl Tests")
class HousingServiceImplTest {

    private static final int TORONTO = 535;
    private static final int HAMILTON = 537;

    @Mock private HousingStartsCompletionsDao housingDao;

    @Mock private LabourMarketDao labourDao;

    @InjectMocks private HousingServiceImpl housingService;

    private static HousingStartsCompletions housing(String city, int starts, int completions) {
        return new HousingStartsCompletions(city, Year.of(2024), 3, starts, completions);
    }

    /** A survey record for a city, with the occupation, family type, and immigrant codes given. */
    private static LabourMarket survey(int cma, int noc43, int eFamType, int immig) {
        return new LabourMarket(1, cma, 2023, 6, noc43, eFamType, immig);
    }

    @Test
    @DisplayName("getHousingTotals returns correct DTOs")
    void testGetHousingTotals_ReturnsData() {
        when(housingDao.findAll())
                .thenReturn(List.of(housing("Toronto", 100, 80), housing("Hamilton", 150, 120)));

        List<HousingTotalDto> result = housingService.getHousingTotals();

        assertEquals(2, result.size());
        assertEquals("Toronto", result.get(0).city());
        assertEquals(100, result.get(0).totalStarts());
        assertEquals(80, result.get(0).totalCompletions());
        assertEquals("Hamilton", result.get(1).city());
    }

    @Test
    @DisplayName("getHousingTotals returns empty list when no data")
    void testGetHousingTotals_EmptyResponse() {
        when(housingDao.findAll()).thenReturn(Collections.emptyList());

        List<HousingTotalDto> result = housingService.getHousingTotals();

        assertTrue(result.isEmpty());
    }

    @Test
    @DisplayName("getHousingRatios calculates ratios correctly")
    void testGetHousingRatios_ReturnsData() {
        when(housingDao.findAll()).thenReturn(List.of(housing("Toronto", 100, 80)));

        List<HousingRatioDto> result = housingService.getHousingRatios();

        assertEquals(1, result.size());
        assertEquals("Toronto", result.get(0).city());
        assertEquals(0.8, result.get(0).ratio(), 0.01);
    }

    @Test
    @DisplayName("getHousingRatios handles zero starts without division error")
    void testGetHousingRatios_HandlesZeroStarts() {
        when(housingDao.findAll()).thenReturn(List.of(housing("Toronto", 0, 50)));

        List<HousingRatioDto> result = housingService.getHousingRatios();

        assertEquals(1, result.size());
        assertEquals(0.0, result.get(0).ratio());
    }

    @Test
    @DisplayName("getHousingRatios returns empty list when no data")
    void testGetHousingRatios_EmptyResponse() {
        when(housingDao.findAll()).thenReturn(Collections.emptyList());

        List<HousingRatioDto> result = housingService.getHousingRatios();

        assertTrue(result.isEmpty());
    }

    @Test
    @DisplayName("getLabourMarketOccupations returns correct DTOs")
    void testGetLabourMarketOccupations_ReturnsData() {
        when(labourDao.findAll())
                .thenReturn(List.of(survey(TORONTO, 5, 1, 3), survey(HAMILTON, 12, 1, 3)));

        List<OccupationDto> result = housingService.getLabourMarketOccupations();

        assertEquals(2, result.size());
        assertEquals("Toronto", result.get(0).city());
        assertEquals("Professional occupations in finance", result.get(0).occupation());
        assertEquals("Hamilton", result.get(1).city());
        assertEquals("Professional occupations in engineering", result.get(1).occupation());
    }

    @Test
    @DisplayName("getLabourMarketOccupations handles unknown occupation codes")
    void testGetLabourMarketOccupations_HandlesUnknownCodes() {
        when(labourDao.findAll()).thenReturn(List.of(survey(TORONTO, 999, 1, 3)));

        List<OccupationDto> result = housingService.getLabourMarketOccupations();

        assertEquals(1, result.size());
        assertEquals("Unknown occupation", result.get(0).occupation());
    }

    @Test
    @DisplayName("getLabourMarketOccupations names every one of the 43 occupation codes")
    void testGetLabourMarketOccupations_NamesAllCodes() {
        List<LabourMarket> mockData =
                IntStream.rangeClosed(1, 43).mapToObj(code -> survey(TORONTO, code, 1, 3)).toList();
        when(labourDao.findAll()).thenReturn(mockData);

        List<OccupationDto> result = housingService.getLabourMarketOccupations();

        assertEquals(43, result.size());
        assertTrue(result.stream().noneMatch(dto -> dto.occupation().startsWith("Unknown")));
        assertEquals(
                "Labourers in processing, manufacturing and utilities",
                result.get(42).occupation());
    }

    @Test
    @DisplayName("getLabourMarketFamilyTypes returns correct DTOs")
    void testGetLabourMarketFamilyTypes_ReturnsData() {
        when(labourDao.findAll())
                .thenReturn(List.of(survey(TORONTO, 5, 2, 3), survey(HAMILTON, 5, 3, 3)));

        List<FamilyTypeDto> result = housingService.getLabourMarketFamilyTypes();

        assertEquals(2, result.size());
        assertEquals("Toronto", result.get(0).city());
        assertEquals(
                "Dual-earner couple, no children or none under 25", result.get(0).familyType());
    }

    @Test
    @DisplayName("getLabourMarketFamilyTypes returns empty list when no data")
    void testGetLabourMarketFamilyTypes_EmptyResponse() {
        when(labourDao.findAll()).thenReturn(List.of());

        List<FamilyTypeDto> result = housingService.getLabourMarketFamilyTypes();

        assertTrue(result.isEmpty());
    }

    @Test
    @DisplayName("getImmigrationData returns correct DTOs")
    void testGetImmigrationData_ReturnsData() {
        when(labourDao.findAll())
                .thenReturn(List.of(survey(TORONTO, 5, 1, 1), survey(HAMILTON, 5, 1, 3)));

        List<ImmigrationDto> result = housingService.getImmigrationData();

        assertEquals(2, result.size());
        assertEquals("Toronto", result.get(0).city());
        assertEquals(2023, result.get(0).year());
        assertEquals("Immigrant", result.get(0).immigrantStatus());
        assertEquals("Non-immigrant", result.get(1).immigrantStatus());
    }
}
