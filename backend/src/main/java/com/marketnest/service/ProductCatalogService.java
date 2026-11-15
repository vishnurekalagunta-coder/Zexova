package com.marketnest.service;

import com.marketnest.entity.Product;
import com.marketnest.entity.ProductBrand;
import com.marketnest.entity.ProductCategory;
import com.marketnest.repository.ProductBrandRepository;
import com.marketnest.repository.ProductCategoryRepository;
import com.marketnest.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class ProductCatalogService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductCategoryRepository categoryRepository;

    @Autowired
    private ProductBrandRepository brandRepository;

    public List<Product> searchProducts(String keyword, String category, String brand) {
        if (keyword != null && !keyword.isBlank()) {
            List<Product> results = productRepository.searchCatalog(keyword.trim());
            if (category != null && !category.isBlank() && !category.equalsIgnoreCase("All")) {
                results = results.stream()
                        .filter(p -> p.getCategory().equalsIgnoreCase(category))
                        .toList();
            }
            if (brand != null && !brand.isBlank() && !brand.equalsIgnoreCase("All")) {
                results = results.stream()
                        .filter(p -> p.getBrand().equalsIgnoreCase(brand))
                        .toList();
            }
            return results;
        }

        if (category != null && !category.isBlank() && !category.equalsIgnoreCase("All")) {
            if (brand != null && !brand.isBlank() && !brand.equalsIgnoreCase("All")) {
                return productRepository.findByCategoryIgnoreCaseAndBrandIgnoreCase(category, brand);
            }
            return productRepository.findByCategoryIgnoreCase(category);
        }

        if (brand != null && !brand.isBlank() && !brand.equalsIgnoreCase("All")) {
            return productRepository.findByBrandIgnoreCase(brand);
        }

        return productRepository.findAll();
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    public Optional<Product> findByBrandAndModel(String brand, String model) {
        if (brand == null || model == null) return Optional.empty();
        Optional<Product> exact = productRepository.findFirstByBrandIgnoreCaseAndModelIgnoreCase(brand.trim(), model.trim());
        if (exact.isPresent()) return exact;

        List<Product> partial = productRepository.findByBrandIgnoreCaseAndModelContainingIgnoreCase(brand.trim(), model.trim());
        if (!partial.isEmpty()) return Optional.of(partial.get(0));

        return Optional.empty();
    }

    public List<ProductCategory> getAllCategories() {
        return categoryRepository.findAll();
    }

    public List<ProductBrand> getBrandsByCategory(String category) {
        if (category == null || category.isBlank() || category.equalsIgnoreCase("All")) {
            return brandRepository.findAll();
        }
        return brandRepository.findByCategoryNameIgnoreCase(category);
    }

    public List<String> getModelsByBrand(String brand) {
        if (brand == null || brand.isBlank()) return Collections.emptyList();
        return productRepository.findModelsByBrand(brand);
    }

    @Transactional
    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }
}

