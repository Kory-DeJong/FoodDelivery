package com.feastfinder.backend.decorator;

public class ExtraCheeseDecorator extends DishDecorator {
    public ExtraCheeseDecorator(DishComponent base) {
        super(base);
    }

    @Override
    public String getName() { return base.getName() + " + Extra Cheese"; }

    @Override
    public String getDescription() { return base.getDescription(); }

    @Override
    public double getPrice() { return base.getPrice() + 1.50; }
}

