package com.capstone.ecommerce.dto;

import java.util.Date;
import java.util.List;
import java.math.BigDecimal;

public record PurchaseReportOrder(
        String orderTrackingNumber,
        Date dateCreated,
        String customerEmail,
        Integer totalQuantity,
        BigDecimal totalPrice,
        List<PurchaseReportItem> items
) {}
