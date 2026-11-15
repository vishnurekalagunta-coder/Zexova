package com.marketnest.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "seller_inquiries")
public class SellerInquiry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long listingId;
    private String listingTitle;

    @Column(length = 500)
    private String listingImage;

    private Long buyerId;
    private String buyerName;
    private Long sellerId;
    private Double offeredPrice;

    @Column(length = 2000)
    private String message;

    private String status = "PENDING"; // PENDING, ACCEPTED, REJECTED
    private LocalDateTime createdAt = LocalDateTime.now();

    public SellerInquiry() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getListingId() { return listingId; }
    public void setListingId(Long listingId) { this.listingId = listingId; }

    public String getListingTitle() { return listingTitle; }
    public void setListingTitle(String listingTitle) { this.listingTitle = listingTitle; }

    public String getListingImage() { return listingImage; }
    public void setListingImage(String listingImage) { this.listingImage = listingImage; }

    public Long getBuyerId() { return buyerId; }
    public void setBuyerId(Long buyerId) { this.buyerId = buyerId; }

    public String getBuyerName() { return buyerName; }
    public void setBuyerName(String buyerName) { this.buyerName = buyerName; }

    public Long getSellerId() { return sellerId; }
    public void setSellerId(Long sellerId) { this.sellerId = sellerId; }

    public Double getOfferedPrice() { return offeredPrice; }
    public void setOfferedPrice(Double offeredPrice) { this.offeredPrice = offeredPrice; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

