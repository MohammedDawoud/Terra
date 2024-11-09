import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ControlPanelRoutingModule } from './control-panel-routing.module';
import { UsersComponent } from './users/users.component';
import { OrganizationComponent } from './organization/organization.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TreeNgxModule } from 'tree-ngx';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatStepperModule } from '@angular/material/stepper';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { NgxHijriGregorianDatepickerModule } from 'ngx-hijri-gregorian-datepicker';
import { NgOtpInputModule } from 'ng-otp-input';
@NgModule({
  declarations: [
    UsersComponent,
    OrganizationComponent,
  ],
  imports: [
    CommonModule,
    ControlPanelRoutingModule,
    SharedModule,
    FormsModule,
    TreeNgxModule,
    ReactiveFormsModule,
    TranslateModule,
    NgSelectModule,
    MatIconModule,
    MatRadioModule,
    NgbModule,
    MatProgressBarModule,
    ModalModule,
    TabsModule,
    TimepickerModule,
    NgApexchartsModule,
    BsDropdownModule,
    MatStepperModule,
    NgxHijriGregorianDatepickerModule,
    NgOtpInputModule,
  ],
})
export class ControlPanelModule {}
