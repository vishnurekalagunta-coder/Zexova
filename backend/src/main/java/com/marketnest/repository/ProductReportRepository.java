package com.marketnest.repository;

import com.marketnest.entity.ProductReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductReportRepository extends JpaRepository<ProductReport, Long> {
    List<ProductReport> findByStatusOrderByCreatedAtDesc(String status);
}

