import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountsRoutingModule } from './accounts-routing.module';

import { SharedModule } from '../../shared/shared.module';
import { TreeNgxModule } from 'tree-ngx';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgApexchartsModule } from 'ng-apexcharts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { AccountsGuideComponent } from './components/accounts-guide/accounts-guide.component';

import { MatTabsModule } from '@angular/material/tabs';
import { MatStepperModule } from '@angular/material/stepper';
import { NgxHijriGregorianDatepickerModule } from 'ngx-hijri-gregorian-datepicker';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    AccountsGuideComponent,
  ],
  imports: [
    CommonModule,
    AccountsRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NgSelectModule,
    MatIconModule,
    MatRadioModule,
    NgbModule,
    MatProgressBarModule,
    ModalModule,
    TreeNgxModule,
    NgApexchartsModule,
    TabsModule,
    TimepickerModule,
    BsDropdownModule,
    MatTabsModule,
    MatStepperModule,
    NgxHijriGregorianDatepickerModule,
    DragDropModule
  ],
})
export class AccountsModule {}