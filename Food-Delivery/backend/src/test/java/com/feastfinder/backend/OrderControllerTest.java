package com.feastfinder.backend;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class OrderControllerTest {
    @Autowired
    MockMvc mvc;
    @Autowired
    ObjectMapper mapper;

    @Test
    void fullOrderFlow_create_pay_discount_updateStatus() throws Exception {
        // Register and obtain token
        String registerPayload = """
            {"username":"testuser","email":"test@ex.com","password":"Passw0rd!"}
            """;
        String regResp = mvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(registerPayload))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        String token = mapper.readTree(regResp).get("token").asText();

        // Create order
        String createPayload = """
            {
              "userId":"user1",
              "restaurantId":"rest1",
              "items":[{"id":"dish1","quantity":1}],
              "deliveryAddress":"123 Main",
              "contactPhone":"1234567890"
            }
            """;
        String createResp = mvc.perform(post("/api/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + token)
                        .content(createPayload))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        JsonNode order = mapper.readTree(createResp);
        String orderId = order.get("id").asText();
        double total = order.get("totalAmount").asDouble();
        assertThat(orderId).startsWith("ORD-");

        // Process payment
        String paymentPayload = """
            {
              "paymentMethod":"credit-card",
              "cardNumber":"4111111111111111",
              "cardExpiry":"12/30",
              "cardCvv":"123"
            }
            """;

        mvc.perform(post("/api/orders/" + orderId + "/payment")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + token)
                        .content(paymentPayload))
                .andExpect(status().isOk())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("success")));

        // Apply discount
        String discountPayload = "{\"discountType\":\"percentage\"}";
        String discountResp = mvc.perform(post("/api/orders/" + orderId + "/discount")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + token)
                        .content(discountPayload))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        double discounted = mapper.readValue(discountResp, Double.class);
        assertThat(discounted).isLessThan(total);

        // Update status
        String statusPayload = "{\"status\":\"PREPARING\"}";
        mvc.perform(put("/api/orders/" + orderId + "/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + token)
                        .content(statusPayload))
                .andExpect(status().isOk())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("updated")));
    }
}
