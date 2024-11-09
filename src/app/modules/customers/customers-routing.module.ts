import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddSearchComponent } from './add-search/add-search.component';

const routes: Routes = [
  { path: '', redirectTo: 'search', pathMatch: 'full' },
  { path: 'search', component: AddSearchComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomersRoutingModule { }
