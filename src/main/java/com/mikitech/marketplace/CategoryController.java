package com.mikitech.marketplace;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "*")
public class CategoryController {

    @Autowired
    private CategoryRepository categoryRepository;

    @GetMapping
    public List<CategoryEntity> getAllCategories() {
        return categoryRepository.findAll();
    }

    @PostMapping
    public CategoryEntity createCategory(@RequestBody CategoryEntity category) {
        return categoryRepository.save(category);
    }
}
