package com.example.cis4900.spring.template.housing.models;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import java.sql.Timestamp;
import java.time.Year;

class HousingStartsCompletionsTest {

    private HousingStartsCompletions housing;

    @BeforeEach
    void setUp() {
        housing = new HousingStartsCompletions.Builder()
                .id(1)
                .year(Year.of(2024))
                .month(3)
                .city("SampleCity")
                .singlesStarts(10)
                .semisStarts(5)
                .rowStarts(8)
                .aptOtherStarts(15)
                .totalStarts(38)
                .singlesComplete(7)
                .semisComplete(4)
                .rowComplete(6)
                .aptOtherComplete(12)
                .totalComplete(29)
                .lastUpdated(new Timestamp(System.currentTimeMillis()))
                .build();
    }

    @Test
    void testGetters() {
        assertEquals(1, housing.getId());
        assertEquals(Year.of(2024), housing.getYear());
        assertEquals(3, housing.getMonth());
        assertEquals("SampleCity", housing.getCity());
        assertEquals(10, housing.getSinglesStarts());
        assertEquals(5, housing.getSemisStarts());
        assertEquals(8, housing.getRowStarts());
        assertEquals(15, housing.getAptOtherStarts());
        assertEquals(38, housing.getTotalStarts());
        assertEquals(7, housing.getSinglesComplete());
        assertEquals(4, housing.getSemisComplete());
        assertEquals(6, housing.getRowComplete());
        assertEquals(12, housing.getAptOtherComplete());
        assertEquals(29, housing.getTotalComplete());
        assertNotNull(housing.getLastUpdated()); // Ensuring timestamp is set
    }

    @Test
    void testBuilderPattern() {
        HousingStartsCompletions newHousing = new HousingStartsCompletions.Builder()
                .id(2)
                .year(Year.of(2023))
                .month(6)
                .city("AnotherCity")
                .totalStarts(50)
                .totalComplete(40)
                .lastUpdated(new Timestamp(System.currentTimeMillis()))
                .build();

        assertEquals(2, newHousing.getId());
        assertEquals(Year.of(2023), newHousing.getYear());
        assertEquals(6, newHousing.getMonth());
        assertEquals("AnotherCity", newHousing.getCity());
        assertEquals(50, newHousing.getTotalStarts());
        assertEquals(40, newHousing.getTotalComplete());
    }

    @Test
    void testBuilderCreatesIndependentObjects() {
        HousingStartsCompletions first = new HousingStartsCompletions.Builder().id(1).city("CityA").build();
        HousingStartsCompletions second = new HousingStartsCompletions.Builder().id(2).city("CityB").build();

        assertNotEquals(first.getId(), second.getId());
        assertNotEquals(first.getCity(), second.getCity());
    }
}
