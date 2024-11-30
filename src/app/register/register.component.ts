// src/app/register/register.component.ts
import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { FormsModule } from '@angular/forms';  // Importa FormsModule

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  imports: [CommonModule, FormsModule],
})
export class RegisterComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  registrationFailed: boolean = false;
  registerMessage: string = '';
  passwordFieldType: string = 'password'; // Tipo di campo per la password

  constructor(private authService: AuthService, private router: Router) {}

  async onRegister() {
    if (!this.email.includes('@')) {
      this.registerMessage = 'L\'email deve contenere il simbolo @.';
      return;
    }

    if (this.password.length < 6) {
      this.registerMessage = 'La password deve contenere almeno 6 caratteri.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.registerMessage = 'Le password non corrispondono.';
      return;
    }

    const success = await this.authService.register(this.email, this.password, this.name);
    if (success) {
      this.registerMessage = 'Registrazione avvenuta!';
      this.router.navigate(['/dashboard']);
    } else {
      this.registerMessage = 'Registrazione fallita. Controlla le tue credenziali.';
    }
  }

  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }
}
