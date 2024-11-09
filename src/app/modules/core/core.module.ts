import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsComponent } from './components/news/news.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatTabsModule } from '@angular/material/tabs';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WebcamModule } from 'ngx-webcam';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgOtpInputModule } from 'ng-otp-input';

@NgModule({
  declarations: [
    NewsComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    MatTabsModule,
    TabsModule,
    FormsModule,
    WebcamModule,
    MatStepperModule,
    MatInputModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgOtpInputModule,
  ],
})
export class CoreModule {}
