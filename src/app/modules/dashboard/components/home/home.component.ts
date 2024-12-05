import { BehaviorSubject, Subscription } from 'rxjs';
import {Component,Inject,OnInit,ViewChild,AfterViewInit,ElementRef,inject,} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DOCUMENT, DatePipe } from '@angular/common';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import {ChartComponent,ApexAxisChartSeries,ApexChart,ApexXAxis,ApexDataLabels,ApexTooltip,ApexStroke,} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
};
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { RestApiService } from 'src/app/shared/services/api.service';
import {
  trigger,
  state,
  style,
  AUTO_STYLE,
  transition,
  animate,
} from '@angular/animations';
import {
  FileUploadControl,
  FileUploadValidators,
} from '@iplab/ngx-file-upload';

import { ToastrService } from 'ngx-toastr';
import { SharedService } from 'src/app/core/services/shared.service';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { TranslateService } from '@ngx-translate/core';
import { AppComponent } from 'src/app/app.component';
import { NgxPrintElementService } from 'ngx-print-element';
import printJS from 'print-js';
import { HttpEventType } from '@angular/common/http';
import { loadModules } from 'esri-loader';

const DEFAULT_DURATION = 300;

@Component({
  selector: 'app-web-analysis',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('collapse', [
      state('false', style({ height: AUTO_STYLE, visibility: AUTO_STYLE })),
      state('true', style({ height: '0', visibility: 'hidden' })),
      transition('false => true', animate(DEFAULT_DURATION + 'ms ease-in')),
      transition('true => false', animate(DEFAULT_DURATION + 'ms ease-out')),
    ]),
  ],
  providers: [DatePipe],
})
export class HomeComponent implements OnInit {
  @ViewChild('userChart') chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions> | any;

  lang: any = 'ar';
  @ViewChild('delayModal') delayModal: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  isRTL = true;
  userG: any = {};
  date = new Date();
  years: any = [2022, 2023, 2024, 2025];
  currentyear: any = new Date().getFullYear();
  constructor(
    private api: RestApiService,
    private modalService: NgbModal,
    private toast: ToastrService,
    private _sharedService: SharedService,
    private authenticationService: AuthenticationService,
    private print: NgxPrintElementService,
    private datePipe: DatePipe,

    private translate: TranslateService
  ) {
    this.userG = this.authenticationService.userGlobalObj;
  }
   
  ngOnInit(): void {

  }
 
}
