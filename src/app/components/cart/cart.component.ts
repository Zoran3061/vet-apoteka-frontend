import { Component, OnInit } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';
import { Store } from '@ngrx/store';
import { HttpClient } from '@angular/common/http';

import { addProduct, clearCart, removeProduct } from 'src/app/cart-state-store/cart.action';
import { ProductGroup, selectGroupCartEntries, selectTotalPrice } from 'src/app/cart-state-store/cart.selector';
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  cartEntries$: Observable<ProductGroup[]>;
  totalPrice$: Observable<number>;

  private cartApi = 'http://localhost:8080/api/cart';

  constructor(
    private store: Store,
    private authService: AuthService,
    private http: HttpClient
  ) {
    this.cartEntries$ = store.select(selectGroupCartEntries);
    this.totalPrice$ = store.select(selectTotalPrice);
  }

  ngOnInit(): void {}

  clearEntries() {
    this.store.dispatch(clearCart());
  }

  more(entry: any) {

    if (entry.count >= entry.product.stock) {
      alert("Nema više proizvoda na lageru.");
      return;
    }

    this.store.dispatch(addProduct(entry.product));
  }

  less(entry: any) {
    this.store.dispatch(removeProduct(entry.product));
  }

  // BUY ALL: prvo snimanje NGRX u bazu, pa checkout
  async buyAll() {
    try {
      const userId = this.authService.getUserId?.() ?? null;

      if (!userId) {
        alert("Nema userId u tokenu/localStorage. Uloguj se ponovo.");
        return;
      }

      const entries = await firstValueFrom(this.cartEntries$);

      if (!entries || entries.length === 0) {
        alert("Korpa je prazna.");
        return;
      }

      // 1) upiši sve iz NGRX u backend cart tabelu
      for (const e of entries) {
        await firstValueFrom(
          this.http.post(this.cartApi, {
            userId: userId,
            productId: e.product.id,
            quantity: e.count
          })
        );
      }

      // 2) pozovi checkout (backend napravi order + orderItems + obriše cart iz baze)
      await firstValueFrom(
        this.http.post(`${this.cartApi}/${userId}/checkout`, {})
      );

      alert("Porudžbina uspešno kreirana!");
      this.store.dispatch(clearCart());

    } catch (err: any) {
      console.error(err);
      alert("Greška prilikom kupovine (checkout). Pogledaj Network→Response i backend log.");
    }
  }
}
