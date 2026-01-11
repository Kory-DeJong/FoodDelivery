package com.feastfinder.backend.decorator;

public class BaseDish implements DishComponent {
    private final String name;
    private final String description;
    private final double price;

    public BaseDish(String name, String description, double price) {
        this.name = name;
        this.description = description;
        this.price = price;
    }

    @Override
    public String getName() { return name; }

    @Override
    public String getDescription() { return description; }

    @Override
    public double getPrice() { return price; }
}

