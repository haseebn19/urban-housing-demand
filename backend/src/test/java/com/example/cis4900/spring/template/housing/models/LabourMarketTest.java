package com.example.cis4900.spring.template.housing.models;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;

import java.sql.Timestamp;

@DisplayName("LabourMarket Model Tests")
class LabourMarketTest {

    private LabourMarket labour;

    @BeforeEach
    void setUp() {
        labour = new LabourMarket.Builder()
                .recNum(1)
                .survYear(2024)
                .survMnth(2)
                .lfsStat(3)
                .prov(4)
                .cma(535) // Toronto CMA code
                .age12(6)
                .age6(7)
                .sex(8)
                .marStat(9)
                .educ(10)
                .mjh(11)
                .everWork(12)
                .ftptLast(13)
                .cowMain(14)
                .immig(1) // Immigrant
                .naics21(16)
                .noc10(17)
                .noc43(5) // Professional occupations in finance
                .hrlyEarn(19.5f)
                .unionStatus(20)
                .permTemp(21)
                .estSize(22)
                .firmSize(23)
                .durUnemp(24)
                .flowUnem(25)
                .schoolN(26)
                .eFamType(2) // Dual-earner couple
                .finalWt(28.5f)
                .lastUpdated(new Timestamp(System.currentTimeMillis()))
                .build();
    }

    @Test
    @DisplayName("getNoc43 returns correct occupation code")
    void testGetNoc43() {
        assertEquals(5, labour.getNoc43());
    }

    @Test
    @DisplayName("getCity returns city name for known CMA code")
    void testGetCity_KnownCMA() {
        assertEquals("Toronto", labour.getCity());
    }

    @Test
    @DisplayName("getCity returns Unknown for unknown CMA code")
    void testGetCity_UnknownCMA() {
        LabourMarket unknownCma = new LabourMarket.Builder()
                .cma(999)
                .build();
        assertEquals("Unknown", unknownCma.getCity());
    }

    @Test
    @DisplayName("getCmaCode returns raw CMA code")
    void testGetCmaCode() {
        assertEquals(535, labour.getCmaCode());
    }

    @Test
    @DisplayName("getCity returns Hamilton for CMA 537")
    void testGetCity_Hamilton() {
        LabourMarket hamilton = new LabourMarket.Builder()
                .cma(537)
                .build();
        assertEquals("Hamilton", hamilton.getCity());
    }

    @Test
    @DisplayName("getEfamtype returns correct family type code")
    void testGetEfamtype() {
        assertEquals(2, labour.getEfamtype());
    }

    @Test
    @DisplayName("getYear returns survey year")
    void testGetYear() {
        assertEquals(2024, labour.getYear());
    }

    @Test
    @DisplayName("getMonth returns survey month")
    void testGetMonth() {
        assertEquals(2, labour.getMonth());
    }

    @Test
    @DisplayName("getImmig returns immigration status code")
    void testGetImmig() {
        assertEquals(1, labour.getImmig());
    }

    @Test
    @DisplayName("Builder creates independent objects")
    void testBuilderCreatesIndependentObjects() {
        LabourMarket first = new LabourMarket.Builder()
                .recNum(1)
                .cma(535)
                .build();
        LabourMarket second = new LabourMarket.Builder()
                .recNum(2)
                .cma(537)
                .build();

        assertNotEquals(first.getCity(), second.getCity());
        assertEquals("Toronto", first.getCity());
        assertEquals("Hamilton", second.getCity());
    }
}
