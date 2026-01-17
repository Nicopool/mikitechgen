package com.mikitech.marketplace;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @GetMapping
    public List<OrderEntity> getAllOrders() {
        return orderRepository.findAll();
    }

    @GetMapping("/user/{userId}")
    public List<OrderEntity> getOrdersByUser(@PathVariable Long userId) {
        return orderRepository.findByUserId(userId);
    }

    @PostMapping
    public OrderEntity createOrder(@RequestBody OrderEntity order) {
        order.setCreatedAt(LocalDateTime.now());
        if (order.getStatus() == null)
            order.setStatus("CREATED");
        return orderRepository.save(order);
    }

    @PutMapping("/{id}/status")
    public OrderEntity updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        OrderEntity order = orderRepository.findById(id).orElseThrow();
        order.setStatus(body.get("status"));
        order.setUpdatedAt(LocalDateTime.now());
        return orderRepository.save(order);
    }
}
