package com.feastfinder.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class OrderItemExtra {
    @Column(name = "extra_id")
    private String extraId;
    private String name;
    private double price;

    public OrderItemExtra() {}

    public OrderItemExtra(String extraId, String name, double price) {
        this.extraId = extraId;
        this.name = name;
        this.price = price;
    }

    public String getExtraId() { return extraId; }
    public void setExtraId(String extraId) { this.extraId = extraId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
}
