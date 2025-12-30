package com.feastfinder.backend.cli;

import com.feastfinder.backend.discount.DiscountStrategy;
import com.feastfinder.backend.discount.FlatDiscountStrategy;
import com.feastfinder.backend.discount.NoDiscountStrategy;
import com.feastfinder.backend.discount.PercentageDiscountStrategy;
import com.feastfinder.backend.dto.OrderCreateRequest;
import com.feastfinder.backend.dto.ToppingOption;
import com.feastfinder.backend.model.Dish;
import com.feastfinder.backend.model.DishType;
import com.feastfinder.backend.model.DiscountCode;
import com.feastfinder.backend.model.Order;
import com.feastfinder.backend.model.OrderItem;
import com.feastfinder.backend.model.OrderItemExtra;
import com.feastfinder.backend.model.Restaurant;
import com.feastfinder.backend.payment.CashOnDeliveryPaymentStrategy;
import com.feastfinder.backend.payment.CreditCardPaymentStrategy;
import com.feastfinder.backend.payment.PayPalPaymentStrategy;
import com.feastfinder.backend.payment.PaymentStrategy;
import com.feastfinder.backend.repository.DiscountCodeRepository;
import com.feastfinder.backend.service.OrderService;
import com.feastfinder.backend.service.RestaurantAddonService;
import com.feastfinder.backend.service.RestaurantService;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.Scanner;

@Component
public class FeastFinderCLI {
    private final RestaurantService restaurantService;
    private final OrderService orderService;
    private final RestaurantAddonService addonService;
    private final DiscountCodeRepository discountRepo;
    private final Scanner scanner = new Scanner(System.in);
    private String currentUserId = "demo";

    public FeastFinderCLI(RestaurantService restaurantService,
                          OrderService orderService,
                          RestaurantAddonService addonService,
                          DiscountCodeRepository discountRepo) {
        this.restaurantService = restaurantService;
        this.orderService = orderService;
        this.addonService = addonService;
        this.discountRepo = discountRepo;
    }

    public void run() {
        System.out.println("=== FeastFinder CLI ===");
        System.out.println("Type 'help' to see commands.");
        while (true) {
            String line = readLine("> ");
            if (line == null) break;
            line = line.trim();
            if (line.isEmpty()) continue;
            String[] parts = line.split("\\s+");
            String cmd = parts[0].toLowerCase(Locale.ROOT);
            switch (cmd) {
                case "help":
                    printHelp();
                    break;
                case "user":
                    handleUser(parts);
                    break;
                case "list":
                case "restaurants":
                    handleList();
                    break;
                case "menu":
                    handleMenu(parts);
                    break;
                case "toppings":
                    handleToppings(parts);
                    break;
                case "order":
                    handleCreateOrder();
                    break;
                case "orders":
                    handleOrders(parts);
                    break;
                case "show":
                    handleShow(parts);
                    break;
                case "status":
                    handleStatus(parts);
                    break;
                case "watch":
                    handleWatch(parts);
                    break;
                case "pay":
                    handlePay(parts);
                    break;
                case "discount":
                    handleDiscount(parts);
                    break;
                case "promo":
                    handlePromo(parts);
                    break;
                case "add-restaurant":
                    handleAddRestaurant();
                    break;
                case "add-dish":
                    handleAddDish(parts);
                    break;
                case "quit":
                case "exit":
                    System.out.println("Goodbye!");
                    return;
                default:
                    System.out.println("Unknown command. Type 'help' for options.");
            }
        }
    }

    private void printHelp() {
        System.out.println("Commands:");
        System.out.println("  help                         Show commands");
        System.out.println("  user [id]                    Show or set current user id");
        System.out.println("  list                         List restaurants");
        System.out.println("  menu <restaurantId>          Show restaurant menu");
        System.out.println("  toppings <restaurantId>      Show available toppings");
        System.out.println("  order                        Create a new order");
        System.out.println("  orders [userId]              List orders for a user");
        System.out.println("  show <orderId>               Show order details");
        System.out.println("  status <orderId>             Show order status");
        System.out.println("  watch <orderId> [seconds]    Watch order status updates");
        System.out.println("  pay <orderId>                Process payment for an order");
        System.out.println("  discount <orderId>           Apply a discount strategy");
        System.out.println("  promo <orderId> <code>        Apply a promo code");
        System.out.println("  add-restaurant               Add a restaurant");
        System.out.println("  add-dish <restaurantId>       Add a dish to restaurant");
        System.out.println("  quit                         Exit CLI");
    }

