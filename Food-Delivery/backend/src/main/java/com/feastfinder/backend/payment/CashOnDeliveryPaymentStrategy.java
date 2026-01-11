package com.feastfinder.backend.payment;

public class CashOnDeliveryPaymentStrategy implements PaymentStrategy {
    @Override
    public boolean process(double amount) {
        // Cash is handled on delivery; we accept any non-negative amount here
        return amount >= 0;
    }

    @Override
    public String getName() {
        return "cash";
    }
}

