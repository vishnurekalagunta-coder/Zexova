package com.marketnest.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "product_price_history")
public class ProductPriceHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long productId;

    @Enumerated(EnumType.STRING)
    private ProductSource source;

    private Double price;

    private LocalDateTime recordedAt = LocalDateTime.now();

    public ProductPriceHistory() {}

    public ProductPriceHistory(Long productId, ProductSource source, Double price) {
        this.productId = productId;
        this.source = source;
        this.price = price;
        this.recordedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public ProductSource getSource() { return source; }
    public void setSource(ProductSource source) { this.source = source; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public LocalDateTime getRecordedAt() { return recordedAt; }
    public void setRecordedAt(LocalDateTime recordedAt) { this.recordedAt = recordedAt; }
}

