import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { VerticalLayoutComponent } from './shared/layouts/vertical-layout/vertical-layout.component';
import { NewsComponent } from './modules/core/components/news/news.component';
import { AuthGuard } from './core/helper/auth.guard';
import { NotValidComponent } from './shared/components/not-valid/not-valid.component';

const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () =>
      import('src/app/modules/authentication/authentication.module').then(
        (m) => m.AuthenticationModule
      ),
  },
  {
    path: 'dash',
    component: VerticalLayoutComponent,
    loadChildren: () =>
      import('src/app/modules/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      ),canActivate:[AuthGuard],
  },
  {
    path: 'customers',
    component: VerticalLayoutComponent,
    loadChildren: () =>
      import('src/app/modules/customers/customers.module').then(
        (m) => m.CustomersModule
      ),canActivate:[AuthGuard],
  },
  {
    path: 'employees',
    component: VerticalLayoutComponent,
    loadChildren: () =>
      import('src/app/modules/employees/employees.module').then(
        (m) => m.EmployeesModule
      ),canActivate:[AuthGuard],
  },
  {
    path: 'projects',
    component: VerticalLayoutComponent,
    loadChildren: () =>
      import('src/app/modules/projects/projects.module').then(
        (m) => m.ProjectsModule
      ),canActivate:[AuthGuard],
  },
  {
    path: 'accounts',
    component: VerticalLayoutComponent,
    loadChildren: () =>
      import('src/app/modules/accounts/accounts.module').then(
        (m) => m.AccountsModule
      ),canActivate:[AuthGuard],
  },
  {
    path: 'controlpanel',
    component: VerticalLayoutComponent,
    loadChildren: () =>
      import('src/app/modules/control-panel/control-panel.module').then(
        (m) => m.ControlPanelModule
      ),canActivate:[AuthGuard],
  },

  { path: 'news', component: NewsComponent },
  { path: 'notValid', component: NotValidComponent },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
