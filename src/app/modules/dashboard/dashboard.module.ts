import { NgxGaugeModule } from 'ngx-gauge';
import { TreeviewModule } from 'ngx-treeview';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { HomeComponent } from './components/home/home.component';

import { TranslateModule } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgApexchartsModule } from 'ng-apexcharts';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatRadioModule } from '@angular/material/radio';
import { TabsModule } from 'ngx-bootstrap/tabs';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { ProjectDetailsComponent } from '../project-management/track-projects/project-details/project-details.component';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { AgmCoreModule } from '@agm/core';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';

// import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [
    HomeComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    TranslateModule,
    SharedModule,
    NgSelectModule,
    // BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    PaginationModule,
    NgApexchartsModule,
    BsDatepickerModule,
    FileUploadModule,
    BsDropdownModule,
    TreeviewModule,
    MatTabsModule,
    MatTableModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatRadioModule,
    TabsModule,
    AccordionModule,
    // BrowserAnimationsModule,
    NgxGaugeModule,
    AgmCoreModule,
    TimepickerModule,
    MatDatepickerModule,
    MatFormFieldModule,
  ],
})
export class DashboardModule {}
