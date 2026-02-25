import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminRoutingModule } from './admin-routing-module';

import { CategoryList } from './pages/category-list/category-list';
import { ProductList } from './pages/admin-product-list/product-list';
import { ProductForm } from './pages/admin-product-form/product-form';
import { InventoryReport } from './pages/inventory-report/inventory-report';
import { PurchasesReport } from './pages/purchases-report/purchases-report';
import { AdminHome } from './pages/admin-home/admin-home';

@NgModule({
  declarations: [
    CategoryList,
    ProductList,
    ProductForm,
    InventoryReport,
    PurchasesReport,
    AdminHome
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AdminModule {}
