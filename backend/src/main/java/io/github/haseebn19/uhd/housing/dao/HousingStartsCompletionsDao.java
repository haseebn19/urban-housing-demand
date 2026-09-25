package io.github.haseebn19.uhd.housing.dao;

import io.github.haseebn19.uhd.housing.models.HousingStartsCompletions;
import org.springframework.data.repository.ListCrudRepository;

public interface HousingStartsCompletionsDao
        extends ListCrudRepository<HousingStartsCompletions, Integer> {}
