import { AccountsGuideComponent } from './components/accounts-guide/accounts-guide.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContractsComponent } from './components/contracts/contracts.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'Sales_bill' },
  { path: 'Accounts_guide', component: AccountsGuideComponent },
  { path: 'Categories', component: CategoriesComponent },
  { path: 'contracts', component: ContractsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountsRoutingModule { }
