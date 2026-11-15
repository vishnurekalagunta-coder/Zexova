package com.marketnest.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "catalog_products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String identifier; // e.g. SKU, ASIN or FSN

    @Column(nullable = false, length = 500)
    private String title;

    @Column(nullable = false)
    private String brand;

    @Column(nullable = false)
    private String model;

    @Column(nullable = false)
    private String category;

    private String subcategory;

    @Column(length = 1000)
    private String imageUrl;

    private String variant; // e.g. "8GB RAM, 128GB Storage"

    private String color;

    private Double originalMrp;

    @Column(length = 2000)
    private String specifications;

    private LocalDateTime createdAt = LocalDateTime.now();

    public Product() {}

    public Product(String identifier, String title, String brand, String model, String category, 
                   String subcategory, String imageUrl, String variant, Double originalMrp, String specifications) {
        this.identifier = identifier;
        this.title = title;
        this.brand = brand;
        this.model = model;
        this.category = category;
        this.subcategory = subcategory;
        this.imageUrl = imageUrl;
        this.variant = variant;
        this.originalMrp = originalMrp;
        this.specifications = specifications;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public Double getOriginalMrp() { return originalMrp; }
    public void setOriginalMrp(Double originalMrp) { this.originalMrp = originalMrp; }

    public String getSpecifications() { return specifications; }
    public void setSpecifications(String specifications) { this.specifications = specifications; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

