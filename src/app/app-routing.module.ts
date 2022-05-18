import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component'

const appRoutes: Routes = [
  {path: '',component: LoginComponent},
  {path: 'home',component: LoginComponent},
  {path: 'index',component: HomeComponent},
  {path: 'register',component: RegisterComponent}
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders<NgModule> = RouterModule.forRoot(appRoutes);
