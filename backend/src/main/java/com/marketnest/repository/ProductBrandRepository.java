package com.marketnest.repository;

import com.marketnest.entity.ProductBrand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductBrandRepository extends JpaRepository<ProductBrand, Long> {
    List<ProductBrand> findByCategorySlugIgnoreCase(String categorySlug);
    List<ProductBrand> findByCategoryNameIgnoreCase(String categoryName);
}