    private void handleUser(String[] parts) {
        if (parts.length < 2) {
            System.out.println("Current user id: " + currentUserId);
            return;
        }
        currentUserId = parts[1].trim();
        System.out.println("Current user id set to: " + currentUserId);
    }

    private void handleList() {
        List<Restaurant> restaurants = restaurantService.getAllRestaurants();
        if (restaurants.isEmpty()) {
            System.out.println("No restaurants found.");
            return;
        }
        for (Restaurant r : restaurants) {
            System.out.printf("%s | %s | %s | rating %.1f%n",
                    r.getId(),
                    r.getName(),
                    safeValue(r.getCuisineType()),
                    r.getRating());
        }
    }

    private void handleMenu(String[] parts) {
        String restaurantId = parts.length > 1 ? parts[1] : promptRequired("Restaurant id");
        Optional<List<Dish>> menuOpt = restaurantService.getRestaurantMenu(restaurantId);
        if (menuOpt.isEmpty() || menuOpt.get().isEmpty()) {
            System.out.println("No menu found for restaurant: " + restaurantId);
            return;
        }
        for (Dish d : menuOpt.get()) {
            System.out.printf("%s | %s | %s | %.2f%n",
                    d.getId(), d.getName(), d.getType(), d.getPrice());
        }
    }

    private void handleToppings(String[] parts) {
        String restaurantId = parts.length > 1 ? parts[1] : promptRequired("Restaurant id");
        List<ToppingOption> options = addonService.getToppingsForRestaurant(restaurantId);
        if (options.isEmpty()) {
            System.out.println("No toppings found for restaurant: " + restaurantId);
            return;
        }
        for (ToppingOption t : options) {
            System.out.printf("%s | %s | %.2f | %s%n",
                    t.getId(),
                    t.getName(),
                    t.getPrice(),
                    formatTypes(t.getCompatibleTypes()));
        }
    }

    private void handleCreateOrder() {
        String userId = prompt("User id", currentUserId);
        if (userId != null && !userId.isBlank()) currentUserId = userId;
        String restaurantId = promptRequired("Restaurant id");

        Optional<List<Dish>> menuOpt = restaurantService.getRestaurantMenu(restaurantId);
        if (menuOpt.isEmpty() || menuOpt.get().isEmpty()) {
            System.out.println("No menu found for restaurant: " + restaurantId);
            return;
        }
        List<Dish> menu = menuOpt.get();
        Map<String, Dish> menuMap = new HashMap<>();
        for (Dish d : menu) {
            menuMap.put(d.getId(), d);
        }

        List<OrderCreateRequest.Item> items = new ArrayList<>();
        while (true) {
            String dishId = prompt("Dish id (blank to finish)", "");
            if (dishId == null || dishId.isBlank()) break;
            Dish dish = menuMap.get(dishId);
            if (dish == null) {
                System.out.println("Dish not in menu. Use 'menu " + restaurantId + "' to list dishes.");
                continue;
            }
            int quantity = promptInt("Quantity", 1);
            List<OrderCreateRequest.Item.Extra> extras = promptExtras(restaurantId, dish);
            OrderCreateRequest.Item item = new OrderCreateRequest.Item();
            item.setId(dishId);
            item.setQuantity(quantity);
            item.setExtras(extras);
            items.add(item);
        }

        if (items.isEmpty()) {
            System.out.println("No items added. Order cancelled.");
            return;
        }

        OrderCreateRequest request = new OrderCreateRequest();
        request.setUserId(currentUserId);
        request.setRestaurantId(restaurantId);
        request.setItems(items);
        request.setDeliveryAddress(prompt("Delivery address", ""));
        request.setContactPhone(prompt("Contact phone", ""));
        request.setInstructions(prompt("Special instructions", ""));
        request.setPaymentMethod(prompt("Payment method (credit-card/paypal/cash)", ""));

        DiscountStrategy discountStrategy = promptDiscountStrategy();
        try {
            Order order = orderService.createOrderWithItems(currentUserId, request, discountStrategy);
            System.out.printf("Order created: %s | total %.2f | status %s%n",
                    order.getId(), order.getTotalAmount(), order.getStatus());
            String payNow = prompt("Process payment now? (y/n)", "n");
            if ("y".equalsIgnoreCase(payNow)) {
                handlePay(new String[]{"pay", order.getId()});
            }
            String watchNow = prompt("Watch status updates now? (y/n)", "n");
            if ("y".equalsIgnoreCase(watchNow)) {
                watchOrder(order.getId(), 40);
            }
        } catch (Exception e) {
            System.out.println("Failed to create order: " + e.getMessage());
        }
    }

