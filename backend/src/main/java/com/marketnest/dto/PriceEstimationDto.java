package com.marketnest.dto;

import com.marketnest.entity.ProductCondition;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class PriceEstimationDto {

    public static class Request {
        @NotBlank
        private String category;
        @NotBlank
        private String brand;
        @NotBlank
        private String model;
        @NotNull
        private Double originalPurchasePrice;
        private Integer purchaseYear = 2024;
        private Integer ageMonths = 12;
        @NotNull
        private ProductCondition condition;
        private Boolean hasWarranty = false;
        private Boolean hasOriginalAccessories = true;
        private Boolean hasOriginalBox = true;
        private String storageVariant;
        private Double currentMarketPrice;

        public Request() {}

        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }

        public String getBrand() { return brand; }
        public void setBrand(String brand) { this.brand = brand; }

        public String getModel() { return model; }
        public void setModel(String model) { this.model = model; }

        public Double getOriginalPurchasePrice() { return originalPurchasePrice; }
        public void setOriginalPurchasePrice(Double originalPurchasePrice) { this.originalPurchasePrice = originalPurchasePrice; }

        public Integer getPurchaseYear() { return purchaseYear; }
        public void setPurchaseYear(Integer purchaseYear) { this.purchaseYear = purchaseYear; }

        public Integer getAgeMonths() { return ageMonths; }
        public void setAgeMonths(Integer ageMonths) { this.ageMonths = ageMonths; }

        public ProductCondition getCondition() { return condition; }
        public void setCondition(ProductCondition condition) { this.condition = condition; }

        public Boolean getHasWarranty() { return hasWarranty; }
        public void setHasWarranty(Boolean hasWarranty) { this.hasWarranty = hasWarranty; }

        public Boolean getHasOriginalAccessories() { return hasOriginalAccessories; }
        public void setHasOriginalAccessories(Boolean hasOriginalAccessories) { this.hasOriginalAccessories = hasOriginalAccessories; }

        public Boolean getHasOriginalBox() { return hasOriginalBox; }
        public void setHasOriginalBox(Boolean hasOriginalBox) { this.hasOriginalBox = hasOriginalBox; }

        public String getStorageVariant() { return storageVariant; }
        public void setStorageVariant(String storageVariant) { this.storageVariant = storageVariant; }

        public Double getCurrentMarketPrice() { return currentMarketPrice; }
        public void setCurrentMarketPrice(Double currentMarketPrice) { this.currentMarketPrice = currentMarketPrice; }
    }

    public static class Response {
        private Long id;
        private String category;
        private String brand;
        private String model;
        private Double originalPrice;
        private Double estimatedMinPrice;
        private Double estimatedMaxPrice;
        private Double recommendedSellingPrice;
        private Double quickSalePrice;
        private Integer depreciationPercentage;
        private String conditionAnalysis;
        private String marketDemand;
        private String pricingExplanation;
        private LocalDateTime estimatedAt;

        // Retail comparison benchmarks
        private Double currentAmazonPrice;
        private Double currentFlipkartPrice;
        private Double lowestRetailPrice;
        private String retailDataSource; // "LIVE FEED" or "DEMO DATA"

        public Response() {}

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }

        public String getBrand() { return brand; }
        public void setBrand(String brand) { this.brand = brand; }

        public String getModel() { return model; }
        public void setModel(String model) { this.model = model; }

        public Double getOriginalPrice() { return originalPrice; }
        public void setOriginalPrice(Double originalPrice) { this.originalPrice = originalPrice; }

        public Double getEstimatedMinPrice() { return estimatedMinPrice; }
        public void setEstimatedMinPrice(Double estimatedMinPrice) { this.estimatedMinPrice = estimatedMinPrice; }

        public Double getEstimatedMaxPrice() { return estimatedMaxPrice; }
        public void setEstimatedMaxPrice(Double estimatedMaxPrice) { this.estimatedMaxPrice = estimatedMaxPrice; }

        public Double getRecommendedSellingPrice() { return recommendedSellingPrice; }
        public void setRecommendedSellingPrice(Double recommendedSellingPrice) { this.recommendedSellingPrice = recommendedSellingPrice; }

        public Double getQuickSalePrice() { return quickSalePrice; }
        public void setQuickSalePrice(Double quickSalePrice) { this.quickSalePrice = quickSalePrice; }

        public Integer getDepreciationPercentage() { return depreciationPercentage; }
        public void setDepreciationPercentage(Integer depreciationPercentage) { this.depreciationPercentage = depreciationPercentage; }

        public String getConditionAnalysis() { return conditionAnalysis; }
        public void setConditionAnalysis(String conditionAnalysis) { this.conditionAnalysis = conditionAnalysis; }

        public String getMarketDemand() { return marketDemand; }
        public void setMarketDemand(String marketDemand) { this.marketDemand = marketDemand; }

        public String getPricingExplanation() { return pricingExplanation; }
        public void setPricingExplanation(String pricingExplanation) { this.pricingExplanation = pricingExplanation; }

        public LocalDateTime getEstimatedAt() { return estimatedAt; }
        public void setEstimatedAt(LocalDateTime estimatedAt) { this.estimatedAt = estimatedAt; }

        public Double getCurrentAmazonPrice() { return currentAmazonPrice; }
        public void setCurrentAmazonPrice(Double currentAmazonPrice) { this.currentAmazonPrice = currentAmazonPrice; }

        public Double getCurrentFlipkartPrice() { return currentFlipkartPrice; }
        public void setCurrentFlipkartPrice(Double currentFlipkartPrice) { this.currentFlipkartPrice = currentFlipkartPrice; }

        public Double getLowestRetailPrice() { return lowestRetailPrice; }
        public void setLowestRetailPrice(Double lowestRetailPrice) { this.lowestRetailPrice = lowestRetailPrice; }

        public String getRetailDataSource() { return retailDataSource; }
        public void setRetailDataSource(String retailDataSource) { this.retailDataSource = retailDataSource; }
    }
}
