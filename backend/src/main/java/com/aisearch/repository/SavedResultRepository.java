package com.aisearch.repository;

import com.aisearch.model.SavedResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SavedResultRepository extends JpaRepository<SavedResult, Long> {
    List<SavedResult> findByUserId(Long userId);
}
