package com.marketnest.controller;

import com.marketnest.entity.Order;
import com.marketnest.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    public ResponseEntity<Order> create(@RequestBody Order order) {
        return ResponseEntity.ok(orderService.createOrder(order));
    }

    @GetMapping
    public ResponseEntity<List<Order>> getAll() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(orderService.getOrdersByUserId(userId));
    }

    @GetMapping("/number/{orderNumber}")
    public ResponseEntity<Order> getByNumber(@PathVariable String orderNumber) {
        return orderService.getOrderByNumber(orderNumber)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}

