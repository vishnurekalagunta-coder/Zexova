package com.marketnest.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "product_brands")
public class ProductBrand {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String categorySlug;

    private String categoryName;

    @Column(length = 500)
    private String logoUrl;

    public ProductBrand() {}

    public ProductBrand(String name, String categorySlug, String categoryName, String logoUrl) {
        this.name = name;
        this.categorySlug = categorySlug;
        this.categoryName = categoryName;
        this.logoUrl = logoUrl;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategorySlug() { return categorySlug; }
    public void setCategorySlug(String categorySlug) { this.categorySlug = categorySlug; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public String getLogoUrl() { return logoUrl; }
    public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }
}

