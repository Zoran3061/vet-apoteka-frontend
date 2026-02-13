import { Component, OnInit } from '@angular/core';
import { ApiService, OrderStatus } from 'src/app/services/api.service';


@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.scss']
})
export class WarehouseComponent implements OnInit {

  orders: any[] = [];
  statuses: OrderStatus[] = ['NEW', 'PROCESSING', 'READY', 'SHIPPED', 'CANCELED'];
  loading = false;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;
    this.api.getOrders().subscribe({
      next: (res) => {
        this.orders = res;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        alert('Ne mogu da učitam porudžbine (403 ili backend error).');
      }
    });
  }

  changeStatus(order: any, newStatus: OrderStatus) {
    this.api.updateOrderStatus(order.id, newStatus).subscribe({
      next: (updated) => {
        order.status = updated.status;
        // this.loadOrders();
      },
      error: (err) => {
        console.error(err);
        alert('Ne mogu da promenim status (proveri role/403).');
      }
    });
  }
}
