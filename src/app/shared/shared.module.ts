import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerticalLayoutComponent } from './layouts/vertical-layout/vertical-layout.component';
import { RouterModule } from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { VerticalSidebarComponent } from './components/vertical-sidebar/vertical-sidebar.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { HijriDatePipe } from './pipes/hijriDate.pipe';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgSelectModule } from '@ng-select/ng-select';
import { NavigatorComponent } from './components/navigator/navigator.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRippleModule } from '@angular/material/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { MatSortModule } from '@angular/material/sort';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgApexchartsModule } from 'ng-apexcharts';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TreeviewModule } from 'ngx-treeview';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TreeNgxModule } from 'tree-ngx';
import { PagesHeaderComponent } from './components/pages-header/pages-header.component';
import { NgxHijriGregorianDatepickerModule } from 'ngx-hijri-gregorian-datepicker';

import { MatRadioModule } from '@angular/material/radio';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxTypedJsModule } from 'ngx-typed-js';
import { SafePipe } from './pipes/safe.pipe';
import { AgmCoreModule } from '@agm/core';
import { Imageipe } from './pipes/img.pipe';
import { MatStepperModule } from '@angular/material/stepper';
import { NgxEditorModule } from 'ngx-editor';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NotValidComponent } from './components/not-valid/not-valid.component';

@NgModule({
  declarations: [
    VerticalLayoutComponent,
    HeaderComponent,
    FooterComponent,
    VerticalSidebarComponent,
    NotFoundComponent,
    HijriDatePipe,
    NavigatorComponent,
    NavigatorComponent,
    PagesHeaderComponent,
    SafePipe,
    Imageipe,
    NotValidComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    TranslateModule,
    MatMenuModule,
    NgxEditorModule,

    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatRippleModule,
    ModalModule,
    ButtonsModule,
    NgSelectModule,
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
    MatCheckboxModule,
    NgxHijriGregorianDatepickerModule,
    MatSlideToggleModule,
    MatRadioModule,
    TabsModule,
    MatProgressBarModule,
    MatDatepickerModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatExpansionModule,
    MatTooltipModule,
    NgxTypedJsModule,
    AgmCoreModule,
    MatStepperModule,
    TreeNgxModule,
    DragDropModule
  ],
  exports: [
    MatMenuModule,
    FooterComponent,
    HijriDatePipe,
    NavigatorComponent,
    MatTabsModule,
    TabsModule,
    TranslateModule,
    MatButtonModule,
    NgxEditorModule,
    MatDialogModule,
    MatRippleModule,
    ModalModule,
    ButtonsModule,
    NgSelectModule,
    NgxDatatableModule,
    PaginationModule,
    NgApexchartsModule,
    BsDatepickerModule,
    FileUploadModule,
    BsDropdownModule,
    TreeviewModule,
    MatTableModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    PagesHeaderComponent,
    NgxHijriGregorianDatepickerModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatRadioModule,
    MatProgressBarModule,
    SafePipe,
    Imageipe,
  ],
})
export class SharedModule {}
