import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/shared/models/Product';
import { Store } from '@ngrx/store';
import { addProduct } from 'src/app/cart-state-store/cart.action';
import { ProductInt } from 'src/app/shared/models/ProductInt';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{

  products!:any;
  constructor(private api: ApiService, private route:ActivatedRoute, private store:Store){}

  ngOnInit(): void {
    this.route.params.subscribe(params =>{
      if(params.searchTerm)
      this.api.getProduct().subscribe(res => {
          this.products = res.filter((product: any) => product.name.toLowerCase().includes(params.searchTerm.toLowerCase()));
    })
    else
    this.products = this.getProducts();
  })

  }

  getProducts(): void {
    this.api.getProduct()
    .subscribe(products => this.products = products);
    }
    
  getAllProducts(){
    this.api.getProduct().subscribe(res=>{
      this.products = res;
    })
  }

  public product(): ProductInt[]{
    return this.products;
  }

  public buyProducts(product:Product){
    this.store.dispatch(addProduct(product))
  }

}
