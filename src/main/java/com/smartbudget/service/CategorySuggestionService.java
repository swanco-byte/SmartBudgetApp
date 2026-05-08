package com.smartbudget.service;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class CategorySuggestionService {
    private static final Map<String, List<String>> CATEGORY_KEYWORDS = new HashMap<>();

    static {
        CATEGORY_KEYWORDS.put("Groceries", Arrays.asList("walmart", "kroger", "whole foods", "safeway", "publix", "trader joe", "grocery", "market", "supermarket"));
        CATEGORY_KEYWORDS.put("Restaurants", Arrays.asList("mcdonald", "subway", "starbucks", "chipotle", "pizza", "restaurant", "cafe", "burger", "diner", "kitchen"));
        CATEGORY_KEYWORDS.put("Utilities", Arrays.asList("electric", "water", "gas", "internet", "phone", "verizon", "at&t", "comcast", "utility"));
        CATEGORY_KEYWORDS.put("Entertainment", Arrays.asList("netflix", "spotify", "cinema", "movie", "concert", "theater", "gaming", "steam", "playstation", "xbox"));
        CATEGORY_KEYWORDS.put("Healthcare", Arrays.asList("pharmacy", "doctor", "hospital", "cvs", "walgreens", "clinic", "dental", "medical", "health"));
        CATEGORY_KEYWORDS.put("Transportation", Arrays.asList("uber", "lyft", "taxi", "gas station", "parking", "car wash", "shell", "chevron", "transit"));
        CATEGORY_KEYWORDS.put("Shopping", Arrays.asList("amazon", "target", "costco", "mall", "store", "retail", "clothing", "shoes", "apparel"));
        CATEGORY_KEYWORDS.put("Fitness", Arrays.asList("gym", "yoga", "fitness", "peloton", "trainer", "exercise", "sports"));
        CATEGORY_KEYWORDS.put("Travel", Arrays.asList("airline", "hotel", "airbnb", "booking", "flight", "resort", "travel"));
    }

    public String suggestCategory(String description) {
        if (description == null || description.isEmpty()) {
            return "Other";
        }

        String lowerDesc = description.toLowerCase();

        for (Map.Entry<String, List<String>> entry : CATEGORY_KEYWORDS.entrySet()) {
            for (String keyword : entry.getValue()) {
                if (lowerDesc.contains(keyword)) {
                    return entry.getKey();
                }
            }
        }

        return "Other";
    }
}