package com.feastfinder.backend.decorator;

public abstract class DishDecorator implements DishComponent {
    protected final DishComponent base;

    protected DishDecorator(DishComponent base) {
        this.base = base;
    }
}

