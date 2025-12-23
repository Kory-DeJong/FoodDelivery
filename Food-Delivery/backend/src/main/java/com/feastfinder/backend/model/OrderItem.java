package com.feastfinder.backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "order_items")
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    @JsonBackReference
    private Order order;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "dish_id")
    private Dish dish;

    private int quantity;

    @ElementCollection
    @CollectionTable(name = "order_item_extras", joinColumns = @JoinColumn(name = "order_item_id"))
    private List<OrderItemExtra> extras = new ArrayList<>();

    public OrderItem() {}

    public OrderItem(Dish dish, int quantity) {
        this.dish = dish;
        this.quantity = quantity;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }
    public Dish getDish() { return dish; }
    public void setDish(Dish dish) { this.dish = dish; }
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
    public List<OrderItemExtra> getExtras() { return extras; }
    public void setExtras(List<OrderItemExtra> extras) { this.extras = extras; }

    public double getExtrasUpcharge() {
        return extras == null ? 0.0 : extras.stream().mapToDouble(OrderItemExtra::getPrice).sum();
    }

    public double getSubtotal() {
        double base = dish != null ? dish.getPrice() : 0.0;
        return (base + getExtrasUpcharge()) * quantity;
    }
}
