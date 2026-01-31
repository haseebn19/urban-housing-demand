package com.example.cis4900.spring.template;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Integration tests for Spring Boot application context.
 */
@SpringBootTest
@ActiveProfiles("test")
@DisplayName("Application Context Tests")
class TemplateApplicationTests {

    @Autowired
    private ApplicationContext applicationContext;

    @Test
    @DisplayName("Application context loads successfully")
    void contextLoads() {
        assertThat(applicationContext).isNotNull();
    }

    @Test
    @DisplayName("Main application class exists")
    void mainApplicationClassExists() {
        assertThat(TemplateApplication.class).isNotNull();
    }
}
