import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/shared/models/Product';
import { Store } from '@ngrx/store';
import { addProduct } from 'src/app/cart-state-store/cart.action';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  products: Product[] = [];
  categories: any[] = [];
  selectedCategoryId: number | null = null;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private store: Store
  ) {}

  ngOnInit(): void {

    // Učitavanje svih proizvoda
    this.getProducts();

    // Učitavanje kategorija
    this.api.getCategories().subscribe((res: any[]) => {
      this.categories = res;
    });

    // Search preko rute (ako postoji)
    this.route.params.subscribe(params => {
      if (params.searchTerm) {
        this.api.getProduct().subscribe(res => {
          this.products = res.filter((product: Product) =>
            product.name.toLowerCase().includes(params.searchTerm.toLowerCase())
          );
        });
      }
    });
  }

  getProducts(): void {
    this.api.getProduct()
      .subscribe(products => this.products = products);
  }

  onCategoryChange(): void {
    if (this.selectedCategoryId) {
      this.api.getProductsFiltered(this.selectedCategoryId)
        .subscribe(res => this.products = res);
    } else {
      this.getProducts();
    }
  }

  public buyProducts(product: Product) {
    const cartProduct: any = {
      ...product,
      category: product.category?.name ?? ''
    };

    this.store.dispatch(addProduct(cartProduct));
  }

}
