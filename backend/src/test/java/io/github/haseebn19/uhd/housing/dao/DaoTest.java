package io.github.haseebn19.uhd.housing.dao;

import static org.junit.jupiter.api.Assertions.*;

import io.github.haseebn19.uhd.housing.models.HousingStartsCompletions;
import io.github.haseebn19.uhd.housing.models.LabourMarket;
import java.time.Year;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

/** Saves and reads records through the H2 test database, so the entity mappings are checked. */
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@ActiveProfiles("test")
@DisplayName("DAO Tests")
class DaoTest {

    @Autowired private HousingStartsCompletionsDao housingDao;

    @Autowired private LabourMarketDao labourDao;

    @Test
    @DisplayName("Housing records are saved and read back")
    void housingRecordsAreSavedAndRead() {
        housingDao.save(new HousingStartsCompletions("Toronto", Year.of(2024), 3, 500, 400));

        List<HousingStartsCompletions> records = housingDao.findAll();

        assertEquals(1, records.size());
        assertEquals(Year.of(2024), records.get(0).getYear());
        assertEquals(3, records.get(0).getMonth());
        assertEquals(400, records.get(0).getTotalComplete());
    }

    @Test
    @DisplayName("Labour market records keep the record number from the survey")
    void labourMarketRecordsAreSavedAndRead() {
        // Record 42, in Hamilton (CMA 537), February 2024
        labourDao.save(new LabourMarket(42, 537, 2024, 2, 12, 2, 3));

        List<LabourMarket> records = labourDao.findAll();

        assertEquals(1, records.size());
        assertEquals("Hamilton", records.get(0).getCity());
        assertEquals(12, records.get(0).getNoc43());
        assertTrue(labourDao.findById(42).isPresent());
    }
}
