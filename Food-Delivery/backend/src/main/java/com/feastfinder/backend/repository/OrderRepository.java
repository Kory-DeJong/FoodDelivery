package com.feastfinder.backend.repository;

import com.feastfinder.backend.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, String> {
    List<Order> findByUserIdOrderByOrderTimeDesc(String userId);
    List<Order> findByRestaurantIdOrderByOrderTimeDesc(String restaurantId);
}

