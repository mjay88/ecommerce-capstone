package com.capstone.ecommerce.dao;

import com.capstone.ecommerce.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import com.capstone.ecommerce.dto.InventoryReportRow;
import org.springframework.data.jpa.repository.Query;
import java.util.List;



//DAO - Data Access Object - gateway to the database, Spring Data Rest automatically exposes the GET /product endpoint
//extends JpaRepository<ProductCategory,Long> - automatic crud methods out of the box

@RepositoryRestResource
public interface ProductRepository extends JpaRepository<Product,Long> {
// like a mongoDB method
    Page<Product> findByCategoryId(@Param("id") Long id, Pageable pageable);

    Page<Product> findByNameContaining(@Param("name") String name, Pageable pageable);

    long countByCategoryId(Long categoryId);

    @Query("""
    select new com.capstone.ecommerce.dto.InventoryReportRow(
        p.id,
        p.name,
        p.sku,
        p.unitPrice,
        p.unitsInStock,
        p.active,
        c.categoryName,
        p.imageUrl
    )
    from Product p
    join p.category c
    order by c.categoryName asc, p.name asc
""")
    List<InventoryReportRow> inventoryReport();



}
