package com.capstone.ecommerce.service;

import com.capstone.ecommerce.dao.CustomerRepository;
import com.capstone.ecommerce.dto.PaymentInfo;
import com.capstone.ecommerce.dto.Purchase;
import com.capstone.ecommerce.dto.PurchaseResponse;

import com.capstone.ecommerce.entity.Customer;
import com.capstone.ecommerce.entity.Order;
import com.capstone.ecommerce.entity.OrderItem;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class CheckoutServiceImpl implements CheckoutService {

    private CustomerRepository customerRepository;


    public CheckoutServiceImpl(CustomerRepository customerRepository, @Value("${stripe.key.secret}") String secretKey) {

        this.customerRepository = customerRepository;
        //initialize stripe API with secret key
        Stripe.apiKey = secretKey;
    }

    @Override
    @Transactional
    public PurchaseResponse placeOrder(Purchase purchase) {

        //retrive the order info from dto
        Order order = purchase.getOrder();
        //generate tracking number
        String orderTrackingNumber = generateOrderTrackingNumber();
        order.setOrderTrackingNumber(orderTrackingNumber);
        //populate order with orderItems
        Set<OrderItem> orderItems = purchase.getOrderItems();
        orderItems.forEach(item -> order.add(item));
        //populate order with billingAddress and shippingAddress
        order.setBillingAddress(purchase.getBillingAddress());
        order.setShippingAddress(purchase.getShippingAddress());
       //populate customer with order
        Customer customer = purchase.getCustomer();

        //check if this is an existing customer
        String theEmail = customer.getEmail();

        Customer customerFromDB = customerRepository.findByEmail(theEmail);

        if(customerFromDB != null){
            //we found them, assing them accoridngly
            customer = customerFromDB;
        }

        customer.add(order);

        //save to the database
        customerRepository.save(customer);
        //return a response

        return new PurchaseResponse(orderTrackingNumber);

    }

    @Override
    public PaymentIntent createPaymentIntent(PaymentInfo paymentInfo) throws StripeException {
        List<String> paymentMethodTypes = new ArrayList<>();
        paymentMethodTypes.add("card");

        Map<String, Object> params = new HashMap<>();
        params.put("amount", paymentInfo.getAmount());
        params.put("currency", paymentInfo.getCurrency());
        params.put("payment_method_types", paymentMethodTypes);
        params.put("description", "Crescent Moon Artworks");
        return PaymentIntent.create(params);
    }

    private String generateOrderTrackingNumber() {

        //generate unique id (UUID)
        return UUID.randomUUID().toString();
    }
}
