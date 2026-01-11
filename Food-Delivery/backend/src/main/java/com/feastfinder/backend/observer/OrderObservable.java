package com.feastfinder.backend.observer;

import com.feastfinder.backend.model.Order;

import java.util.ArrayList;
import java.util.List;

public class OrderObservable {
    private final List<OrderObserver> observers = new ArrayList<>();

    public void register(OrderObserver observer) {
        observers.add(observer);
    }

    public void unregister(OrderObserver observer) {
        observers.remove(observer);
    }

    public void notifyAll(Order order) {
        observers.forEach(o -> o.onStatusChanged(order));
    }
}

