package com.capstone.ecommerce.dao;

import com.capstone.ecommerce.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    @Query("""
        select
            o.orderTrackingNumber,
            o.dateCreated,
            c.email,
            p.name,
            p.description,
            oi.quantity,
            oi.unitPrice,
            (oi.unitPrice * oi.quantity)
        from OrderItem oi
        join oi.order o
        join o.customer c
        join Product p on p.id = oi.productId
        order by o.dateCreated desc, o.id desc
    """)
    List<Object[]> purchaseReport();
}
