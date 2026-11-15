-- ========================================================
-- MarketNest (Zexova) Production MySQL Schema DDL
-- Database: MySQL 8.0+
-- ========================================================

CREATE DATABASE IF NOT EXISTS marketnest_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE marketnest_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(191) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(30),
    role VARCHAR(30) NOT NULL DEFAULT 'CUSTOMER',
    avatar_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_email (email),
    INDEX idx_user_role (role)
) ENGINE=InnoDB;

-- 2. User Addresses Table
CREATE TABLE IF NOT EXISTS user_addresses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNIQUE,
    street VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'India',
    CONSTRAINT fk_address_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 3. Product Categories Table
CREATE TABLE IF NOT EXISTS product_categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    icon_name VARCHAR(50),
    description TEXT,
    image_url VARCHAR(500),
    item_count INT DEFAULT 0
) ENGINE=InnoDB;

-- 4. Accredited Merchant Shops Table
CREATE TABLE IF NOT EXISTS shops (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    zip_code VARCHAR(20),
    latitude DOUBLE NOT NULL,
    longitude DOUBLE NOT NULL,
    phone VARCHAR(30),
    email VARCHAR(100),
    rating DOUBLE DEFAULT 4.8,
    reviews_count INT DEFAULT 0,
    opening_hours VARCHAR(100) DEFAULT '10:00 AM - 09:30 PM',
    is_verified BOOLEAN DEFAULT TRUE,
    image_url VARCHAR(500),
    owner_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_shop_city (city),
    INDEX idx_shop_geo (latitude, longitude),
    CONSTRAINT fk_shop_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 5. Used Product Listings Table
CREATE TABLE IF NOT EXISTS used_product_listings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    selling_price DOUBLE NOT NULL,
    original_price DOUBLE,
    condition VARCHAR(50) NOT NULL,
    product_age_months INT,
    warranty_status BOOLEAN DEFAULT FALSE,
    accessories TEXT,
    images TEXT,
    location VARCHAR(150),
    city VARCHAR(100),
    seller_id BIGINT,
    seller_name VARCHAR(150),
    seller_rating DOUBLE DEFAULT 5.0,
    seller_reviews_count INT DEFAULT 1,
    seller_phone VARCHAR(30),
    status VARCHAR(30) DEFAULT 'ACTIVE',
    featured BOOLEAN DEFAULT FALSE,
    views_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_used_category (category),
    INDEX idx_used_price (selling_price),
    INDEX idx_used_status (status),
    CONSTRAINT fk_used_seller FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 6. New Products Catalog Table
CREATE TABLE IF NOT EXISTS new_products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    price DOUBLE NOT NULL,
    original_price DOUBLE,
    discount_percentage INT DEFAULT 0,
    stock_quantity INT DEFAULT 10,
    shop_id BIGINT,
    shop_name VARCHAR(200),
    shop_verified BOOLEAN DEFAULT TRUE,
    images TEXT,
    specifications TEXT,
    rating DOUBLE DEFAULT 4.8,
    reviews_count INT DEFAULT 0,
    is_available BOOLEAN DEFAULT TRUE,
    warranty_period VARCHAR(100) DEFAULT '1 Year Brand Warranty',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_new_category (category),
    INDEX idx_new_price (price),
    CONSTRAINT fk_new_shop FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 7. Carts & Cart Items Tables
CREATE TABLE IF NOT EXISTS carts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNIQUE,
    CONSTRAINT fk_cart_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS cart_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cart_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    product_type VARCHAR(20) NOT NULL,
    title VARCHAR(255) NOT NULL,
    price DOUBLE NOT NULL,
    original_price DOUBLE,
    image VARCHAR(500),
    quantity INT NOT NULL DEFAULT 1,
    shop_name VARCHAR(200),
    CONSTRAINT fk_cartitem_cart FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 8. Wishlists Table
CREATE TABLE IF NOT EXISTS wishlists (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    INDEX idx_wishlist_user (user_id),
    CONSTRAINT fk_wishlist_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 9. Orders & Order Items Tables
CREATE TABLE IF NOT EXISTS orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    user_id BIGINT,
    total_amount DOUBLE NOT NULL,
    shipping_fee DOUBLE DEFAULT 0.0,
    discount_amount DOUBLE DEFAULT 0.0,
    payment_method VARCHAR(50) DEFAULT 'RAZORPAY',
    payment_status VARCHAR(50) DEFAULT 'PAID',
    order_status VARCHAR(50) DEFAULT 'CONFIRMED',
    street VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_order_user (user_id),
    CONSTRAINT fk_order_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    product_type VARCHAR(20) NOT NULL,
    product_title VARCHAR(255) NOT NULL,
    product_image VARCHAR(500),
    price DOUBLE NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    CONSTRAINT fk_orderitem_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 10. AI Price Estimations Table
CREATE TABLE IF NOT EXISTS price_estimations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    category VARCHAR(100) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    original_price DOUBLE NOT NULL,
    estimated_min_price DOUBLE NOT NULL,
    estimated_max_price DOUBLE NOT NULL,
    recommended_selling_price DOUBLE NOT NULL,
    quick_sale_price DOUBLE NOT NULL,
    depreciation_percentage INT NOT NULL,
    condition_analysis TEXT,
    market_demand VARCHAR(20),
    pricing_explanation TEXT,
    estimated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_estimation_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 11. Seller Inquiries & Negotiations Table
CREATE TABLE IF NOT EXISTS seller_inquiries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    listing_id BIGINT NOT NULL,
    listing_title VARCHAR(255) NOT NULL,
    listing_image VARCHAR(500),
    buyer_id BIGINT,
    buyer_name VARCHAR(150),
    seller_id BIGINT NOT NULL,
    offered_price DOUBLE,
    message TEXT,
    status VARCHAR(30) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 12. Product Reports Table
CREATE TABLE IF NOT EXISTS product_reports (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    product_type VARCHAR(20) NOT NULL,
    product_title VARCHAR(255) NOT NULL,
    reporter_email VARCHAR(191) NOT NULL,
    reason VARCHAR(50) NOT NULL,
    details TEXT,
    status VARCHAR(30) DEFAULT 'OPEN',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 13. Customer Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    user_name VARCHAR(150),
    product_id BIGINT,
    shop_id BIGINT,
    rating INT NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

