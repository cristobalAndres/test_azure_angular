// app-routing.module.ts
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminLayoutSidebarLargeComponent } from
  './shared/components/layouts/admin-layout-sidebar-large/admin-layout-sidebar-large.component';
import { AuthLayoutComponent } from './shared/components/layouts/auth-layout/auth-layout.component';
import { AuthGuard } from './services/auth/auth.guard';
import { PermissionGuard } from './services/permissions/permission.guard';

const adminRoutes: Routes = [
  {
    path: 'users',
    canActivate: [PermissionGuard],
    loadComponent() {
      return import('./views/users/users.component').then(m => m.UsersComponent);
    },
    data: { permission: '[CONFIGURATIONS][SUB-USERS]' }
  },
  {
    path: 'roles',
    canActivate: [PermissionGuard],
    loadComponent() {
      return import('./views/roles/roles.component').then(m => m.RolesComponent);
    },
    data: { permission: '[CONFIGURATIONS][SUB-ROLES]' }
  },
  {
    path: 'companies',
    children: [
      {
        path: '',
        loadComponent: () => import('./views/companies/companies.component')
          .then(m => m.CompaniesComponent),
      },
      {
        path: 'home',
        canActivate: [PermissionGuard],
        loadComponent: () => import('./views/home-companies/home-companies.component')
          .then(m => m.HomeCompaniesComponent),
        data: { permission: '[COMPANIES][MODULE]' }
      },
      {
        path: 'taxes',
        canActivate: [PermissionGuard],
        loadComponent: () => import('./views/taxes/taxes.component').then(m => m.TaxesComponent),
        data: { permission: '[COMPANIES][SUB-TAXES]' }
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'companies',
    pathMatch: 'full',
  },
];

const routes: Routes = [
  {
    path: 'dashboard',
    component: AdminLayoutSidebarLargeComponent,
    canActivate: [AuthGuard],
    children: adminRoutes
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./views/auth/auth.module').then(m => m.AuthModule)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'others/404'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
