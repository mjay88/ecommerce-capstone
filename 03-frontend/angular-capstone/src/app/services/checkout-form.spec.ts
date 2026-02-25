import { TestBed } from '@angular/core/testing';

import { CheckoutForm } from './checkout-form';

describe('CheckoutForm', () => {
  let service: CheckoutForm;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckoutForm);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
