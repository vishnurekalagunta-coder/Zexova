package com.marketnest.repository;

import com.marketnest.entity.ProductPriceHistory;
import com.marketnest.entity.ProductSource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductPriceHistoryRepository extends JpaRepository<ProductPriceHistory, Long> {
    List<ProductPriceHistory> findByProductIdOrderByRecordedAtAsc(Long productId);
    List<ProductPriceHistory> findByProductIdAndSourceOrderByRecordedAtAsc(Long productId, ProductSource source);
}

