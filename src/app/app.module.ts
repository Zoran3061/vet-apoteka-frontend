import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { LoginComponent } from './components/login/login.component';
import { ProtectedComponent } from './components/protected/protected.component';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { SearchComponent } from './components/search/search.component';
import { ProductPageComponent } from './components/product-page/product-page.component';
import { CartComponent } from './components/cart/cart.component';
import { SignupComponent } from './components/signup/signup.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { cartReducer, metaReducerLocalStorage } from './cart-state-store/cart.reducer';

import { AuthService } from './services/auth.service';
import { ApiService } from './services/api.service';


import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { WarehouseComponent } from './components/warehouse/warehouse.component';
import { AdminProductComponent } from './components/admin-product/admin-product.component';
import { AdminUsersComponent } from './components/admin-users/admin-users.component';

@NgModule({
  declarations: [
    AppComponent,
    ProtectedComponent,
    HomeComponent,
    LoginComponent,
    HeaderComponent,
    SearchComponent,
    ProductPageComponent,
    CartComponent,
    SignupComponent,
    WarehouseComponent,
    AdminProductComponent,
    AdminUsersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    StoreModule.forRoot({ cartEntries: cartReducer }, { metaReducers: [metaReducerLocalStorage] })
  ],
  providers: [
    AuthService,
    ApiService,

    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
