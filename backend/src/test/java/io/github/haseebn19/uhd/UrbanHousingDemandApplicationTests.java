package io.github.haseebn19.uhd;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;
import org.springframework.test.context.ActiveProfiles;

/** Starts the whole application against the in-memory test database. */
@SpringBootTest
@ActiveProfiles("test")
@DisplayName("Application Context Tests")
class UrbanHousingDemandApplicationTests {

    @Autowired private ApplicationContext applicationContext;

    @Test
    @DisplayName("Application context loads successfully")
    void contextLoads() {
        assertThat(applicationContext).isNotNull();
    }
}
