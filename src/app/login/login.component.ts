// src/app/login/login.component.ts
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
  passwordFieldType: string = 'password'; // Tipo di campo per la password

  constructor(private authService: AuthService, private router: Router) {}

  async onLogin() {
    if (!this.email.includes('@')) {
      this.loginMessage = 'L\'email deve contenere il simbolo @.';
      return;
    }

    if (this.password.length < 6) {
      this.loginMessage = 'La password deve contenere almeno 6 caratteri.';
      return;
    }

    const success = await this.authService.login(this.email, this.password);
    if (success) {
      this.loginMessage = 'Login riuscito!';
      this.router.navigate(['/dashboard']);
    } else {
      this.loginMessage = 'Login fallito. Controlla le tue credenziali.';
    }
  }

  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }
}
