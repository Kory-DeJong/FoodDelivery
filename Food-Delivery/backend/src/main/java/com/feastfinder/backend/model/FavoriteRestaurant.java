package com.feastfinder.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "favorite_restaurants", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "restaurant_id"}))
public class FavoriteRestaurant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private UserAccount user;

    @Column(name = "restaurant_id", nullable = false)
    private String restaurantId;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public UserAccount getUser() { return user; }
    public void setUser(UserAccount user) { this.user = user; }
    public String getRestaurantId() { return restaurantId; }
    public void setRestaurantId(String restaurantId) { this.restaurantId = restaurantId; }
}

