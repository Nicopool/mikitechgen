package com.mikitech.marketplace;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/kits")
@CrossOrigin(origins = "*")
public class KitController {

    @Autowired
    private KitRepository kitRepository;

    @GetMapping
    public List<KitEntity> getAllKits() {
        return kitRepository.findAll();
    }

    @GetMapping("/vendor/{vendorId}")
    public List<KitEntity> getKitsByVendor(@PathVariable Long vendorId) {
        return kitRepository.findByProviderId(vendorId);
    }

    @PostMapping
    public KitEntity createKit(@RequestBody KitEntity kit) {
        return kitRepository.save(kit);
    }

    @DeleteMapping("/{id}")
    public void deleteKit(@PathVariable Long id) {
        kitRepository.deleteById(id);
    }
}
