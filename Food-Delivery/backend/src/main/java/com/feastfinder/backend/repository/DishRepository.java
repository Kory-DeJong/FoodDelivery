package com.feastfinder.backend.repository;

import com.feastfinder.backend.model.Dish;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DishRepository extends JpaRepository<Dish, String> {
    List<Dish> findByRestaurant_Id(String restaurantId);
}

