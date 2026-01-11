package com.feastfinder.backend.payment;

public class CreditCardPaymentStrategy implements PaymentStrategy {
    private final String cardNumber;
    private final String cardExpiry;
    private final String cardCvv;

    public CreditCardPaymentStrategy(String cardNumber, String cardExpiry, String cardCvv) {
        this.cardNumber = cardNumber;
        this.cardExpiry = cardExpiry;
        this.cardCvv = cardCvv;
    }

    @Override
    public boolean process(double amount) {
        // In real life, integrate with card processor
        return cardNumber != null && cardExpiry != null && cardCvv != null && amount >= 0;
    }

    @Override
    public String getName() {
        return "credit-card";
    }
}

