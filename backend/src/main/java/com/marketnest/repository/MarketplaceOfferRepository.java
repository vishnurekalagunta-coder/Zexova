package com.marketnest.repository;

import com.marketnest.entity.MarketplaceOffer;
import com.marketnest.entity.ProductSource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MarketplaceOfferRepository extends JpaRepository<MarketplaceOffer, Long> {
    List<MarketplaceOffer> findByProductId(Long productId);
    Optional<MarketplaceOffer> findByProductIdAndSource(Long productId, ProductSource source);
    List<MarketplaceOffer> findBySource(ProductSource source);
    void deleteByProductId(Long productId);
}

