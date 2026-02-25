package com.capstone.ecommerce.controller.admin;

import com.capstone.ecommerce.dao.OrderItemRepository;
import com.capstone.ecommerce.dao.ProductRepository;
import com.capstone.ecommerce.dto.InventoryReportRow;
import com.capstone.ecommerce.dto.PurchaseReportItem;
import com.capstone.ecommerce.dto.PurchaseReportOrder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/reports")
@CrossOrigin
public class AdminReportController {

    private final ProductRepository productRepo;
    private final OrderItemRepository orderItemRepo;

    public AdminReportController(ProductRepository productRepo,
                                 OrderItemRepository orderItemRepo) {
        this.productRepo = productRepo;
        this.orderItemRepo = orderItemRepo;
    }

    @GetMapping("/inventory")
    public List<InventoryReportRow> inventoryReport() {
        return productRepo.inventoryReport();
    }


    @GetMapping("/purchases")
    public List<PurchaseReportOrder> purchasesReport() {

        List<Object[]> rows = orderItemRepo.purchaseReport();

        // Group rows by order (tracking number + created date + email)
        record Key(String trackingNumber, Date dateCreated, String email) {}

        Map<Key, List<Object[]>> grouped = rows.stream()
                .collect(Collectors.groupingBy(r -> new Key(
                        (String) r[0],   // orderTrackingNumber
                        (Date) r[1],     // dateCreated
                        (String) r[2]    // customerEmail
                )));

        // Build one PurchaseReportOrder per group, newest first
        return grouped.entrySet().stream()
                .map(entry -> {
                    Key key = entry.getKey();
                    List<Object[]> groupRows = entry.getValue();

                    List<PurchaseReportItem> items = groupRows.stream()
                            .map(r -> new PurchaseReportItem(
                                    (String) r[3],            // productName
                                    (String) r[4],            // productDescription
                                    (Integer) r[5],           // quantity
                                    (BigDecimal) r[6],        // unitPrice
                                    (BigDecimal) r[7]         // lineTotal
                            ))
                            .toList();

                    int totalQuantity = items.stream()
                            .mapToInt(PurchaseReportItem::quantity)
                            .sum();

                    BigDecimal totalPrice = items.stream()
                            .map(PurchaseReportItem::lineTotal)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);

                    return new PurchaseReportOrder(
                            key.trackingNumber(),
                            key.dateCreated(),
                            key.email(),
                            totalQuantity,
                            totalPrice,
                            items
                    );
                })
                .sorted((a, b) -> b.dateCreated().compareTo(a.dateCreated()))
                .toList();
    }
}
