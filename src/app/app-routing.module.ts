import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DrawComponent } from './draw/draw.component';  // Importa il componente Draw
import { AppComponent } from './app.component';

const routes: Routes = [
  { path: '', component: AppComponent },   // Home page
  { path: 'draw', component: DrawComponent } // Pagina di estrazione
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],  // Configura il router
  exports: [RouterModule]
})
export class AppRoutingModule { }
