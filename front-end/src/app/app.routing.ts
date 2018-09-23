import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ErrorComponent } from './components/error/error.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { IndexComponent } from './components/index/index.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { PreventLogged } from './guards/preventlogged.guard';

const appRoutes: Routes = [
	{path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
	{path: 'profile/:id', component: ProfileComponent, canActivate: [AuthGuard]},
	{path: 'edit', component: UserEditComponent, canActivate: [AuthGuard]},
	{path: '', component: IndexComponent, canActivate: [PreventLogged]},
	{path: 'register', component: RegisterComponent, canActivate: [PreventLogged]},
	{path: 'login', component: LoginComponent, canActivate: [PreventLogged]},
	{path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [PreventLogged]},
	{path: 'reset_password', component: ResetPasswordComponent, canActivate: [PreventLogged]},
	{path: 'admin/dashboard', component: DashboardComponent, canActivate: [AdminGuard]},
	{path: '**',component: ErrorComponent }
];


export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
