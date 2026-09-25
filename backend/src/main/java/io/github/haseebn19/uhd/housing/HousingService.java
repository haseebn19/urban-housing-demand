package io.github.haseebn19.uhd.housing;

import io.github.haseebn19.uhd.housing.dto.FamilyTypeDto;
import io.github.haseebn19.uhd.housing.dto.HousingRatioDto;
import io.github.haseebn19.uhd.housing.dto.HousingTotalDto;
import io.github.haseebn19.uhd.housing.dto.ImmigrationDto;
import io.github.haseebn19.uhd.housing.dto.OccupationDto;
import java.util.List;

/** The data behind each endpoint of HousingController, which describes what each one returns. */
public interface HousingService {

    List<HousingTotalDto> getHousingTotals();

    List<HousingRatioDto> getHousingRatios();

    List<OccupationDto> getLabourMarketOccupations();

    List<FamilyTypeDto> getLabourMarketFamilyTypes();

    List<ImmigrationDto> getImmigrationData();
}
