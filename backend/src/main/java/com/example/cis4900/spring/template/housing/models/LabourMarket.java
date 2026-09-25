package com.example.cis4900.spring.template.housing.models;

import jakarta.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "labour_market")
public class LabourMarket {

    // CMA (Census Metropolitan Area) codes to city name mapping
    private static final java.util.Map<Integer, String> CMA_TO_CITY = java.util.Map.of(
            535, "Toronto",
            537, "Hamilton");

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rec_num", nullable = false)
    private Integer recNum;

    @Column(name = "survyear", nullable = false)
    private Integer survYear;

    @Column(name = "survmnth", nullable = false)
    private Integer survMnth;

    @Column(name = "lfsstat", nullable = false)
    private Integer lfsStat;

    @Column(name = "prov", nullable = false)
    private Integer prov;

    @Column(name = "cma", nullable = false)
    private Integer cma;

    @Column(name = "age_12", nullable = false)
    private Integer age12;

    @Column(name = "age_6", nullable = false)
    private Integer age6;

    @Column(name = "sex", nullable = false)
    private Integer sex;

    @Column(name = "marstat", nullable = false)
    private Integer marStat;

    @Column(name = "educ", nullable = false)
    private Integer educ;

    @Column(name = "mjh", nullable = false)
    private Integer mjh;

    @Column(name = "everwork", nullable = false)
    private Integer everWork;

    @Column(name = "ftptlast", nullable = false)
    private Integer ftptLast;

    @Column(name = "cowmain", nullable = false)
    private Integer cowMain;

    @Column(name = "immig", nullable = false)
    private Integer immig;

    @Column(name = "NAICS_21", nullable = false)
    private Integer naics21;

    @Column(name = "NOC_10", nullable = false)
    private Integer noc10;

    @Column(name = "NOC_43", nullable = false)
    private Integer noc43;

    @Column(name = "HRLYEARN")
    private Float hrlyEarn;

    @Column(name = "`UNION`", nullable = false)
    private Integer unionStatus;

    @Column(name = "PERMTEMP", nullable = false)
    private Integer permTemp;

    @Column(name = "ESTSIZE", nullable = false)
    private Integer estSize;

    @Column(name = "FIRMSIZE", nullable = false)
    private Integer firmSize;

    @Column(name = "DURUNEMP")
    private Integer durUnemp;

    @Column(name = "FLOWUNEM", nullable = false)
    private Integer flowUnem;

    @Column(name = "SCHOOLN", nullable = false)
    private Integer schoolN;

    @Column(name = "EFAMTYPE", nullable = false)
    private Integer eFamType;

    @Column(name = "FINALWT")
    private Float finalWt;

