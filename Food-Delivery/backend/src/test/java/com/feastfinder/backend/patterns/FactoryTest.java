package com.feastfinder.backend.patterns;

import com.feastfinder.backend.decorator.DishComponent;
import com.feastfinder.backend.factory.DishFactory;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class FactoryTest {
    @Test
    void factoryCreatesBaseDish() {
        DishFactory factory = new DishFactory();
        DishComponent d = factory.create("Burger", "Tasty", 7.0);
        assertThat(d.getName()).contains("Burger");
        assertThat(d.getPrice()).isEqualTo(7.0);
    }
}

