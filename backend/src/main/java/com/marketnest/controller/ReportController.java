package com.marketnest.controller;

import com.marketnest.entity.ProductReport;
import com.marketnest.repository.ProductReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    @Autowired
    private ProductReportRepository reportRepository;

    @GetMapping
    public ResponseEntity<List<ProductReport>> getAll() {
        return ResponseEntity.ok(reportRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<ProductReport> create(@RequestBody ProductReport report) {
        report.setCreatedAt(LocalDateTime.now());
        report.setStatus("OPEN");
        return ResponseEntity.ok(reportRepository.save(report));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ProductReport> updateStatus(@PathVariable Long id, @RequestParam String status) {
        ProductReport report = reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found"));
        report.setStatus(status);
        return ResponseEntity.ok(reportRepository.save(report));
    }
}

