package com.marketnest.service.impl;

import com.marketnest.entity.Shop;
import com.marketnest.repository.ShopRepository;
import com.marketnest.service.ShopService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ShopServiceImpl implements ShopService {

    @Autowired
    private ShopRepository shopRepository;

    @Override
    public List<Shop> getNearbyShops(Double userLat, Double userLng, Double radiusKm, String category, String query) {
        if ("All".equalsIgnoreCase(category)) category = null;
        List<Shop> all = shopRepository.searchShops(category, query);

        if (userLat != null && userLng != null) {
            final double finalRadius = radiusKm != null ? radiusKm : 50.0;
            return all.stream()
                    .filter(s -> calculateDistanceKm(userLat, userLng, s.getLatitude(), s.getLongitude()) <= finalRadius)
                    .sorted(Comparator.comparingDouble(s -> calculateDistanceKm(userLat, userLng, s.getLatitude(), s.getLongitude())))
                    .collect(Collectors.toList());
        }

        return all;
    }

    @Override
    public Optional<Shop> getShopById(Long id) {
        return shopRepository.findById(id);
    }

    @Override
    public Shop createShop(Shop shop) {
        return shopRepository.save(shop);
    }

    @Override
    public Shop verifyShop(Long id, boolean verify) {
        Shop shop = shopRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Shop not found with id: " + id));
        shop.setIsVerified(verify);
        return shopRepository.save(shop);
    }

    /**
     * Haversine formula to calculate great-circle distance between two GPS coordinates in kilometers.
     */
    private double calculateDistanceKm(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Earth's radius in KM
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return Math.round((R * c) * 10.0) / 10.0; // round to 1 decimal place
    }
}

