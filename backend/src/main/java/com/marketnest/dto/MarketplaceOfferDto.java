package com.marketnest.dto;

import java.time.LocalDateTime;

public class MarketplaceOfferDto {
    private Long id;
    private String source; // AMAZON or FLIPKART
    private String externalId;
    private String productTitle;
    private String productUrl;
    private Double currentPrice;
    private Double mrp;
    private Integer discountPercent;
    private Boolean inStock = true;
    private String availabilityText = "In Stock";
    private Double rating;
    private Integer ratingCount;
    private Boolean isLive = false;
    private LocalDateTime lastFetchedAt;

    public MarketplaceOfferDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public String getExternalId() { return externalId; }
    public void setExternalId(String externalId) { this.externalId = externalId; }

    public String getProductTitle() { return productTitle; }
    public void setProductTitle(String productTitle) { this.productTitle = productTitle; }

    public String getProductUrl() { return productUrl; }
    public void setProductUrl(String productUrl) { this.productUrl = productUrl; }

    public Double getCurrentPrice() { return currentPrice; }
    public void setCurrentPrice(Double currentPrice) { this.currentPrice = currentPrice; }

    public Double getMrp() { return mrp; }
    public void setMrp(Double mrp) { this.mrp = mrp; }

    public Integer getDiscountPercent() { return discountPercent; }
    public void setDiscountPercent(Integer discountPercent) { this.discountPercent = discountPercent; }

    public Boolean getInStock() { return inStock; }
    public void setInStock(Boolean inStock) { this.inStock = inStock; }

    public String getAvailabilityText() { return availabilityText; }
    public void setAvailabilityText(String availabilityText) { this.availabilityText = availabilityText; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public Integer getRatingCount() { return ratingCount; }
    public void setRatingCount(Integer ratingCount) { this.ratingCount = ratingCount; }

    public Boolean getIsLive() { return isLive; }
    public void setIsLive(Boolean isLive) { this.isLive = isLive; }

    public LocalDateTime getLastFetchedAt() { return lastFetchedAt; }
    public void setLastFetchedAt(LocalDateTime lastFetchedAt) { this.lastFetchedAt = lastFetchedAt; }
}

