package com.capstone.ecommerce.service;

import com.capstone.ecommerce.dto.PaymentInfo;
import com.capstone.ecommerce.dto.Purchase;
import com.capstone.ecommerce.dto.PurchaseResponse;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;

public interface CheckoutService {

    PurchaseResponse placeOrder(Purchase purchase);

    PaymentIntent createPaymentIntent(PaymentInfo paymentInfo)throws StripeException;
}
