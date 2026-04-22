package com.aisearch.service;

import com.aisearch.model.UserProfile;
import com.aisearch.model.User;
import com.aisearch.repository.UserProfileRepository;
import com.aisearch.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserProfileService {

    private final UserProfileRepository userProfileRepository;
    private final UserRepository userRepository;

    public UserProfile getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return userProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Profile not found"));
    }

    public UserProfile updateInterests(String email, String interestsJson) {
        UserProfile profile = getProfile(email);
        profile.setInterests(interestsJson);
        return userProfileRepository.save(profile);
    }

    public UserProfile updateMode(String email, String mode) {
        UserProfile profile = getProfile(email);
        profile.setActiveMode(mode);
        return userProfileRepository.save(profile);
    }
}
