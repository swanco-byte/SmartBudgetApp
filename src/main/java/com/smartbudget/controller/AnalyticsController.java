package com.smartbudget.controller;

import com.smartbudget.dto.ApiResponse;
import com.smartbudget.dto.AnalyticsDTO;
import com.smartbudget.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/analytics")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/expenses-by-category")
    public ResponseEntity<?> getExpensesByCategory(Authentication authentication) {
        try {
            String username = authentication.getName();
            Long userId = Long.parseLong(authentication.getPrincipal().toString());
            
            Map<String, BigDecimal> data = analyticsService.getExpensesByCategory(userId);
            return ResponseEntity.ok(ApiResponse.success("Expenses by category retrieved", data));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(ApiResponse.error("Error retrieving data: " + e.getMessage(), 500));
        }
    }

    @GetMapping("/monthly-expenses")
    public ResponseEntity<?> getMonthlyExpenses(Authentication authentication) {
        try {
            Long userId = Long.parseLong(authentication.getPrincipal().toString());
            
            Map<String, BigDecimal> data = analyticsService.getMonthlyExpenses(userId);
            return ResponseEntity.ok(ApiResponse.success("Monthly expenses retrieved", data));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(ApiResponse.error("Error retrieving data: " + e.getMessage(), 500));
        }
    }

    @GetMapping("/category-trends")
    public ResponseEntity<?> getCategoryTrends(Authentication authentication) {
        try {
            Long userId = Long.parseLong(authentication.getPrincipal().toString());
            
            var data = analyticsService.getCategoryTrends(userId);
            return ResponseEntity.ok(ApiResponse.success("Category trends retrieved", data));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(ApiResponse.error("Error retrieving data: " + e.getMessage(), 500));
        }
    }
}