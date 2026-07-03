package com.aisearch.service;

import com.aisearch.payload.SearchResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.ai.embedding.EmbeddingResponse;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class RankingService {

    private final EmbeddingModel embeddingModel;

    /**
     * Re-ranks search results using cosine similarity between:
     *   - a "profile embedding"  : query + user interests
     *   - each result's embedding: title + snippet
     *
     * Mirrors the old Python /rerank endpoint, now running inside the JVM
     * via Spring AI's EmbeddingModel (OpenAI text-embedding-3-small).
     */
    public List<SearchResult> rerank(List<SearchResult> results, String interests, String query) {
        if (results == null || results.isEmpty()) {
            return results;
        }

        try {
            // Build profile text: query + space-separated interests
            String interestText = parseInterests(interests);
            String profileText = query + (interestText.isBlank() ? "" : " " + interestText);

            // Embed the profile text
            float[] profileEmbedding = embed(profileText);

            // Score each result
            List<SearchResult> scored = new ArrayList<>();
            for (SearchResult result : results) {
                String resultText = result.getTitle() + " " + result.getSnippet();
                float[] resultEmbedding = embed(resultText);
                double similarity = cosineSimilarity(profileEmbedding, resultEmbedding);

                SearchResult scoredResult = SearchResult.builder()
                        .title(result.getTitle())
                        .link(result.getLink())
                        .snippet(result.getSnippet())
                        .personalizedScore(Math.round(similarity * 10_000.0) / 100.0)
                        .build();
                scored.add(scoredResult);
            }

            // Sort descending by personalizedScore
            scored.sort((a, b) -> Double.compare(
                    b.getPersonalizedScore() != null ? b.getPersonalizedScore() : 0,
                    a.getPersonalizedScore() != null ? a.getPersonalizedScore() : 0
            ));

            return scored;

        } catch (Exception e) {
            log.error("Spring AI re-ranking failed, returning original order: {}", e.getMessage());
            return results;
        }
    }

    /**
     * Generates an embedding vector for a list of interests.
     * Replaces the old Python /embed endpoint.
     */
    public List<Double> embedInterests(List<String> interests) {
        String text = (interests == null || interests.isEmpty()) ? "general" : String.join(" ", interests);
        float[] raw = embed(text);
        List<Double> result = new ArrayList<>(raw.length);
        for (float v : raw) result.add((double) v);
        return result;
    }

    // ── helpers ────────────────────────────────────────────────────────────────

    /**
     * Calls Spring AI EmbeddingModel to get a float[] embedding for the given text.
     * In Spring AI 1.0.0-M6, Embedding.getOutput() returns float[].
     */
    private float[] embed(String text) {
        EmbeddingResponse response = embeddingModel.embedForResponse(List.of(text));
        return response.getResults().get(0).getOutput();
    }

    private double cosineSimilarity(float[] a, float[] b) {
        double dot = 0, normA = 0, normB = 0;
        int len = Math.min(a.length, b.length);
        for (int i = 0; i < len; i++) {
            dot   += (double) a[i] * b[i];
            normA += (double) a[i] * a[i];
            normB += (double) b[i] * b[i];
        }
        if (normA == 0 || normB == 0) return 0;
        return dot / (Math.sqrt(normA) * Math.sqrt(normB));
    }

    /**
     * Parses a JSON array string like ["AI","Tech"] into "AI Tech",
     * or returns the raw string if it is not a JSON array.
     */
    private String parseInterests(String interests) {
        if (interests == null || interests.isBlank()) return "";
        String trimmed = interests.trim();
        if (trimmed.startsWith("[")) {
            // Strip JSON array brackets and quotes
            trimmed = trimmed.replaceAll("[\\[\\]\"]", "").replace(",", " ");
        }
        return trimmed.trim();
    }
}
