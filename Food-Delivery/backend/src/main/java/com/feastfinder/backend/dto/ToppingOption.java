package com.feastfinder.backend.dto;

import com.feastfinder.backend.model.DishType;
import java.util.Set;

public class ToppingOption {
    private String id;
    private String name;
    private double price;
    private String description;
    private Set<DishType> compatibleTypes;
    private boolean removable;

    public ToppingOption() {}

    public ToppingOption(String id, String name, double price, String description, Set<DishType> compatibleTypes) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.description = description;
        this.compatibleTypes = compatibleTypes;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Set<DishType> getCompatibleTypes() { return compatibleTypes; }
    public void setCompatibleTypes(Set<DishType> compatibleTypes) { this.compatibleTypes = compatibleTypes; }
    public boolean isRemovable() { return removable; }
    public void setRemovable(boolean removable) { this.removable = removable; }

    public boolean supports(DishType type) {
        return compatibleTypes == null || compatibleTypes.isEmpty() || compatibleTypes.contains(type);
    }
}
