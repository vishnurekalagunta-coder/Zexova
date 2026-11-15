package com.marketnest.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "used_product_listings")
public class UsedProductListing {

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
    private Double sellingPrice;

    private Double originalPrice;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProductCondition condition;

    private Integer productAgeMonths;

    private Boolean warrantyStatus = false;

    @Column(length = 1000)
    private String accessories; // comma separated list

    @Column(length = 2000)
    private String images; // comma separated URLs

    private String location;
    private String city;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id")
    private User seller;

    private String sellerName;
    private Double sellerRating = 5.0;
    private Integer sellerReviewsCount = 10;
    private String sellerPhone;

    @Enumerated(EnumType.STRING)
    private ListingStatus status = ListingStatus.ACTIVE;

    private Boolean featured = false;
    private Integer viewsCount = 0;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public UsedProductListing() {}

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

    public Double getSellingPrice() { return sellingPrice; }
    public void setSellingPrice(Double sellingPrice) { this.sellingPrice = sellingPrice; }

    public Double getOriginalPrice() { return originalPrice; }
    public void setOriginalPrice(Double originalPrice) { this.originalPrice = originalPrice; }

    public ProductCondition getCondition() { return condition; }
    public void setCondition(ProductCondition condition) { this.condition = condition; }

    public Integer getProductAgeMonths() { return productAgeMonths; }
    public void setProductAgeMonths(Integer productAgeMonths) { this.productAgeMonths = productAgeMonths; }

    public Boolean getWarrantyStatus() { return warrantyStatus; }
    public void setWarrantyStatus(Boolean warrantyStatus) { this.warrantyStatus = warrantyStatus; }

    public String getAccessories() { return accessories; }
    public void setAccessories(String accessories) { this.accessories = accessories; }

    public String getImages() { return images; }
    public void setImages(String images) { this.images = images; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public User getSeller() { return seller; }
    public void setSeller(User seller) { this.seller = seller; }

    public String getSellerName() { return sellerName; }
    public void setSellerName(String sellerName) { this.sellerName = sellerName; }

    public Double getSellerRating() { return sellerRating; }
    public void setSellerRating(Double sellerRating) { this.sellerRating = sellerRating; }

    public Integer getSellerReviewsCount() { return sellerReviewsCount; }
    public void setSellerReviewsCount(Integer sellerReviewsCount) { this.sellerReviewsCount = sellerReviewsCount; }

    public String getSellerPhone() { return sellerPhone; }
    public void setSellerPhone(String sellerPhone) { this.sellerPhone = sellerPhone; }

    public ListingStatus getStatus() { return status; }
    public void setStatus(ListingStatus status) { this.status = status; }

    public Boolean getFeatured() { return featured; }
    public void setFeatured(Boolean featured) { this.featured = featured; }

    public Integer getViewsCount() { return viewsCount; }
    public void setViewsCount(Integer viewsCount) { this.viewsCount = viewsCount; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

