package io.github.haseebn19.uhd.housing.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.Map;

/** One Labour Force Survey record. Only the columns the API uses. */
@Entity
@Table(name = "labour_market")
public class LabourMarket {

    // Census Metropolitan Area codes of the two cities
    private static final Map<Integer, String> CMA_TO_CITY =
            Map.of(
                    535, "Toronto",
                    537, "Hamilton");

    // Record numbers come from the survey data, so the database does not generate them
    @Id
    @Column(name = "rec_num")
    private Integer recNum;

    @Column(name = "survyear")
    private int survYear;

    @Column(name = "survmnth")
    private int survMnth;

    private int cma;

    @Column(name = "NOC_43")
    private int noc43;

    @Column(name = "EFAMTYPE")
    private int eFamType;

    private int immig;

    protected LabourMarket() {}

    public LabourMarket(
            int recNum, int cma, int survYear, int survMnth, int noc43, int eFamType, int immig) {
        this.recNum = recNum;
        this.cma = cma;
        this.survYear = survYear;
        this.survMnth = survMnth;
        this.noc43 = noc43;
        this.eFamType = eFamType;
        this.immig = immig;
    }

    /** The city name for the CMA code, or "Unknown" for a code outside Toronto and Hamilton. */
    public String getCity() {
        return CMA_TO_CITY.getOrDefault(cma, "Unknown");
    }

    public int getYear() {
        return survYear;
    }

    public int getMonth() {
        return survMnth;
    }

    public int getNoc43() {
        return noc43;
    }

    public int getEfamtype() {
        return eFamType;
    }

    public int getImmig() {
        return immig;
    }
}
