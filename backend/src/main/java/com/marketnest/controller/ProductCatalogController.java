package com.marketnest.controller;

import com.marketnest.dto.MarketplaceSearchResponseDto;
import com.marketnest.dto.ProductComparisonDto;
import com.marketnest.entity.Product;
import com.marketnest.entity.ProductBrand;
import com.marketnest.entity.ProductCategory;
import com.marketnest.service.AmazonCreatorsApiService;
import com.marketnest.service.FlipkartAffiliateApiService;
import com.marketnest.service.ProductCatalogService;
import com.marketnest.service.ProductComparisonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
public class ProductCatalogController {

    @Autowired
    private ProductCatalogService catalogService;

    @Autowired
    private ProductComparisonService comparisonService;

    @Autowired
    private AmazonCreatorsApiService amazonService;

    @Autowired
    private FlipkartAffiliateApiService flipkartService;

    @GetMapping("/search")
    public ResponseEntity<List<Product>> search(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String brand) {
        return ResponseEntity.ok(catalogService.searchProducts(keyword, category, brand));
    }

    @GetMapping("/amazon/search")
    public ResponseEntity<MarketplaceSearchResponseDto> searchAmazon(
            @RequestParam(required = false, defaultValue = "") String keyword,
            @RequestParam(required = false) String category) {
        return ResponseEntity.ok(amazonService.searchProducts(keyword, category));
    }

    @GetMapping("/flipkart/search")
    public ResponseEntity<MarketplaceSearchResponseDto> searchFlipkart(
            @RequestParam(required = false, defaultValue = "") String keyword,
            @RequestParam(required = false) String category) {
        return ResponseEntity.ok(flipkartService.searchProducts(keyword, category));
    }

    @GetMapping("/compare")
    public ResponseEntity<List<ProductComparisonDto>> compare(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String brand) {
        return ResponseEntity.ok(comparisonService.searchAndCompare(query, category, brand));
    }

    @GetMapping("/categories")
    public ResponseEntity<List<ProductCategory>> getCategories() {
        return ResponseEntity.ok(catalogService.getAllCategories());
    }

    @GetMapping("/brands")
    public ResponseEntity<List<ProductBrand>> getBrands(@RequestParam(required = false) String category) {
        return ResponseEntity.ok(catalogService.getBrandsByCategory(category));
    }

    @GetMapping("/models")
    public ResponseEntity<List<String>> getModels(@RequestParam String brand) {
        return ResponseEntity.ok(catalogService.getModelsByBrand(brand));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductComparisonDto> getProductComparison(@PathVariable Long id) {
        Optional<ProductComparisonDto> comp = comparisonService.compareProduct(id);
        return comp.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
}

