import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

import { selectCountProducts } from 'src/app/cart-state-store/cart.selector';
import { clearCart } from 'src/app/cart-state-store/cart.action';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  countProducts$: Observable<number>;

  isAdmin = false;
  isMagacioner = false;
  isLoggedIn = false;
  username = '';

  constructor(
    private store: Store,
    private authService: AuthService,
    private router: Router
  ) {
    this.countProducts$ = this.store.select(selectCountProducts);
  }

  ngOnInit(): void {
    this.refreshAuthFlags();

    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => this.refreshAuthFlags());
  }

  private refreshAuthFlags(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.isAdmin = this.authService.isAdmin();
    this.isMagacioner = this.authService.isMagacioner();
    this.username = this.authService.getUser() ?? '';
  }

  logout(): void {
    this.authService.logout();
    this.store.dispatch(clearCart());
    this.router.navigateByUrl('/login');
  }
}
