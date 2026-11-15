package com.marketnest.service.impl;

import com.marketnest.entity.*;
import com.marketnest.repository.NewProductRepository;
import com.marketnest.repository.ProductCategoryRepository;
import com.marketnest.repository.UsedProductListingRepository;
import com.marketnest.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductCategoryRepository categoryRepository;

    @Autowired
    private UsedProductListingRepository usedProductRepository;

    @Autowired
    private NewProductRepository newProductRepository;

    @Override
    public List<ProductCategory> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Override
    public List<UsedProductListing> getUsedProducts(String category, ProductCondition condition, Double maxPrice, String query) {
        if ("All".equalsIgnoreCase(category)) category = null;
        return usedProductRepository.searchProducts(category, condition, maxPrice, query);
    }

    @Override
    public Optional<UsedProductListing> getUsedProductById(Long id) {
        return usedProductRepository.findById(id);
    }

    @Override
    public UsedProductListing createUsedProduct(UsedProductListing listing) {
        listing.setCreatedAt(LocalDateTime.now());
        listing.setStatus(ListingStatus.ACTIVE);
        if (listing.getSellerRating() == null) listing.setSellerRating(5.0);
        if (listing.getSellerReviewsCount() == null) listing.setSellerReviewsCount(1);
        return usedProductRepository.save(listing);
    }

    @Override
    public UsedProductListing updateUsedProductStatus(Long id, ListingStatus status) {
        UsedProductListing listing = usedProductRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Listing not found with id: " + id));
        listing.setStatus(status);
        return usedProductRepository.save(listing);
    }

    @Override
    public void deleteUsedProduct(Long id) {
        usedProductRepository.deleteById(id);
    }

    @Override
    public List<NewProduct> getNewProducts(String category, Boolean verifiedOnly, String query) {
        if ("All".equalsIgnoreCase(category)) category = null;
        return newProductRepository.searchProducts(category, verifiedOnly, query);
    }

    @Override
    public Optional<NewProduct> getNewProductById(Long id) {
        return newProductRepository.findById(id);
    }

    @Override
    public NewProduct createNewProduct(NewProduct product) {
        product.setCreatedAt(LocalDateTime.now());
        return newProductRepository.save(product);
    }
}

