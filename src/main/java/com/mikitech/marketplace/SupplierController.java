package com.mikitech.marketplace;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/supplier")
@CrossOrigin(origins = "*")
public class SupplierController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private VendorOrderRepository vendorOrderRepository;

    @GetMapping("/{vendorId}/stats")
    public Map<String, Object> getVendorStats(@PathVariable Long vendorId) {
        Map<String, Object> stats = new HashMap<>();
        stats.put("monthlySales", 4250.0); // Placeholder
        stats.put("pendingOrders", vendorOrderRepository.findByProviderId(vendorId).size());
        stats.put("activeProducts", productRepository.findByProviderId(vendorId).size());
        stats.put("criticalStock", 2);
        return stats;
    }

    @GetMapping("/{vendorId}/products")
    public List<ProductEntity> getVendorProducts(@PathVariable Long vendorId) {
        return productRepository.findByProviderId(vendorId);
    }
}
