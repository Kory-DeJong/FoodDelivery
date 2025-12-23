package com.feastfinder.backend.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "restaurants")
public class Restaurant {
    @Id
    private String id;

    private String name;
    private String description;
    private String address;
    private String phoneNumber;
    private double rating;
    private String cuisineType;

    @Enumerated(EnumType.STRING)
    private DishType primaryType;

    private String image;

    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<Dish> menu = new ArrayList<>();

    public Restaurant() {}

    public Restaurant(String id, String name) {
        this.id = id;
        this.name = name;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }
    public String getCuisineType() { return cuisineType; }
    public void setCuisineType(String cuisineType) { this.cuisineType = cuisineType; }
    public DishType getPrimaryType() { return primaryType; }
    public void setPrimaryType(DishType primaryType) { this.primaryType = primaryType; }
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
    public List<Dish> getMenu() { return menu; }
    public void setMenu(List<Dish> menu) { this.menu = menu; }
}
