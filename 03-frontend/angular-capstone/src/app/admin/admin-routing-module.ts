import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AdminHome } from './pages/admin-home/admin-home';
import { CategoryList } from './pages/category-list/category-list';
import { ProductList } from './pages/admin-product-list/product-list';
import { ProductForm } from './pages/admin-product-form/product-form';
import { InventoryReport } from './pages/inventory-report/inventory-report';
import { PurchasesReport } from './pages/purchases-report/purchases-report';

const routes: Routes = [
  { path: '', component: AdminHome },
  {
    path: 'categories',
    component: CategoryList,
  },
 
  //new comes before id to avoid conflict
  {
    path: 'products/new',
    component: ProductForm,
  },
  {
    path: 'products/:id',
    component: ProductForm,
  },
   {
    path: 'products',
    component: ProductList,
  },
  {
    path: 'reports/inventory',
    component: InventoryReport,
  },
  {
    path: 'reports/purchases',
    component: PurchasesReport,
  },
  
];

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
