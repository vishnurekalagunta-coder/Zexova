package com.marketnest.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "product_categories")
public class ProductCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false, unique = true)
    private String slug;

    private String iconName;

    @Column(length = 1000)
    private String description;

    @Column(length = 500)
    private String imageUrl;

    private Integer itemCount = 0;

    public ProductCategory() {}

    public ProductCategory(String name, String slug, String iconName, String description, String imageUrl, Integer itemCount) {
        this.name = name;
        this.slug = slug;
        this.iconName = iconName;
        this.description = description;
        this.imageUrl = imageUrl;
        this.itemCount = itemCount;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getIconName() { return iconName; }
    public void setIconName(String iconName) { this.iconName = iconName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Integer getItemCount() { return itemCount; }
    public void setItemCount(Integer itemCount) { this.itemCount = itemCount; }
}

