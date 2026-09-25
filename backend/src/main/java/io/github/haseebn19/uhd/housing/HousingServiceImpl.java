package io.github.haseebn19.uhd.housing;

import io.github.haseebn19.uhd.housing.dao.HousingStartsCompletionsDao;
import io.github.haseebn19.uhd.housing.dao.LabourMarketDao;
import io.github.haseebn19.uhd.housing.dto.FamilyTypeDto;
import io.github.haseebn19.uhd.housing.dto.HousingRatioDto;
import io.github.haseebn19.uhd.housing.dto.HousingTotalDto;
import io.github.haseebn19.uhd.housing.dto.ImmigrationDto;
import io.github.haseebn19.uhd.housing.dto.OccupationDto;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;

/** Reads the housing and survey tables in full, and turns the survey's codes into names. */
@Service
public class HousingServiceImpl implements HousingService {

    // NOC_43 occupation codes: the 43 groups of Statistics Canada's labour force variant of
    // NOC 2021, in order (The 2023 Revisions of the Labour Force Survey, Appendix A, Table A-1)
    private static final Map<Integer, String> OCCUPATION_MAP =
            Map.ofEntries(
                    Map.entry(1, "Legislative and senior management occupations"),
                    Map.entry(2, "Specialized middle management occupations"),
                    Map.entry(
                            3,
                            "Middle management occupations in retail and wholesale trade and"
                                    + " customer services"),
                    Map.entry(
                            4,
                            "Middle management occupations in trades, transportation, production"
                                    + " and utilities"),
                    Map.entry(5, "Professional occupations in finance"),
                    Map.entry(6, "Professional occupations in business"),
                    Map.entry(
                            7,
                            "Administrative and financial supervisors and specialized"
                                    + " administrative occupations"),
                    Map.entry(
                            8,
                            "Administrative occupations and transportation logistics occupations"),
                    Map.entry(
                            9,
                            "Administrative and financial support and supply chain logistics"
                                    + " occupations"),
                    Map.entry(10, "Professional occupations in natural sciences"),
                    Map.entry(
                            11,
                            "Professional occupations in applied sciences (except engineering)"),
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
                    Map.entry(
                            24,
                            "Paraprofessional occupations in legal, social, community and education"
                                    + " services"),
                    Map.entry(
                            25,
                            "Assisting occupations in education and in legal and public"
                                    + " protection"),
                    Map.entry(26, "Care providers and public protection support occupations"),
                    Map.entry(27, "Professional occupations in art and culture"),
                    Map.entry(28, "Technical occupations in art, culture and sport"),
                    Map.entry(29, "Occupations in art, culture and sport"),
                    Map.entry(30, "Support occupations in art, culture and sport"),
                    Map.entry(
                            31,
                            "Retail sales and service supervisors and specialized occupations in"
                                    + " sales and services"),
                    Map.entry(32, "Occupations in sales and services"),
                    Map.entry(
                            33,
                            "Sales and service representatives and other customer and personal"
                                    + " services occupations"),
                    Map.entry(34, "Sales and service support occupations"),
                    Map.entry(35, "Technical trades and transportation officers and controllers"),
                    Map.entry(36, "General trades"),
                    Map.entry(
                            37,
                            "Mail and message distribution, other transport equipment operators"
                                    + " and related maintenance workers"),
                    Map.entry(
                            38,
                            "Helpers and labourers and other transport drivers, operators and"
                                    + " labourers"),
                    Map.entry(
                            39,
                            "Supervisors and occupations in natural resources, agriculture and"
                                    + " related production"),
                    Map.entry(
                            40,
                            "Workers and labourers in natural resources, agriculture and related"
                                    + " production"),
                    Map.entry(
                            41,
                            "Supervisors, central control and process operators in processing,"
                                    + " manufacturing and utilities and aircraft assemblers and"
                                    + " inspectors"),
                    Map.entry(
                            42,
                            "Machine operators, assemblers and inspectors in processing,"
                                    + " manufacturing and printing"),
                    Map.entry(43, "Labourers in processing, manufacturing and utilities"));

