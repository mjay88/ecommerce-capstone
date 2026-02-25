package com.capstone.ecommerce.dto;

import java.math.BigDecimal;

public record PurchaseReportItem(
        String productName,
        String productDescription,
        Integer quantity,
        BigDecimal unitPrice,
        BigDecimal lineTotal
) {}

