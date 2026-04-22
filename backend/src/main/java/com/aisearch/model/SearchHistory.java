package com.aisearch.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "search_history")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SearchHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String query;

    @Column(name = "clicked_url", columnDefinition = "TEXT")
    private String clickedUrl;

    @Enumerated(EnumType.STRING)
    @Column(length = 10)
    private Feedback feedback = Feedback.neutral;

    @Column(name = "persona_mode", length = 50)
    private String personaMode;

    @CreationTimestamp
    @Column(name = "searched_at", updatable = false)
    private LocalDateTime searchedAt;

    public enum Feedback {
        positive, negative, neutral
    }
}
