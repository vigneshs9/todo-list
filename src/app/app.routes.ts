import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { DashboardComponent } from './dashboard/dashboard';
import { ChangePasswordComponent } from './change-password/change-password';
import { ForgotPasswordComponent } from './forgot-password/forgot-password';

export const routes: Routes = [
 { path: '', redirectTo: 'login', pathMatch: 'full' },
 { path: 'login', component: LoginComponent },
 { path: 'dashboard', component: DashboardComponent },
 { path: 'cpwd', component: ChangePasswordComponent },
 { path: 'fpwd', component: ForgotPasswordComponent },
 { path: '**', redirectTo: 'login' }
];
