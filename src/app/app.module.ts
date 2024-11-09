import { NgOtpInputModule } from 'ng-otp-input';
import {
  NgModule,
  CUSTOM_ELEMENTS_SCHEMA,
  forwardRef,
  NO_ERRORS_SCHEMA,
} from '@angular/core';

import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { ToastrModule } from 'ngx-toastr';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import {
  HttpClientModule,
  HttpClient,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';

import { NgxSpinnerModule } from 'ngx-spinner';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TreeviewModule } from 'ngx-treeview';
import { FormsModule } from '@angular/forms';
import { CoreModule } from './modules/core/core.module';
import { WebcamModule } from 'ngx-webcam';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TreeNgxModule } from 'tree-ngx';
import { NgxHijriGregorianDatepickerModule } from 'ngx-hijri-gregorian-datepicker';
import { SharedService } from './core/services/shared.service';
import { CustomInterceptor } from './core/interceptor/custom.interceptor';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { AgmCoreModule } from '@agm/core';
import { NgxGaugeModule } from 'ngx-gauge';
import { NgxPrintModule } from 'ngx-print';
import { NgxPrintElementModule } from 'ngx-print-element';
import { CustomDateAdapter } from './shared/dataadapter/customdate';
import {
  DateAdapter,
  MAT_DATE_LOCALE,
  MatNativeDateModule,
} from '@angular/material/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    NgbModule,
    BrowserAnimationsModule,
    SharedModule,
    ToastrModule.forRoot(),
    NgxIntlTelInputModule,
    NgxDatatableModule.forRoot({
      messages: {
        emptyMessage: 'No data to display', // Message to show when array is presented, but contains no values
        totalMessage: 'total', // Footer total message
        selectedMessage: 'selected', // Footer selected message
      },
    }),
    HttpClientModule,
    NgxSpinnerModule,
    TranslateModule.forRoot({
      defaultLanguage: 'ar',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    NgOtpInputModule,
    TreeviewModule.forRoot(),
    FormsModule,
    CoreModule,
    WebcamModule,
    ModalModule.forRoot(),
    TreeNgxModule,
    NgxHijriGregorianDatepickerModule,
    NgIdleKeepaliveModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: '',
    }),
    NgxGaugeModule,
    NgxPrintElementModule,
    LeafletModule,
    NgxPrintModule,
    MatInputModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
  ],
  providers: [
    // { provide: DateAdapter, useClass: CustomDateAdapter },
    // { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: HTTP_INTERCEPTORS, useClass: CustomInterceptor, multi: true },
    SharedService,
    { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule {}
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '../assets/i18n/', '.json');
}
