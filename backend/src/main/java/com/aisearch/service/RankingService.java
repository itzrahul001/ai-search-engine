package com.aisearch.service;

import com.aisearch.payload.SearchResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class RankingService {

    private final WebClient webClient;

    @Value("${ml.service.url}")
    private String mlServiceUrl;

    public List<SearchResult> rerank(List<SearchResult> results, String interests, String query) {
        try {
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("query", query);
            requestBody.put("results", results);
            requestBody.put("interests", interests);

            List<SearchResult> ranked = webClient.post()
                    .uri(mlServiceUrl + "/rerank")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<List<SearchResult>>() {})
                    .block();

            return ranked != null ? ranked : results;
        } catch (Exception e) {
            log.error("ML service reranking failed, returning original order: {}", e.getMessage());
            return results;
        }
    }
}
