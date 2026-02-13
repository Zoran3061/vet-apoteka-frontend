import { Component, OnInit } from '@angular/core';
import { ApiService, AppUser, UserRole } from 'src/app/services/api.service';

type CreateMagacionerDto = {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
};

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent implements OnInit {

  users: AppUser[] = [];
  loading = false;

  // admin može da menja role USER, MAGACIONER (ne nudimo ADMIN da ne napravi haos)
  roles: UserRole[] = ['USER', 'MAGACIONER'];

  // forma za kreiranje magacionera
  createModel: CreateMagacionerDto = {
    firstName: '',
    lastName: '',
    username: '',
    password: ''
  };

  // edit
  editingId: number | null = null;
  editModel: Partial<AppUser> = {};

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;

    this.api.getUsers().subscribe({
      next: (res) => {

        //sakrij ADMIN korisnike
        this.users = res.filter(u => u.role !== 'ADMIN' && u.id !== 1);

        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        alert('Greška pri učitavanju korisnika.');
      }
    });
  }


  // CREATE MAGACIONER
  createMagacioner() {
    const m = this.createModel;

    if (!m.firstName || !m.lastName || !m.username || !m.password) {
      alert('Popuni sva polja (ime, prezime, username, password).');
      return;
    }

    this.api.createMagacioner(m).subscribe({
      next: () => {
        alert('Magacioner uspešno kreiran!');
        this.createModel = { firstName: '', lastName: '', username: '', password: '' };
        this.loadUsers();
      },
      error: (err) => {
        console.error(err);
        alert('Ne mogu da kreiram magacionera (možda username već postoji).');
      }
    });
  }

  // EDIT
  startEdit(u: AppUser) {
    this.editingId = u.id;
    this.editModel = { ...u };
  }

  cancelEdit() {
    this.editingId = null;
    this.editModel = {};
  }

  saveEdit() {
    if (this.editingId == null) return;

    const payload: any = {
      firstName: this.editModel.firstName,
      lastName: this.editModel.lastName,
      username: this.editModel.username,
      role: this.editModel.role
    };

    this.api.updateUserById(this.editingId, payload).subscribe({
      next: () => {
        alert('Korisnik ažuriran.');
        this.cancelEdit();
        this.loadUsers();
      },
      error: (err) => {
        console.error(err);
        alert('Ne mogu da sačuvam izmene.');
      }
    });
  }

  // DELETE
  deleteUser(u: AppUser) {
    if (!confirm(`Obrisati korisnika "${u.username}"?`)) return;

    this.api.deleteUserById(u.id).subscribe({
      next: () => {
        alert('Korisnik obrisan.');
        this.loadUsers();
      },
      error: (err) => {
        console.error(err);
        alert('Ne mogu da obrišem korisnika (možda je admin id=1).');
      }
    });
  }
}
