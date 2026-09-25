package com.example.cis4900.spring.template.housing.models;

import jakarta.persistence.*;
import java.sql.Timestamp;
import java.time.Year;

@Entity
@Table(name = "housing_starts_completions")
public class HousingStartsCompletions {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Year year;
    private int month;
    private String city;

    // Housing Starts
    private int singlesStarts;
    private int semisStarts;
    private int rowStarts;
    private int aptOtherStarts;
    private int totalStarts;

    // Housing Completions
    private int singlesComplete;
    private int semisComplete;
    private int rowComplete;
    private int aptOtherComplete;
    private int totalComplete;
    private Timestamp lastUpdated;

    // Default constructor required by JPA
    public HousingStartsCompletions() {
    }

    // Private constructor for the builder pattern
    private HousingStartsCompletions(Builder builder) {
        this.id = builder.id;
        this.year = builder.year;
        this.month = builder.month;
        this.city = builder.city;
        this.singlesStarts = builder.singlesStarts;
        this.semisStarts = builder.semisStarts;
        this.rowStarts = builder.rowStarts;
        this.aptOtherStarts = builder.aptOtherStarts;
        this.totalStarts = builder.totalStarts;
        this.singlesComplete = builder.singlesComplete;
        this.semisComplete = builder.semisComplete;
        this.rowComplete = builder.rowComplete;
        this.aptOtherComplete = builder.aptOtherComplete;
        this.totalComplete = builder.totalComplete;
        this.lastUpdated = builder.lastUpdated;
    }

    // Builder Pattern to avoid too many parameters in the constructor
    public static class Builder {
        private Integer id;
        private Year year;
        private int month;
        private String city;
        private int singlesStarts;
        private int semisStarts;
        private int rowStarts;
        private int aptOtherStarts;
        private int totalStarts;
        private int singlesComplete;
        private int semisComplete;
        private int rowComplete;
        private int aptOtherComplete;
        private int totalComplete;
        private Timestamp lastUpdated;

        public Builder id(Integer id) {
            this.id = id;
            return this;
        }

        public Builder year(Year year) {
            this.year = year;
            return this;
        }

        public Builder month(int month) {
            this.month = month;
            return this;
        }

        public Builder city(String city) {
            this.city = city;
            return this;
        }

        public Builder singlesStarts(int singlesStarts) {
            this.singlesStarts = singlesStarts;
            return this;
        }

        public Builder semisStarts(int semisStarts) {
            this.semisStarts = semisStarts;
            return this;
        }

        public Builder rowStarts(int rowStarts) {
            this.rowStarts = rowStarts;
            return this;
        }

        public Builder aptOtherStarts(int aptOtherStarts) {
            this.aptOtherStarts = aptOtherStarts;
            return this;
        }

        public Builder totalStarts(int totalStarts) {
            this.totalStarts = totalStarts;
            return this;
        }

        public Builder singlesComplete(int singlesComplete) {
            this.singlesComplete = singlesComplete;
            return this;
        }

        public Builder semisComplete(int semisComplete) {
            this.semisComplete = semisComplete;
            return this;
        }

        public Builder rowComplete(int rowComplete) {
            this.rowComplete = rowComplete;
            return this;
        }

        public Builder aptOtherComplete(int aptOtherComplete) {
            this.aptOtherComplete = aptOtherComplete;
            return this;
        }

        public Builder totalComplete(int totalComplete) {
            this.totalComplete = totalComplete;
            return this;
        }

        public Builder lastUpdated(Timestamp lastUpdated) {
            this.lastUpdated = lastUpdated;
            return this;
        }

        public HousingStartsCompletions build() {
            return new HousingStartsCompletions(this);
        }
    }

    // Getters (No Setters to Keep It Immutable)
    public Integer getId() {
        return id;
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

    public int getSinglesStarts() {
        return singlesStarts;
    }

    public int getSemisStarts() {
        return semisStarts;
    }

    public int getRowStarts() {
        return rowStarts;
    }

    public int getAptOtherStarts() {
        return aptOtherStarts;
    }

    public int getTotalStarts() {
        return totalStarts;
    }

    public int getSinglesComplete() {
        return singlesComplete;
    }

    public int getSemisComplete() {
        return semisComplete;
    }

    public int getRowComplete() {
        return rowComplete;
    }

    public int getAptOtherComplete() {
        return aptOtherComplete;
    }

    public int getTotalComplete() {
        return totalComplete;
    }

    public Timestamp getLastUpdated() {
        return lastUpdated;
    }
}
