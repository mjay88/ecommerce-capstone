package com.capstone.ecommerce.dto;

import java.math.BigDecimal;

public record InventoryReportRow(
        Long productId,
        String name,
        String sku,
        BigDecimal unitPrice,
        Integer unitsInStock,
        Boolean active,
        String categoryName,
        String imageUrl
) {}
