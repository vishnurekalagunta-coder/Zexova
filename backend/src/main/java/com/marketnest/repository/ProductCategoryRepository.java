package com.marketnest.repository;

import com.marketnest.entity.ProductCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ProductCategoryRepository extends JpaRepository<ProductCategory, Long> {
    Optional<ProductCategory> findByName(String name);
    Optional<ProductCategory> findBySlug(String slug);
}

