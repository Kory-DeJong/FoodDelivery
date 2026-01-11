package com.feastfinder.backend.observer;

import com.feastfinder.backend.model.Order;

public class SMSNotificationObserver implements OrderObserver {
    @Override
    public void onStatusChanged(Order order) {
        // In real world, send SMS
        System.out.printf("[SMS] Order %s status changed to %s%n", order.getId(), order.getStatus());
    }
}

