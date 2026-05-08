package com.smartbudget.controller;

import com.smartbudget.dto.ApiResponse;
import com.smartbudget.dto.CategorySuggestionRequest;
import com.smartbudget.service.CategorySuggestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/suggestions")
public class SuggestionController {

    @Autowired
    private CategorySuggestionService categoryService;

    @PostMapping("/category")
    public ResponseEntity<?> suggestCategory(@RequestBody CategorySuggestionRequest request) {
        try {
            String suggestedCategory = categoryService.suggestCategory(request.getDescription());
            Map<String, String> data = new HashMap<>();
            data.put("suggestedCategory", suggestedCategory);
            return ResponseEntity.ok(ApiResponse.success("Category suggestion retrieved", data));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(ApiResponse.error("Error suggesting category: " + e.getMessage(), 500));
        }
    }
}