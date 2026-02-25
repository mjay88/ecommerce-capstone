import { Component } from '@angular/core';
import { Product } from '../../common/product';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../../services/cart';
import { CartItem } from '../../common/cart-item';

@Component({
  selector: 'app-product-details',
  standalone: false,
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails {
  product!: Product;

  constructor(private productService: ProductService, private cartService: CartService, private route: ActivatedRoute){
    
  }

  ngOnInit(): void{
    this.route.paramMap.subscribe(() => {
      this.handleProductDetails();
    })
  }
  handleProductDetails() {
    //get the "id" param. string. convert string to a number using the "+" symbol 
    const theProductId: number = +this.route.snapshot.paramMap.get('id')!;

    this.productService.getProduct(theProductId).subscribe(
      //assign the result of call to product
      data => {
        this.product = data;
      }
    )
  }

  addToCart() {
    console.log(`Adding to cart: ${this.product.name}, ${this.product.unitPrice}`);
    //!!
    const theCartItem = new CartItem(this.product.id.toString(), this.product.name, this.product.imageUrl, this.product.unitPrice, 1)

    this.cartService.addToCart(theCartItem);
    
  }
}
