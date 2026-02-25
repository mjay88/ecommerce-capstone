package com.capstone.ecommerce.controller.admin;

import com.capstone.ecommerce.dao.ProductCategoryRepository;
import com.capstone.ecommerce.dao.ProductRepository;
import com.capstone.ecommerce.entity.ProductCategory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/categories")
@CrossOrigin // keep simple for now; later we can tighten to your Angular origin
public class AdminCategoryController {

    private final ProductCategoryRepository categoryRepo;
    private final ProductRepository productRepo;

    public AdminCategoryController(ProductCategoryRepository categoryRepo,
                                   ProductRepository productRepo) {
        this.categoryRepo = categoryRepo;
        this.productRepo = productRepo;
    }

    // GET /api/admin/categories
    @GetMapping
    public List<ProductCategory> getAll() {
        return categoryRepo.findAll();
    }

    // GET /api/admin/categories/{id}
    @GetMapping("/{id}")
    public ResponseEntity<ProductCategory> getById(@PathVariable Long id) {
        return categoryRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // POST /api/admin/categories
    @PostMapping
    public ResponseEntity<ProductCategory> create(@RequestBody ProductCategory category) {
        // ensure create doesn't accidentally overwrite
        category.setId(null);
        ProductCategory saved = categoryRepo.save(category);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // PUT /api/admin/categories/{id}
    @PutMapping("/{id}")
    public ResponseEntity<ProductCategory> update(@PathVariable Long id,
                                                  @RequestBody ProductCategory incoming) {

        Optional<ProductCategory> existingOpt = categoryRepo.findById(id);
        if (existingOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        ProductCategory existing = existingOpt.get();
        existing.setCategoryName(incoming.getCategoryName());

        ProductCategory saved = categoryRepo.save(existing);
        return ResponseEntity.ok(saved);
    }

    // DELETE /api/admin/categories/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {

        if (!categoryRepo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        // Prevent delete if products reference this category
        long productCount = productRepo.countByCategoryId(id);
        if (productCount > 0) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Cannot delete category: products exist in this category.");
        }

        categoryRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
