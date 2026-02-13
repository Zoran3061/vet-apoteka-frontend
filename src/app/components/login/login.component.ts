import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  message: string = '';

  constructor(public authService: AuthService, public router: Router) {}

  async login(username: string, password: string): Promise<boolean> {
    const isAuthenticated = await this.authService.login(username, password);

    if (!isAuthenticated) {
      this.message = 'Vaši podaci nisu tačni ili ne postoje!!!.';
      setTimeout(() => (this.message = ''), 2500);
      return false;
    }

    // redirect po role
if (this.authService.isAdmin()) {
  this.router.navigateByUrl('/admin/products');
} else if (this.authService.isMagacioner()) {
  this.router.navigateByUrl('/warehouse');
} else {
  this.router.navigateByUrl('/home');
}


    return false;
  }

  logout(): boolean {
    this.authService.logout();
    this.router.navigateByUrl('/login');
    return false;
  }
}
