package com.feastfinder.backend.discount;

public interface DiscountStrategy {
    double apply(double total);
    String getName();
}

