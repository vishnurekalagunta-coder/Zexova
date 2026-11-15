package com.marketnest.dto;

public class MarketReferenceDto {
    private String category;
    private String brand;
    private String model;
    private String matchedTitle;
    private String imageUrl;
    private Double amazonPrice;
    private Double flipkartPrice;
    private Double mrp;
    private Double lowestRetailPrice;
    private String retailSource; // "Amazon", "Flipkart", or "Market Average"
    private String dataSource;   // "LIVE FEED" or "DEMO DATA"
    private String statusMessage;

    public MarketReferenceDto() {}

    public MarketReferenceDto(String category, String brand, String model, String matchedTitle, String imageUrl,
                              Double amazonPrice, Double flipkartPrice, Double mrp, Double lowestRetailPrice,
                              String retailSource, String dataSource, String statusMessage) {
        this.category = category;
        this.brand = brand;
        this.model = model;
        this.matchedTitle = matchedTitle;
        this.imageUrl = imageUrl;
        this.amazonPrice = amazonPrice;
        this.flipkartPrice = flipkartPrice;
        this.mrp = mrp;
        this.lowestRetailPrice = lowestRetailPrice;
        this.retailSource = retailSource;
        this.dataSource = dataSource;
        this.statusMessage = statusMessage;
    }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public String getMatchedTitle() { return matchedTitle; }
    public void setMatchedTitle(String matchedTitle) { this.matchedTitle = matchedTitle; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Double getAmazonPrice() { return amazonPrice; }
    public void setAmazonPrice(Double amazonPrice) { this.amazonPrice = amazonPrice; }

    public Double getFlipkartPrice() { return flipkartPrice; }
    public void setFlipkartPrice(Double flipkartPrice) { this.flipkartPrice = flipkartPrice; }

    public Double getMrp() { return mrp; }
    public void setMrp(Double mrp) { this.mrp = mrp; }

    public Double getLowestRetailPrice() { return lowestRetailPrice; }
    public void setLowestRetailPrice(Double lowestRetailPrice) { this.lowestRetailPrice = lowestRetailPrice; }

    public String getRetailSource() { return retailSource; }
    public void setRetailSource(String retailSource) { this.retailSource = retailSource; }

    public String getDataSource() { return dataSource; }
    public void setDataSource(String dataSource) { this.dataSource = dataSource; }

    public String getStatusMessage() { return statusMessage; }
    public void setStatusMessage(String statusMessage) { this.statusMessage = statusMessage; }
}