    private void handleOrders(String[] parts) {
        String userId = parts.length > 1 ? parts[1] : currentUserId;
        List<Order> orders = orderService.getOrdersByUser(userId);
        if (orders.isEmpty()) {
            System.out.println("No orders found for user: " + userId);
            return;
        }
        for (Order o : orders) {
            System.out.printf("%s | %s | %.2f | %s%n",
                    o.getId(), o.getStatus(), o.getTotalAmount(), safeValue(o.getRestaurantName()));
        }
    }

    private void handleShow(String[] parts) {
        String orderId = parts.length > 1 ? parts[1] : promptRequired("Order id");
        Optional<Order> orderOpt = orderService.getOrderWithItems(orderId);
        if (orderOpt.isEmpty()) {
            System.out.println("Order not found: " + orderId);
            return;
        }
        printOrderDetails(orderOpt.get());
    }

    private void handleStatus(String[] parts) {
        String orderId = parts.length > 1 ? parts[1] : promptRequired("Order id");
        Optional<Order> orderOpt = orderService.getOrderById(orderId);
        if (orderOpt.isEmpty()) {
            System.out.println("Order not found: " + orderId);
            return;
        }
        Order order = orderOpt.get();
        System.out.printf("Order %s status: %s%n", order.getId(), order.getStatus());
    }

    private void handleWatch(String[] parts) {
        String orderId = parts.length > 1 ? parts[1] : promptRequired("Order id");
        long seconds = 40;
        if (parts.length > 2) {
            try {
                seconds = Long.parseLong(parts[2]);
            } catch (NumberFormatException ignored) {
                System.out.println("Invalid seconds value. Using default 40 seconds.");
            }
        }
        watchOrder(orderId, seconds);
    }

