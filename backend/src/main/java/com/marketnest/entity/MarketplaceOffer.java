package com.marketnest.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "marketplace_offers")
public class MarketplaceOffer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long productId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProductSource source; // AMAZON or FLIPKART

    private String externalId; // ASIN or FSN

    @Column(length = 500)
    private String productTitle;

    @Column(length = 1000)
    private String productUrl;

    @Column(nullable = false)
    private Double currentPrice;

    private Double mrp;

    private Integer discountPercent;

    private Boolean inStock = true;

    private String availabilityText = "In Stock";

    private Double rating;

    private Integer ratingCount;

    private Boolean isLive = false; // true if returned by active API, false if demo fallback

    private LocalDateTime lastFetchedAt = LocalDateTime.now();

    public MarketplaceOffer() {}

    public MarketplaceOffer(Long productId, ProductSource source, String externalId, String productTitle,
                            String productUrl, Double currentPrice, Double mrp, Integer discountPercent,
                            Boolean inStock, String availabilityText, Double rating, Integer ratingCount, Boolean isLive) {
        this.productId = productId;
        this.source = source;
        this.externalId = externalId;
        this.productTitle = productTitle;
        this.productUrl = productUrl;
        this.currentPrice = currentPrice;
        this.mrp = mrp;
        this.discountPercent = discountPercent;
        this.inStock = inStock;
        this.availabilityText = availabilityText;
        this.rating = rating;
        this.ratingCount = ratingCount;
        this.isLive = isLive;
        this.lastFetchedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public ProductSource getSource() { return source; }
    public void setSource(ProductSource source) { this.source = source; }

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

