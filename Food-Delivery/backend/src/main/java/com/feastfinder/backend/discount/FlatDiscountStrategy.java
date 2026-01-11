package com.feastfinder.backend.discount;

public class FlatDiscountStrategy implements DiscountStrategy {
    private final double amount;

    public FlatDiscountStrategy(double amount) {
        this.amount = amount;
    }

    @Override
    public double apply(double total) {
        return Math.max(0.0, total - Math.max(0.0, amount));
    }

    @Override
    public String getName() { return "flat"; }
}

