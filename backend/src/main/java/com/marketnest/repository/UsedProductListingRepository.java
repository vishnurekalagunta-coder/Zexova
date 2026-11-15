package com.marketnest.repository;

import com.marketnest.entity.ListingStatus;
import com.marketnest.entity.ProductCondition;
import com.marketnest.entity.UsedProductListing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface UsedProductListingRepository extends JpaRepository<UsedProductListing, Long> {

    List<UsedProductListing> findByStatus(ListingStatus status);

    List<UsedProductListing> findByCategoryAndStatus(String category, ListingStatus status);

    List<UsedProductListing> findBySellerId(Long sellerId);

    @Query("SELECT p FROM UsedProductListing p WHERE p.status = 'ACTIVE' " +
           "AND (:category IS NULL OR LOWER(p.category) = LOWER(:category)) " +
           "AND (:condition IS NULL OR p.condition = :condition) " +
           "AND (:maxPrice IS NULL OR p.sellingPrice <= :maxPrice) " +
           "AND (:query IS NULL OR LOWER(p.title) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "    OR LOWER(p.brand) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "    OR LOWER(p.model) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<UsedProductListing> searchProducts(
        @Param("category") String category,
        @Param("condition") ProductCondition condition,
        @Param("maxPrice") Double maxPrice,
        @Param("query") String query
    );
}

