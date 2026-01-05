package com.feastfinder.backend.controller;

import com.feastfinder.backend.model.FavoriteRestaurant;
import com.feastfinder.backend.model.UserAccount;
import com.feastfinder.backend.repository.FavoriteRestaurantRepository;
import com.feastfinder.backend.repository.UserRepository;
import com.feastfinder.backend.security.UserPrincipal;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user/favorites")
@CrossOrigin(origins = "*")
public class FavoriteController {
    private final FavoriteRestaurantRepository repo;
    private final UserRepository userRepo;

    public FavoriteController(FavoriteRestaurantRepository repo, UserRepository userRepo) {
        this.repo = repo; this.userRepo = userRepo;
    }

    @GetMapping("/restaurants")
    public List<FavoriteRestaurant> restaurants(Authentication auth) {
        String userId = ((UserPrincipal) auth.getPrincipal()).id();
        return repo.findByUser_Id(userId);
    }

    @PostMapping("/restaurants")
    public ResponseEntity<?> add(Authentication auth, @RequestBody Map<String, String> req) {
        String userId = ((UserPrincipal) auth.getPrincipal()).id();
        String restId = req.get("restaurantId");
        if (restId == null) return ResponseEntity.badRequest().body(Map.of("error", "restaurantId required"));
        return repo.findByUser_IdAndRestaurantId(userId, restId)
                .<ResponseEntity<?>>map(fr -> ResponseEntity.ok(fr))
                .orElseGet(() -> {
                    UserAccount u = userRepo.findById(userId).orElseThrow();
                    FavoriteRestaurant fr = new FavoriteRestaurant();
                    fr.setUser(u); fr.setRestaurantId(restId);
                    return ResponseEntity.ok(repo.save(fr));
                });
    }

    @DeleteMapping("/restaurants/{restaurantId}")
    public ResponseEntity<?> remove(Authentication auth, @PathVariable String restaurantId) {
        String userId = ((UserPrincipal) auth.getPrincipal()).id();
        return repo.findByUser_IdAndRestaurantId(userId, restaurantId)
                .map(fr -> { repo.delete(fr); return ResponseEntity.noContent().build(); })
                .orElse(ResponseEntity.notFound().build());
    }
}

