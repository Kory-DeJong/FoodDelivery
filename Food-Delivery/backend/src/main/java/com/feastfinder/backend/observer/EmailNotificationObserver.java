package com.feastfinder.backend.observer;

import com.feastfinder.backend.model.Order;

public class EmailNotificationObserver implements OrderObserver {
    @Override
    public void onStatusChanged(Order order) {
        // In real world, send email
        System.out.printf("[EMAIL] Order %s status changed to %s%n", order.getId(), order.getStatus());
    }
}

