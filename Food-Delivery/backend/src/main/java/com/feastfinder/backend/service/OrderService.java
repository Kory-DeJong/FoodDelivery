package com.feastfinder.backend.service;

import com.feastfinder.backend.discount.DiscountStrategy;
import com.feastfinder.backend.discount.NoDiscountStrategy;
import com.feastfinder.backend.dto.OrderCreateRequest;
import com.feastfinder.backend.model.Dish;
import com.feastfinder.backend.model.Order;
import com.feastfinder.backend.model.OrderItem;
import com.feastfinder.backend.model.OrderItemExtra;
import com.feastfinder.backend.model.Restaurant;
import com.feastfinder.backend.observer.EmailNotificationObserver;
import com.feastfinder.backend.observer.OrderObservable;
import com.feastfinder.backend.observer.SMSNotificationObserver;
import com.feastfinder.backend.payment.PaymentStrategy;
import com.feastfinder.backend.repository.DishRepository;
import com.feastfinder.backend.repository.OrderRepository;
import com.feastfinder.backend.repository.RestaurantRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.annotation.PostConstruct;
import java.util.*;
import java.util.concurrent.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Service
public class OrderService {
    private final RestaurantRepository restaurantRepository;
    private final DishRepository dishRepository;
    private final OrderRepository orderRepository;
    private final RestaurantAddonService addonService;
    private final DiscountStrategy defaultDiscountStrategy = new NoDiscountStrategy();
    private final OrderObservable orderObservable = new OrderObservable();

    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(2);
    private final ConcurrentMap<String, CopyOnWriteArrayList<SseEmitter>> sseEmitters = new ConcurrentHashMap<>();

    public OrderService(RestaurantRepository restaurantRepository,
                        DishRepository dishRepository,
                        OrderRepository orderRepository,
                        RestaurantAddonService addonService) {
        this.restaurantRepository = restaurantRepository;
        this.dishRepository = dishRepository;
        this.orderRepository = orderRepository;
        this.addonService = addonService;
    }

    @PostConstruct
    void initObservers() {
        orderObservable.register(new EmailNotificationObserver());
        orderObservable.register(new SMSNotificationObserver());
    }

    public List<Order> getAllOrders() { return orderRepository.findAll(); }

    public Optional<Order> getOrderById(String id) { return orderRepository.findById(id); }

    @Transactional(readOnly = true)
    public Optional<Order> getOrderWithItems(String id) {
        return orderRepository.findById(id).map(order -> {
            order.getItems().size();
            for (OrderItem item : order.getItems()) {
                if (item.getDish() != null) {
                    item.getDish().getName();
                }
                if (item.getExtras() != null) {
                    item.getExtras().size();
                }
            }
            return order;
        });
    }

    public List<Order> getOrdersByUser(String userId) { return orderRepository.findByUserIdOrderByOrderTimeDesc(userId); }

    public List<Order> getOrdersByRestaurant(String restaurantId) { return orderRepository.findByRestaurantIdOrderByOrderTimeDesc(restaurantId); }

    public Order createOrder(String userId, String restaurantId, List<Dish> items,
                             String deliveryAddress, String contactPhone) {
        Restaurant r = restaurantRepository.findById(restaurantId).orElseThrow(() -> new IllegalArgumentException("Restaurant not found"));
        Order order = new Order();
        order.setId("ORD-" + ThreadLocalRandom.current().nextInt(100000, 999999));
        order.setUserId(userId);
        order.setRestaurantId(restaurantId);
        order.setRestaurantName(r.getName());
        order.setDeliveryAddress(deliveryAddress);
        order.setContactPhone(contactPhone);
        order.setStatus(Order.OrderStatus.PLACED);

        // Map incoming items to current restaurant dish details
        List<OrderItem> mapped = new ArrayList<>();
        for (Dish incoming : items) {
            Dish menuDish = dishRepository.findById(incoming.getId()).orElseThrow(() -> new IllegalArgumentException("Dish not found in restaurant menu"));
            int qty = 1; // Default quantity since the simple payload has no quantities
            mapped.add(new OrderItem(menuDish, qty));
        }
        order.setItems(mapped);
        double subtotal = mapped.stream().mapToDouble(OrderItem::getSubtotal).sum();
        order.setDiscountStrategy(defaultDiscountStrategy.getName());
        order.setDiscountAmount(0);
        order.setTotalAmount(subtotal);

        // set back-reference
        for (OrderItem oi : mapped) {
            oi.setOrder(order);
        }
        orderRepository.save(order);

        // Concurrency: simulate order progression
        scheduleStatusUpdates(order.getId());
        return order;
    }

    public Order createOrderWithItems(String userId, OrderCreateRequest request, DiscountStrategy discountStrategy) {
        String restaurantId = request.getRestaurantId();
        Restaurant r = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new IllegalArgumentException("Restaurant not found"));

        Order order = new Order();
        order.setId("ORD-" + ThreadLocalRandom.current().nextInt(100000, 999999));
        order.setUserId(userId);
        order.setRestaurantId(restaurantId);
        order.setRestaurantName(r.getName());
        order.setDeliveryAddress(request.getDeliveryAddress());
        order.setContactPhone(request.getContactPhone());
        order.setStatus(Order.OrderStatus.PLACED);
        order.setSpecialInstructions(request.getInstructions());
        order.setPaymentMethod(request.getPaymentMethod());
        order.setPromoCode(request.getPromoCode());

