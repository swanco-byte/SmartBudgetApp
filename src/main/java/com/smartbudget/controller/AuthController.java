package com.smartbudget.controller;

import com.smartbudget.dto.AuthRequest;
import com.smartbudget.dto.AuthResponse;
import com.smartbudget.dto.RegisterRequest;
import com.smartbudget.entity.User;
import com.smartbudget.security.JwtTokenProvider;
import com.smartbudget.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            // Check if user already exists
            if (userService.existsByUsername(request.getUsername())) {
                return ResponseEntity.badRequest().body(new AuthResponse(null, null, null, null, null, "Username already exists"));
            }
            if (userService.existsByEmail(request.getEmail())) {
                return ResponseEntity.badRequest().body(new AuthResponse(null, null, null, null, null, "Email already exists"));
            }

            // Create new user
            User user = new User();
            user.setUsername(request.getUsername());
            user.setEmail(request.getEmail());
            user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
            user.setFirstName(request.getFirstName());
            user.setLastName(request.getLastName());
            user.setCreatedAt(LocalDateTime.now());
            user.setUpdatedAt(LocalDateTime.now());

            User savedUser = userService.createUser(user);

            // Generate tokens
            String token = jwtTokenProvider.generateToken(savedUser.getUsername(), savedUser.getId());
            String refreshToken = jwtTokenProvider.generateRefreshToken(savedUser.getUsername(), savedUser.getId());

            return ResponseEntity.ok(AuthResponse.builder()
                    .token(token)
                    .refreshToken(refreshToken)
                    .userId(savedUser.getId())
                    .username(savedUser.getUsername())
                    .email(savedUser.getEmail())
                    .message("User registered successfully")
                    .build());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new AuthResponse(null, null, null, null, null, "Registration failed: " + e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            User user = userService.getUserByUsername(request.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            String token = jwtTokenProvider.generateToken(user.getUsername(), user.getId());
            String refreshToken = jwtTokenProvider.generateRefreshToken(user.getUsername(), user.getId());

            return ResponseEntity.ok(AuthResponse.builder()
                    .token(token)
                    .refreshToken(refreshToken)
                    .userId(user.getId())
                    .username(user.getUsername())
                    .email(user.getEmail())
                    .message("Login successful")
                    .build());
        } catch (Exception e) {
            return ResponseEntity.status(401).body(new AuthResponse(null, null, null, null, null, "Login failed: Invalid credentials"));
        }
    }

    @GetMapping("/health")
    public ResponseEntity<?> health() {
        return ResponseEntity.ok("\"status\": \"OK\"");
    }
}