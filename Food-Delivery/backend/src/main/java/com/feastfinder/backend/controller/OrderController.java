package com.feastfinder.backend.controller;

import com.feastfinder.backend.discount.DiscountStrategy;
import com.feastfinder.backend.discount.FlatDiscountStrategy;
import com.feastfinder.backend.discount.NoDiscountStrategy;
import com.feastfinder.backend.discount.PercentageDiscountStrategy;
import com.feastfinder.backend.dto.OrderCreateRequest;
import com.feastfinder.backend.model.Dish;
import com.feastfinder.backend.model.Order;
import com.feastfinder.backend.payment.CashOnDeliveryPaymentStrategy;
import com.feastfinder.backend.payment.CreditCardPaymentStrategy;
import com.feastfinder.backend.payment.PayPalPaymentStrategy;
import com.feastfinder.backend.payment.PaymentStrategy;
import com.feastfinder.backend.service.OrderService;
import com.feastfinder.backend.repository.DiscountCodeRepository;
import com.feastfinder.backend.model.DiscountCode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import com.feastfinder.backend.security.UserPrincipal;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderService orderService;
    private final DiscountCodeRepository discountRepo;

    @Autowired
    public OrderController(OrderService orderService, DiscountCodeRepository discountRepo) {
        this.orderService = orderService;
        this.discountRepo = discountRepo;
    }

    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable("id") String id) {
        Optional<Order> order = orderService.getOrderById(id);
        return order.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getOrdersByUser(@PathVariable("userId") String userId) {
        return ResponseEntity.ok(orderService.getOrdersByUser(userId));
    }

    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<List<Order>> getOrdersByRestaurant(@PathVariable("restaurantId") String restaurantId) {
        return ResponseEntity.ok(orderService.getOrdersByRestaurant(restaurantId));
    }

    @GetMapping("/me")
    public ResponseEntity<List<Order>> getOrdersForCurrent(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof UserPrincipal up)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(orderService.getOrdersByUser(up.id()));
    }

    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody OrderCreateRequest request, Authentication authentication) {
        try {
            String userId = request.getUserId();
            if (authentication != null && authentication.getPrincipal() instanceof UserPrincipal up) {
                userId = up.id();
            }
            DiscountStrategy strategy = strategyFromKey(request.getDiscountStrategy());
            Order order = orderService.createOrderWithItems(userId, request, strategy);
            return ResponseEntity.status(HttpStatus.CREATED).body(order);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<String> updateOrderStatus(
            @PathVariable("id") String id,
            @RequestBody Map<String, String> statusUpdate) {
        try {
            Order.OrderStatus newStatus = Order.OrderStatus.valueOf(statusUpdate.get("status"));
            boolean success = orderService.updateOrderStatus(id, newStatus);
            return success
                    ? ResponseEntity.ok("Order status updated successfully")
                    : ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid order status");
        }
    }

    @GetMapping("/{id}/events")
    public org.springframework.web.servlet.mvc.method.annotation.SseEmitter events(@PathVariable("id") String id) {
        return orderService.subscribe(id);
    }

    @PostMapping("/{id}/payment")
    public ResponseEntity<String> processPayment(
            @PathVariable("id") String id,
            @RequestBody Map<String, Object> paymentDetails) {
        try {
            String paymentMethod = (String) paymentDetails.get("paymentMethod");
            PaymentStrategy paymentStrategy;

            switch (paymentMethod) {
                case "credit-card":
                    String cardNumber = (String) paymentDetails.get("cardNumber");
                    String cardExpiry = (String) paymentDetails.get("cardExpiry");
                    String cardCvv = (String) paymentDetails.get("cardCvv");
                    paymentStrategy = new CreditCardPaymentStrategy(cardNumber, cardExpiry, cardCvv);
                    break;
                case "paypal":
                    String email = (String) paymentDetails.get("email");
                    String password = (String) paymentDetails.get("password");
                    paymentStrategy = new PayPalPaymentStrategy(email, password);
                    break;
                case "cash":
                    paymentStrategy = new CashOnDeliveryPaymentStrategy();
                    break;
                default:
                    return ResponseEntity.badRequest().body("Invalid payment method");
            }

            boolean success = orderService.processPayment(id, paymentStrategy);
            return success
                    ? ResponseEntity.ok("Payment processed successfully")
                    : ResponseEntity.badRequest().body("Payment processing failed");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error processing payment: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/discount")
    public ResponseEntity<Double> applyDiscount(
            @PathVariable("id") String id,
            @RequestBody Map<String, String> discountDetails) {
        try {
            String discountType = discountDetails.get("discountType");
            DiscountStrategy discountStrategy;

            switch (discountType) {
                case "percentage":
                    discountStrategy = new PercentageDiscountStrategy(10.0); // 10% discount
                    break;
                case "flat":
                    discountStrategy = new FlatDiscountStrategy(5.0); // $5 off
                    break;
                case "none":
                default:
                    discountStrategy = new NoDiscountStrategy();
                    break;
            }

            double discountedTotal = orderService.applyDiscount(id, discountStrategy);
            return ResponseEntity.ok(discountedTotal);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{id}/promo")
    public ResponseEntity<?> applyPromo(@PathVariable("id") String id, @RequestBody Map<String, String> body) {
        String code = body.get("code");
        if (code == null) return ResponseEntity.badRequest().body(Map.of("error", "code required"));
        var opt = discountRepo.findById(code.toUpperCase());
        if (opt.isEmpty() || !opt.get().isActive()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid code"));
        }
        DiscountCode dc = opt.get();
        DiscountStrategy strategy = dc.getType() == DiscountCode.Type.PERCENT
                ? new PercentageDiscountStrategy(dc.getValue())
                : new FlatDiscountStrategy(dc.getValue());
        double total = orderService.applyDiscount(id, strategy);
        orderService.updatePromoCode(id, code.toUpperCase());
        return ResponseEntity.ok(Map.of("total", total));
    }

    private DiscountStrategy strategyFromKey(String key) {
        if (key == null) return new NoDiscountStrategy();
        return switch (key) {
            case "percent10" -> new PercentageDiscountStrategy(10.0);
            case "flat5" -> new FlatDiscountStrategy(5.0);
            default -> new NoDiscountStrategy();
        };
    }
}
