import { Component, OnInit } from '@angular/core';
import { ApiService, OrderStatus } from 'src/app/services/api.service';

@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.scss']
})
export class WarehouseComponent implements OnInit {

  // PORUDŽBINE
  orders: any[] = [];
  filteredOrders: any[] = [];
  selectedStatus: string = 'ALL';
  loading = false;

  // STAVKE PORUDŽBINE
  orderItemsMap: { [key: number]: any[] } = {};

  // PROIZVODI (za prijem robe)
  products: any[] = [];
  stockInputMap: { [key: number]: number } = {};

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadOrders();
    this.loadProducts();
  }

  // ======================
  // PORUDŽBINE
  // ======================

  loadOrders() {
    this.loading = true;
    this.api.getOrders().subscribe({
      next: (res) => {
        this.orders = res;
        this.applyFilter();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        alert('Ne mogu da učitam porudžbine.');
      }
    });
  }

  applyFilter() {
    if (this.selectedStatus === 'ALL') {
      this.filteredOrders = this.orders;
    } else {
      this.filteredOrders = this.orders.filter(o => o.status === this.selectedStatus);
    }
  }

  loadOrderItems(orderId: number) {
    if (this.orderItemsMap[orderId]) {
      delete this.orderItemsMap[orderId];
      return;
    }

    this.api.getOrderItems(orderId).subscribe(res => {
      this.orderItemsMap[orderId] = res;
    });
  }

  // ======================
  // STATUS LOGIKA
  // ======================

  canPrepare(order: any): boolean {
    return order.status === 'NEW';
  }

  canShip(order: any): boolean {
    return order.status === 'READY';
  }

  canCancel(order: any): boolean {
    return order.status === 'NEW' || order.status === 'READY';
  }

  prepareOrder(order: any) {
    this.changeStatus(order, 'READY', 'Porudžbina pripremljena.');
  }

  shipOrder(order: any) {
    this.changeStatus(order, 'SHIPPED', 'Porudžbina poslata.');
  }

  cancelOrder(order: any) {
    this.changeStatus(order, 'CANCELED', 'Porudžbina otkazana.');
  }

  private changeStatus(order: any, status: OrderStatus, message: string) {
    this.api.updateOrderStatus(order.id, status).subscribe({
      next: (updated) => {
        order.status = updated.status;
        alert(message);
        this.applyFilter();
      },
      error: () => {
        alert('Greška pri promeni statusa.');
      }
    });
  }

  // ======================
  // PRIJEM ROBE
  // ======================

  loadProducts() {
    this.api.getProduct().subscribe(res => {
      this.products = res;
    });
  }

  increaseStock(productId: number) {

    const amount = this.stockInputMap[productId];

    if (!amount || amount <= 0) {
      alert('Unesite količinu veću od 0.');
      return;
    }

    this.api.increaseStock(productId, amount).subscribe({
      next: () => {
        alert('Prijem robe evidentiran.');
        this.stockInputMap[productId] = 0;
        this.loadProducts();
      },
      error: () => {
        alert('Greška pri evidentiranju prijema robe.');
      }
    });
  }
}
