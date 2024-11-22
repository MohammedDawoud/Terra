
import { LiveAnnouncer } from '@angular/cdk/a11y';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  HostListener,
  Pipe,
  PipeTransform,
} from '@angular/core';
import { EmailValidator, NgForm } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {
  FileUploadControl,
  FileUploadValidators,
} from '@iplab/ngx-file-upload';
import {
  BsModalService,
  BsModalRef,
  ModalDirective,
} from 'ngx-bootstrap/modal';
import { BehaviorSubject, Subscription } from 'rxjs';

import { PreviewService } from 'src/app/core/services/project-services/preview.service';
import { ExportationService } from 'src/app/core/services/exportation-service/exportation.service';
import { fade } from 'src/app/shared/animations/toggleBtn.animation';
import { RestApiService } from 'src/app/shared/services/api.service';
import { combineLatest } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import {
  ModalDismissReasons,
  NgbModal,
  NgbModalOptions,
} from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import printJS from 'print-js';
import { DomSanitizer } from '@angular/platform-browser';
import { SafePipe } from 'src/app/shared/pipes/safe.pipe';
import { TranslateService } from '@ngx-translate/core';
import 'hijri-date';
import { DateType } from 'ngx-hijri-gregorian-datepicker';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { SharedService } from 'src/app/core/services/shared.service';
import { CustomerService } from 'src/app/core/services/customer-services/customer.service';
import { EmployeeService } from 'src/app/core/services/employee-services/employee.service';

const hijriSafe = require('hijri-date/lib/safe');
const HijriDate = hijriSafe.default;
const toHijri = hijriSafe.toHijri;

