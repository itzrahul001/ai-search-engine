package com.aisearch.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class SearchResult {
    private String title;
    private String link;
    private String snippet;
    private Double personalizedScore;
}
