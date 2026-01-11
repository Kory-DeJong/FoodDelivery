package com.feastfinder.backend.factory;

import com.feastfinder.backend.decorator.BaseDish;
import com.feastfinder.backend.decorator.DishComponent;

public class DishFactory {
    public DishComponent create(String name, String description, double price) {
        // Factory method returns a base dish component
        return new BaseDish(name, description, price);
    }
}

