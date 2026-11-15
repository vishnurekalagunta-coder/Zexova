package com.marketnest.service;

import com.marketnest.dto.MarketReferenceDto;
import com.marketnest.dto.MarketplaceOfferDto;
import com.marketnest.dto.MarketplaceSearchResponseDto;
import com.marketnest.dto.ProductComparisonDto;
import com.marketnest.entity.MarketplaceOffer;
import com.marketnest.entity.Product;
import com.marketnest.entity.ProductSource;
import com.marketnest.repository.MarketplaceOfferRepository;
import com.marketnest.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class ProductComparisonService {

    private static final Logger log = LoggerFactory.getLogger(ProductComparisonService.class);

    @Autowired
    private AmazonCreatorsApiService amazonService;

    @Autowired
    private FlipkartAffiliateApiService flipkartService;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private MarketplaceOfferRepository offerRepository;

    /**
     * Compare products matching a search query, category, or brand.
     */
    public List<ProductComparisonDto> searchAndCompare(String query, String category, String brand) {
        log.info("Comparing products for query: '{}', category: '{}', brand: '{}'", query, category, brand);

        // Fetch catalog items first
        String effectiveQuery = (query != null ? query.trim() : "");
        List<Product> catalogProducts;

        if (!effectiveQuery.isBlank()) {
            catalogProducts = productRepository.searchCatalog(effectiveQuery);
        } else if (category != null && !category.isBlank() && !category.equalsIgnoreCase("All")) {
            if (brand != null && !brand.isBlank() && !brand.equalsIgnoreCase("All")) {
                catalogProducts = productRepository.findByCategoryIgnoreCaseAndBrandIgnoreCase(category, brand);
            } else {
                catalogProducts = productRepository.findByCategoryIgnoreCase(category);
            }
        } else if (brand != null && !brand.isBlank() && !brand.equalsIgnoreCase("All")) {
            catalogProducts = productRepository.findByBrandIgnoreCase(brand);
        } else {
            catalogProducts = productRepository.findAll();
        }

        // Fetch marketplace listings
        MarketplaceSearchResponseDto amazonResp = amazonService.searchProducts(effectiveQuery, category);
        MarketplaceSearchResponseDto flipkartResp = flipkartService.searchProducts(effectiveQuery, category);

        List<MarketplaceOfferDto> amazonOffers = amazonResp.getOffers();
        List<MarketplaceOfferDto> flipkartOffers = flipkartResp.getOffers();

        boolean anyLive = (amazonResp.getIsLiveFeed() != null && amazonResp.getIsLiveFeed()) ||
                          (flipkartResp.getIsLiveFeed() != null && flipkartResp.getIsLiveFeed());

        List<ProductComparisonDto> comparisons = new ArrayList<>();

        for (Product product : catalogProducts) {
            ProductComparisonDto dto = new ProductComparisonDto();
            dto.setProductId(product.getId());
            dto.setIdentifier(product.getIdentifier());
            dto.setTitle(product.getTitle());
            dto.setBrand(product.getBrand());
            dto.setModel(product.getModel());
            dto.setCategory(product.getCategory());
            dto.setSubcategory(product.getSubcategory());
            dto.setImageUrl(product.getImageUrl());
            dto.setVariant(product.getVariant());
            dto.setSpecifications(product.getSpecifications());
            dto.setOriginalMrp(product.getOriginalMrp());

            // Match best Amazon offer for this model and variant
            MarketplaceOfferDto bestAmazon = findBestOffer(amazonOffers, product.getBrand(), product.getModel(), product.getVariant());
            // Match best Flipkart offer for this model and variant
            MarketplaceOfferDto bestFlipkart = findBestOffer(flipkartOffers, product.getBrand(), product.getModel(), product.getVariant());

            dto.setAmazonOffer(bestAmazon);
            dto.setFlipkartOffer(bestFlipkart);

            // Compute price dynamics
            computeComparisonMetrics(dto, product.getOriginalMrp());

            dto.setDataSourceLabel(anyLive ? "LIVE FEED" : "DEMO DATA");
            dto.setLastUpdated(LocalDateTime.now());

            comparisons.add(dto);
        }

        return comparisons;
    }

    /**
     * Compare a single product by ID.
     */
    public Optional<ProductComparisonDto> compareProduct(Long productId) {
        Optional<Product> prodOpt = productRepository.findById(productId);
        if (prodOpt.isEmpty()) return Optional.empty();

        Product product = prodOpt.get();
        MarketplaceSearchResponseDto amz = amazonService.searchProducts(product.getModel(), product.getCategory());
        MarketplaceSearchResponseDto fk = flipkartService.searchProducts(product.getModel(), product.getCategory());

        ProductComparisonDto dto = new ProductComparisonDto();
        dto.setProductId(product.getId());
        dto.setIdentifier(product.getIdentifier());
        dto.setTitle(product.getTitle());
        dto.setBrand(product.getBrand());
        dto.setModel(product.getModel());
        dto.setCategory(product.getCategory());
        dto.setSubcategory(product.getSubcategory());
        dto.setImageUrl(product.getImageUrl());
        dto.setVariant(product.getVariant());
        dto.setSpecifications(product.getSpecifications());
        dto.setOriginalMrp(product.getOriginalMrp());

        dto.setAmazonOffer(findBestOffer(amz.getOffers(), product.getBrand(), product.getModel(), product.getVariant()));
        dto.setFlipkartOffer(findBestOffer(fk.getOffers(), product.getBrand(), product.getModel(), product.getVariant()));

        computeComparisonMetrics(dto, product.getOriginalMrp());
        boolean anyLive = (amz.getIsLiveFeed() != null && amz.getIsLiveFeed()) ||
                          (fk.getIsLiveFeed() != null && fk.getIsLiveFeed());
        dto.setDataSourceLabel(anyLive ? "LIVE FEED" : "DEMO DATA");

        return Optional.of(dto);
    }

    /**
     * Retrieve market reference retail price for the Price Estimator.
     * Looks up matching Amazon and Flipkart new retail listings.
     */
    public MarketReferenceDto getMarketReference(String category, String brand, String model) {
        log.info("Fetching retail market reference for: [{} - {} - {}]", category, brand, model);

        String cleanModel = (model != null ? model.trim() : "");
        String cleanBrand = (brand != null ? brand.trim() : "");

        // Auto-detect brand if missing
        if (cleanBrand.isBlank() && !cleanModel.isBlank()) {
            String qLower = cleanModel.toLowerCase();
            if (qLower.contains("iphone") || qLower.contains("macbook") || qLower.contains("ipad") || qLower.contains("apple")) {
                cleanBrand = "Apple";
            } else if (qLower.contains("galaxy") || qLower.contains("samsung")) {
                cleanBrand = "Samsung";
            } else if (qLower.contains("oneplus")) {
                cleanBrand = "OnePlus";
            } else if (qLower.contains("sony") || qLower.contains("playstation") || qLower.contains("ps5")) {
                cleanBrand = "Sony";
            } else if (qLower.contains("dell")) {
                cleanBrand = "Dell";
            } else if (qLower.contains("hp")) {
                cleanBrand = "HP";
            } else if (qLower.contains("lenovo")) {
                cleanBrand = "Lenovo";
            } else if (qLower.contains("boat")) {
                cleanBrand = "boAt";
            } else if (qLower.contains("noise")) {
                cleanBrand = "Noise";
            } else if (qLower.contains("lg")) {
                cleanBrand = "LG";
            } else if (qLower.contains("philips")) {
                cleanBrand = "Philips";
            } else if (qLower.contains("canon")) {
                cleanBrand = "Canon";
            } else if (qLower.contains("pixel")) {
                cleanBrand = "Google Pixel";
            } else if (qLower.contains("nothing")) {
                cleanBrand = "Nothing";
            }
        }

        String searchQuery = (cleanBrand.isBlank() ? "" : (cleanBrand + " ")) + cleanModel;
        searchQuery = searchQuery.trim();

        MarketplaceSearchResponseDto amz = amazonService.searchProducts(searchQuery, category);
        MarketplaceSearchResponseDto fk = flipkartService.searchProducts(searchQuery, category);

        MarketplaceOfferDto amzOffer = findBestOffer(amz.getOffers(), cleanBrand, cleanModel, null);
        MarketplaceOfferDto fkOffer = findBestOffer(fk.getOffers(), cleanBrand, cleanModel, null);

        Double amzPrice = amzOffer != null ? amzOffer.getCurrentPrice() : null;
        Double fkPrice = fkOffer != null ? fkOffer.getCurrentPrice() : null;
        Double mrp = null;

        if (amzOffer != null && amzOffer.getMrp() != null) {
            mrp = amzOffer.getMrp();
        }
        if (fkOffer != null && fkOffer.getMrp() != null) {
            if (mrp == null || fkOffer.getMrp() > mrp) {
                mrp = fkOffer.getMrp();
            }
        }

        // Check catalog for canonical data
        String imageUrl = null;
        List<Product> catalogMatches = productRepository.searchCatalog(searchQuery);
        if (!catalogMatches.isEmpty()) {
            Product matched = catalogMatches.get(0);
            if (mrp == null || mrp <= 0) {
                mrp = matched.getOriginalMrp();
            }
            if (imageUrl == null) {
                imageUrl = matched.getImageUrl();
            }
            if (cleanBrand.isBlank()) {
                cleanBrand = matched.getBrand();
            }
            if (category == null || category.isBlank() || category.equalsIgnoreCase("All")) {
                category = matched.getCategory();
            }
        }

        Double lowestPrice = null;
        String retailSource = "Market Average";

        if (amzPrice != null && fkPrice != null) {
            if (amzPrice < fkPrice) {
                lowestPrice = amzPrice;
                retailSource = "Amazon";
            } else if (fkPrice < amzPrice) {
                lowestPrice = fkPrice;
                retailSource = "Flipkart";
            } else {
                lowestPrice = amzPrice;
                retailSource = "Equal";
            }
        } else if (amzPrice != null) {
            lowestPrice = amzPrice;
            retailSource = "Amazon";
        } else if (fkPrice != null) {
            lowestPrice = fkPrice;
            retailSource = "Flipkart";
        }

        // If no offer matched from search, fallback to catalog price
        if (lowestPrice == null && mrp != null) {
            lowestPrice = mrp * 0.90;
            amzPrice = lowestPrice;
            fkPrice = lowestPrice * 0.98;
            retailSource = "Flipkart";
        }

        boolean anyLive = (amz.getIsLiveFeed() != null && amz.getIsLiveFeed()) ||
                          (fk.getIsLiveFeed() != null && fk.getIsLiveFeed());
        String dataSource = anyLive ? "LIVE FEED" : "DEMO DATA";

        String matchedTitle = amzOffer != null ? amzOffer.getProductTitle() : (fkOffer != null ? fkOffer.getProductTitle() : (cleanBrand + " " + cleanModel));

        String statusMessage = String.format("Retail benchmark for %s %s: Lowest price ₹%,.0f on %s", 
                cleanBrand, cleanModel, lowestPrice != null ? lowestPrice : 0.0, retailSource);

        return new MarketReferenceDto(
                category, cleanBrand, cleanModel, matchedTitle, imageUrl,
                amzPrice, fkPrice, mrp, lowestPrice, retailSource, dataSource, statusMessage
        );
    }

    private MarketplaceOfferDto findBestOffer(List<MarketplaceOfferDto> offers, String brand, String model, String variant) {
        if (offers == null || offers.isEmpty()) return null;

        String brandLower = brand != null ? brand.toLowerCase().trim() : "";
        String modelLower = model != null ? model.toLowerCase().trim() : "";

        // 1. Exact substring match on model (e.g. "iphone 15" or "galaxy s24")
        if (!modelLower.isBlank()) {
            for (MarketplaceOfferDto offer : offers) {
                String titleLower = offer.getProductTitle().toLowerCase();
                if (titleLower.contains(modelLower)) {
                    return offer;
                }
            }
        }

        // 2. Token overlap scoring
        String combined = (brandLower + " " + modelLower).trim();
        String[] tokens = combined.split("\\s+");

        MarketplaceOfferDto bestOffer = null;
        int maxMatches = 0;

        for (MarketplaceOfferDto offer : offers) {
            String titleLower = offer.getProductTitle().toLowerCase();
            int matches = 0;
            for (String tok : tokens) {
                if (tok.length() > 2 && titleLower.contains(tok)) {
                    matches++;
                }
            }
            if (matches > maxMatches) {
                maxMatches = matches;
                bestOffer = offer;
            }
        }

        if (maxMatches >= 1) {
            return bestOffer;
        }

        return offers.get(0);
    }

    private void computeComparisonMetrics(ProductComparisonDto dto, Double fallbackMrp) {
        Double amz = (dto.getAmazonOffer() != null) ? dto.getAmazonOffer().getCurrentPrice() : null;
        Double fk = (dto.getFlipkartOffer() != null) ? dto.getFlipkartOffer().getCurrentPrice() : null;

        if (amz != null && fk != null) {
            if (amz < fk) {
                dto.setLowestPrice(amz);
                dto.setLowestPriceSource("Amazon");
                dto.setPriceDifference(fk - amz);
            } else if (fk < amz) {
                dto.setLowestPrice(fk);
                dto.setLowestPriceSource("Flipkart");
                dto.setPriceDifference(amz - fk);
            } else {
                dto.setLowestPrice(amz);
                dto.setLowestPriceSource("Equal");
                dto.setPriceDifference(0.0);
            }
        } else if (amz != null) {
            dto.setLowestPrice(amz);
            dto.setLowestPriceSource("Amazon");
            dto.setPriceDifference(0.0);
        } else if (fk != null) {
            dto.setLowestPrice(fk);
            dto.setLowestPriceSource("Flipkart");
            dto.setPriceDifference(0.0);
        } else {
            dto.setLowestPrice(fallbackMrp);
            dto.setLowestPriceSource("None");
            dto.setPriceDifference(0.0);
        }

        // Calculate best discount from MRP
        Double refMrp = fallbackMrp;
        if (dto.getAmazonOffer() != null && dto.getAmazonOffer().getMrp() != null) {
            refMrp = dto.getAmazonOffer().getMrp();
        } else if (dto.getFlipkartOffer() != null && dto.getFlipkartOffer().getMrp() != null) {
            refMrp = dto.getFlipkartOffer().getMrp();
        }

        if (refMrp != null && dto.getLowestPrice() != null && refMrp > dto.getLowestPrice()) {
            dto.setBestDiscountPercent((int) Math.round(((refMrp - dto.getLowestPrice()) / refMrp) * 100));
        } else {
            dto.setBestDiscountPercent(0);
        }
    }
}
