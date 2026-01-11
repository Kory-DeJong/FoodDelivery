package com.feastfinder.backend.patterns;

import com.feastfinder.backend.discount.FlatDiscountStrategy;
import com.feastfinder.backend.discount.NoDiscountStrategy;
import com.feastfinder.backend.discount.PercentageDiscountStrategy;
import com.feastfinder.backend.payment.CashOnDeliveryPaymentStrategy;
import com.feastfinder.backend.payment.CreditCardPaymentStrategy;
import com.feastfinder.backend.payment.PayPalPaymentStrategy;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class StrategyTest {
    @Test
    void discountStrategies_apply() {
        assertThat(new NoDiscountStrategy().apply(100)).isEqualTo(100);
        assertThat(new PercentageDiscountStrategy(10).apply(100)).isEqualTo(90);
        assertThat(new FlatDiscountStrategy(5).apply(100)).isEqualTo(95);
    }

    @Test
    void paymentStrategies_process() {
        assertThat(new CashOnDeliveryPaymentStrategy().process(10)).isTrue();
        assertThat(new CreditCardPaymentStrategy("4111", "12/30", "123").process(25)).isTrue();
        assertThat(new PayPalPaymentStrategy("a@b.com", "pw").process(25)).isTrue();
    }
}

