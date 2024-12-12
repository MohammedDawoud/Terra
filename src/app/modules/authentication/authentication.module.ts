import { ToastrModule } from 'ngx-toastr';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthenticationRoutingModule } from './authentication-routing.module';
import { LoginComponent } from './components/login/login.component';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgOtpInputModule } from 'ng-otp-input';
import { purchaseComponent } from './components/purchase/purchase.component';

@NgModule({
  declarations: [
    LoginComponent,
    purchaseComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    AuthenticationRoutingModule,
    ToastrModule,
    TranslateModule,
    NgOtpInputModule,
  ],
})
export class AuthenticationModule {}
