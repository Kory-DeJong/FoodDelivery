package com.feastfinder.backend.controller;

import com.feastfinder.backend.dto.ToppingOption;
import com.feastfinder.backend.model.Dish;
import com.feastfinder.backend.model.Restaurant;
import com.feastfinder.backend.service.RestaurantAddonService;
import com.feastfinder.backend.service.RestaurantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/restaurants")
@CrossOrigin(origins = "*")
public class RestaurantController {

    private final RestaurantService restaurantService;
    private final RestaurantAddonService addonService;

    @Autowired
    public RestaurantController(RestaurantService restaurantService, RestaurantAddonService addonService) {
        this.restaurantService = restaurantService;
        this.addonService = addonService;
    }

    @GetMapping
    public ResponseEntity<List<Restaurant>> getAllRestaurants() {
        return ResponseEntity.ok(restaurantService.getAllRestaurants());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Restaurant> getRestaurantById(@PathVariable("id") String id) {
        Optional<Restaurant> restaurant = restaurantService.getRestaurantById(id);
        return restaurant.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/menu")
    public ResponseEntity<List<Dish>> getRestaurantMenu(@PathVariable("id") String id) {
        Optional<List<Dish>> menu = restaurantService.getRestaurantMenu(id);
        return menu.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/toppings")
    public ResponseEntity<List<ToppingOption>> getRestaurantToppings(@PathVariable("id") String id) {
        return ResponseEntity.ok(addonService.getToppingsForRestaurant(id));
    }

    @PostMapping
    public ResponseEntity<Restaurant> addRestaurant(@RequestBody Restaurant restaurant) {
        Restaurant savedRestaurant = restaurantService.addRestaurant(restaurant);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedRestaurant);
    }

    @PostMapping("/{id}/dishes")
    public ResponseEntity<String> addDishToRestaurant(
            @PathVariable("id") String id,
            @RequestBody Dish dish) {
        boolean success = restaurantService.addDishToRestaurant(id, dish);
        return success
                ? ResponseEntity.status(HttpStatus.CREATED).body("Dish added successfully")
                : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeRestaurant(@PathVariable("id") String id) {
        boolean success = restaurantService.removeRestaurant(id);
        return success
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }
}
