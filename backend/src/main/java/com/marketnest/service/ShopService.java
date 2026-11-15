package com.marketnest.service;

import com.marketnest.entity.Shop;
import java.util.List;
import java.util.Optional;

public interface ShopService {
    List<Shop> getNearbyShops(Double latitude, Double longitude, Double radiusKm, String category, String query);
    Optional<Shop> getShopById(Long id);
    Shop createShop(Shop shop);
    Shop verifyShop(Long id, boolean verify);
}

