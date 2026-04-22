package com.aisearch.payload;

import lombok.Data;

@Data
public class FeedbackRequest {
    private Long resultId;
    private String feedback;
}
