package com.marketnest.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "product_reports")
public class ProductReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long productId;
    private String productType;
    private String productTitle;
    private String reporterEmail;
    private String reason; // INCORRECT_INFO, COUNTERFEIT, SCAM, OFFENSIVE, OTHER

    @Column(length = 2000)
    private String details;

    private String status = "OPEN"; // OPEN, INVESTIGATING, RESOLVED, DISMISSED
    private LocalDateTime createdAt = LocalDateTime.now();

    public ProductReport() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getProductType() { return productType; }
    public void setProductType(String productType) { this.productType = productType; }

    public String getProductTitle() { return productTitle; }
    public void setProductTitle(String productTitle) { this.productTitle = productTitle; }

    public String getReporterEmail() { return reporterEmail; }
    public void setReporterEmail(String reporterEmail) { this.reporterEmail = reporterEmail; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

