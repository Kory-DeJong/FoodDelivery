package com.feastfinder.backend.payment;

public class PayPalPaymentStrategy implements PaymentStrategy {
    private final String email;
    private final String password;

    public PayPalPaymentStrategy(String email, String password) {
        this.email = email;
        this.password = password;
    }

    @Override
    public boolean process(double amount) {
        return email != null && password != null && amount >= 0;
    }

    @Override
    public String getName() {
        return "paypal";
    }
}

