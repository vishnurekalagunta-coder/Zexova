package com.marketnest.engine;

import com.marketnest.entity.ProductCondition;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.Set;

/**
 * Intelligent Resale Pricing Engine.
 * Implements configurable multi-factor circular commerce depreciation curves.
 * Architected to allow future integration with ML regression and random forest models.
 */
@Component
public class PricingEngine {

    private static final Set<String> PREMIUM_BRANDS = Set.of(
        "apple", "sony", "samsung", "herman miller", "trek", "royal enfield", "de'longhi", "bose", "canon"
    );

    private static final Map<ProductCondition, Double> CONDITION_FACTORS = Map.of(
        ProductCondition.LIKE_NEW, 1.08,
        ProductCondition.EXCELLENT, 1.00,
        ProductCondition.GOOD, 0.88,
        ProductCondition.FAIR, 0.72,
        ProductCondition.POOR, 0.52
    );

    public static class ValuationOutcome {
        private final double minPrice;
        private final double maxPrice;
        private final double recommendedPrice;
        private final double quickSalePrice;
        private final int depreciationPercent;
        private final String conditionAnalysis;
        private final String marketDemand;
        private final String explanation;

        public ValuationOutcome(double minPrice, double maxPrice, double recommendedPrice, 
                                double quickSalePrice, int depreciationPercent, 
                                String conditionAnalysis, String marketDemand, String explanation) {
            this.minPrice = minPrice;
            this.maxPrice = maxPrice;
            this.recommendedPrice = recommendedPrice;
            this.quickSalePrice = quickSalePrice;
            this.depreciationPercent = depreciationPercent;
            this.conditionAnalysis = conditionAnalysis;
            this.marketDemand = marketDemand;
            this.explanation = explanation;
        }

        public double getMinPrice() { return minPrice; }
        public double getMaxPrice() { return maxPrice; }
        public double getRecommendedPrice() { return recommendedPrice; }
        public double getQuickSalePrice() { return quickSalePrice; }
        public int getDepreciationPercent() { return depreciationPercent; }
        public String getConditionAnalysis() { return conditionAnalysis; }
        public String getMarketDemand() { return marketDemand; }
        public String getExplanation() { return explanation; }
    }

    public ValuationOutcome calculate(
            String category,
            String brand,
            String model,
            double originalPrice,
            int ageMonths,
            ProductCondition condition,
            boolean hasWarranty,
            boolean hasAccessories) {
        return calculate(category, brand, model, originalPrice, ageMonths, condition, hasWarranty, hasAccessories, null);
    }

    public ValuationOutcome calculate(
            String category,
            String brand,
            String model,
            double originalPrice,
            int ageMonths,
            ProductCondition condition,
            boolean hasWarranty,
            boolean hasAccessories,
            Double currentRetailPrice) {

        // 1. Annual category depreciation rate
        double annualDepreciation = 0.20; // 20% baseline
        String catLower = category != null ? category.toLowerCase() : "";
        if (catLower.contains("phone") || catLower.contains("tablet") || catLower.contains("watch")) {
            annualDepreciation = 0.24;
        } else if (catLower.contains("laptop") || catLower.contains("gaming") || catLower.contains("headphone")) {
            annualDepreciation = 0.22;
        } else if (catLower.contains("motorcycle") || catLower.contains("bicycle")) {
            annualDepreciation = 0.12;
        } else if (catLower.contains("furniture") || catLower.contains("refrigerator") || catLower.contains("washing")) {
            annualDepreciation = 0.14;
        }

        // 2. Compounded monthly depreciation
        double monthlyRate = annualDepreciation / 12.0;
        int clampedAge = Math.min(Math.max(ageMonths, 1), 72);
        double timeDepreciation = Math.pow(1.0 - monthlyRate, clampedAge);

        // 3. Physical condition factor
        double conditionFactor = CONDITION_FACTORS.getOrDefault(condition, 0.88);

        // 4. Brand liquidity multiplier
        boolean isPremium = brand != null && PREMIUM_BRANDS.contains(brand.trim().toLowerCase());
        double brandFactor = isPremium ? 1.08 : 0.98;

        // 5. Bonuses
        double warrantyBonus = hasWarranty ? 1.06 : 1.00;
        double accessoryBonus = hasAccessories ? 1.04 : 1.00;

        // 6. Compute raw price anchored to current retail market benchmark
        double valuationBase = (currentRetailPrice != null && currentRetailPrice > 0) 
                ? Math.min(originalPrice, currentRetailPrice) 
                : originalPrice;

        double rawVal = valuationBase * timeDepreciation * conditionFactor * brandFactor * warrantyBonus * accessoryBonus;
        // Floor constraint (salvage residual value)
        rawVal = Math.max(rawVal, valuationBase * 0.15);
        // Ceiling constraint: used product cannot exceed 88% of current brand new retail price
        rawVal = Math.min(rawVal, valuationBase * 0.88);

        // Round to nearest 50
        double recommended = Math.round(rawVal / 50.0) * 50.0;
        double minPrice = Math.round((recommended * 0.90) / 50.0) * 50.0;
        double maxPrice = Math.round((recommended * 1.10) / 50.0) * 50.0;
        double quickSale = Math.round((recommended * 0.86) / 50.0) * 50.0;

        int depPct = (int) Math.round(((originalPrice - recommended) / originalPrice) * 100.0);
        depPct = Math.max(0, Math.min(depPct, 85));

        // Market Demand classification
        String marketDemand = "MODERATE";
        if ((catLower.contains("phone") || catLower.contains("laptop") || catLower.contains("gaming"))
                && (condition == ProductCondition.LIKE_NEW || condition == ProductCondition.EXCELLENT)) {
            marketDemand = "HIGH";
        } else if (condition == ProductCondition.POOR || ageMonths > 36) {
            marketDemand = "LOW";
        }

        String conditionDesc;
        switch (condition) {
            case LIKE_NEW -> conditionDesc = "Near mint physical condition with full operational battery efficiency and pristine display.";
            case EXCELLENT -> conditionDesc = "Gentle cosmetic usage signs. Hardware and display operate at 100% manufacturer capacity.";
            case GOOD -> conditionDesc = "Standard surface scuffs with reliable internal components and stable remaining lifecycle.";
            case FAIR -> conditionDesc = "Noticeable aesthetic wear and battery aging, priced for budget-conscious buyers.";
            default -> conditionDesc = "Heavy cosmetic or functional wear; recommended for quick refurbishing.";
        }

        String explanation;
        if (currentRetailPrice != null && currentRetailPrice > 0) {
            explanation = String.format(
                "Valuation generated via %d-month %s depreciation curve (annual %.0f%%), %s brand resale factor (%.2f), %s grade (%.2f), benchmarked against current new retail price (₹%,.0f) and active regional circular liquidity.",
                ageMonths, category, annualDepreciation * 100, isPremium ? "premium" : "standard", brandFactor, condition, conditionFactor, currentRetailPrice
            );
        } else {
            explanation = String.format(
                "Valuation generated via %d-month %s depreciation curve (annual %.0f%%), %s brand resale factor (%.2f), %s grade (%.2f) and active regional liquidity demand.",
                ageMonths, category, annualDepreciation * 100, isPremium ? "premium" : "standard", brandFactor, condition, conditionFactor
            );
        }

        return new ValuationOutcome(minPrice, maxPrice, recommended, quickSale, depPct, conditionDesc, marketDemand, explanation);
    }
}

