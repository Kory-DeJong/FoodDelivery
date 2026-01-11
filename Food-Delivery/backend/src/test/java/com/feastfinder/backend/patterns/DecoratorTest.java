package com.feastfinder.backend.patterns;

import com.feastfinder.backend.decorator.BaseDish;
import com.feastfinder.backend.decorator.DishComponent;
import com.feastfinder.backend.decorator.ExtraCheeseDecorator;
import com.feastfinder.backend.decorator.ExtraSauceDecorator;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class DecoratorTest {
    @Test
    void toppingsIncreasePrice() {
        DishComponent base = new BaseDish("Pizza", "Cheese pizza", 10.0);
        DishComponent withCheese = new ExtraCheeseDecorator(base);
        DishComponent withCheeseAndSauce = new ExtraSauceDecorator(withCheese);
        assertThat(withCheese.getPrice()).isEqualTo(11.5);
        assertThat(withCheeseAndSauce.getPrice()).isEqualTo(12.5);
    }
}

