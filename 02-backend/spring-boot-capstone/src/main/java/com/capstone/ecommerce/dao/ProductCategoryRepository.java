package com.capstone.ecommerce.dao;

import com.capstone.ecommerce.entity.ProductCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;


//DAO - Data Access Object - gateway to the database, Spring Data Rest automatically exposes the GET /product-category endpoint
//extends JpaRepository<ProductCategory,Long> - automatic crud methods out of the box

@RepositoryRestResource(collectionResourceRel = "productCategory", path = "product-category")
public interface ProductCategoryRepository extends JpaRepository<ProductCategory,Long> {
}
