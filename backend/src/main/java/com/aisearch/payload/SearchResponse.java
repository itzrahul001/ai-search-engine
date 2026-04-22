package com.aisearch.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class SearchResponse {
    private List<SearchResult> results;
    private String query;
    private String mode;
}
