package com.mikitech.marketplace;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class MarketplaceController {

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public List<ProductEntity> getAllProducts() {
        return productRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductEntity> getProduct(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ProductEntity createProduct(@RequestBody ProductEntity product) {
        return productRepository.save(product);
    }

    @PutMapping("/{id}")
    public ProductEntity updateProduct(@PathVariable Long id, @RequestBody ProductEntity product) {
        ProductEntity existing = productRepository.findById(id).orElseThrow();
        existing.setName(product.getName());
        existing.setSlug(product.getSlug());
        existing.setDescription(product.getDescription());
        existing.setSku(product.getSku());
        existing.setPrice(product.getPrice());
        existing.setStock(product.getStock());
        existing.setImageUrl(product.getImageUrl());
        existing.setActive(product.getActive());
        existing.setProviderId(product.getProviderId());
        return productRepository.save(existing);
    }

    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Long id) {
        productRepository.deleteById(id);
    }
}
