package com.example.cis4900.spring.template.housing.dao;

import com.example.cis4900.spring.template.housing.models.HousingStartsCompletions;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface HousingStartsCompletionsDao extends CrudRepository<HousingStartsCompletions, Integer> {

    @Query("SELECT h FROM HousingStartsCompletions h")
    List<HousingStartsCompletions> findAllData();
}
