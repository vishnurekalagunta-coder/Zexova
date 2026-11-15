package com.marketnest.service;

import com.marketnest.entity.ListingStatus;
import com.marketnest.entity.NewProduct;
import com.marketnest.entity.ProductCategory;
import com.marketnest.entity.ProductCondition;
import com.marketnest.entity.UsedProductListing;

import java.util.List;
import java.util.Optional;

public interface ProductService {
    List<ProductCategory> getAllCategories();
    
    // Used Products
    List<UsedProductListing> getUsedProducts(String category, ProductCondition condition, Double maxPrice, String query);
    Optional<UsedProductListing> getUsedProductById(Long id);
    UsedProductListing createUsedProduct(UsedProductListing listing);
    UsedProductListing updateUsedProductStatus(Long id, ListingStatus status);
    void deleteUsedProduct(Long id);

    // New Products
    List<NewProduct> getNewProducts(String category, Boolean verifiedOnly, String query);
    Optional<NewProduct> getNewProductById(Long id);
    NewProduct createNewProduct(NewProduct product);
}

