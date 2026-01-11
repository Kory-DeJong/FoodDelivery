package com.feastfinder.backend.patterns;

import com.feastfinder.backend.model.Order;
import com.feastfinder.backend.observer.OrderObservable;
import com.feastfinder.backend.observer.OrderObserver;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class ObserverTest {
    @Test
    void observersAreNotified() {
        OrderObservable observable = new OrderObservable();
        final int[] count = {0};
        OrderObserver o = order -> count[0]++;
        observable.register(o);
        observable.notifyAll(new Order());
        observable.notifyAll(new Order());
        assertThat(count[0]).isEqualTo(2);
    }
}

