package com.capstone.ecommerce.dto;

import com.capstone.ecommerce.entity.Address;
import com.capstone.ecommerce.entity.Customer;
import com.capstone.ecommerce.entity.Order;
import com.capstone.ecommerce.entity.OrderItem;
import lombok.Data;

import java.util.Set;

@Data
public class Purchase {

    private Customer customer;
    private Address shippingAddress;
    private Address billingAddress;
    private Order order;
    private Set<OrderItem> orderItems;
}
