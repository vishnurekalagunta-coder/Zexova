package com.marketnest.controller;

import com.marketnest.entity.SellerInquiry;
import com.marketnest.repository.SellerInquiryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/inquiries")
public class InquiryController {

    @Autowired
    private SellerInquiryRepository inquiryRepository;

    @GetMapping
    public ResponseEntity<List<SellerInquiry>> getAll() {
        return ResponseEntity.ok(inquiryRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<SellerInquiry> create(@RequestBody SellerInquiry inquiry) {
        inquiry.setCreatedAt(LocalDateTime.now());
        inquiry.setStatus("PENDING");
        return ResponseEntity.ok(inquiryRepository.save(inquiry));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<SellerInquiry> updateStatus(@PathVariable Long id, @RequestParam String status) {
        SellerInquiry inq = inquiryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inquiry not found"));
        inq.setStatus(status);
        return ResponseEntity.ok(inquiryRepository.save(inq));
    }
}

