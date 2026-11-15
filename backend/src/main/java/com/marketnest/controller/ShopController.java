package com.marketnest.controller;

import com.marketnest.entity.Shop;
import com.marketnest.service.ShopService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shops")
public class ShopController {

    @Autowired
    private ShopService shopService;

    @GetMapping("/nearby")
    public ResponseEntity<List<Shop>> getNearby(
            @RequestParam(required = false) Double latitude,
            @RequestParam(required = false) Double longitude,
            @RequestParam(required = false) Double radiusKm,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String query) {
        return ResponseEntity.ok(shopService.getNearbyShops(latitude, longitude, radiusKm, category, query));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Shop> getById(@PathVariable Long id) {
        return shopService.getShopById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Shop> create(@RequestBody Shop shop) {
        return ResponseEntity.ok(shopService.createShop(shop));
    }

    @PatchMapping("/{id}/verify")
    public ResponseEntity<Shop> verifyShop(@PathVariable Long id, @RequestParam boolean verified) {
        return ResponseEntity.ok(shopService.verifyShop(id, verified));
    }
}

