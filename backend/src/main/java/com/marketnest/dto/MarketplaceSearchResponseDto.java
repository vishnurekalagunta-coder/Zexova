package com.marketnest.dto;

import java.util.ArrayList;
import java.util.List;

public class MarketplaceSearchResponseDto {
    private String source; // "AMAZON" or "FLIPKART"
    private String query;
    private Boolean isLiveFeed = false;
    private String dataSourceLabel = "DEMO DATA";
    private String connectionStatus = "Connected";
    private List<MarketplaceOfferDto> offers = new ArrayList<>();

    public MarketplaceSearchResponseDto() {}

    public MarketplaceSearchResponseDto(String source, String query, Boolean isLiveFeed, String dataSourceLabel, 
                                        String connectionStatus, List<MarketplaceOfferDto> offers) {
        this.source = source;
        this.query = query;
        this.isLiveFeed = isLiveFeed;
        this.dataSourceLabel = dataSourceLabel;
        this.connectionStatus = connectionStatus;
        this.offers = offers;
    }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public String getQuery() { return query; }
    public void setQuery(String query) { this.query = query; }

    public Boolean getIsLiveFeed() { return isLiveFeed; }
    public void setIsLiveFeed(Boolean isLiveFeed) { this.isLiveFeed = isLiveFeed; }

    public String getDataSourceLabel() { return dataSourceLabel; }
    public void setDataSourceLabel(String dataSourceLabel) { this.dataSourceLabel = dataSourceLabel; }

    public String getConnectionStatus() { return connectionStatus; }
    public void setConnectionStatus(String connectionStatus) { this.connectionStatus = connectionStatus; }

    public List<MarketplaceOfferDto> getOffers() { return offers; }
    public void setOffers(List<MarketplaceOfferDto> offers) { this.offers = offers; }
}

