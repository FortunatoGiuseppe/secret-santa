import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';
import { AppComponent } from '../app.component';
import { AuthGuard } from './auth-guard.service';

const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    canActivate: [AuthGuard]  // Proteggi la home con l'AuthGuard
  },
  {
    path: 'login',
    component: LoginComponent,  // Componente di login
  },
  {
    path: 'register',
    component: RegisterComponent,  // Componente di registrazione
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