    // EFAMTYPE codes: the family type of the survey respondent
    private static final Map<Integer, String> FAMILY_TYPE_MAP =
            Map.ofEntries(
                    Map.entry(1, "Person not in an economic family"),
                    Map.entry(2, "Dual-earner couple, no children or none under 25"),
                    Map.entry(3, "Dual-earner couple, youngest child 0 to 17"),
                    Map.entry(4, "Dual-earner couple, youngest child 18 to 24"),
                    Map.entry(
                            5, "Single-earner couple, male employed, no children or none under 25"),
                    Map.entry(6, "Single-earner couple, male employed, youngest child 0 to 17"),
                    Map.entry(7, "Single-earner couple, male employed, youngest child 18 to 24"),
                    Map.entry(
                            8,
                            "Single-earner couple, female employed, no children or none under 25"),
                    Map.entry(9, "Single-earner couple, female employed, youngest child 0 to 17"),
                    Map.entry(10, "Single-earner couple, female employed, youngest child 18 to 24"),
                    Map.entry(11, "Non-earner couple, no children or none under 25"),
                    Map.entry(12, "Non-earner couple, youngest child 0 to 17"),
                    Map.entry(13, "Non-earner couple, youngest child 18 to 24"),
                    Map.entry(14, "Lone-parent family, parent employed, youngest child 0 to 17"),
                    Map.entry(15, "Lone-parent family, parent employed, youngest child 18 to 24"),
                    Map.entry(
                            16, "Lone-parent family, parent not employed, youngest child 0 to 17"),
                    Map.entry(
                            17, "Lone-parent family, parent not employed, youngest child 18 to 24"),
                    Map.entry(18, "Other families"));

    // IMMIG codes: 1 and 2 are immigrants who landed up to ten years ago and longer ago
    private static final Map<Integer, String> IMMIGRANT_MAP =
            Map.of(
                    1, "Immigrant",
                    2, "Immigrant",
                    3, "Non-immigrant");

    private final HousingStartsCompletionsDao housingDao;
    private final LabourMarketDao labourDao;

    public HousingServiceImpl(HousingStartsCompletionsDao housingDao, LabourMarketDao labourDao) {
        this.housingDao = housingDao;
        this.labourDao = labourDao;
    }

    @Override
    public List<HousingTotalDto> getHousingTotals() {
        return housingDao.findAll().stream()
                .map(
                        h ->
                                new HousingTotalDto(
                                        h.getCity(),
                                        h.getYear(),
                                        h.getMonth(),
                                        h.getTotalStarts(),
                                        h.getTotalComplete()))
                .toList();
    }

    @Override
    public List<HousingRatioDto> getHousingRatios() {
        return housingDao.findAll().stream()
                .map(
                        h -> {
                            // A month with no starts has a ratio of 0
                            double ratio =
                                    (h.getTotalStarts() == 0)
                                            ? 0.0
                                            : (double) h.getTotalComplete() / h.getTotalStarts();
                            return new HousingRatioDto(
                                    h.getCity(), h.getYear(), h.getMonth(), ratio);
                        })
                .toList();
    }

    @Override
    public List<OccupationDto> getLabourMarketOccupations() {
        return labourDao.findAll().stream()
                .map(
                        l ->
                                new OccupationDto(
                                        l.getCity(),
                                        OCCUPATION_MAP.getOrDefault(
                                                l.getNoc43(), "Unknown occupation")))
                .toList();
    }

    @Override
    public List<FamilyTypeDto> getLabourMarketFamilyTypes() {
        return labourDao.findAll().stream()
                .map(
                        l ->
                                new FamilyTypeDto(
                                        l.getCity(),
                                        FAMILY_TYPE_MAP.getOrDefault(
                                                l.getEfamtype(), "Unknown family type")))
                .toList();
    }

    @Override
    public List<ImmigrationDto> getImmigrationData() {
        return labourDao.findAll().stream()
                .map(
                        l ->
                                new ImmigrationDto(
                                        l.getCity(),
                                        l.getYear(),
                                        l.getMonth(),
                                        IMMIGRANT_MAP.getOrDefault(l.getImmig(), "Unknown status")))
                .toList();
    }
}
