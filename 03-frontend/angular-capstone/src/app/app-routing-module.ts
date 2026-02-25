import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProductList } from './components/product-list/product-list';
import { ProductDetails } from './components/product-details/product-details';
import { CartDetails } from './components/cart-details/cart-details';
import { Checkout } from './components/checkout/checkout';
import { Login } from './components/login/login';
import { LoginCallback } from './components/login-callback/login-callback';
import { AdminGuard } from './auth/guards/admin-guard';

const routes: Routes = [
  { path: 'checkout', component: Checkout },
  { path: 'cart-details', component: CartDetails },
  { path: 'products/:id', component: ProductDetails },
  { path: 'search/:keyword', component: ProductList },
  { path: 'category/:id', component: ProductList },
  { path: 'category', component: ProductList },
  { path: 'products', component: ProductList },
  { path: 'login/callback', component: LoginCallback },
  { path: 'login', component: Login },
 

  // lazy load admin module
 {
  path: 'admin',
  canMatch: [AdminGuard],
  loadChildren: () =>
    import('./admin/admin.module').then(m => m.AdminModule)
},


  { path: '', redirectTo: '/products', pathMatch: 'full' },
  { path: '**', redirectTo: '/products' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
