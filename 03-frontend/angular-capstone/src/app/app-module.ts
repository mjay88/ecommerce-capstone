import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';

import { AuthModule, AuthHttpInterceptor } from '@auth0/auth0-angular';
import myAppConfig from './config/my-app-config';

import { ProductService } from './services/product.service';

// components
import { ProductList } from './components/product-list/product-list';
import { ProductCategoryMenu } from './components/product-category-menu/product-category-menu';
import { Search } from './components/search/search';
import { ProductDetails } from './components/product-details/product-details';
import { CartStatus } from './components/cart-status/cart-status';
import { CartDetails } from './components/cart-details/cart-details';
import { Checkout } from './components/checkout/checkout';
import { LoginCallback } from './components/login-callback/login-callback';
import { Login } from './components/login/login';
import { LoginStatus } from './components/login-status/login-status';

@NgModule({
  declarations: [
    App,
    ProductList,
    ProductCategoryMenu,
    Search,
    ProductDetails,
    CartStatus,
    CartDetails,
    Checkout,
    LoginStatus,
    LoginCallback,
    Login,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,     
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    AuthModule.forRoot({
      ...myAppConfig.auth,
      httpInterceptor: {
        ...myAppConfig.httpInterceptor,
      },
    }),
  ],
  providers: [
    ProductService,
    provideBrowserGlobalErrorListeners(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor,
      multi: true,
    },
  ],
  bootstrap: [App],
})
export class AppModule {}
