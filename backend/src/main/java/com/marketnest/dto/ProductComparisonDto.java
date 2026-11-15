package com.marketnest.dto;

import java.time.LocalDateTime;

public class ProductComparisonDto {
    private Long productId;
    private String identifier;
    private String title;
    private String brand;
    private String model;
    private String category;
    private String subcategory;
    private String imageUrl;
    private String variant;
    private String specifications;
    private Double originalMrp;

    private MarketplaceOfferDto amazonOffer;
    private MarketplaceOfferDto flipkartOffer;

    private Double lowestPrice;
    private String lowestPriceSource; // "Amazon", "Flipkart", "Equal", "None"
    private Double priceDifference;
    private Integer bestDiscountPercent;
    private LocalDateTime lastUpdated = LocalDateTime.now();
    private String dataSourceLabel = "LIVE FEED"; // "LIVE FEED" or "DEMO DATA"

    public ProductComparisonDto() {}

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getIdentifier() { return identifier; }
    public void setIdentifier(String identifier) { this.identifier = identifier; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getSubcategory() { return subcategory; }
    public void setSubcategory(String subcategory) { this.subcategory = subcategory; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getVariant() { return variant; }
    public void setVariant(String variant) { this.variant = variant; }

    public String getSpecifications() { return specifications; }
    public void setSpecifications(String specifications) { this.specifications = specifications; }

    public Double getOriginalMrp() { return originalMrp; }
    public void setOriginalMrp(Double originalMrp) { this.originalMrp = originalMrp; }

    public MarketplaceOfferDto getAmazonOffer() { return amazonOffer; }
    public void setAmazonOffer(MarketplaceOfferDto amazonOffer) { this.amazonOffer = amazonOffer; }

    public MarketplaceOfferDto getFlipkartOffer() { return flipkartOffer; }
    public void setFlipkartOffer(MarketplaceOfferDto flipkartOffer) { this.flipkartOffer = flipkartOffer; }

    public Double getLowestPrice() { return lowestPrice; }
    public void setLowestPrice(Double lowestPrice) { this.lowestPrice = lowestPrice; }

    public String getLowestPriceSource() { return lowestPriceSource; }
    public void setLowestPriceSource(String lowestPriceSource) { this.lowestPriceSource = lowestPriceSource; }

    public Double getPriceDifference() { return priceDifference; }
    public void setPriceDifference(Double priceDifference) { this.priceDifference = priceDifference; }

    public Integer getBestDiscountPercent() { return bestDiscountPercent; }
    public void setBestDiscountPercent(Integer bestDiscountPercent) { this.bestDiscountPercent = bestDiscountPercent; }

    public LocalDateTime getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(LocalDateTime lastUpdated) { this.lastUpdated = lastUpdated; }

    public String getDataSourceLabel() { return dataSourceLabel; }
    public void setDataSourceLabel(String dataSourceLabel) { this.dataSourceLabel = dataSourceLabel; }
}

