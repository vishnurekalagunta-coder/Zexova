package com.marketnest.service.impl;

import com.marketnest.dto.MarketReferenceDto;
import com.marketnest.dto.PriceEstimationDto;
import com.marketnest.engine.PricingEngine;
import com.marketnest.entity.PriceEstimation;
import com.marketnest.repository.PriceEstimationRepository;
import com.marketnest.service.PriceEstimatorService;
import com.marketnest.service.ProductComparisonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PriceEstimatorServiceImpl implements PriceEstimatorService {

    @Autowired
    private PricingEngine pricingEngine;

    @Autowired
    private PriceEstimationRepository estimationRepository;

    @Autowired
    private ProductComparisonService comparisonService;

    @Override
    public PriceEstimationDto.Response estimate(PriceEstimationDto.Request request) {
        // Retrieve live or fallback market reference from Amazon and Flipkart
        MarketReferenceDto marketRef = comparisonService.getMarketReference(
                request.getCategory(),
                request.getBrand(),
                request.getModel()
        );

        Double currentRetail = request.getCurrentMarketPrice();
        if ((currentRetail == null || currentRetail <= 0) && marketRef.getLowestRetailPrice() != null) {
            currentRetail = marketRef.getLowestRetailPrice();
        }

        PricingEngine.ValuationOutcome outcome = pricingEngine.calculate(
                request.getCategory(),
                request.getBrand(),
                request.getModel(),
                request.getOriginalPurchasePrice(),
                request.getAgeMonths() != null ? request.getAgeMonths() : 12,
                request.getCondition(),
                Boolean.TRUE.equals(request.getHasWarranty()),
                Boolean.TRUE.equals(request.getHasOriginalAccessories()),
                currentRetail
        );

        // Persist to database
        PriceEstimation entity = new PriceEstimation();
        entity.setCategory(request.getCategory());
        entity.setBrand(request.getBrand());
        entity.setModel(request.getModel());
        entity.setOriginalPrice(request.getOriginalPurchasePrice());
        entity.setEstimatedMinPrice(outcome.getMinPrice());
        entity.setEstimatedMaxPrice(outcome.getMaxPrice());
        entity.setRecommendedSellingPrice(outcome.getRecommendedPrice());
        entity.setQuickSalePrice(outcome.getQuickSalePrice());
        entity.setDepreciationPercentage(outcome.getDepreciationPercent());
        entity.setConditionAnalysis(outcome.getConditionAnalysis());
        entity.setMarketDemand(outcome.getMarketDemand());
        entity.setPricingExplanation(outcome.getExplanation());
        entity.setEstimatedAt(LocalDateTime.now());

        PriceEstimation saved = estimationRepository.save(entity);

        // Map response
        PriceEstimationDto.Response resp = new PriceEstimationDto.Response();
        resp.setId(saved.getId());
        resp.setCategory(saved.getCategory());
        resp.setBrand(saved.getBrand());
        resp.setModel(saved.getModel());
        resp.setOriginalPrice(saved.getOriginalPrice());
        resp.setEstimatedMinPrice(outcome.getMinPrice());
        resp.setEstimatedMaxPrice(outcome.getMaxPrice());
        resp.setRecommendedSellingPrice(outcome.getRecommendedPrice());
        resp.setQuickSalePrice(outcome.getQuickSalePrice());
        resp.setDepreciationPercentage(outcome.getDepreciationPercent());
        resp.setConditionAnalysis(outcome.getConditionAnalysis());
        resp.setMarketDemand(outcome.getMarketDemand());
        resp.setPricingExplanation(outcome.getExplanation());
        resp.setEstimatedAt(saved.getEstimatedAt());

        // Marketplace benchmarks
        resp.setCurrentAmazonPrice(marketRef.getAmazonPrice());
        resp.setCurrentFlipkartPrice(marketRef.getFlipkartPrice());
        resp.setLowestRetailPrice(marketRef.getLowestRetailPrice());
        resp.setRetailDataSource(marketRef.getDataSource());

        return resp;
    }

    @Override
    public MarketReferenceDto getMarketReference(String category, String brand, String model) {
        return comparisonService.getMarketReference(category, brand, model);
    }

    @Override
    public List<PriceEstimation> getRecentEstimations() {
        return estimationRepository.findTop10ByOrderByEstimatedAtDesc();
    }
}