// @Pipe({ name: 'safe' })
// export class SafePipe implements PipeTransform {
//   constructor(private domSanitizer: DomSanitizer) {}
//   transform(url:any) {
//     return this.domSanitizer.bypassSecurityTrustResourceUrl(url);
//   }
// }

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
  animations: [fade],
})
export class PreviewComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  public uploadedFiles: Array<File> = [];
  dataSourceTemp: any = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource([{}]);
  _PreviewSMS: any = null;
  modal?: BsModalRef;
  modalDetails: any = {};
  load_BranchAccount: any;
  load_CityAndAreas: any;
  customrRowSelected: any;
  BranchId: number;
  allCount = 0;
  load_BranchUserId: any;
  nameAr: any;
  nameEn: any;
  isSubmit: boolean = false;
  modalRef?: BsModalRef;
  subscriptions: Subscription[] = [];

  userG: any = {};
  selectedDateType = DateType.Hijri;

  title: any = {
    main: {
      name: {
        ar: 'إدارة المشاريع',
        en: 'Projects',
      },
      link: '/projects/preview',
    },
    sub: {
      ar: 'المعاينات',
      en: 'Preview',
    },
  };

  data: any = {
    type: '0',
    files: [],
    clients: [],
    branches: [],
    cities: [],
    filesTypes: [],
  };

  searchBox: any = {
    open: false,
    searchType: null,
  };
  @ViewChild(DatatableComponent) table: DatatableComponent | any;

  columns: any = [];

  isEditable: any = {};

  displayedColumns: string[] = [
    'branchName',
    'previewCode',
    'nameAr',
    'mainPhoneNo',
    'nationalId',
    'statusName',
    'operations',
  ];
  displayedColumn: any = {
    usersMail: ['select', 'name', 'email'],
    usersMobile: ['select', 'name', 'mobile'],
  };
  data2: any = {
    filter: {
      enable: true,
      date: null,
      search_PreviewName: '',
      search_previewEmail: '',
      search_previewMobile: '',
      isChecked: false,
    },
  };

  EditModel: any = {
    PreviewId: 0,
    nameAr: null,
    nameEn: null,
  };

  constructor(
    private service: PreviewService,
    private modalService: BsModalService,
    private api: RestApiService,
    private changeDetection: ChangeDetectorRef,
    private toast: ToastrService,
    private ngbModalService: NgbModal,
    private _sharedService: SharedService,
    private authenticationService: AuthenticationService,
    private customerService: CustomerService,
    private employeeService: EmployeeService,
    private translate: TranslateService,
    private domSanitizer: DomSanitizer
  ) {
    this.userG = this.authenticationService.userGlobalObj;
    this.subscription = this.control.valueChanges.subscribe(
      (values: Array<File>) => this.getImage(values[0])
    );
  }

  //   ngAfterContentChecked() {
  //     this.fillBranchByUserId();
  //     this.changeDetection.detectChanges();
  //  }

  @ViewChild('dataModal') dataModal!: any;

  @ViewChild('optionsModal') optionsModal!: any;

  @ViewChild('noticModal') noticModal!: any;

  @ViewChild('paginatorServices') paginatorServices!: MatPaginator;

  @ViewChild('NewInvoiceModal') newInvoiceModal: any;
  @ViewChild('mailPaginator') mailPaginator!: MatPaginator;
  @ViewChild('smsPaginator') smsPaginator!: MatPaginator;

  //
  //
  users: any;
  showPrice: any = false;
  existValue: any = true;

  selectAllValue = false;

  ngOnInit(): void {
    this.getAllPreviews();
    this.FillCustomerSelect();
    this.FillEmployeeselect();
  }

  applyFilter(event: any) {
    const val = event.target.value.toLowerCase();
    var tempsource = this.dataSourceTemp;
    if (val) {
      tempsource = this.dataSourceTemp.filter((d: any) => {
        return (
          (d.branchName &&
            d.branchName?.trim().toLowerCase().indexOf(val) !== -1) ||
          (d.nationalId &&
            d.nationalId?.trim().toLowerCase().indexOf(val) !== -1) ||
          (d.previewCode &&
            d.previewCode?.trim().toLowerCase().indexOf(val) !== -1) ||
          (d.nameAr &&
            d.nameAr?.trim().toLowerCase().indexOf(val) !== -1) ||
          (d.mainPhoneNo &&
            d.mainPhoneNo?.trim().toLowerCase().indexOf(val) !== -1) ||
          (d.subMainPhoneNo &&
            d.subMainPhoneNo?.trim().toLowerCase().indexOf(val) !== -1)
        );
      });
    }

    this.dataSource = new MatTableDataSource(tempsource);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // checkValue(event: any) {
  //   if (event == 'A') {
  //     this.getAllPreviews();
  //   } else {
  //     this.RefreshData();
  //   }
  // }

  resetandRefresh() {
    if (this.searchBox.open == false) {
      this.data2.filter.search_PreviewName = null;
      this.data2.filter.search_previewMobile = null;
      this.data.type = 0;
      this.getAllPreviews();
    }
  }
  //------------------ Fill DATA ----------------------------------

  fillBranchByUserId() {
    this.service.FillBranchByUserIdSelect().subscribe((data) => {
      debugger
      this.load_BranchUserId = data;
      if (this.load_BranchUserId.length == 1) {
        this.modalDetails.branchId = this.load_BranchUserId[0].id;
      }
    });
  }
  load_Customers: any=[];
  FillCustomerSelect() {
    this.customerService.FillCustomerSelect().subscribe((data) => {
      this.load_Customers = data.result;
      console.log(this.load_Customers);
    });
  }

  load_Employees: any=[];
  FillEmployeeselect() {
    this.employeeService.FillEmployeeselect().subscribe((data) => {
      this.load_Employees = data;
    });
  }


  GeneratePreviewNumber(){
    this.service.GeneratePreviewNumber().subscribe(data=>{
      this.modalDetails.previewCode=data.reasonPhrase;
    });
  }

  //-----------------------OPEN MODAL--------------------------------------------------

  openModal(template: TemplateRef<any>, data?: any, modalType?: any) {
    this.resetModal();
    this.fillBranchByUserId();
    //this.getEmailOrganization();
    debugger
    if (modalType == 'addPreview') {
      this.GeneratePreviewNumber();
    }
    console.log('this.modalDetails');
    console.log(this.modalDetails);

    if (data) {
      this.modalDetails = data;
      if (modalType == 'editPreview') {
        this.modalDetails.appointmentDate = this._sharedService.String_TO_date(this.modalDetails.appointmentDate);
        debugger;
        if (data.agentAttachmentUrl != null) {
          this.modalDetails.attachmentUrl =
            environment.PhotoURL + data.agentAttachmentUrl;
          //this.modalDetails.attachmentUrl = this.domSanitizer.bypassSecurityTrustUrl(environment.PhotoURL+data.agentAttachmentUrl)
        }
      }
      console.log(this.modalDetails);
    }
    if (modalType) {
      //console.log(modalType);

      this.modalDetails.type = modalType;
    }

    this.modal = this.modalService.show(template, {
      class: ' modal-xl',
      backdrop: 'static',
      keyboard: false,
    });
  }

  closeResult: any;
  OfferPopupAddorEdit: any = 0; //add offerprice

  invoicepop = 1;
  publicidRow: any;

  InvoiceModelPublic: any;

  open(content: any, data?: any, type?: any, idRow?: any, model?: any) {
    this.publicidRow = 0;

    if (idRow != null) {

    }
    if (data) {
      this.modalDetails = data;
    }
    if (type === 'deleteModalPerm') {
      this.publicidRow = data.idRow;
    }
    this.ngbModalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        size: type ? 'xl' : 'lg',
        centered:
          type == 'SaveInvoiceConfirmModal' ? true : !type ? true : false,
        backdrop: 'static',
        keyboard: false,
      })
      .result.then(
        (result) => {
          //this.resetModal();
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }
  private getDismissReason(reason: any, type?: any): string {
    //this.resetModal();
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  //dawoud
  TablClick() {
    this.modalDetails.nameAr = null;
    this.modalDetails.nameEn = null;
    this.isSubmit = false;
  }
  ShowImg(pho: any) {
    var img = environment.PhotoURL + pho;
    return img;
  }
  ShowAgentFile(file: any) {
    if (file != null) {
      window.open(file, '_blank');
    }
  }

  PreviewIdPublic: any = 0;
  setPreviewid_P(id: any) {
    this.PreviewIdPublic = id;
    console.log('this.PreviewIdPublic');
    console.log(this.PreviewIdPublic);
  }

  disableButtonSave_Preview = false;

  addPreview() {
    debugger;
    var val = this.validateForm();
    if (val.status == false) {
      this.toast.error(val.msg, 'رسالة');
      return;
    }
    var custObj: any = {};
    custObj.previewId = this.modalDetails.previewId;
    custObj.nameAr = this.modalDetails.nameAr;
    custObj.nameEn = this.modalDetails.nameEn;
    custObj.nationalId = this.modalDetails.nationalId;
    custObj.previewCode = this.modalDetails.previewCode;
    custObj.branchId = this.modalDetails.branchId;
    custObj.accountId = this.modalDetails.accountId;
    custObj.subMainPhoneNo = this.modalDetails.subMainPhoneNo;
    custObj.mainPhoneNo = this.modalDetails.mainPhoneNo;
    //custObj.status = this.modalDetails.status;
    custObj.status = true;

    custObj.directManagerId = this.modalDetails.directManagerId;
    custObj.jobId = this.modalDetails.jobId;
    custObj.salary = this.modalDetails.salary;
    custObj.appointmentDate = this.modalDetails.appointmentDate;

    if (this.modalDetails.appointmentDate != null) {
      custObj.appointmentDate = this._sharedService.date_TO_String(this.modalDetails.appointmentDate);
    }

    custObj.address = this.modalDetails.address;
    custObj.notes = this.modalDetails.notes;
    console.log('custObj');
    console.log(custObj);

    const formData = new FormData();
    for (const key of Object.keys(custObj)) {
      const value = custObj[key] == null ? '' : custObj[key];
      formData.append(key, value);
      formData.append('PreviewId', custObj.previewId.toString());
    }
    this.disableButtonSave_Preview = true;
    setTimeout(() => {
      this.disableButtonSave_Preview = false;
    }, 5000);
    this.service.SavePreview(formData).subscribe((result: any) => {
      if (result.statusCode == 200) {
        this.toast.success(
          this.translate.instant(result.reasonPhrase),
          this.translate.instant('Message')
        );
        this.decline();
        this.getAllPreviews();
        this.ngbModalService.dismissAll();
      } else {
        this.toast.error(result.reasonPhrase, 'رسالة');
      }
    });
  }
  ValidateObjMsg: any = { status: true, msg: null };
  validateForm() {
    this.ValidateObjMsg = { status: true, msg: null };

    if (
      this.modalDetails.nameAr == null ||
      this.modalDetails.nameAr == ''
    ) {
      this.ValidateObjMsg = { status: false, msg: ' أدخل أسم المعاينة عربي' };
      return this.ValidateObjMsg;
    } else if (
      this.modalDetails.nameEn == null ||
      this.modalDetails.nameEn == ''
    ) {
      this.ValidateObjMsg = { status: false, msg: 'أدخل أسم المعاينة انجليزي' };
      return this.ValidateObjMsg;
    } else if (this.modalDetails.branchId == null) {
      this.ValidateObjMsg = { status: false, msg: 'اختر فرع المعاينة' };
      return this.ValidateObjMsg;
    } else if (
      this.modalDetails.accountName == null ||
      this.modalDetails.accountName == ''
    ) {
      this.ValidateObjMsg = { status: false, msg: 'لا يوجد حساب لهذا الفرع' };
      return this.ValidateObjMsg;
    }
    else if ((this.modalDetails.mainPhoneNo == null ||this.modalDetails.mainPhoneNo == '')
    ) {
      this.ValidateObjMsg = { status: false, msg: 'ادخل جوال المعاينة' };
      return this.ValidateObjMsg;
    }
    else if ((this.modalDetails.nationalId == null ||
        this.modalDetails.nationalId == '')
    ) {
      this.ValidateObjMsg = {
        status: false,
        msg: 'ادخل رقم الهوية للمعاينة',
      };
      return this.ValidateObjMsg;
    }
    if ((this.modalDetails.nationalId == null ||
      this.modalDetails.nationalId == '')) {
    this.ValidateObjMsg = { status: false, msg: 'ادخل رقم هوية المعاينة' };
    return this.ValidateObjMsg;
  }
    this.ValidateObjMsg = { status: true, msg: null };
    return this.ValidateObjMsg;
  }

  exportData() {
    let x = [];

    for (let index = 0; index < this.dataSourceTemp.length; index++) {
      x.push({
        branchName: this.dataSourceTemp[index].branchName,
        previewCode: this.dataSourceTemp[index].previewCode,
        previewName: this.dataSourceTemp[index].nameAr,
        mainPhoneNo: this.dataSourceTemp[index].mainPhoneNo,
        nationalId: this.dataSourceTemp[index].nationalId,
        jobName: this.dataSourceTemp[index].jobName,
      });
    }
    debugger;
    this.service.customExportExcel(x, 'Previews');
  }

  getAllPreviews() {
    this.service.GetAllPreviews_Branch().subscribe((data: any) => {
      // console.log(data);

      this.dataSource = new MatTableDataSource(data);
      this.dataSourceTemp = data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.allCount = data.length;
    });
  }

  resetModal() {
    this.isSubmit = false;
    this.control.clear();
    this.modalDetails = {
      CustMainAccByBranchId: {
        accountCode: '',
        accountName: null,
        nameAr: '',
        nameEn: '',
      },
      type: 'addPreview',
      nameAr: null,
      nameEn: null,
      id: null,
      name: null,
      previewId: 0,
      branchId: null,
      previewCode: null,
      nationalId: null,
      address: null,
      mainPhoneNo: null,
      subMainPhoneNo: null,
      directManagerId: null,
      jobId: null,
      salary: null,
      appointmentDate: null,
      notes: null,
      accountId: null,
      accountName: null,
      addDate: null,
      addUser: [],
      addedpreviewImg: null,
      accountCodee: null,
    };
  }

  confirm(): void {
    this.service.DeletePreview(this.modalDetails.previewId).subscribe((result) => {
        if (result.statusCode == 200) {
          this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
          this.getAllPreviews();
          this.modal?.hide();
        } else {
          this.toast.error(result.reasonPhrase, 'رسالة');
        }
      });
  }

  decline(): void {
    this.modal?.hide();
  }



  // upload img ]
  public readonly uploadedFile: BehaviorSubject<string> = new BehaviorSubject(
    ''
  );
  public readonly control = new FileUploadControl(
    {
      listVisible: true,
      // accept: ['image/*'],
      discardInvalid: true,
      multiple: false,
    },
    [
      //FileUploadValidators.accept(['image/*']),
      FileUploadValidators.filesLimit(1),
    ]
  );
  private subscription?: Subscription;

  private getImage(file: File): void {
    if (FileReader && file) {
      const fr = new FileReader();
      fr.onload = (e: any) => this.uploadedFile.next(e.target.result);
      fr.readAsDataURL(file);
    } else {
      this.uploadedFile.next('');
    }
  }

  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

}
