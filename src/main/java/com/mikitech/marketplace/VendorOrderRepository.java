package com.mikitech.marketplace;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VendorOrderRepository extends JpaRepository<VendorOrderEntity, Long> {
    List<VendorOrderEntity> findByProviderId(Long providerId);
}
