package com.marketnest.controller;

import com.marketnest.entity.NewProduct;
import com.marketnest.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/new-products")
public class NewProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public ResponseEntity<List<NewProduct>> getAll(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Boolean verifiedOnly,
            @RequestParam(required = false) String query) {
        return ResponseEntity.ok(productService.getNewProducts(category, verifiedOnly, query));
    }

    @GetMapping("/{id}")
    public ResponseEntity<NewProduct> getById(@PathVariable Long id) {
        return productService.getNewProductById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<NewProduct> create(@RequestBody NewProduct product) {
        return ResponseEntity.ok(productService.createNewProduct(product));
    }
}

