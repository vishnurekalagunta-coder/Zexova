package com.marketnest.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "price_estimations")
public class PriceEstimation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private String category;
    private String brand;
    private String model;
    private Double originalPrice;

    private Double estimatedMinPrice;
    private Double estimatedMaxPrice;
    private Double recommendedSellingPrice;
    private Double quickSalePrice;
    private Integer depreciationPercentage;

    @Column(length = 2000)
    private String conditionAnalysis;

    private String marketDemand; // HIGH, MODERATE, LOW

    @Column(length = 2000)
    private String pricingExplanation;

    private LocalDateTime estimatedAt = LocalDateTime.now();

    public PriceEstimation() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

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
}

