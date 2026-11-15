package com.marketnest.controller;

import com.marketnest.dto.MarketReferenceDto;
import com.marketnest.dto.PriceEstimationDto;
import com.marketnest.service.PriceEstimatorService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/prices")
public class PriceMarketController {

    @Autowired
    private PriceEstimatorService estimatorService;

    @GetMapping("/market-reference")
    public ResponseEntity<MarketReferenceDto> getMarketReference(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String model) {
        return ResponseEntity.ok(estimatorService.getMarketReference(category, brand, model));
    }

    @PostMapping("/estimate")
    public ResponseEntity<PriceEstimationDto.Response> estimate(@Valid @RequestBody PriceEstimationDto.Request request) {
        return ResponseEntity.ok(estimatorService.estimate(request));
    }
}

