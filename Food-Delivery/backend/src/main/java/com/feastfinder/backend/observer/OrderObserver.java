package com.feastfinder.backend.observer;

import com.feastfinder.backend.model.Order;

public interface OrderObserver {
    void onStatusChanged(Order order);
}

