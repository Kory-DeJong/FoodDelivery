package com.feastfinder.backend.controller;

import com.feastfinder.backend.dto.ToppingOption;
import com.feastfinder.backend.model.DiscountCode;
import com.feastfinder.backend.repository.DiscountCodeRepository;
import com.feastfinder.backend.repository.DishRepository;
import com.feastfinder.backend.repository.OrderRepository;
import com.feastfinder.backend.repository.RestaurantRepository;
import com.feastfinder.backend.repository.UserRepository;
import com.feastfinder.backend.service.RestaurantAddonService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {
    private final RestaurantRepository restaurantRepository;
    private final DishRepository dishRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final DiscountCodeRepository discountRepo;
    private final RestaurantAddonService addonService;

    public AdminController(RestaurantRepository restaurantRepository,
                           DishRepository dishRepository,
                           OrderRepository orderRepository,
                           UserRepository userRepository,
                           DiscountCodeRepository discountRepo,
                           RestaurantAddonService addonService) {
        this.restaurantRepository = restaurantRepository;
        this.dishRepository = dishRepository;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.discountRepo = discountRepo;
        this.addonService = addonService;
    }

    @GetMapping("/overview")
    public ResponseEntity<Map<String, Object>> overview() {
        long restaurants = restaurantRepository.count();
        long dishes = dishRepository.count();
        long orders = orderRepository.count();
        long users = userRepository.count();
        long activeDiscounts = discountRepo.findAll().stream().filter(DiscountCode::isActive).count();
        return ResponseEntity.ok(Map.of(
                "restaurants", restaurants,
                "dishes", dishes,
                "orders", orders,
                "users", users,
                "activeDiscounts", activeDiscounts
        ));
    }

    @GetMapping("/discount-codes")
    public ResponseEntity<List<DiscountCode>> listDiscounts() {
        return ResponseEntity.ok(discountRepo.findAll());
    }

    @PostMapping("/discount-codes")
    public ResponseEntity<DiscountCode> createDiscount(@RequestBody DiscountPayload payload) {
        if (payload.code == null || payload.code().isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        DiscountCode code = new DiscountCode();
        code.setCode(payload.code().toUpperCase());
        code.setType(payload.type());
        code.setValue(payload.value());
        code.setActive(payload.active() != null ? payload.active() : true);
        return ResponseEntity.ok(discountRepo.save(code));
    }

    @PutMapping("/discount-codes/{code}")
    public ResponseEntity<DiscountCode> updateDiscount(@PathVariable String code, @RequestBody DiscountPayload payload) {
        return discountRepo.findById(code.toUpperCase())
                .map(existing -> {
                    if (payload.value() != null) existing.setValue(payload.value());
                    if (payload.type() != null) existing.setType(payload.type());
                    if (payload.active() != null) existing.setActive(payload.active());
                    return ResponseEntity.ok(discountRepo.save(existing));
                }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/restaurants/{id}/toppings")
    public ResponseEntity<List<ToppingOption>> toppings(@PathVariable String id) {
        return ResponseEntity.ok(addonService.getToppingsForRestaurant(id));
    }

    @PostMapping("/restaurants/{id}/toppings")
    public ResponseEntity<?> addTopping(@PathVariable String id, @RequestBody ToppingOption option) {
        if (option.getId() == null || option.getId().isBlank()) {
            option.setId(UUID.randomUUID().toString());
        }
        addonService.upsertOption(id, option);
        return ResponseEntity.ok(addonService.getToppingsForRestaurant(id));
    }

    @DeleteMapping("/restaurants/{id}/toppings/{toppingId}")
    public ResponseEntity<?> removeTopping(@PathVariable String id, @PathVariable String toppingId) {
        boolean removed = addonService.removeOption(id, toppingId);
        return removed ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    public record DiscountPayload(String code, DiscountCode.Type type, Double value, Boolean active) {}
}
