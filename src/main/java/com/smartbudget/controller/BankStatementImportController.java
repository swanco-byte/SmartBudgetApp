package com.smartbudget.controller;

import com.smartbudget.dto.ApiResponse;
import com.smartbudget.dto.BankStatementImportRequest;
import com.smartbudget.entity.User;
import com.smartbudget.service.BankStatementImportService;
import com.smartbudget.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/import")
public class BankStatementImportController {

    @Autowired
    private BankStatementImportService importService;

    @Autowired
    private UserService userService;

    @PostMapping("/csv")
    public ResponseEntity<?> importCSV(@RequestParam("file") MultipartFile file, Authentication authentication) {
        try {
            User user = userService.getUserByUsername(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            var result = importService.importFromCSV(file, user);
            return ResponseEntity.ok(ApiResponse.success((String) result.get("message"), result));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(ApiResponse.error("Error importing CSV: " + e.getMessage(), 500));
        }
    }

    @PostMapping("/json")
    public ResponseEntity<?> importJSON(@RequestBody BankStatementImportRequest request, Authentication authentication) {
        try {
            User user = userService.getUserByUsername(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            var result = importService.importFromJSON(request, user);
            return ResponseEntity.ok(ApiResponse.success((String) result.get("message"), result));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(ApiResponse.error("Error importing data: " + e.getMessage(), 500));
        }
    }
}