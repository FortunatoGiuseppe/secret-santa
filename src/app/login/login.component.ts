import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';  // Importa FormsModule
import { CommonModule } from '@angular/common'; // Import CommonModule

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [CommonModule, FormsModule],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  loginFailed: boolean = false;
  loginMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  async onLogin() {
    const success = await this.authService.login(this.email, this.password);
    if (success) {
      this.loginMessage = 'Login riuscito!';
      this.router.navigate(['/dashboard']);
    } else {
      this.loginMessage = 'Login fallito. Controlla le tue credenziali.';
    }
  }
}
