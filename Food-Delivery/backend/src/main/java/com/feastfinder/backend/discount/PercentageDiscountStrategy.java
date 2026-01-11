package com.feastfinder.backend.discount;

public class PercentageDiscountStrategy implements DiscountStrategy {
    private final double percent;

    public PercentageDiscountStrategy(double percent) {
        this.percent = percent;
    }

    @Override
    public double apply(double total) {
        if (percent <= 0) return total;
        return total - (total * (percent / 100.0));
    }

    @Override
    public String getName() { return "percentage"; }
}

