package com.marketnest.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.CUSTOMER;

    @Column(length = 500)
    private String avatarUrl;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private UserAddress address;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public User() {}

    public User(String name, String email, String password, Role role, String phone, String avatarUrl) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.phone = phone;
        this.avatarUrl = avatarUrl;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public UserAddress getAddress() { return address; }
    public void setAddress(UserAddress address) { this.address = address; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

