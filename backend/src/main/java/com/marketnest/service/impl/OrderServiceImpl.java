package com.marketnest.service.impl;

import com.marketnest.entity.Order;
import com.marketnest.repository.OrderRepository;
import com.marketnest.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Override
    public Order createOrder(Order order) {
        if (order.getOrderNumber() == null) {
            order.setOrderNumber("MN-" + (int)(100000 + Math.random() * 900000));
        }
        order.setCreatedAt(LocalDateTime.now());
        order.setOrderStatus("CONFIRMED");
        order.setPaymentStatus("PAID");

        if (order.getItems() != null) {
            order.getItems().forEach(item -> item.setOrder(order));
        }

        return orderRepository.save(order);
    }

    @Override
    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    public Optional<Order> getOrderByNumber(String orderNumber) {
        return orderRepository.findByOrderNumber(orderNumber);
    }
}

