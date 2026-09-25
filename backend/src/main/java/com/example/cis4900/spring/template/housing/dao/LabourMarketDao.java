package com.example.cis4900.spring.template.housing.dao;

import com.example.cis4900.spring.template.housing.models.LabourMarket;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface LabourMarketDao extends CrudRepository<LabourMarket, Integer> {

    @Query("SELECT h FROM LabourMarket h")
    List<LabourMarket> findAllData();
}
