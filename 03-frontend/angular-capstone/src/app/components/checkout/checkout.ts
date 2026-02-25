import { CartService } from './../../services/cart';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { firstValueFrom, zip } from 'rxjs';
import { CheckoutForm } from '../../services/checkout-form';
import { Checkout as CheckoutService } from '../../services/checkout';
import { Country } from '../../common/country';
import { State } from '../../common/state';
import { CheckoutFormValidators } from '../../validators/checkout-form-validators';
import { Router } from '@angular/router';
import { Order } from '../../common/order';
import { OrderItem } from '../../common/order-item';
import { Purchase } from '../../common/purchase';
import { AuthService } from '@auth0/auth0-angular';
import { environment } from '../../../environments/environment';
import { PaymentInfo } from '../../common/payment-info';

@Component({
  selector: 'app-checkout',
  standalone: false,
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout {
  checkoutFormGroup!: FormGroup;
  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  //missing
  // storage: Storage = sessionStorage;

  //initialize strip api
  stripe = Stripe(environment.stripePublishableKey);

  paymentInfo: PaymentInfo = new PaymentInfo();
  cardElement: any;
  displayError: any = '';

  isDisabled: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private checkoutFormService: CheckoutForm,
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private router: Router,
    private auth: AuthService,
  ) {}

  ngOnInit(): void {
    //setup stripe payment form
    this.setupStripePaymentForm();

    this.reviewCartDetails();

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CheckoutFormValidators.notOnlyWhitespace,
        ]),
        lastName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CheckoutFormValidators.notOnlyWhitespace,
        ]),
        email: new FormControl('', [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ]),
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CheckoutFormValidators.notOnlyWhitespace,
        ]),
        city: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CheckoutFormValidators.notOnlyWhitespace,
        ]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CheckoutFormValidators.notOnlyWhitespace,
        ]),
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CheckoutFormValidators.notOnlyWhitespace,
        ]),
        city: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CheckoutFormValidators.notOnlyWhitespace,
        ]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CheckoutFormValidators.notOnlyWhitespace,
        ]),
      }),
      // creditCard: this.formBuilder.group({
      //   cardType: new FormControl('', [Validators.required]),
      //   nameOnCard: new FormControl('', [
      //     Validators.required,
      //     Validators.minLength(2),
      //     CheckoutFormValidators.notOnlyWhitespace,
      //   ]),
      //   cardNumber: new FormControl('', [Validators.pattern('^[0-9]{16}$'), Validators.required]),
      //   securityCode: new FormControl('', [Validators.pattern('^[0-9]{3}$'), Validators.required]),
      //   expirationMonth: [''],
      //   expirationYear: [''],
      // }),
    });

    //popluate credit card months and years

    // const startMonth: number = new Date().getMonth() + 1;
    // console.log('startMonth: ' + startMonth);

    // this.checkoutFormService.getCreditCardMonths(startMonth).subscribe((data) => {
    //   console.log('Retrieved credit card months: ' + JSON.stringify(data));
    //   this.creditCardMonths = data;
    // });

    // this.checkoutFormService.getCreditCardYears().subscribe((data) => {
    //   console.log('Retrieved credit card years: ' + JSON.stringify(data));
    //   this.creditCardYears = data;
    // });

    //get countries
    this.checkoutFormService.getCountries().subscribe((data) => {
      console.log('Retrieved countries: ' + JSON.stringify(data));
      this.countries = data;
    });
  }

  setupStripePaymentForm() {
    //get a handle to stripe elements
    var elements = this.stripe.elements();
    //create a card element ... and hide the zip-code field
    this.cardElement = elements.create('card', { hidePostalCode: true });
    //add an instance of card UI component into the 'card-element' div
    this.cardElement.mount('#card-element');
    //add event binding for the 'change' event on the card element
    this.cardElement.on('change', (event: any) => {
      //get a handle to card-errors element
      this.displayError = document.getElementById('card-errors');
      if (event.complete) {
        this.displayError.textContent = '';
      } else if (event.error) {
        this.displayError.textContent = event.error.message;
      }
    });
  }

  reviewCartDetails() {
    //subscribe to carService.totalQuantity
    this.cartService.totalQuantity.subscribe(
      (totalQuantity) => (this.totalQuantity = totalQuantity),
    );
    //subscribe to cartSERvice.totalPrice
    this.cartService.totalPrice.subscribe((totalPrice) => (this.totalPrice = totalPrice));
  }

  get firstName() {
    return this.checkoutFormGroup.get('customer.firstName');
  }

  get lastName() {
    return this.checkoutFormGroup.get('customer.lastName');
  }

  get email() {
    return this.checkoutFormGroup.get('customer.email');
  }

  get shippingAddressStreet() {
    return this.checkoutFormGroup.get('shippingAddress.street');
  }

  get shippingAddressCity() {
    return this.checkoutFormGroup.get('shippingAddress.city');
  }

  get shippingAddressState() {
    return this.checkoutFormGroup.get('shippingAddress.state');
  }

  get shippingAddressCountry() {
    return this.checkoutFormGroup.get('shippingAddress.country');
  }

  get shippingAddressZipCode() {
    return this.checkoutFormGroup.get('shippingAddress.zipCode');
  }

  get billingAddressStreet() {
    return this.checkoutFormGroup.get('billingAddress.street');
  }

  get billingAddressCity() {
    return this.checkoutFormGroup.get('billingAddress.city');
  }

  get billingAddressState() {
    return this.checkoutFormGroup.get('billingAddress.state');
  }

  get billingAddressCountry() {
    return this.checkoutFormGroup.get('billingAddress.country');
  }

  get billingAddressZipCode() {
    return this.checkoutFormGroup.get('billingAddress.zipCode');
  }

  get creditCardType() {
    return this.checkoutFormGroup.get('creditCard.cardType');
  }

  get creditCardNameOnCard() {
    return this.checkoutFormGroup.get('creditCard.nameOnCard');
  }

  get creditCardNumber() {
    return this.checkoutFormGroup.get('creditCard.cardNumber');
  }

  get creditCardSecurityCode() {
    return this.checkoutFormGroup.get('creditCard.securityCode');
  }

  copyShippingAddressToBillingAddress(event: any) {
    if (event.target.checked) {
      this.checkoutFormGroup.controls['billingAddress'].setValue(
        this.checkoutFormGroup.controls['shippingAddress'].value,
      );

      this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
      //reset
      this.billingAddressStates = [];
    }
  }

  async onSubmit() {
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    // Ensure user is logged in interactively if needed (prevents consent_required during API call)
    const isAuth = await firstValueFrom(this.auth.isAuthenticated$);
    //Do not need to be logged in to checkout
    // if (!isAuth) {
    //   await this.auth.loginWithRedirect();
    //   return;
    // }

    //set up order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;
    //get cart items
    const cartItems = this.cartService.cartItems;
    //create orderitems for cartitems
    let orderItems: OrderItem[] = cartItems.map((tempCartItem) => new OrderItem(tempCartItem));
    //set up purchase
    let purchase = new Purchase();
    //populate purchase - customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;
    //populate purchase - shipping address
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    //populate purchase - billing address
    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;
    //populate purchase - order and orderItems
    purchase.order = order;
    purchase.orderItems = orderItems;

    //compute payment info
    this.paymentInfo.amount = Math.round(this.totalPrice * 100);
    this.paymentInfo.currency = 'USD';

    //if valid form
    // create payment intent
    //confirm card payment
    //place order

    const hasStripeError = this.displayError?.textContent && this.displayError.textContent !== '';
    if (!this.checkoutFormGroup.invalid && !hasStripeError) {
      this.isDisabled = true;

      this.checkoutService
        .createPaymentIntent(this.paymentInfo)
        .subscribe((paymentIntentResponse) => {
          this.stripe
            .confirmCardPayment(
              paymentIntentResponse.client_secret,
              {
                payment_method: {
                  card: this.cardElement,
                  billing_details: {
                    email: purchase.customer.email,
                    name: `${purchase.customer.firstName} ${purchase.customer.lastName}`,
                    address: {
                      line1: purchase.billingAddress.street,
                      city: purchase.billingAddress.city,
                      state: purchase.billingAddress.state,
                      postal_code: purchase.billingAddress.zipCode,
                      country: this.billingAddressCountry?.value.code,
                    },
                  },
                },
              },
              { handleActions: false },
            )
            .then((result: any) => {
              if (result.error) {
                //inform the customer there was an error
                alert(`There was an error: ${result.error.message}`);
                this.isDisabled = false;
              } else {
                //call rest api via the checkout service
                this.checkoutService.placeOrder(purchase).subscribe({
                  next: (response: any) => {
                    alert(
                      `Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`,
                    );
                    //reset cart
                    this.resetCart();
                    this.isDisabled = false;
                  },
                  error: (err: any) => {
                    alert(`There was an error: ${err.message}`);
                    this.isDisabled = false;
                  },
                });
              }
            });
        });
    } else {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
  }
  resetCart() {
    //reset cart
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
    this.cartService.persistCartItems();

    //reset form
    this.checkoutFormGroup.reset();

    //navigate back to products page
    this.router.navigateByUrl('/products');
  }

  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup?.value.expirationYear);

    //if the current year equals the selecteed year, then star t with the current month

    let startMonth: number;
    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }

    this.checkoutFormService.getCreditCardMonths(startMonth).subscribe((data) => {
      console.log('Retrieved credit card months: ' + JSON.stringify(data));
      this.creditCardMonths = data;
    });
  }

  getStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup?.value.country.code;
    const countryName = formGroup?.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);

    this.checkoutFormService.getStates(countryCode).subscribe((data) => {
      if (formGroupName === 'shippingAddress') {
        this.shippingAddressStates = data;
      } else {
        this.billingAddressStates = data;
      }

      //select first item by default
      formGroup?.get('state')?.setValue(data[0]);
    });
  }
}