        List<OrderItem> validated = new ArrayList<>();
        List<OrderCreateRequest.Item> incomingItems = request.getItems() == null ? List.of() : request.getItems();
        if (incomingItems.isEmpty()) {
            throw new IllegalArgumentException("Order requires at least one item");
        }

        for (OrderCreateRequest.Item dto : incomingItems) {
            if (dto.getId() == null || dto.getId().isBlank()) {
                throw new IllegalArgumentException("Dish id is required");
            }
            Dish menuDish = dishRepository.findById(dto.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Dish not found in restaurant menu"));
            int quantity = dto.getQuantity() == null ? 1 : Math.max(1, dto.getQuantity());
            OrderItem orderItem = new OrderItem(menuDish, quantity);
            orderItem.setExtras(resolveExtras(restaurantId, menuDish.getType(), dto.getExtras()));
            orderItem.setOrder(order);
            validated.add(orderItem);
        }

        order.setItems(validated);
        double subtotal = validated.stream().mapToDouble(OrderItem::getSubtotal).sum();
        DiscountStrategy effectiveStrategy = discountStrategy == null ? defaultDiscountStrategy : discountStrategy;
        double discounted = effectiveStrategy.apply(subtotal);
        order.setDiscountStrategy(effectiveStrategy.getName());
        order.setDiscountAmount(Math.max(0, subtotal - discounted));
        order.setTotalAmount(discounted);

        orderRepository.save(order);
        scheduleStatusUpdates(order.getId());
        return order;
    }

    public boolean updateOrderStatus(String id, Order.OrderStatus newStatus) {
        Order order = orderRepository.findById(id).orElse(null);
        if (order == null) return false;
        order.setStatus(newStatus);
        orderRepository.save(order);
        orderObservable.notifyAll(order);
        notifySse(order);
        return true;
    }

    public boolean processPayment(String id, PaymentStrategy strategy) {
        Order order = orderRepository.findById(id).orElse(null);
        if (order == null) return false;
        boolean ok = strategy.process(order.getTotalAmount());
        if (ok) {
            order.setPaymentMethod(strategy.getName());
        }
        if (ok) orderRepository.save(order);
        return ok;
    }

    public double applyDiscount(String id, DiscountStrategy strategy) {
        Order order = orderRepository.findById(id).orElse(null);
        if (order == null) throw new IllegalArgumentException("Order not found");
        double subtotal = order.getItems().stream().mapToDouble(OrderItem::getSubtotal).sum();
        double discounted = strategy.apply(subtotal);
        order.setDiscountStrategy(strategy.getName());
        order.setDiscountAmount(Math.max(0, subtotal - discounted));
        order.setTotalAmount(discounted);
        orderRepository.save(order);
        return discounted;
    }

    public void updatePromoCode(String orderId, String promoCode) {
        orderRepository.findById(orderId).ifPresent(order -> {
            order.setPromoCode(promoCode);
            orderRepository.save(order);
        });
    }

    private void scheduleStatusUpdates(String orderId) {
        scheduler.schedule(() -> updateOrderStatus(orderId, Order.OrderStatus.PREPARING), 5, TimeUnit.SECONDS);
        scheduler.schedule(() -> updateOrderStatus(orderId, Order.OrderStatus.OUT_FOR_DELIVERY), 15, TimeUnit.SECONDS);
        scheduler.schedule(() -> updateOrderStatus(orderId, Order.OrderStatus.DELIVERED), 30, TimeUnit.SECONDS);
    }

    public SseEmitter subscribe(String orderId) {
        SseEmitter emitter = new SseEmitter(0L);
        sseEmitters.computeIfAbsent(orderId, k -> new CopyOnWriteArrayList<>()).add(emitter);
        emitter.onCompletion(() -> sseEmitters.getOrDefault(orderId, new CopyOnWriteArrayList<>()).remove(emitter));
        emitter.onTimeout(() -> sseEmitters.getOrDefault(orderId, new CopyOnWriteArrayList<>()).remove(emitter));
        // push current state if available
        orderRepository.findById(orderId).ifPresent(o -> {
            try { emitter.send(SseEmitter.event().name("status").data(o.getStatus().name())); } catch (Exception ignored) {}
        });
        return emitter;
    }

    private void notifySse(Order order) {
        var list = sseEmitters.get(order.getId());
        if (list == null) return;
        List<SseEmitter> toRemove = new ArrayList<>();
        for (SseEmitter e : list) {
            try { e.send(SseEmitter.event().name("status").data(order.getStatus().name())); }
            catch (Exception ex) { toRemove.add(e); }
        }
        list.removeAll(toRemove);
    }

    private List<OrderItemExtra> resolveExtras(String restaurantId, com.feastfinder.backend.model.DishType dishType,
                                               List<OrderCreateRequest.Item.Extra> extrasDto) {
        if (extrasDto == null || extrasDto.isEmpty()) return new ArrayList<>();
        List<OrderItemExtra> extras = new ArrayList<>();
        for (OrderCreateRequest.Item.Extra extraDto : extrasDto) {
            if (extraDto == null || extraDto.getId() == null) continue;
            var topping = addonService.findOption(restaurantId, extraDto.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Topping not supported: " + extraDto.getId()));
            if (!topping.supports(dishType)) {
                throw new IllegalArgumentException("Topping " + topping.getId() + " not allowed for dish type " + dishType);
            }
            extras.add(new OrderItemExtra(topping.getId(), topping.getName(), topping.getPrice()));
        }
        return extras;
    }
}
