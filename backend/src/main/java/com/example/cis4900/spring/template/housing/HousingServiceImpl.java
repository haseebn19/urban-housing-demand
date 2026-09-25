package com.example.cis4900.spring.template.housing;

import com.example.cis4900.spring.template.housing.dao.*;
import com.example.cis4900.spring.template.housing.dto.*;
import com.example.cis4900.spring.template.housing.models.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * Implementation of HousingService providing housing and labour market data.
 */
@Service
public class HousingServiceImpl implements HousingService {

        private static final Logger logger = LoggerFactory.getLogger(HousingServiceImpl.class);

        private final HousingStartsCompletionsDao housingDao;
        private final LabourMarketDao labourDao;

        public HousingServiceImpl(HousingStartsCompletionsDao housingDao, LabourMarketDao labourDao) {
                this.housingDao = housingDao;
                this.labourDao = labourDao;
        }

        // NOC_43 occupation code mappings
        private static final Map<Integer, String> OCCUPATION_MAP = Map.ofEntries(
                        Map.entry(1, "Legislative and senior management occupations"),
                        Map.entry(2, "Specialized middle management occupations"),
                        Map.entry(3, "Middle management occupations in retail and wholesale trade and customer services"),
                        Map.entry(4, "Middle management occupations in trades, transportation, production and utilities"),
                        Map.entry(5, "Professional occupations in finance"),
                        Map.entry(6, "Professional occupations in business"),
                        Map.entry(7, "Administrative and financial supervisors and specialized administrative occupations"),
                        Map.entry(8, "Administrative occupations and transportation logistics occupations"),
                        Map.entry(9, "Administrative and financial support and supply chain logistics occupations"),
                        Map.entry(10, "Professional occupations in natural sciences"),
                        Map.entry(11, "Professional occupations in applied sciences (except engineering)"),
                        Map.entry(12, "Professional occupations in engineering"),
                        Map.entry(13, "Technical occupations related to natural and applied sciences"),
                        Map.entry(14, "Health treating and consultation services professionals"),
                        Map.entry(15, "Therapy and assessment professionals"),
                        Map.entry(16, "Nursing and allied health professionals"),
                        Map.entry(17, "Technical occupations in health"),
                        Map.entry(18, "Assisting occupations in support of health services"),
                        Map.entry(19, "Professional occupations in law"),
                        Map.entry(20, "Professional occupations in education services"),
                        Map.entry(21, "Professional occupations in social and community services"),
                        Map.entry(22, "Professional occupations in government services"),
                        Map.entry(23, "Occupations in front-line public protection services"),
                        Map.entry(24, "Paraprofessional occupations in legal, social, community and education services"),
                        Map.entry(25, "Assisting occupations in education and in legal and public protection"),
                        Map.entry(26, "Care providers and public protection support occupations"),
                        Map.entry(27, "Professional occupations in art and culture"),
                        Map.entry(28, "Technical occupations in art, culture and sport"),
                        Map.entry(29, "Occupations in art, culture and sport"),
                        Map.entry(30, "Support occupations in art, culture and sport"));

        // EFAMTYPE family type code mappings
        private static final Map<Integer, String> FAMILY_TYPE_MAP = Map.ofEntries(
                        Map.entry(1, "Person not in an economic family"),
                        Map.entry(2, "Dual-earner couple, no children or none under 25"),
                        Map.entry(3, "Dual-earner couple, youngest child 0 to 17"),
                        Map.entry(4, "Dual-earner couple, youngest child 18 to 24"),
                        Map.entry(5, "Single-earner couple, male employed, no children or none under 25"),
                        Map.entry(6, "Single-earner couple, male employed, youngest child 0 to 17"),
                        Map.entry(7, "Single-earner couple, male employed, youngest child 18 to 24"),
                        Map.entry(8, "Single-earner couple, female employed, no children or none under 25"),
                        Map.entry(9, "Single-earner couple, female employed, youngest child 0 to 17"),
                        Map.entry(10, "Single-earner couple, female employed, youngest child 18 to 24"),
                        Map.entry(11, "Non-earner couple, no children or none under 25"),
                        Map.entry(12, "Non-earner couple, youngest child 0 to 17"),
                        Map.entry(13, "Non-earner couple, youngest child 18 to 24"),
                        Map.entry(14, "Lone-parent family, parent employed, youngest child 0 to 17"),
                        Map.entry(15, "Lone-parent family, parent employed, youngest child 18 to 24"),
                        Map.entry(16, "Lone-parent family, parent not employed, youngest child 0 to 17"),
                        Map.entry(17, "Lone-parent family, parent not employed, youngest child 18 to 24"),
                        Map.entry(18, "Other families"));

        // IMMIG immigrant status code mappings
        private static final Map<Integer, String> IMMIGRANT_MAP = Map.of(
                        1, "Immigrant",
                        2, "Immigrant",
                        3, "Non-immigrant");

        @Override
        public List<HousingTotalDto> getHousingTotals() {
                logger.debug("Fetching housing totals");
                List<HousingStartsCompletions> allData = housingDao.findAllData();

                return allData.stream()
                                .map(h -> new HousingTotalDto(
                                                h.getCity(),
                                                h.getYear(),
                                                h.getMonth(),
                                                h.getTotalStarts(),
                                                h.getTotalComplete()))
                                .toList();
        }

        @Override
        public List<HousingRatioDto> getHousingRatios() {
                logger.debug("Fetching housing ratios");
                List<HousingStartsCompletions> allData = housingDao.findAllData();

                return allData.stream()
                                .map(h -> {
                                        // Prevent division by zero
                                        double ratio = (h.getTotalStarts() == 0) ? 0.0
                                                        : (double) h.getTotalComplete() / h.getTotalStarts();
                                        return new HousingRatioDto(
                                                        h.getCity(),
                                                        h.getYear(),
                                                        h.getMonth(),
                                                        ratio);
                                })
                                .toList();
        }

        @Override
        public List<OccupationDto> getLabourMarketOccupations() {
                logger.debug("Fetching labour market occupations");
                List<LabourMarket> allData = labourDao.findAllData();

                return allData.stream()
                                .map(l -> new OccupationDto(
                                                l.getCity(),
                                                getOccupationName(l.getNoc43())))
                                .toList();
        }

        @Override
        public List<FamilyTypeDto> getLabourMarketFamilyTypes() {
                logger.debug("Fetching labour market family types");
                List<LabourMarket> allData = labourDao.findAllData();

                return allData.stream()
                                .map(l -> new FamilyTypeDto(
                                                l.getCity(),
                                                getFamilyTypeName(l.getEfamtype())))
                                .toList();
        }

        @Override
        public List<ImmigrationDto> getImmigrationData() {
                logger.debug("Fetching immigration data");
                List<LabourMarket> allData = labourDao.findAllData();

                return allData.stream()
                                .map(l -> new ImmigrationDto(
                                                l.getCity(),
                                                l.getYear(),
                                                l.getMonth(),
                                                getImmigrantStatus(l.getImmig())))
                                .toList();
        }

        private String getOccupationName(Integer noc43) {
                return OCCUPATION_MAP.getOrDefault(noc43, "Unknown Occupation");
        }

        private String getFamilyTypeName(Integer efamtype) {
                return FAMILY_TYPE_MAP.getOrDefault(efamtype, "Unknown Family Type");
        }

        private String getImmigrantStatus(Integer immig) {
                return IMMIGRANT_MAP.getOrDefault(immig, "Unknown Status");
        }
}
