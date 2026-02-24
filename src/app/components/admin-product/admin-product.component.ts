import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-admin-product',
  templateUrl: './admin-product.component.html',
  styleUrls: ['./admin-product.component.scss']
})
export class AdminProductComponent implements OnInit {

  products: any[] = [];
  categories: any[] = [];
  loading = false;

  newProduct: any = {
    name: '',
    image: '',
    categoryId: null,
    material: '',
    price: 0,
    description: '',
    stock: 0
  };

  editingId: number | null = null;
  editModel: any = {};

  startEdit(p: any) {
    this.editingId = p.id;
    this.editModel = {
      name: p.name,
      image: p.image,
      categoryId: p.category?.id,
      material: p.material,
      price: p.price,
      description: p.description,
      stock: p.stock
    };
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
        alert('Greška pri izmeni.');
      }
    });
  }

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts() {
    this.loading = true;
    this.api.getProduct().subscribe({
      next: (res) => {
        this.products = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        alert('Ne mogu da učitam proizvode.');
      }
    });
  }

  loadCategories() {
    this.api.getCategories().subscribe(res => {
      this.categories = res;
    });
  }

  addProduct() {
    this.api.createProduct(this.newProduct).subscribe({
      next: () => {
        this.newProduct = {
          name: '',
          image: '',
          categoryId: null,
          material: '',
          price: 0,
          description: '',
          stock: 0
        };
        this.loadProducts();
        alert('Proizvod dodat.');
      },
      error: (err) => {
        console.error(err);
        alert('Greška pri dodavanju proizvoda.');
      }
    });
  }

  deleteProduct(id: number) {
    if (!confirm('Obrisati proizvod?')) return;

    this.api.deleteProductById(id).subscribe(() => {
      this.loadProducts();
    });
  }
}
