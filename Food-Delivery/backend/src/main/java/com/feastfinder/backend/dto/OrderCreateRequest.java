package com.feastfinder.backend.dto;

import java.util.List;

public class OrderCreateRequest {
    private String userId;
    private String restaurantId;
    private List<Item> items;
    private String deliveryAddress;
    private String contactPhone;
    private String instructions;
    private String paymentMethod;
    private String discountStrategy;
    private Double discountAmount;
    private String promoCode;

    public static class Item {
        private String id;
        private Integer quantity;
        private List<Extra> extras;

        public static class Extra {
            private String id;

            public String getId() { return id; }
            public void setId(String id) { this.id = id; }
        }

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
        public List<Extra> getExtras() { return extras; }
        public void setExtras(List<Extra> extras) { this.extras = extras; }
    }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getRestaurantId() { return restaurantId; }
    public void setRestaurantId(String restaurantId) { this.restaurantId = restaurantId; }
    public List<Item> getItems() { return items; }
    public void setItems(List<Item> items) { this.items = items; }
    public String getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }
    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }
    public String getInstructions() { return instructions; }
    public void setInstructions(String instructions) { this.instructions = instructions; }
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    public String getDiscountStrategy() { return discountStrategy; }
    public void setDiscountStrategy(String discountStrategy) { this.discountStrategy = discountStrategy; }
    public Double getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(Double discountAmount) { this.discountAmount = discountAmount; }
    public String getPromoCode() { return promoCode; }
    public void setPromoCode(String promoCode) { this.promoCode = promoCode; }
}
