package com.capstone.ecommerce.controller.admin;

import com.capstone.ecommerce.dao.ProductCategoryRepository;
import com.capstone.ecommerce.dao.ProductRepository;
import com.capstone.ecommerce.entity.ProductCategory;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AdminCategoryController.class)
class AdminCategoryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProductCategoryRepository categoryRepo;

    @MockBean
    private ProductRepository productRepo;
//Test 1: GET  returns empty array when no categories exist
    @Test
    void getAll_whenEmpty_returnsEmptyArray() throws Exception {
        when(categoryRepo.findAll()).thenReturn(List.of());

        mockMvc.perform(get("/api/admin/categories"))
                //status we expect = 200
                .andExpect(status().isOk())
                //expect an empty array
                .andExpect(content().json("[]"));

        verify(categoryRepo).findAll();
    }
//Test 2: DELETE returns correct code when categories is empty
    @Test
    void delete_whenNoProducts_deletesAndReturns204() throws Exception {
        long id = 123L;

        when(categoryRepo.existsById(id)).thenReturn(true);
        when(productRepo.countByCategoryId(id)).thenReturn(0L);
        //attempt to delete empty category (no products)
        mockMvc.perform(delete("/api/admin/categories/{id}", id))
                //status expected = 204 delete successful
                .andExpect(status().isNoContent());

        verify(categoryRepo).deleteById(id);
    }

//Test 3: DELETE fails when products exist in categories
    @Test
    void delete_whenProductsExist_returns409() throws Exception {
        long id = 123L;

        when(categoryRepo.existsById(id)).thenReturn(true);
        when(productRepo.countByCategoryId(id)).thenReturn(2L);
            //attempt to delete category with products in it
        mockMvc.perform(delete("/api/admin/categories/{id}", id))
                //status expected = 409 conflict
                .andExpect(status().isConflict())
                .andExpect(content().string("Cannot delete category: products exist in this category."));

        verify(categoryRepo, never()).deleteById(id);
    }
}