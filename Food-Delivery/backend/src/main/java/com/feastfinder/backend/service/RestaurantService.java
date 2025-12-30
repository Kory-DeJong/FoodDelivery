package com.feastfinder.backend.service;

import com.feastfinder.backend.model.Dish;
import com.feastfinder.backend.model.DishType;
import com.feastfinder.backend.model.Restaurant;
import com.feastfinder.backend.repository.DishRepository;
import com.feastfinder.backend.repository.RestaurantRepository;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.util.*;

@Service
public class RestaurantService {
    private final RestaurantRepository restaurantRepository;
    private final DishRepository dishRepository;

    public RestaurantService(RestaurantRepository restaurantRepository, DishRepository dishRepository) {
        this.restaurantRepository = restaurantRepository;
        this.dishRepository = dishRepository;
    }

    @PostConstruct
    void seed() {
        if (restaurantRepository.count() > 0) return;

        Restaurant pizza = new Restaurant("rest1", "Pizza Paradise");
        pizza.setDescription("The best pizza in town with a variety of toppings.");
        pizza.setRating(4.5);
        pizza.setAddress("123 Main St, Foodville");
        pizza.setPhoneNumber("(123) 456-7890");
        pizza.setCuisineType("Italian");
        pizza.setPrimaryType(DishType.VEGETARIAN);
        pizza.setImage("https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80");

        Restaurant burger = new Restaurant("rest2", "Burger Bliss");
        burger.setDescription("Juicy burgers with premium ingredients and special sauces.");
        burger.setRating(4.3);
        burger.setAddress("456 Oak Ave, Foodville");
        burger.setPhoneNumber("(123) 456-7891");
        burger.setCuisineType("American");
        burger.setPrimaryType(DishType.NON_VEGETARIAN);
        burger.setImage("https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80");

        restaurantRepository.saveAll(List.of(pizza, burger));

        Dish d1 = new Dish("dish1", "Margherita", "Classic cheese pizza", DishType.VEGETARIAN, 8.99);
        d1.setRestaurant(pizza);
        Dish d2 = new Dish("dish2", "Pepperoni", "Pepperoni and cheese", DishType.NON_VEGETARIAN, 9.99);
        d2.setRestaurant(pizza);
        Dish d3 = new Dish("dish3", "Vegan Delight", "Plant-based toppings", DishType.VEGAN, 10.49);
        d3.setRestaurant(pizza);
        Dish d4 = new Dish("dish4", "Classic Burger", "Beef patty with lettuce & tomato", DishType.NON_VEGETARIAN, 7.99);
        d4.setRestaurant(burger);
        Dish d5 = new Dish("dish5", "Veggie Burger", "Grilled veggie patty", DishType.VEGETARIAN, 7.49);
        d5.setRestaurant(burger);
        dishRepository.saveAll(List.of(d1, d2, d3, d4, d5));
    }

    public List<Restaurant> getAllRestaurants() {
        return restaurantRepository.findAll();
    }

    public Optional<Restaurant> getRestaurantById(String id) {
        return restaurantRepository.findById(id);
    }

    public Optional<List<Dish>> getRestaurantMenu(String id) {
        return restaurantRepository.findById(id).map(r -> dishRepository.findByRestaurant_Id(id));
    }

    public Restaurant addRestaurant(Restaurant restaurant) {
        if (restaurant.getId() == null || restaurant.getId().isBlank()) {
            restaurant.setId(UUID.randomUUID().toString());
        }
        return restaurantRepository.save(restaurant);
    }

    public boolean addDishToRestaurant(String restaurantId, Dish dish) {
        return restaurantRepository.findById(restaurantId).map(r -> {
            if (dish.getId() == null || dish.getId().isBlank()) {
                dish.setId(UUID.randomUUID().toString());
            }
            dish.setRestaurant(r);
            dishRepository.save(dish);
            return true;
        }).orElse(false);
    }

    public boolean removeRestaurant(String id) {
        if (!restaurantRepository.existsById(id)) return false;
        restaurantRepository.deleteById(id);
        return true;
    }
}
