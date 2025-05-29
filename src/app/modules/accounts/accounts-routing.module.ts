import { AccountsGuideComponent } from './components/accounts-guide/accounts-guide.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContractsComponent } from './components/contracts/contracts.component';
import { RevoucherComponent } from './components/revoucher/revoucher.component';
import { AccountstatementComponent } from './components/accountstatement/accountstatement.component';
import { OffersComponent } from './components/offers/offers.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'Sales_bill' },
  { path: 'Accounts_guide', component: AccountsGuideComponent },
  { path: 'Categories', component: CategoriesComponent },
  { path: 'contracts', component: ContractsComponent },
  { path: 'offers', component: OffersComponent },
  { path: 'revoucher', component: RevoucherComponent },
  { path: 'Account_Statement', component: AccountstatementComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountsRoutingModule { }
