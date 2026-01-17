package com.mikitech.marketplace;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "vendor_orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VendorOrderEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_id")
    private Long orderId;

    @Column(name = "provider_id")
    private Long providerId;

    private String status;

    @Column(name = "total_amount")
    private Double totalAmount;

    @Column(name = "tracking_number")
    private String trackingNumber;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
