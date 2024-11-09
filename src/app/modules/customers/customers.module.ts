import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomersRoutingModule } from './customers-routing.module';
import { AddSearchComponent } from './add-search/add-search.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import {DragDropModule} from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    AddSearchComponent,
  ],
  imports: [
    CommonModule,
    CustomersRoutingModule,
    SharedModule,
    MatSortModule,
    FormsModule,
    ReactiveFormsModule,
    PaginationModule,
    MatPaginatorModule,
    FileUploadModule,
    DragDropModule
  ],
  providers: [BsModalService],
})
export class CustomersModule {}
