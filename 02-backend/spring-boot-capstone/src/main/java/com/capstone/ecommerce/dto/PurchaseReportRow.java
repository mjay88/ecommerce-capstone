package com.capstone.ecommerce.dto;

import java.math.BigDecimal;
import java.util.Date;

public record PurchaseReportRow(
        String orderTrackingNumber,
        Date orderDateCreated,
        String customerEmail,
        String productName,
        String productDescription,
        Integer quantity,
        BigDecimal unitPrice,
        BigDecimal lineTotal
) {}
