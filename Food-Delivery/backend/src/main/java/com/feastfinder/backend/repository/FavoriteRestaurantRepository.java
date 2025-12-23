package com.feastfinder.backend.repository;

import com.feastfinder.backend.model.FavoriteRestaurant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavoriteRestaurantRepository extends JpaRepository<FavoriteRestaurant, Long> {
    List<FavoriteRestaurant> findByUser_Id(String userId);
    Optional<FavoriteRestaurant> findByUser_IdAndRestaurantId(String userId, String restaurantId);
}