    private void watchOrder(String orderId, long seconds) {
        Optional<Order> orderOpt = orderService.getOrderById(orderId);
        if (orderOpt.isEmpty()) {
            System.out.println("Order not found: " + orderId);
            return;
        }
        Order.OrderStatus last = orderOpt.get().getStatus();
        System.out.println("Watching order " + orderId + ". Current status: " + last);
        long deadline = System.currentTimeMillis() + (seconds * 1000L);
        while (System.currentTimeMillis() < deadline) {
            if (last == Order.OrderStatus.DELIVERED || last == Order.OrderStatus.CANCELLED) break;
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                break;
            }
            Optional<Order> current = orderService.getOrderById(orderId);
            if (current.isEmpty()) {
                System.out.println("Order not found: " + orderId);
                return;
            }
            Order.OrderStatus status = current.get().getStatus();
            if (status != last) {
                last = status;
                System.out.println("Status updated: " + status);
            }
        }
    }

    private void handlePay(String[] parts) {
        String orderId = parts.length > 1 ? parts[1] : promptRequired("Order id");
        String method = prompt("Payment method (credit-card/paypal/cash)", "cash").toLowerCase(Locale.ROOT);
        PaymentStrategy strategy;
        switch (method) {
            case "credit-card":
                String number = promptRequired("Card number");
                String expiry = promptRequired("Card expiry (MM/YY)");
                String cvv = promptRequired("Card CVV");
                strategy = new CreditCardPaymentStrategy(number, expiry, cvv);
                break;
            case "paypal":
                String email = promptRequired("PayPal email");
                String password = promptRequired("PayPal password");
                strategy = new PayPalPaymentStrategy(email, password);
                break;
            case "cash":
            default:
                strategy = new CashOnDeliveryPaymentStrategy();
                break;
        }
        boolean ok = orderService.processPayment(orderId, strategy);
        System.out.println(ok ? "Payment processed successfully." : "Payment processing failed.");
    }

    private void handleDiscount(String[] parts) {
        String orderId = parts.length > 1 ? parts[1] : promptRequired("Order id");
        DiscountStrategy strategy = promptDiscountStrategy();
        try {
            double total = orderService.applyDiscount(orderId, strategy);
            System.out.printf("Discount applied. New total: %.2f%n", total);
        } catch (Exception e) {
            System.out.println("Failed to apply discount: " + e.getMessage());
        }
    }

    private void handlePromo(String[] parts) {
        String orderId = parts.length > 1 ? parts[1] : promptRequired("Order id");
        String code = parts.length > 2 ? parts[2] : promptRequired("Promo code");
        if (code == null || code.isBlank()) {
            System.out.println("Promo code required.");
            return;
        }
        String normalized = code.toUpperCase(Locale.ROOT);
        Optional<DiscountCode> opt = discountRepo.findById(normalized);
        if (opt.isEmpty() || !opt.get().isActive()) {
            System.out.println("Invalid or inactive promo code.");
            return;
        }
        DiscountCode dc = opt.get();
        DiscountStrategy strategy = dc.getType() == DiscountCode.Type.PERCENT
                ? new PercentageDiscountStrategy(dc.getValue())
                : new FlatDiscountStrategy(dc.getValue());
        try {
            double total = orderService.applyDiscount(orderId, strategy);
            orderService.updatePromoCode(orderId, normalized);
            System.out.printf("Promo applied. New total: %.2f%n", total);
        } catch (Exception e) {
            System.out.println("Failed to apply promo: " + e.getMessage());
        }
    }

    private void handleAddRestaurant() {
        Restaurant r = new Restaurant();
        r.setName(promptRequired("Name"));
        r.setDescription(prompt("Description", ""));
        r.setAddress(prompt("Address", ""));
        r.setPhoneNumber(prompt("Phone number", ""));
        r.setCuisineType(prompt("Cuisine type", ""));
        r.setPrimaryType(promptDishType("Primary dish type", DishType.VEGETARIAN));
        r.setImage(prompt("Image URL", ""));
        String ratingInput = prompt("Rating (0-5)", "0");
        try {
            r.setRating(Double.parseDouble(ratingInput));
        } catch (NumberFormatException ignored) {
            r.setRating(0);
        }
        Restaurant saved = restaurantService.addRestaurant(r);
        System.out.println("Restaurant added with id: " + saved.getId());
    }

    private void handleAddDish(String[] parts) {
        String restaurantId = parts.length > 1 ? parts[1] : promptRequired("Restaurant id");
        Dish dish = new Dish();
        dish.setName(promptRequired("Dish name"));
        dish.setDescription(prompt("Description", ""));
        dish.setType(promptDishType("Dish type", DishType.VEGETARIAN));
        dish.setPrice(promptDouble("Price", 0.0));
        boolean success = restaurantService.addDishToRestaurant(restaurantId, dish);
        System.out.println(success ? "Dish added." : "Restaurant not found.");
    }

    private List<OrderCreateRequest.Item.Extra> promptExtras(String restaurantId, Dish dish) {
        List<ToppingOption> options = addonService.getToppingsForRestaurant(restaurantId);
        Map<String, ToppingOption> compatible = new HashMap<>();
        for (ToppingOption option : options) {
            if (option.supports(dish.getType())) {
                compatible.put(option.getId(), option);
            }
        }
        if (compatible.isEmpty()) {
            return List.of();
        }
        System.out.println("Available toppings for " + dish.getName() + ":");
        for (ToppingOption option : compatible.values()) {
            System.out.printf("  %s | %s | %.2f%n", option.getId(), option.getName(), option.getPrice());
        }
        String input = prompt("Extra topping ids (comma separated)", "");
        if (input == null || input.isBlank()) {
            return List.of();
        }
        String[] ids = input.split(",");
        List<OrderCreateRequest.Item.Extra> extras = new ArrayList<>();
        for (String raw : ids) {
            String id = raw.trim();
            if (id.isEmpty() || !compatible.containsKey(id)) {
                continue;
            }
            OrderCreateRequest.Item.Extra extra = new OrderCreateRequest.Item.Extra();
            extra.setId(id);
            extras.add(extra);
        }
        return extras;
    }

    private void printOrderDetails(Order order) {
        System.out.printf("Order %s | %s | total %.2f | %s%n",
                order.getId(),
                safeValue(order.getRestaurantName()),
                order.getTotalAmount(),
                order.getStatus());
        if (order.getItems() == null || order.getItems().isEmpty()) {
            System.out.println("No items.");
            return;
        }
        for (OrderItem item : order.getItems()) {
            Dish dish = item.getDish();
            String dishName = dish != null ? dish.getName() : "Unknown dish";
            System.out.printf("- %s x%d%n", dishName, item.getQuantity());
            if (item.getExtras() != null && !item.getExtras().isEmpty()) {
                for (OrderItemExtra extra : item.getExtras()) {
                    System.out.printf("  + %s (%.2f)%n", extra.getName(), extra.getPrice());
                }
            }
        }
    }

    private DiscountStrategy promptDiscountStrategy() {
        String type = prompt("Discount (none/percent/flat)", "none").toLowerCase(Locale.ROOT);
        switch (type) {
            case "percent":
            case "percentage":
                double percent = promptDouble("Percent", 10.0);
                return new PercentageDiscountStrategy(percent);
            case "flat":
                double amount = promptDouble("Flat amount", 5.0);
                return new FlatDiscountStrategy(amount);
            case "none":
            default:
                return new NoDiscountStrategy();
        }
    }

    private DishType promptDishType(String label, DishType defaultType) {
        while (true) {
            String input = prompt(label + " (VEGETARIAN/NON_VEGETARIAN/VEGAN/GLUTEN_FREE)", defaultType.name());
            DishType type = parseDishType(input);
            if (type != null) return type;
            System.out.println("Invalid dish type.");
        }
    }

    private DishType parseDishType(String raw) {
        if (raw == null) return null;
        String normalized = raw.trim().toUpperCase(Locale.ROOT).replace('-', '_');
        if (normalized.equals("VEG")) normalized = "VEGETARIAN";
        if (normalized.equals("NONVEG") || normalized.equals("NON_VEG")) normalized = "NON_VEGETARIAN";
        if (normalized.equals("GF")) normalized = "GLUTEN_FREE";
        try {
            return DishType.valueOf(normalized);
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    private String formatTypes(java.util.Set<DishType> types) {
        if (types == null || types.isEmpty()) return "ALL";
        return types.toString();
    }

    private String readLine(String prompt) {
        System.out.print(prompt);
        try {
            return scanner.nextLine();
        } catch (NoSuchElementException e) {
            return null;
        }
    }

    private String prompt(String label, String defaultValue) {
        String prompt = defaultValue == null
                ? label + ": "
                : label + " [" + defaultValue + "]: ";
        String line = readLine(prompt);
        if (line == null) return defaultValue;
        line = line.trim();
        return line.isEmpty() ? defaultValue : line;
    }

    private String promptRequired(String label) {
        while (true) {
            String value = prompt(label, null);
            if (value != null && !value.isBlank()) return value.trim();
            System.out.println(label + " is required.");
        }
    }

    private int promptInt(String label, int defaultValue) {
        while (true) {
            String value = prompt(label, String.valueOf(defaultValue));
            try {
                return Integer.parseInt(value);
            } catch (NumberFormatException ignored) {
                System.out.println("Invalid number. Try again.");
            }
        }
    }

    private double promptDouble(String label, double defaultValue) {
        while (true) {
            String value = prompt(label, String.valueOf(defaultValue));
            try {
                return Double.parseDouble(value);
            } catch (NumberFormatException ignored) {
                System.out.println("Invalid number. Try again.");
            }
        }
    }

    private String safeValue(String value) {
        return value == null ? "" : value;
    }
}
