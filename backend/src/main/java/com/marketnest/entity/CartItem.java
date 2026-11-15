package com.marketnest.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "cart_items")
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id")
    private Cart cart;

    private Long productId;
    private String productType; // NEW or USED
    private String title;
    private Double price;
    private Double originalPrice;

    @Column(length = 500)
    private String image;

    private Integer quantity = 1;
    private String shopName;

    public CartItem() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Cart getCart() { return cart; }
    public void setCart(Cart cart) { this.cart = cart; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getProductType() { return productType; }
    public void setProductType(String productType) { this.productType = productType; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public Double getOriginalPrice() { return originalPrice; }
    public void setOriginalPrice(Double originalPrice) { this.originalPrice = originalPrice; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public String getShopName() { return shopName; }
    public void setShopName(String shopName) { this.shopName = shopName; }
}

