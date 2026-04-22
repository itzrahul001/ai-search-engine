package com.aisearch.controller;

import com.aisearch.model.SavedResult;
import com.aisearch.model.User;
import com.aisearch.model.UserProfile;
import com.aisearch.repository.SavedResultRepository;
import com.aisearch.repository.UserRepository;
import com.aisearch.service.UserProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class UserController {

    private final UserProfileService userProfileService;
    private final UserRepository userRepository;
    private final SavedResultRepository savedResultRepository;

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@AuthenticationPrincipal UserDetails userDetails) {
        UserProfile profile = userProfileService.getProfile(userDetails.getUsername());
        return ResponseEntity.ok(Map.of(
                "interests", profile.getInterests() != null ? profile.getInterests() : "[]",
                "activeMode", profile.getActiveMode() != null ? profile.getActiveMode() : "student",
                "tasteVector", profile.getTasteVector() != null ? profile.getTasteVector() : ""
        ));
    }

    @PutMapping("/interests")
    public ResponseEntity<?> updateInterests(
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserDetails userDetails) {
        String interests = body.get("interests");
        userProfileService.updateInterests(userDetails.getUsername(), interests);
        return ResponseEntity.ok(Map.of("message", "Interests updated"));
    }

    @PutMapping("/mode")
    public ResponseEntity<?> updateMode(
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserDetails userDetails) {
        String mode = body.get("mode");
        userProfileService.updateMode(userDetails.getUsername(), mode);
        return ResponseEntity.ok(Map.of("message", "Mode updated to " + mode));
    }

    @PostMapping("/save")
    public ResponseEntity<?> saveResult(
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserDetails userDetails) {

        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        SavedResult saved = SavedResult.builder()
                .user(user)
                .title(body.get("title"))
                .url(body.get("url"))
                .snippet(body.get("snippet"))
                .topicTag(body.get("topicTag"))
                .build();
        savedResultRepository.save(saved);

        return ResponseEntity.ok(Map.of("message", "Result saved"));
    }

    @GetMapping("/saved")
    public ResponseEntity<?> getSavedResults(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Map<String, Object>> results = savedResultRepository.findByUserId(user.getId())
                .stream()
                .map(r -> Map.<String, Object>of(
                        "id", r.getId(),
                        "title", r.getTitle() != null ? r.getTitle() : "",
                        "url", r.getUrl(),
                        "snippet", r.getSnippet() != null ? r.getSnippet() : "",
                        "topicTag", r.getTopicTag() != null ? r.getTopicTag() : "",
                        "savedAt", r.getSavedAt().toString()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(results);
    }
}
