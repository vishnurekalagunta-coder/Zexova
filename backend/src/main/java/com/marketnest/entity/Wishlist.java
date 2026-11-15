package com.marketnest.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "wishlists")
public class Wishlist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private Long productId;

    public Wishlist() {}
    public Wishlist(User user, Long productId) {
        this.user = user;
        this.productId = productId;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
}

