package com.aisearch.controller;

import com.aisearch.model.SearchHistory;
import com.aisearch.model.User;
import com.aisearch.payload.FeedbackRequest;
import com.aisearch.payload.SearchResponse;
import com.aisearch.repository.SearchHistoryRepository;
import com.aisearch.repository.UserRepository;
import com.aisearch.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/search")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class SearchController {

    private final SearchService searchService;
    private final SearchHistoryRepository searchHistoryRepository;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<SearchResponse> search(
            @RequestParam String query,
            @RequestParam(defaultValue = "student") String mode,
            @AuthenticationPrincipal UserDetails userDetails) {

        SearchResponse response = searchService.personalizedSearch(
                query, mode, userDetails.getUsername());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/feedback")
    public ResponseEntity<?> submitFeedback(
            @RequestBody FeedbackRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        if (request.getResultId() != null) {
            searchHistoryRepository.findById(request.getResultId()).ifPresent(history -> {
                history.setFeedback(SearchHistory.Feedback.valueOf(request.getFeedback()));
                searchHistoryRepository.save(history);
            });
        }
        return ResponseEntity.ok(Map.of("message", "Feedback saved"));
    }

    @GetMapping("/history")
    public ResponseEntity<?> getSearchHistory(
            @AuthenticationPrincipal UserDetails userDetails) {

        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<SearchHistory> history = searchHistoryRepository
                .findByUserIdOrderBySearchedAtDesc(user.getId());

        // Limit to 20 and map to response format
        List<Map<String, Object>> response = history.stream()
                .limit(20)
                .map(h -> Map.<String, Object>of(
                        "id", h.getId(),
                        "query", h.getQuery(),
                        "personaMode", h.getPersonaMode() != null ? h.getPersonaMode() : "",
                        "searchedAt", h.getSearchedAt().toString()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }
}
