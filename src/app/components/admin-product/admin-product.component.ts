import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-admin-product',
  templateUrl: './admin-product.component.html',
  styleUrls: ['./admin-product.component.scss']
})
export class AdminProductComponent implements OnInit {

  products: any[] = [];
  loading = false;

  // forma za ADD
  newProduct: any = {
    name: '',
    image: '',
    category: '',
    material: '',
    price: 0,
    description: ''
  };

  // edit state
  editingId: number | null = null;
  editModel: any = {};

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.api.getProduct().subscribe({
      next: (res) => {
        this.products = res;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        alert('Ne mogu da učitam proizvode.');
      }
    });
  }

  startEdit(p: any) {
    this.editingId = p.id;
    this.editModel = { ...p };
  }

  cancelEdit() {
    this.editingId = null;
    this.editModel = {};
  }

  saveEdit() {
    if (!this.editingId) return;

    this.api.updateProductById(this.editingId, this.editModel).subscribe({
      next: () => {
        this.cancelEdit();
        this.loadProducts();
        alert('Proizvod izmenjen.');
      },
      error: (err) => {
        console.error(err);
        alert('Greška pri izmeni (da li si ulogovan kao ADMIN?).');
      }
    });
  }

  addProduct() {
    this.api.createProduct(this.newProduct).subscribe({
      next: () => {
        this.newProduct = { name:'', image:'', category:'', material:'', price:0, description:'' };
        this.loadProducts();
        alert('Proizvod dodat.');
      },
      error: (err) => {
        console.error(err);
        alert('Greška pri dodavanju (da li si ulogovan kao ADMIN?).');
      }
    });
  }

  deleteProduct(id: number) {
    if (!confirm('Obrisati proizvod?')) return;

    this.api.deleteProductById(id).subscribe({
      next: () => {
        this.loadProducts();
        alert('Proizvod obrisan.');
      },
      error: (err) => {
        console.error(err);
        alert('Greška pri brisanju (da li si ulogovan kao ADMIN?).');
      }
    });
  }
}
