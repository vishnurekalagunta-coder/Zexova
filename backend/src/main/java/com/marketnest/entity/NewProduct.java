package com.marketnest.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "new_products")
public class NewProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 4000)
    private String description;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private String brand;

    @Column(nullable = false)
    private String model;

    @Column(nullable = false)
    private Double price;

    private Double originalPrice;
    private Integer discountPercentage = 0;
    private Integer stockQuantity = 10;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shop_id")
    private Shop shop;

    private String shopName;
    private Boolean shopVerified = true;

    @Column(length = 2000)
    private String images; // comma separated image URLs

    @Column(length = 4000)
    private String specifications; // JSON / key-value string

    private Double rating = 4.8;
    private Integer reviewsCount = 25;
    private Boolean isAvailable = true;
    private String warrantyPeriod = "1 Year Brand Warranty";

    private LocalDateTime createdAt = LocalDateTime.now();

    public NewProduct() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public Double getOriginalPrice() { return originalPrice; }
    public void setOriginalPrice(Double originalPrice) { this.originalPrice = originalPrice; }

    public Integer getDiscountPercentage() { return discountPercentage; }
    public void setDiscountPercentage(Integer discountPercentage) { this.discountPercentage = discountPercentage; }

    public Integer getStockQuantity() { return stockQuantity; }
    public void setStockQuantity(Integer stockQuantity) { this.stockQuantity = stockQuantity; }

    public Shop getShop() { return shop; }
    public void setShop(Shop shop) { this.shop = shop; }

    public String getShopName() { return shopName; }
    public void setShopName(String shopName) { this.shopName = shopName; }

    public Boolean getShopVerified() { return shopVerified; }
    public void setShopVerified(Boolean shopVerified) { this.shopVerified = shopVerified; }

    public String getImages() { return images; }
    public void setImages(String images) { this.images = images; }

    public String getSpecifications() { return specifications; }
    public void setSpecifications(String specifications) { this.specifications = specifications; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public Integer getReviewsCount() { return reviewsCount; }
    public void setReviewsCount(Integer reviewsCount) { this.reviewsCount = reviewsCount; }

    public Boolean getIsAvailable() { return isAvailable; }
    public void setIsAvailable(Boolean isAvailable) { this.isAvailable = isAvailable; }

    public String getWarrantyPeriod() { return warrantyPeriod; }
    public void setWarrantyPeriod(String warrantyPeriod) { this.warrantyPeriod = warrantyPeriod; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

