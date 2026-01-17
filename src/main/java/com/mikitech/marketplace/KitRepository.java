package com.mikitech.marketplace;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface KitRepository extends JpaRepository<KitEntity, Long> {
    List<KitEntity> findByProviderId(Long providerId);
}
