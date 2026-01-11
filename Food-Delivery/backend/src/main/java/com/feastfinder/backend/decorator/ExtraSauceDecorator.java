package com.feastfinder.backend.decorator;

public class ExtraSauceDecorator extends DishDecorator {
    public ExtraSauceDecorator(DishComponent base) {
        super(base);
    }

    @Override
    public String getName() { return base.getName() + " + Extra Sauce"; }

    @Override
    public String getDescription() { return base.getDescription(); }

    @Override
    public double getPrice() { return base.getPrice() + 1.00; }
}

