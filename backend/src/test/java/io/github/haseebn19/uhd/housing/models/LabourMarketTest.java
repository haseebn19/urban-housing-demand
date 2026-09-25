package io.github.haseebn19.uhd.housing.models;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

@DisplayName("LabourMarket Model Tests")
class LabourMarketTest {

    private static LabourMarket recordFor(int cma) {
        return new LabourMarket(1, cma, 2024, 2, 5, 2, 1);
    }

    @Test
    @DisplayName("CMA 535 is Toronto and 537 is Hamilton")
    void namesTheTwoCities() {
        assertEquals("Toronto", recordFor(535).getCity());
        assertEquals("Hamilton", recordFor(537).getCity());
    }

    @Test
    @DisplayName("Any other CMA code is Unknown")
    void namesOtherCodesUnknown() {
        assertEquals("Unknown", recordFor(999).getCity());
    }
}
