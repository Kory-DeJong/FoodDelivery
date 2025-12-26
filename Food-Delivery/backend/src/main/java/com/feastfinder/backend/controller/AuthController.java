package com.feastfinder.backend.controller;

import com.feastfinder.backend.model.UserAccount;
import com.feastfinder.backend.repository.UserRepository;
import com.feastfinder.backend.security.JwtService;
import com.feastfinder.backend.security.UserPrincipal;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public record RegisterRequest(@NotBlank String username, @Email String email, @NotBlank String password) {}
    public record LoginRequest(@NotBlank String usernameOrEmail, @NotBlank String password) {}

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        if (userRepository.findByUsername(req.username()).isPresent() || userRepository.findByEmail(req.email()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username or email already exists"));
        }
        UserAccount u = new UserAccount();
        u.setId(UUID.randomUUID().toString());
        u.setUsername(req.username());
        u.setEmail(req.email());
        u.setPasswordHash(passwordEncoder.encode(req.password()));
        u.setRole("ROLE_USER");
        userRepository.save(u);
        String token = jwtService.generateToken(u.getId(), u.getUsername(), u.getRole());
        return ResponseEntity.ok(Map.of("token", token, "user", Map.of("id", u.getId(), "username", u.getUsername(), "email", u.getEmail())));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        Optional<UserAccount> opt = userRepository.findByUsername(req.usernameOrEmail());
        if (opt.isEmpty()) opt = userRepository.findByEmail(req.usernameOrEmail());
        if (opt.isEmpty()) return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
        UserAccount u = opt.get();
        if (!passwordEncoder.matches(req.password(), u.getPasswordHash()))
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
        String token = jwtService.generateToken(u.getId(), u.getUsername(), u.getRole());
        return ResponseEntity.ok(Map.of("token", token, "user", Map.of("id", u.getId(), "username", u.getUsername(), "email", u.getEmail())));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof UserPrincipal up)) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(Map.of("id", up.id(), "username", up.username(), "role", up.role()));
    }
}

