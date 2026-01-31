package com.example.cis4900.spring.template.housing;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.example.cis4900.spring.template.housing.dao.HousingStartsCompletionsDao;
import com.example.cis4900.spring.template.housing.dao.LabourMarketDao;
import com.example.cis4900.spring.template.housing.dto.*;
import com.example.cis4900.spring.template.housing.models.HousingStartsCompletions;
import com.example.cis4900.spring.template.housing.models.LabourMarket;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.sql.Timestamp;
import java.time.Year;
import java.util.List;
import java.util.Collections;

@DisplayName("HousingServiceImpl Tests")
class HousingServiceImplTest {

    @Mock
    private HousingStartsCompletionsDao housingDao;

    @Mock
    private LabourMarketDao labourDao;

    @InjectMocks
    private HousingServiceImpl housingService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("getHousingTotals returns correct DTOs")
    void testGetHousingTotals_ReturnsData() {
        // Arrange
        List<HousingStartsCompletions> mockData = List.of(
                new HousingStartsCompletions.Builder()
                        .id(1)
                        .year(Year.of(2024))
                        .month(3)
                        .city("Toronto")
                        .totalStarts(100)
                        .totalComplete(80)
                        .lastUpdated(new Timestamp(System.currentTimeMillis()))
                        .build(),
                new HousingStartsCompletions.Builder()
                        .id(2)
                        .year(Year.of(2023))
                        .month(2)
                        .city("Hamilton")
                        .totalStarts(150)
                        .totalComplete(120)
                        .lastUpdated(new Timestamp(System.currentTimeMillis()))
                        .build());
        when(housingDao.findAllData()).thenReturn(mockData);

        // Act
        List<HousingTotalDto> result = housingService.getHousingTotals();

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("Toronto", result.get(0).city());
        assertEquals(100, result.get(0).totalStarts());
        assertEquals(80, result.get(0).totalCompletions());
        assertEquals("Hamilton", result.get(1).city());
    }

    @Test
    @DisplayName("getHousingTotals returns empty list when no data")
    void testGetHousingTotals_EmptyResponse() {
        when(housingDao.findAllData()).thenReturn(Collections.emptyList());

        List<HousingTotalDto> result = housingService.getHousingTotals();

        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    @DisplayName("getHousingRatios calculates ratios correctly")
    void testGetHousingRatios_ReturnsData() {
        List<HousingStartsCompletions> mockData = List.of(
                new HousingStartsCompletions.Builder()
                        .id(1)
                        .year(Year.of(2024))
                        .month(3)
                        .city("Toronto")
                        .totalStarts(100)
                        .totalComplete(80)
                        .lastUpdated(new Timestamp(System.currentTimeMillis()))
                        .build());
        when(housingDao.findAllData()).thenReturn(mockData);

        List<HousingRatioDto> result = housingService.getHousingRatios();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Toronto", result.get(0).city());
        assertEquals(0.8, result.get(0).ratio(), 0.01);
    }

    @Test
    @DisplayName("getHousingRatios handles zero starts without division error")
    void testGetHousingRatios_HandlesZeroStarts() {
        List<HousingStartsCompletions> mockData = List.of(
                new HousingStartsCompletions.Builder()
                        .id(1)
                        .year(Year.of(2024))
                        .month(3)
                        .city("Toronto")
                        .totalStarts(0) // Zero starts
                        .totalComplete(50)
                        .lastUpdated(new Timestamp(System.currentTimeMillis()))
                        .build());
        when(housingDao.findAllData()).thenReturn(mockData);

        List<HousingRatioDto> result = housingService.getHousingRatios();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(0.0, result.get(0).ratio()); // Should be 0, not infinity or error
    }

    @Test
    @DisplayName("getHousingRatios returns empty list when no data")
    void testGetHousingRatios_EmptyResponse() {
        when(housingDao.findAllData()).thenReturn(Collections.emptyList());

        List<HousingRatioDto> result = housingService.getHousingRatios();

        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    @DisplayName("getLabourMarketOccupations returns correct DTOs")
    void testGetLabourMarketOccupations_ReturnsData() {
        List<LabourMarket> mockData = List.of(
                new LabourMarket.Builder().cma(535).noc43(5).build(), // Toronto, Finance
                new LabourMarket.Builder().cma(537).noc43(12).build() // Hamilton, Engineering
        );
        when(labourDao.findAllData()).thenReturn(mockData);

        List<OccupationDto> result = housingService.getLabourMarketOccupations();

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("Toronto", result.get(0).city());
        assertEquals("Professional occupations in finance", result.get(0).occupation());
        assertEquals("Hamilton", result.get(1).city());
        assertEquals("Professional occupations in engineering", result.get(1).occupation());
    }

    @Test
    @DisplayName("getLabourMarketOccupations handles unknown occupation codes")
    void testGetLabourMarketOccupations_HandlesUnknownCodes() {
        List<LabourMarket> mockData = List.of(
                new LabourMarket.Builder().cma(535).noc43(999).build() // Unknown code
        );
        when(labourDao.findAllData()).thenReturn(mockData);

        List<OccupationDto> result = housingService.getLabourMarketOccupations();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Unknown Occupation", result.get(0).occupation());
    }

    @Test
    @DisplayName("getLabourMarketFamilyTypes returns correct DTOs")
    void testGetLabourMarketFamilyTypes_ReturnsData() {
        List<LabourMarket> mockData = List.of(
                new LabourMarket.Builder().cma(535).eFamType(2).build(),
                new LabourMarket.Builder().cma(537).eFamType(3).build());
        when(labourDao.findAllData()).thenReturn(mockData);

        List<FamilyTypeDto> result = housingService.getLabourMarketFamilyTypes();

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("Toronto", result.get(0).city());
        assertEquals("Dual-earner couple, no children or none under 25", result.get(0).familyType());
    }

    @Test
    @DisplayName("getLabourMarketFamilyTypes returns empty list when no data")
    void testGetLabourMarketFamilyTypes_EmptyResponse() {
        when(labourDao.findAllData()).thenReturn(List.of());

        List<FamilyTypeDto> result = housingService.getLabourMarketFamilyTypes();

        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    @DisplayName("getImmigrationData returns correct DTOs")
    void testGetImmigrationData_ReturnsData() {
        List<LabourMarket> mockData = List.of(
                new LabourMarket.Builder()
                        .cma(535)
                        .survYear(2023)
                        .survMnth(6)
                        .immig(1)
                        .build(),
                new LabourMarket.Builder()
                        .cma(537)
                        .survYear(2023)
                        .survMnth(7)
                        .immig(3)
                        .build());
        when(labourDao.findAllData()).thenReturn(mockData);

        List<ImmigrationDto> result = housingService.getImmigrationData();

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("Toronto", result.get(0).city());
        assertEquals(2023, result.get(0).year());
        assertEquals("Immigrant", result.get(0).immigrantStatus());
        assertEquals("Non-immigrant", result.get(1).immigrantStatus());
    }
}
