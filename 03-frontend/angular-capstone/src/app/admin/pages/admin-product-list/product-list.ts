import { Component, OnInit } from '@angular/core';
import { AdminProductService } from '../../services/admin-product-service';
import { AdminProduct } from '../../models/admin-product';

@Component({
  selector: 'app-admin-product-list',
  templateUrl: './product-list.html',
  standalone: false,
})
export class ProductList implements OnInit {
  products: AdminProduct[] = [];
  loading = false;
  errorMsg = '';
  saving = false;


  constructor(private productService: AdminProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.errorMsg = '';

    this.productService.getAll().subscribe({
      next: (data) => {
        this.products = data ?? [];
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err?.error?.message ?? 'Failed to load products.';
        console.error('GET products failed:', err);
      },
    });
  }

  //delete
  deleteProduct(p: AdminProduct): void {
  const ok = confirm(`Delete product "${p.name}"?`);
  if (!ok) return;

  this.saving = true;
  this.errorMsg = '';

  this.productService.delete(p.id).subscribe({
    next: () => {
      this.saving = false;
      this.loadProducts();
    },
    error: (err) => {
      this.saving = false;
      this.errorMsg = err?.error?.message ?? 'Failed to delete product.';
      console.error('DELETE product failed:', err);
    },
  });
}


  trackById(_: number, item: AdminProduct): number {
    return item.id;
  }
}
