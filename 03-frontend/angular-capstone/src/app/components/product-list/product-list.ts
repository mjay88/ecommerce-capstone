import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../common/product';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from '../../common/cart-item';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-product-list',
  standalone: false,
  templateUrl: './product-list-grid.html',

  styleUrl: './product-list.css',
})
export class ProductList implements OnInit {
  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;

  //new properties for pagination
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;

  previousKeyword: string = '';

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }

  handleSearchProducts() {
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;
    //if we have a different keyword than previous then set the PageNumber back to 1
    if (this.previousKeyword != theKeyword) {
      this.thePageNumber = 1;
    }

    this.previousKeyword = theKeyword;

    console.log(`keyword=${theKeyword}, thePageNumber=${this.thePageNumber}`);

    //now search for products using keyword
    this.productService
      .searchProductsPaginate(this.thePageNumber - 1, this.thePageSize, theKeyword)
      .subscribe(this.processResult());
  }

 handleListProducts() {
  const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id')!;

  if (hasCategoryId) {
    // category view
    this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;

    // reset page if category changed
    if (this.previousCategoryId !== this.currentCategoryId) {
      this.thePageNumber = 1;
    }
    this.previousCategoryId = this.currentCategoryId;

    console.log(`categoryId=${this.currentCategoryId}, page=${this.thePageNumber}`);

    this.productService
      .getProductListPaginate(this.thePageNumber - 1, this.thePageSize, this.currentCategoryId)
      .subscribe(this.processResult());

  } else {
    // ✅ /products (no id) → ALL products
    // reset page if coming from a category view
    if (this.previousCategoryId !== 0) {
      this.thePageNumber = 1;
    }
    this.previousCategoryId = 0;

    console.log(`ALL products, page=${this.thePageNumber}`);

    this.productService
      .getAllProductsPaginate(this.thePageNumber - 1, this.thePageSize)
      .subscribe(this.processResult());
  }
  console.log('URL:', this.route.snapshot.url.map(s => s.path).join('/'));
console.log('paramMap id:', this.route.snapshot.paramMap.get('id'));
}
  updatePageSize(pageSize: string) {
    this.thePageSize = +pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }

  processResult() {
    return (data: any) => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    };
  }

  addToCart(theProduct: Product) {
    console.log(`Adding to cart: ${theProduct.name}, ${theProduct.unitPrice}`);

    const theCartItem = new CartItem(theProduct.id.toString(), theProduct.name, theProduct.imageUrl, theProduct.unitPrice, 1);

    this.cartService.addToCart(theCartItem);
  }
}
