package com.marketnest.controller;

import com.marketnest.entity.ListingStatus;
import com.marketnest.entity.ProductCondition;
import com.marketnest.entity.UsedProductListing;
import com.marketnest.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/used-products")
public class UsedProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public ResponseEntity<List<UsedProductListing>> getAll(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) ProductCondition condition,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) String query) {
        return ResponseEntity.ok(productService.getUsedProducts(category, condition, maxPrice, query));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsedProductListing> getById(@PathVariable Long id) {
        return productService.getUsedProductById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<UsedProductListing> create(@RequestBody UsedProductListing listing) {
        return ResponseEntity.ok(productService.createUsedProduct(listing));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<UsedProductListing> updateStatus(
            @PathVariable Long id,
            @RequestParam ListingStatus status) {
        return ResponseEntity.ok(productService.updateUsedProductStatus(id, status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productService.deleteUsedProduct(id);
        return ResponseEntity.noContent().build();
    }
}

