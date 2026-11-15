package com.marketnest.repository;

import com.marketnest.entity.PriceEstimation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PriceEstimationRepository extends JpaRepository<PriceEstimation, Long> {
    List<PriceEstimation> findByUserIdOrderByEstimatedAtDesc(Long userId);
    List<PriceEstimation> findTop10ByOrderByEstimatedAtDesc();
}

