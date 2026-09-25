package io.github.haseebn19.uhd.housing.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Year;

/** A city's housing starts and completions for one month. Only the columns the API uses. */
@Entity
@Table(name = "housing_starts_completions")
public class HousingStartsCompletions {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Year year;
    private int month;
    private String city;
    private int totalStarts;
    private int totalComplete;

    protected HousingStartsCompletions() {}

    public HousingStartsCompletions(
            String city, Year year, int month, int totalStarts, int totalComplete) {
        this.city = city;
        this.year = year;
        this.month = month;
        this.totalStarts = totalStarts;
        this.totalComplete = totalComplete;
    }

    public Year getYear() {
        return year;
    }

    public int getMonth() {
        return month;
    }

    public String getCity() {
        return city;
    }

    public int getTotalStarts() {
        return totalStarts;
    }

    public int getTotalComplete() {
        return totalComplete;
    }
}
