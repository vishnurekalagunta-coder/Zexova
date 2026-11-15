package com.marketnest.repository;

import com.marketnest.entity.SellerInquiry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SellerInquiryRepository extends JpaRepository<SellerInquiry, Long> {
    List<SellerInquiry> findBySellerIdOrderByCreatedAtDesc(Long sellerId);
    List<SellerInquiry> findByBuyerIdOrderByCreatedAtDesc(Long buyerId);
}

