package com.marketnest.controller;

import com.marketnest.entity.ProductCategory;
import com.marketnest.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public ResponseEntity<List<ProductCategory>> getCategories() {
        return ResponseEntity.ok(productService.getAllCategories());
    }
}

