import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Product } from '../shared/models/Product';
import { Observable } from 'rxjs';

// TIPOVI
export type OrderStatus = 'NEW' | 'PROCESSING' | 'READY' | 'SHIPPED' | 'CANCELED';

export type UserRole = 'USER' | 'ADMIN' | 'MAGACIONER';

export interface AppUser {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  role: UserRole;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = "http://localhost:8080/api";

  constructor(private http: HttpClient) {}

  // PROIZVODI
  postProduct(data: any) {
    return this.http.post<any>(`${this.apiUrl}/products`, data).pipe(map((res: any) => res));
  }

  getProduct(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
  }

  getSearchProduct(): Promise<Product[]> {
    return new Promise((resolve, reject) => {
      this.http.get<Product[]>(`${this.apiUrl}/products`).subscribe(
        (res: Product[]) => resolve(res),
        (error: any) => reject(error)
      );
    });
  }

  // ADMIN PROIZVODI
  createProduct(product: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/products`, product);
  }

  updateProductById(id: number, product: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/products/${id}`, product);
  }

  deleteProductById(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/products/${id}`);
  }

  updateProduct(data: any, id: number) {
    return this.updateProductById(id, data);
  }

  deleteProduct(id: number) {
    return this.deleteProductById(id);
  }

  // KORISNICI
  postUser(data: any) {
    return this.http.post<any>(`${this.apiUrl}/register`, data).pipe(map((res: any) => res));
  }

  // ADMIN KORISNICI
  getUsers(): Observable<AppUser[]> {
    return this.http.get<AppUser[]>(`${this.apiUrl}/users`);
  }

  createMagacioner(payload: { firstName: string; lastName: string; username: string; password: string; }): Observable<AppUser> {
    return this.http.post<AppUser>(`${this.apiUrl}/users`, payload);
  }

  updateUserById(id: number, payload: Partial<AppUser>): Observable<AppUser> {
    return this.http.put<AppUser>(`${this.apiUrl}/users/${id}`, payload);
  }

  deleteUserById(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${id}`);
  }

  // NAREDBE
  getOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/orders`);
  }

  updateOrderStatus(orderId: number, status: OrderStatus): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/orders/${orderId}/status?status=${status}`, {});
  }

  // KATEGORIJE
  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/categories`);
  }

  // PROIZVODI (filter po kategoriji + search)
  getProductsFiltered(categoryId?: number | null, search?: string | null): Observable<Product[]> {
    let url = `${this.apiUrl}/products`;
    const params: string[] = [];

    if (categoryId) params.push(`categoryId=${categoryId}`);
    if (search && search.trim().length > 0) params.push(`search=${encodeURIComponent(search.trim())}`);

    if (params.length > 0) url += `?${params.join('&')}`;

    return this.http.get<Product[]>(url);
  }

  getOrderItems(orderId: number) {
    return this.http.get<any[]>(`${this.apiUrl}/orders/${orderId}/items`);
  }

  increaseStock(productId: number, amount: number) {
    return this.http.put<any>(
      `${this.apiUrl}/products/${productId}/increase-stock?amount=${amount}`,
      {}
    );
  }
}
