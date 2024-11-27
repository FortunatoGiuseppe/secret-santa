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
  email: string = '';
  password: string = '';
  registrationFailed: boolean = false;
  registerMessage: string = '';


  constructor(private authService: AuthService, private router : Router) {}

  async onRegister() {
    const success = await this.authService.register(this.email, this.password);
    if (success) {
      this.registerMessage = 'Registrazione avvenuta!';
      this.router.navigate(['/dashboard']);
    } else {
      this.registerMessage = 'Registrazione fallita. Controlla le tue credenziali.';
    }
  }
}