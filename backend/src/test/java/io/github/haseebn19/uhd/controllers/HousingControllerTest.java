package io.github.haseebn19.uhd.controllers;

import static org.mockito.Mockito.*;

import io.github.haseebn19.uhd.housing.HousingService;
import io.github.haseebn19.uhd.housing.dto.FamilyTypeDto;
import io.github.haseebn19.uhd.housing.dto.HousingRatioDto;
import io.github.haseebn19.uhd.housing.dto.HousingTotalDto;
import io.github.haseebn19.uhd.housing.dto.ImmigrationDto;
import io.github.haseebn19.uhd.housing.dto.OccupationDto;
import java.time.Year;
import java.util.Collections;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

@WebMvcTest(HousingController.class)
@DisplayName("HousingController Tests")
class HousingControllerTest {

    @Autowired private MockMvc mockMvc;

    @MockitoBean private HousingService housingService;

    @Test
    @DisplayName("GET /starts-completions/total returns housing totals")
    void testGetHousingTotals_ReturnsData() throws Exception {
        List<HousingTotalDto> mockData =
                List.of(
                        new HousingTotalDto("Toronto", Year.of(2024), 1, 100, 80),
                        new HousingTotalDto("Hamilton", Year.of(2024), 1, 200, 150));
        when(housingService.getHousingTotals()).thenReturn(mockData);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/housing/starts-completions/total"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.length()").value(2))
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].city").value("Toronto"))
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].year").value(2024))
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].totalStarts").value(100))
                .andExpect(MockMvcResultMatchers.jsonPath("$[1].city").value("Hamilton"));
    }

    @Test
    @DisplayName("GET /starts-completions/total returns empty list when no data")
    void testGetHousingTotals_EmptyResponse() throws Exception {
        when(housingService.getHousingTotals()).thenReturn(Collections.emptyList());

        mockMvc.perform(MockMvcRequestBuilders.get("/api/housing/starts-completions/total"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.length()").value(0));
    }

    @Test
    @DisplayName("GET /starts-completions/ratio returns housing ratios")
    void testGetHousingRatios_ReturnsData() throws Exception {
        List<HousingRatioDto> mockData =
                List.of(
                        new HousingRatioDto("Toronto", Year.of(2024), 1, 0.8),
                        new HousingRatioDto("Hamilton", Year.of(2024), 1, 0.75));
        when(housingService.getHousingRatios()).thenReturn(mockData);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/housing/starts-completions/ratio"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.length()").value(2))
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].city").value("Toronto"))
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].year").value(2024))
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].ratio").value(0.8));
    }

    @Test
    @DisplayName("GET /starts-completions/ratio returns empty list when no data")
    void testGetHousingRatios_EmptyResponse() throws Exception {
        when(housingService.getHousingRatios()).thenReturn(Collections.emptyList());

        mockMvc.perform(MockMvcRequestBuilders.get("/api/housing/starts-completions/ratio"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.length()").value(0));
    }

    @Test
    @DisplayName("GET /labour-market/occupation returns occupation data")
    void testGetLabourMarketOccupations_ReturnsData() throws Exception {
        List<OccupationDto> mockData =
                List.of(
                        new OccupationDto("Toronto", "Professional occupations in finance"),
                        new OccupationDto("Hamilton", "Professional occupations in engineering"));
        when(housingService.getLabourMarketOccupations()).thenReturn(mockData);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/housing/labour-market/occupation"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.length()").value(2))
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].city").value("Toronto"))
                .andExpect(
                        MockMvcResultMatchers.jsonPath("$[0].occupation")
                                .value("Professional occupations in finance"));
    }

    @Test
    @DisplayName("GET /labour-market/family-type returns family type data")
    void testGetLabourMarketFamilyTypes_ReturnsData() throws Exception {
        List<FamilyTypeDto> mockData =
                List.of(
                        new FamilyTypeDto(
                                "Toronto", "Dual-earner couple, no children or none under 25"),
                        new FamilyTypeDto("Hamilton", "Person not in an economic family"));
        when(housingService.getLabourMarketFamilyTypes()).thenReturn(mockData);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/housing/labour-market/family-type"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.length()").value(2))
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].city").value("Toronto"));
    }

    @Test
    @DisplayName("GET /labour-market/immigration-data returns immigration data")
    void testGetImmigrationData_ReturnsData() throws Exception {
        List<ImmigrationDto> mockData =
                List.of(
                        new ImmigrationDto("Toronto", 2023, 6, "Immigrant"),
                        new ImmigrationDto("Hamilton", 2023, 6, "Non-immigrant"));
        when(housingService.getImmigrationData()).thenReturn(mockData);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/housing/labour-market/immigration-data"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.length()").value(2))
                .andExpect(
                        MockMvcResultMatchers.jsonPath("$[0].immigrantStatus").value("Immigrant"));
    }

    @Test
    @DisplayName("Unknown paths return 404 instead of a server error")
    void testUnknownPath_ReturnsNotFound() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/housing/unknown"))
                .andExpect(MockMvcResultMatchers.status().isNotFound())
                .andExpect(MockMvcResultMatchers.jsonPath("$.status").value(404))
                .andExpect(MockMvcResultMatchers.jsonPath("$.error").value("Not Found"));
    }

    @Test
    @DisplayName("Unsupported methods return 405 instead of a server error")
    void testUnsupportedMethod_ReturnsMethodNotAllowed() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.post("/api/housing/starts-completions/total"))
                .andExpect(MockMvcResultMatchers.status().isMethodNotAllowed())
                .andExpect(MockMvcResultMatchers.jsonPath("$.status").value(405));
    }
}
