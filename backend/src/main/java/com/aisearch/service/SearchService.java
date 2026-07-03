package com.aisearch.service;

import com.aisearch.model.SearchHistory;
import com.aisearch.model.User;
import com.aisearch.model.UserProfile;
import com.aisearch.payload.SearchResponse;
import com.aisearch.payload.SearchResult;
import com.aisearch.repository.SearchHistoryRepository;
import com.aisearch.repository.UserRepository;
import com.aisearch.repository.UserProfileRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class SearchService {

    private final WebClient webClient;
    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final SearchHistoryRepository searchHistoryRepository;
    private final RankingService rankingService;
    private final ObjectMapper objectMapper;

    @Value("${serpapi.key}")
    private String serpApiKey;

    public SearchResponse personalizedSearch(String query, String mode, String email) {
        // 1. Fetch from SerpAPI
        List<SearchResult> results = fetchFromSerpAPI(query);

        // 2. Get user profile
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        UserProfile profile = userProfileRepository.findByUserId(user.getId())
                .orElse(null);

        // 3. Re-rank via ML service
        if (profile != null && results != null && !results.isEmpty()) {
            String interests = profile.getInterests() != null ? profile.getInterests() : "[]";
            results = rankingService.rerank(results, interests, query);
        }

        // 4. Save to search history
        try {
            SearchHistory history = SearchHistory.builder()
                    .user(user)
                    .query(query)
                    .personaMode(mode != null ? mode : "student")
                    .build();
            searchHistoryRepository.save(history);
        } catch (Exception e) {
            log.error("Failed to save search history: {}", e.getMessage());
        }

        // 5. Return response
        return SearchResponse.builder()
                .results(results != null ? results : new ArrayList<>())
                .query(query)
                .mode(mode)
                .build();
    }

    private List<SearchResult> fetchFromSerpAPI(String query) {
        try {
            String response = webClient.get()
                    .uri("https://serpapi.com/search.json?q={query}&api_key={key}&engine=google",
                            query, serpApiKey)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response);
            JsonNode organicResults = root.get("organic_results");

            List<SearchResult> results = new ArrayList<>();
            if (organicResults != null && organicResults.isArray()) {
                for (JsonNode node : organicResults) {
                    SearchResult result = SearchResult.builder()
                            .title(node.has("title") ? node.get("title").asText() : "")
                            .link(node.has("link") ? node.get("link").asText() : "")
                            .snippet(node.has("snippet") ? node.get("snippet").asText() : "")
                            .build();
                    results.add(result);
                }
            }
            return results;
        } catch (Exception e) {
            log.error("SerpAPI fetch failed: {}", e.getMessage());
            return new ArrayList<>();
        }
    }
}
