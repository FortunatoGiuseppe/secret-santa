import { Routes } from '@angular/router';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DrawComponent } from './draw/draw.component';
import { LoginComponent } from './login/login.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { WishlistComponent } from './wishlist/wishlist.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Reindirizza alla pagina di login
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'admin-panel', component: AdminPanelComponent },
  { path: 'draw', component: DrawComponent },
  { path: 'user-profile', component: UserProfileComponent },
  { path: 'wishlist', component: WishlistComponent },
];
