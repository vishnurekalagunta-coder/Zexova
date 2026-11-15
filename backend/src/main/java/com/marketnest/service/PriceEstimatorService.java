package com.marketnest.service;

import com.marketnest.dto.MarketReferenceDto;
import com.marketnest.dto.PriceEstimationDto;
import com.marketnest.entity.PriceEstimation;

import java.util.List;

public interface PriceEstimatorService {
    PriceEstimationDto.Response estimate(PriceEstimationDto.Request request);
    MarketReferenceDto getMarketReference(String category, String brand, String model);
    List<PriceEstimation> getRecentEstimations();
}