    @Column(name = "last_updated", insertable = false, updatable = false, columnDefinition = "TIMESTAMP DEFAULT "
            + "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
    private Timestamp lastUpdated;

    // Default constructor required by JPA
    public LabourMarket() {
    }

    // Private constructor for Builder Pattern
    private LabourMarket(Builder builder) {
        this.recNum = builder.recNum;
        this.survYear = builder.survYear;
        this.survMnth = builder.survMnth;
        this.lfsStat = builder.lfsStat;
        this.prov = builder.prov;
        this.cma = builder.cma;
        this.age12 = builder.age12;
        this.age6 = builder.age6;
        this.sex = builder.sex;
        this.marStat = builder.marStat;
        this.educ = builder.educ;
        this.mjh = builder.mjh;
        this.everWork = builder.everWork;
        this.ftptLast = builder.ftptLast;
        this.cowMain = builder.cowMain;
        this.immig = builder.immig;
        this.naics21 = builder.naics21;
        this.noc10 = builder.noc10;
        this.noc43 = builder.noc43;
        this.hrlyEarn = builder.hrlyEarn;
        this.unionStatus = builder.unionStatus;
        this.permTemp = builder.permTemp;
        this.estSize = builder.estSize;
        this.firmSize = builder.firmSize;
        this.durUnemp = builder.durUnemp;
        this.flowUnem = builder.flowUnem;
        this.schoolN = builder.schoolN;
        this.eFamType = builder.eFamType;
        this.finalWt = builder.finalWt;
        this.lastUpdated = builder.lastUpdated;
    }

    // Builder Pattern
    public static class Builder {

        private Integer recNum;
        private Integer survYear;
        private Integer survMnth;
        private Integer lfsStat;
        private Integer prov;
        private Integer cma;
        private Integer age12;
        private Integer age6;
        private Integer sex;
        private Integer marStat;
        private Integer educ;
        private Integer mjh;
        private Integer everWork;
        private Integer ftptLast;
        private Integer cowMain;
        private Integer immig;
        private Integer naics21;
        private Integer noc10;
        private Integer noc43;
        private Float hrlyEarn;
        private Integer unionStatus;
        private Integer permTemp;
        private Integer estSize;
        private Integer firmSize;
        private Integer durUnemp;
        private Integer flowUnem;
        private Integer schoolN;
        private Integer eFamType;
        private Float finalWt;
        private Timestamp lastUpdated;

        public Builder recNum(Integer recNum) {
            this.recNum = recNum;
            return this;
        }

        public Builder survYear(Integer survYear) {
            this.survYear = survYear;
            return this;
        }

        public Builder survMnth(Integer survMnth) {
            this.survMnth = survMnth;
            return this;
        }

        public Builder lfsStat(Integer lfsStat) {
            this.lfsStat = lfsStat;
            return this;
        }

        public Builder prov(Integer prov) {
            this.prov = prov;
            return this;
        }

        public Builder cma(Integer cma) {
            this.cma = cma;
            return this;
        }

        public Builder age12(Integer age12) {
            this.age12 = age12;
            return this;
        }

        public Builder age6(Integer age6) {
            this.age6 = age6;
            return this;
        }

        public Builder sex(Integer sex) {
            this.sex = sex;
            return this;
        }

        public Builder marStat(Integer marStat) {
            this.marStat = marStat;
            return this;
        }

        public Builder educ(Integer educ) {
            this.educ = educ;
            return this;
        }

        public Builder mjh(Integer mjh) {
            this.mjh = mjh;
            return this;
        }

        public Builder everWork(Integer everWork) {
            this.everWork = everWork;
            return this;
        }

        public Builder ftptLast(Integer ftptLast) {
            this.ftptLast = ftptLast;
            return this;
        }

        public Builder cowMain(Integer cowMain) {
            this.cowMain = cowMain;
            return this;
        }

        public Builder immig(Integer immig) {
            this.immig = immig;
            return this;
        }

        public Builder naics21(Integer naics21) {
            this.naics21 = naics21;
            return this;
        }

        public Builder noc10(Integer noc10) {
            this.noc10 = noc10;
            return this;
        }

        public Builder noc43(Integer noc43) {
            this.noc43 = noc43;
            return this;
        }

        public Builder hrlyEarn(Float hrlyEarn) {
            this.hrlyEarn = hrlyEarn;
            return this;
        }

        public Builder unionStatus(Integer unionStatus) {
            this.unionStatus = unionStatus;
            return this;
        }

        public Builder permTemp(Integer permTemp) {
            this.permTemp = permTemp;
            return this;
        }

        public Builder estSize(Integer estSize) {
            this.estSize = estSize;
            return this;
        }

        public Builder firmSize(Integer firmSize) {
            this.firmSize = firmSize;
            return this;
        }

        public Builder durUnemp(Integer durUnemp) {
            this.durUnemp = durUnemp;
            return this;
        }

        public Builder flowUnem(Integer flowUnem) {
            this.flowUnem = flowUnem;
            return this;
        }

        public Builder schoolN(Integer schoolN) {
            this.schoolN = schoolN;
            return this;
        }

        public Builder eFamType(Integer eFamType) {
            this.eFamType = eFamType;
            return this;
        }

        public Builder finalWt(Float finalWt) {
            this.finalWt = finalWt;
            return this;
        }

        public Builder lastUpdated(Timestamp lastUpdated) {
            this.lastUpdated = lastUpdated;
            return this;
        }

        public LabourMarket build() {
            return new LabourMarket(this);
        }
    }

    // Getters
    public Integer getNoc43() {
        return noc43;
    }

    public Integer getEfamtype() {
        return eFamType;
    }

    public Integer getCmaCode() {
        return cma;
    }

    /**
     * Returns the city name based on CMA code.
     * Maps CMA codes to human-readable city names.
     */
    public String getCity() {
        return CMA_TO_CITY.getOrDefault(cma, "Unknown");
    }

    public Integer getYear() {
        return survYear;
    }

    public Integer getMonth() {
        return survMnth;
    }

    public Integer getImmig() {
        return immig;
    }

}
