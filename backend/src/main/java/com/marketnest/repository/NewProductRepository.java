package com.marketnest.repository;

import com.marketnest.entity.NewProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NewProductRepository extends JpaRepository<NewProduct, Long> {

    List<NewProduct> findByShopId(Long shopId);

    List<NewProduct> findByCategory(String category);

    @Query("SELECT p FROM NewProduct p WHERE " +
           "(:category IS NULL OR LOWER(p.category) = LOWER(:category)) " +
           "AND (:verifiedOnly IS NULL OR :verifiedOnly = false OR p.shopVerified = true) " +
           "AND (:query IS NULL OR LOWER(p.title) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "    OR LOWER(p.brand) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "    OR LOWER(p.shopName) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<NewProduct> searchProducts(
        @Param("category") String category,
        @Param("verifiedOnly") Boolean verifiedOnly,
        @Param("query") String query
    );
}

