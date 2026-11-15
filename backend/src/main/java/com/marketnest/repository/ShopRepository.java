package com.marketnest.repository;

import com.marketnest.entity.Shop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ShopRepository extends JpaRepository<Shop, Long> {

    List<Shop> findByIsVerifiedTrue();

    List<Shop> findByCategory(String category);

    @Query("SELECT s FROM Shop s WHERE " +
           "(:category IS NULL OR LOWER(s.category) LIKE LOWER(CONCAT('%', :category, '%'))) " +
           "AND (:query IS NULL OR LOWER(s.name) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "    OR LOWER(s.address) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "    OR LOWER(s.city) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Shop> searchShops(@Param("category") String category, @Param("query") String query);
}

