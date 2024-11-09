import { AccountsGuideComponent } from './components/accounts-guide/accounts-guide.component';

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'Sales_bill' },
  { path: 'Accounts_guide', component: AccountsGuideComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountsRoutingModule { }
