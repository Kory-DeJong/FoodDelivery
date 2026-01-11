package com.feastfinder.backend.discount;

public class NoDiscountStrategy implements DiscountStrategy {
    @Override
    public double apply(double total) {
        return total;
    }

    @Override
    public String getName() { return "none"; }
}

