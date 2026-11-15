package com.marketnest.controller;

import com.marketnest.dto.PriceEstimationDto;
import com.marketnest.entity.PriceEstimation;
import com.marketnest.service.PriceEstimatorService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/estimator")
public class PriceEstimatorController {

    @Autowired
    private PriceEstimatorService estimatorService;

    @PostMapping("/estimate")
    public ResponseEntity<PriceEstimationDto.Response> estimate(@Valid @RequestBody PriceEstimationDto.Request request) {
        return ResponseEntity.ok(estimatorService.estimate(request));
    }

    @GetMapping("/market-reference")
    public ResponseEntity<com.marketnest.dto.MarketReferenceDto> getMarketReference(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String model) {
        return ResponseEntity.ok(estimatorService.getMarketReference(category, brand, model));
    }

    @GetMapping("/history")
    public ResponseEntity<List<PriceEstimation>> getHistory() {
        return ResponseEntity.ok(estimatorService.getRecentEstimations());
    }
}

