package com.feastfinder.backend.payment;

public interface PaymentStrategy {
    boolean process(double amount);
    String getName();
}

