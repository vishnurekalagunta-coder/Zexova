package com.marketnest.repository;

import com.marketnest.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    Optional<Product> findByIdentifier(String identifier);

    List<Product> findByCategoryIgnoreCase(String category);

    List<Product> findByBrandIgnoreCase(String brand);

    List<Product> findByCategoryIgnoreCaseAndBrandIgnoreCase(String category, String brand);

    Optional<Product> findFirstByBrandIgnoreCaseAndModelIgnoreCase(String brand, String model);

    List<Product> findByBrandIgnoreCaseAndModelContainingIgnoreCase(String brand, String model);

    @Query("SELECT p FROM Product p WHERE " +
           "LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.brand) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.model) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.category) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.subcategory) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Product> searchCatalog(@Param("keyword") String keyword);

    @Query("SELECT DISTINCT p.brand FROM Product p WHERE LOWER(p.category) = LOWER(:category)")
    List<String> findBrandsByCategory(@Param("category") String category);

    @Query("SELECT DISTINCT p.model FROM Product p WHERE LOWER(p.brand) = LOWER(:brand)")
    List<String> findModelsByBrand(@Param("brand") String brand);
}

