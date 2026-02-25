package com.capstone.ecommerce.controller.admin;

import com.capstone.ecommerce.dao.ProductCategoryRepository;
import com.capstone.ecommerce.dao.ProductRepository;
import com.capstone.ecommerce.entity.Product;
import com.capstone.ecommerce.entity.ProductCategory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.capstone.ecommerce.service.CloudinaryService;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpStatus;


import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/products")
@CrossOrigin
public class AdminProductController {

    private final ProductRepository productRepo;
    private final ProductCategoryRepository categoryRepo;

    private final CloudinaryService cloudinaryService;


    public AdminProductController(ProductRepository productRepo,
                                  ProductCategoryRepository categoryRepo, CloudinaryService cloudinaryService) {
        this.productRepo = productRepo;
        this.categoryRepo = categoryRepo;
        this.cloudinaryService = cloudinaryService;
    }

    // GET /api/admin/products
    @GetMapping
    public List<Product> getAll() {
        return productRepo.findAll();
    }

    // GET /api/admin/products/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Product> getById(@PathVariable Long id) {
        return productRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // POST /api/admin/products
    @PostMapping
    public ResponseEntity<?> create(@RequestBody Product incoming) {

        // prevent accidental overwrite
        incoming.setId(null);

        // validate category exists
        if (incoming.getCategory() == null || incoming.getCategory().getId() == null) {
            return ResponseEntity.badRequest().body("category.id is required");
        }

        Optional<ProductCategory> catOpt = categoryRepo.findById(incoming.getCategory().getId());
        if (catOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid category.id");
        }

        incoming.setCategory(catOpt.get());

        Product saved = productRepo.save(incoming);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // PUT /api/admin/products/{id}
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Product incoming) {

        Optional<Product> existingOpt = productRepo.findById(id);
        if (existingOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Product existing = existingOpt.get();

        // update allowed fields (adjust names to match your entity)
        existing.setName(incoming.getName());
        existing.setDescription(incoming.getDescription());
        existing.setUnitPrice(incoming.getUnitPrice());
        existing.setUnitsInStock(incoming.getUnitsInStock());
        existing.setActive(incoming.isActive());

        // category update (optional but supported)
        if (incoming.getCategory() != null && incoming.getCategory().getId() != null) {
            Optional<ProductCategory> catOpt = categoryRepo.findById(incoming.getCategory().getId());
            if (catOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Invalid category.id");
            }
            existing.setCategory(catOpt.get());
        }

        // image_url is NOT set here (Phase 3 endpoint handles it)
        Product saved = productRepo.save(existing);
        return ResponseEntity.ok(saved);
    }

    // DELETE /api/admin/products/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {

        if (!productRepo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        productRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }


    // POST /api/admin/products/{id}/image
    @PostMapping("/{id}/image")
    public ResponseEntity<?> uploadImage(@PathVariable Long id,
                                         @RequestParam("image") MultipartFile image) {
        try {
            Optional<Product> productOpt = productRepo.findById(id);
            if (productOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Product product = productOpt.get();

            // Upload to Cloudinary
            String imageUrl = cloudinaryService.uploadProductImage(image);

            // Save URL in DB
            product.setImageUrl(imageUrl);
            Product saved = productRepo.save(product);

            return ResponseEntity.ok(saved);

        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Image upload failed: " + ex.getMessage());
        }
    }

}
