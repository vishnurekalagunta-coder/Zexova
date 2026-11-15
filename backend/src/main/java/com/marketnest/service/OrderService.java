package com.marketnest.service;

import com.marketnest.entity.Order;
import java.util.List;
import java.util.Optional;

public interface OrderService {
    Order createOrder(Order order);
    List<Order> getOrdersByUserId(Long userId);
    List<Order> getAllOrders();
    Optional<Order> getOrderByNumber(String orderNumber);
}

