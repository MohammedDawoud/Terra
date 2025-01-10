
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
import { filesservice } from 'src/app/core/services/sys_Services/files.service';
import { HttpEventType } from '@angular/common/http';

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
  dataSourceTemp: any = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource([{}]);
  _PreviewSMS: any = null;
  modal?: BsModalRef;
  modalDetails: any = {};
  load_BranchAccount: any;
  load_CityAndAreas: any;
  customrRowSelected: any;
  BranchId: number;
  allPreviewCount = 0;
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
    'orderBarcode',
    'previewCode',
    'customerName',
    'mainPhoneNo',
    'address',
    'chairpersonName',
    'date',
    'previewStatustxt',
    'addDate', 
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
    private files: filesservice,
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
  PreviewStatusList: any;

  ngOnInit(): void {
    this.PreviewStatusList = [
      { id: 1, name: { ar: 'قيد الإنتظار', en: 'pending' } },
      { id: 2, name: { ar: 'قيد التشغيل', en: 'in progress' } },
      { id: 3, name: { ar: 'منتهية', en: 'finished' } },
    ];
    this.getAllPreviews();
    this.FillCustomerSelect();
    this.FillEmployeeselect();
    this.FilltAllPreviewTypes();
  }

  PreviewTypesList: any=[];
  FilltAllPreviewTypes() {
    this.service.FilltAllPreviewTypes().subscribe((data) => {
      this.PreviewTypesList = data;
    });
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
            (d.customerName &&
              d.customerName?.trim().toLowerCase().indexOf(val) !== -1) ||
              (d.chairpersonName &&
                d.chairpersonName?.trim().toLowerCase().indexOf(val) !== -1) ||
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

  fillBranchByUserId(modalType:any) {
    this.service.FillBranchByUserIdSelect().subscribe((data) => {
      this.load_BranchUserId = data;
      debugger
      if(modalType == 'addPreview2')
      {
        this.modalDetails.orderBarcode=1;
      }
      if (this.load_BranchUserId.length == 1) {
        this.modalDetails.branchId = this.load_BranchUserId[0].id;
      }
      if (this.load_BranchUserId.length == 1) {
        this.modalDetails.branchId = this.load_BranchUserId[0].id;
        if (modalType == 'addPreview1' || modalType == 'addPreview2'){
          this.BranchChange(this.modalDetails.branchId,modalType);
        }
      }
      else
      {
        this.modalDetails.branchId = parseInt(this._sharedService.getStoBranch());
        if (modalType == 'addPreview1' || modalType == 'addPreview2'){
          debugger
          
          this.BranchChange(this.modalDetails.branchId,modalType);
        }     
      }

    });
  }

  BranchChange(BranchId: any,modalType:any) {
    debugger
    if(modalType == 'addPreview1'  || modalType == 'addPreview2')
    {
      this.PreviewNumber_Reservation(BranchId,this.modalDetails.orderBarcode,modalType);
    }
  }

  load_Customers: any=[];
  FillCustomerSelect() {
    this.customerService.FillCustomerSelect().subscribe((data) => {
      this.load_Customers = data.result;
      console.log(this.load_Customers);
    });
  }

  load_BarcodesCustomer: any=[];
  load_BarcodesCustomerTemp: any=[];

  GetAllPreviewsSelectBarcode() {
    this.service.GetAllPreviewsSelectBarcode().subscribe((data) => {
      this.load_BarcodesCustomer = data;
      this.load_BarcodesCustomerTemp = data;

      console.log(this.load_BarcodesCustomer);
    });
  }

  load_Employees: any=[];
  FillEmployeeselect() {
    this.employeeService.FillEmployeeselect(2).subscribe((data) => {
      this.load_Employees = data;
    });
  }

  GeneratePreviewNumber(){
    debugger
    this.service.GeneratePreviewNumber().subscribe(data=>{
      this.modalDetails.previewCode=data.reasonPhrase;
    });
  }
  GeneratePreviewNumberByBarcodeNum(){
    debugger
    if(!(this.modalDetails.orderBarcode==null || this.modalDetails.orderBarcode==""))
    {
      this.service.GeneratePreviewNumberByBarcodeNum(this.modalDetails.orderBarcode).subscribe(data=>{
        this.modalDetails.previewCode=data.reasonPhrase;
      });
    }  
  }
  // GenerateOrderBarcodeNumber(){
  //   this.service.GenerateOrderBarcodeNumber().subscribe(data=>{
  //     this.modalDetails.orderBarcode=data.reasonPhrase;
  //     if(!this.TransbarcodeActive)
  //     {
  //       this.GeneratePreviewNumberByBarcodeNum();
  //     }
  //   });
  // }
  GenerateOrderBarcodeNumber(){
    this.service.GenerateOrderBarcodeNumber().subscribe(data=>{
      this.modalDetails.orderBarcode=data.reasonPhrase;
      if(!this.TransbarcodeActive)
      {
        //this.GeneratePreviewNumberByBarcodeNum();
        this.PreviewNumber_Reservation(this.modalDetails.branchId,this.modalDetails.orderBarcode,this.modalDetails.type);
      }
    });
  }

  PreviewNumber_Reservation(BranchId:any,orderBarcode:any,modalType:any){
    if(!(BranchId==null))
    {
      this.service.PreviewNumber_Reservation(BranchId,orderBarcode).subscribe(data=>{
        this.modalDetails.previewCode=data.reasonPhrase;
      });
    }
  }

  //-----------------------OPEN MODAL--------------------------------------------------

  openModal(template: TemplateRef<any>, data?: any, modalType?: any) {
    this.resetModal();
    this.fillBranchByUserId(modalType);
    if(this.TransbarcodeActive)
    {
      this.GetAllPreviewsSelectBarcode();
    }
    debugger
    if (modalType == 'addPreview1') {
      if(!this.TransbarcodeActive)
      {
        //this.GeneratePreviewNumber();
        //this.PreviewNumber_Reservation(this.modalDetails.branchId);
      }   
    }
    if (modalType == 'addPreview2') {
      this.modalDetails.orderBarcode=1;
      // this.modalDetails.previewCode=1;
      //this.PreviewNumber_Reservation(this.modalDetails.branchId,this.modalDetails.orderBarcode,'addPreview2');
      //this.GenerateOrderBarcodeNumber();
      //this.PreviewNumber_Reservation(this.modalDetails.branchId);
      //this.PreviewNumber_Reservation(this.modalDetails.branchId,"First");
      this.TransbarcodeActive=false;
    }
    console.log('this.modalDetails');
    console.log(this.modalDetails);


    if (data) {
      this.modalDetails = data;
      if (modalType == 'editPreview' || modalType == 'PreviewView') {
        this.TransbarcodeActive=false;
        if(this.modalDetails.date!=null)
        {
          this.modalDetails.date = this._sharedService.String_TO_date(this.modalDetails.date);
          this.modalDetails.prevDateTime = this.modalDetails.date;
        }
        debugger
        if(!(this.modalDetails.totalValue==null || this.modalDetails.totalValue==""))
        {
          this.modalDetails.totalValueStatus=true;
        }
        else
        {
          this.modalDetails.totalValueStatus=false;
        }

        if(this.modalDetails.meetingDate!=null)
        {
          this.modalDetails.meetingDate = this._sharedService.String_TO_date(this.modalDetails.meetingDate);
        }    
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
    if(type === 'ShowPreviewFiles')
    {
      this.GetAllPreviewFiles(this.modalDetails.previewId);
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


  TransbarcodeActive:boolean=false;
  confirmAddPreviewMessage(){
    this.TransbarcodeActive=true;
  }
  declineAddPreviewMessage(){
    this.TransbarcodeActive=false;
    this.GenerateOrderBarcodeNumber();
    //this.PreviewNumber_Reservation(this.modalDetails.branchId,this.modalDetails.orderBarcode,"addPreview1");
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

   

    var prevObj: any = {};
    prevObj.previewId = this.modalDetails.previewId;
    prevObj.branchId = this.modalDetails.branchId;

    if(this.modalDetails.previewStatus==3){
      if(this.modalDetails.meetingDate==null){
        this.toast.error(this.translate.instant("من فضلك أختر تاريخ الإجتماع"),this.translate.instant('Message'));
        return;
      }
      if(this.modalDetails.meetingChairperson==null){
        this.toast.error(this.translate.instant("من فضلك أختر القائم بالإجتماع"),this.translate.instant('Message'));
        return;
      }
      if (this.modalDetails.meetingDate != null) {
        prevObj.meetingDate = this._sharedService.date_TO_String(this.modalDetails.meetingDate);
      }
      prevObj.meetingChairperson=this.modalDetails.meetingChairperson;

    }


    prevObj.orderBarcode = this.modalDetails.orderBarcode;

    prevObj.previewCode = this.modalDetails.previewCode;
    prevObj.customerId = this.modalDetails.customerId;
    prevObj.previewChairperson = this.modalDetails.previewChairperson;
    prevObj.previewTypeId = this.modalDetails.previewTypeId;
    prevObj.previewStatus = this.modalDetails.previewStatus;
    if (this.modalDetails.date != null) {
      prevObj.date = this._sharedService.date_TO_String(this.modalDetails.date);
    }
    if (this.modalDetails.prevDateTime != null) {
      prevObj.prevDateTime = this._sharedService.formatAMPM(this.modalDetails.prevDateTime);
    }

    prevObj.totalValue = this.modalDetails.totalValue;


    prevObj.notes = this.modalDetails.notes;

    prevObj.orderBarcodeAuto=!this.TransbarcodeActive;

    console.log('prevObj');
    console.log(prevObj);

    const formData = new FormData();
    for (const key of Object.keys(prevObj)) {
      const value = prevObj[key] == null ? '' : prevObj[key];
      formData.append(key, value);
      formData.append('PreviewId', prevObj.previewId.toString());
    }
    this.disableButtonSave_Preview = true;
    setTimeout(() => {
      this.disableButtonSave_Preview = false;
    }, 5000);
    this.service.SavePreview(formData).subscribe((result: any) => {
      if (result.statusCode == 200) {
        this.toast.success(
          this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
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

    if (this.modalDetails.branchId == null ||this.modalDetails.branchId == '') {
      this.ValidateObjMsg = { status: false, msg: 'أختر فرع المعاينة' };
      return this.ValidateObjMsg;
    }
    // else if (this.modalDetails.branchId == 1 ||this.modalDetails.branchId == '1') {
    //   this.ValidateObjMsg = { status: false, msg: 'لا يمكنك الحفظ في الإدارة المركزية' };
    //   return this.ValidateObjMsg;
    // } 
     else if (this.modalDetails.orderBarcode == null ||this.modalDetails.orderBarcode == '') {
      this.ValidateObjMsg = { status: false, msg: 'أدخل باركود العمليات' };
      return this.ValidateObjMsg;
    } else if (this.modalDetails.previewCode == null || this.modalDetails.previewCode == '') {
      this.ValidateObjMsg = { status: false, msg: 'اختر كود المعاينة' };
      return this.ValidateObjMsg;
    } else if (this.modalDetails.customerId == null ||this.modalDetails.customerId == '') {
      this.ValidateObjMsg = { status: false, msg: 'اختر عميل' };
      return this.ValidateObjMsg;
    }
    else if ((this.modalDetails.previewChairperson == null ||this.modalDetails.previewChairperson == '')) {
      this.ValidateObjMsg = { status: false, msg: 'اختر القائم بالمعاينة' };
      return this.ValidateObjMsg;
    }
    else if ((this.modalDetails.previewTypeId == null ||this.modalDetails.previewTypeId == '')) {
      this.ValidateObjMsg = { status: false, msg: 'اختر نوع المعاينة' };
      return this.ValidateObjMsg;
    }
    else if ((this.modalDetails.previewStatus == null ||this.modalDetails.previewStatus == '')) {
      this.ValidateObjMsg = { status: false, msg: 'اختر حالة المعاينة' };
      return this.ValidateObjMsg;
    }
    else if ((this.modalDetails.date == null ||this.modalDetails.date == '')) {
      this.ValidateObjMsg = {status: false,msg: 'ادخل تاريخ المعاينة',};
      return this.ValidateObjMsg;
    }
    else if (this.modalDetails.totalValueStatus && ((this.modalDetails.totalValue == null ||this.modalDetails.totalValue == ''))) {
      this.ValidateObjMsg = {status: false,msg: 'ادخل مبلغ الرسوم',};
      return this.ValidateObjMsg;
    }
    else if ((this.modalDetails.prevDateTime == null ||this.modalDetails.prevDateTime == '')) {
      this.ValidateObjMsg = {
        status: false,
        msg: 'ادخل وقت المعاينة',
      };
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
        orderBarcode: this.dataSourceTemp[index].orderBarcode,
        previewCode: this.dataSourceTemp[index].previewCode,
        customerName: this.dataSourceTemp[index].customerName,
        mainPhoneNo: this.dataSourceTemp[index].mainPhoneNo,
        address: this.dataSourceTemp[index].address,
        chairpersonName: this.dataSourceTemp[index].chairpersonName,
        date: this.dataSourceTemp[index].date,
        previewStatus: this.dataSourceTemp[index].previewStatustxt,
        previewConvert: this.dataSourceTemp[index].previewConverttxt,
        addDate: this.dataSourceTemp[index].addDate,
      });
    }
    this.service.customExportExcel(x, 'Previews');
  }

  getAllPreviews() {
    this.service.GetAllPreviews_Branch().subscribe((data: any) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSourceTemp = data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.allPreviewCount = data.length;
      this.FillSerachLists(data);
    });
  }

  


  getpreviewdata(customerId:any){
    this.modalDetails.customerId=customerId;
    let data = this.load_BarcodesCustomer.filter((d: { id: any }) => d.id == customerId); 
    this.modalDetails.orderBarcode=data[0].name;
    //this.GeneratePreviewNumberByBarcodeNum();
    //this.PreviewNumber_Reservation(this.modalDetails.branchId,this.modalDetails.orderBarcode,this.modalDetails.type)
  }

  CustomerChange(customerId:any){
    debugger
    if(this.TransbarcodeActive)
    {
      this.modalDetails.previewBarcodeSelect=null;
      this.modalDetails.previewCode=null;
      if(customerId==null)
      {
        this.load_BarcodesCustomer=this.load_BarcodesCustomerTemp;
        return;
      }
      let data = this.load_BarcodesCustomerTemp.filter((d: { id: any }) => d.id == customerId); 
      this.load_BarcodesCustomer = data;
      if(data.length==1)
      {
        this.modalDetails.previewBarcodeSelect=data[0].id;
        this.getpreviewdata(data[0].id);  
      }
    }
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
      orderBarcode:null,
      previewBarcodeSelect: null,
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
      meetingCode: null,
      meetingDate: null,
      meetingId: null,
      meetingChairperson: null,
      prevDateTime:null,
    };
  }

  confirm(): void {
    this.service.DeletePreview(this.modalDetails.previewId).subscribe((result) => {
        if (result.statusCode == 200) {
          this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
          this.getAllPreviews();
          this.modal?.hide();
        } else {
          this.toast.error(result.reasonPhrase, this.translate.instant('Message'));
        }
      });
  }

  confirmConvert(): void {
    this.service.ConvertPreview(this.modalDetails.previewId).subscribe((result) => {
        if (result.statusCode == 200) {
          this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
          this.getAllPreviews();
          this.modal?.hide();
        } else {
          this.toast.error(result.reasonPhrase, this.translate.instant('Message'));
        }
      });
  }

  //-----------------------------------SavePreviewType-------------------------------
  //#region 
  selectedPreviewType: any;

  AddDataType: any = {
    PreviewTypedata: {
      id: 0,
      namear: null,
      nameen: null,
    },
  };
  PreviewTypeRowSelected: any;
  getPreviewTypeRow(row: any) {
    this.PreviewTypeRowSelected = row;
  }
  setPreviewTypeInSelect(data: any, modal: any) {
    this.modalDetails.previewTypeId=data.id;
  }
  confirmPreviewTypeDelete() {
    this.service.DeletePreviewType(this.PreviewTypeRowSelected.id).subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
          this.FilltAllPreviewTypes();
        } else {
          this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
        }
      });
  }

  savePreviewType() {
    if (
      this.AddDataType.PreviewTypedata.namear == null ||
      this.AddDataType.PreviewTypedata.nameen == null
    ) {
      this.toast.error('من فضلك أكمل البيانات', 'رسالة');
      return;
    }
    var PreviewTypeObj: any = {};
    PreviewTypeObj.PreviewTypeId = this.AddDataType.PreviewTypedata.id;
    PreviewTypeObj.NameAr = this.AddDataType.PreviewTypedata.namear;
    PreviewTypeObj.NameEn = this.AddDataType.PreviewTypedata.nameen;

    var obj = PreviewTypeObj;
    this.service.SavePreviewType(obj).subscribe((result: any) => {
      if (result.statusCode == 200) {
        this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
        this.resetPreviewType();
        this.FilltAllPreviewTypes();
      } else {
        this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
      }
    });
  }
  resetPreviewType() {
    this.AddDataType.PreviewTypedata.id = 0;
    this.AddDataType.PreviewTypedata.namear = null;
    this.AddDataType.PreviewTypedata.nameen = null;
  }
  //#endregion
  //----------------------------------EndSavePreviewtype-----------------------------

  

  decline(): void {
    this.modal?.hide();
  }


  UpdateMeeting() {   
    debugger;
    var MeetingObj: any = {};
    MeetingObj.MeetingId = this.modalDetails.meetingId;
    if(this.modalDetails.meetingDate!=null)
    {
      MeetingObj.Date = this._sharedService.date_TO_String(this.modalDetails.meetingDate);
    } 
    MeetingObj.MeetingChairperson = this.modalDetails.meetingChairperson;

    this.service.UpdateMeeting(MeetingObj).subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(this.translate.instant(result.reasonPhrase), this.translate.instant('Message'));
          this.getAllPreviews();
        } else {
          this.toast.error(this.translate.instant(result.reasonPhrase), this.translate.instant('Message') );
        }
      });
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

  //--------------------------------UploadFiles---------------------------------------
  //#region 
public uploadedFiles: Array<File> = [];
selectedFiles?: FileList;
currentFile?: File;

progress = 0;
uploading=false;
disableButtonSave_File = false;
dataFile:any={
  FileId:0,
  FileName:null,
}
resetprog(){
  this.disableButtonSave_File = false;
  this.progress = 0;
  this.uploading=false;
}

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }
  SaveprojectFiles(type:any,dataFile:any,uploadtype:any) {
  if(this.dataFile.FileName==null)
  {
    this.toast.error("من فضلك أكمل البيانات ", 'رسالة');
    return;
  }
  if(this.control?.value.length>0){
  }
    var _Files: any = {};
    _Files.fileId=0;
    _Files.previewId=this.modalDetails.previewId;
    _Files.fileName=this.dataFile.FileName;
    _Files.transactionTypeId=37;
    _Files.notes=null;
    this.progress = 0;
    this.disableButtonSave_File = true;
    this.uploading=true;
    setTimeout(() => {
      this.resetprog();
    }, 60000);

    if (this.control?.value.length>0) {
      var obj=_Files;
      this.files.UploadFiles(this.control?.value[0],obj).subscribe((result: any)=>{
        if (result.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(100 * result.loaded / result.total);
        }
        debugger
        if(result?.body?.statusCode==200){
          this.control.removeFile(this.control?.value[0]);
          this.toast.success(this.translate.instant(result?.body?.reasonPhrase),'رسالة');
          this.getAllPreviews();
          this.ClearField();
          this.resetprog();
        }
        else if(result?.body?.statusCode>200){
          this.toast.error(this.translate.instant(result?.body?.reasonPhrase), 'رسالة');
          this.resetprog();
        }
        else if(result?.type>=0)
        {}
        else{this.toast.error(this.translate.instant(result?.body?.reasonPhrase), 'رسالة');this.resetprog();}

      });
    }
    else{this.toast.error("من فضلك أختر ملف", 'رسالة');}


  }
ClearField(){
  this.dataFile.FileId=0;
  this.dataFile.FileName=null;
  this.selectedFiles = undefined;
  this.uploadedFiles=[];
}

clickfile(evenet:any)
{
  console.log(evenet);
}
focusfile(evenet:any)
{
  console.log(evenet);
}
blurfile(evenet:any)
{
  console.log(evenet);
}


downloadFile3(data: any) {
  debugger
  var link="file:///D:/Terra/testtgrebe/64background.png";
  console.log(link);
  window.open(link, '_blank');
}

downloadFile(data: any) {
  try
  {
    debugger
    //var link=environment.PhotoURL+"/Uploads/Users/img1.jpg";
    var link=environment.PhotoURL+data.fileUrl;
    console.log(link);
    window.open(link, '_blank');
  }
  catch (error)
  {
    this.toast.error("تأكد من الملف",this.translate.instant("Message"));
  }
}

downloadFile2(data: any) {
  try
  {
    debugger
    //var link=environment.PhotoURL+data.fileUrl;
    var link="http://"+data.fileUrl;
    console.log(link);
    window.open(link, '_blank');
  }
  catch (error)
  {
    this.toast.error("تأكد من الملف",this.translate.instant("Message"));
  }
}
PreviewFileRowSelected: any;

getPreviewFileRow(row: any) {
  debugger
  this.PreviewFileRowSelected = row;
}
confirmDeletePreviewFile(): void {
  this.files.DeleteFiles(this.PreviewFileRowSelected.fileId).subscribe((result) => {
      if (result.statusCode == 200) {
        this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
        this.GetAllPreviewFiles(this.PreviewFileRowSelected.previewId);
        this.modal?.hide();
      } else {
        this.toast.error(result.reasonPhrase, this.translate.instant('Message'));
      }
    });
}

PreviewFilesList: any=[];

GetAllPreviewFiles(PreviewId:any) {
  this.PreviewFilesList=[];
  this.files.GetAllPreviewFiles(PreviewId).subscribe((data: any) => {
    this.PreviewFilesList = data;
  });
}


  //-------------------------------EndUploadFiles-------------------------------------
//#endregion


//------------------------------Search--------------------------------------------------------
//#region 

dataSearch: any = {
  filter: {
    enable: false,
    date: null,
    isChecked: false,
    ListName:[],
    ListCode:[],
    ListPhone:[],
    ListEmployee:[],
    ListPreviewStatus:[],
    ListPreviewValue:[],
    customerId:null,
    previewChairperson:null,
    previewStatusId:null,
    PreviewValueId:null,
    showFilters:false
  },
};

  FillSerachLists(dataT:any){
    this.FillCustomerListName(dataT);
    this.FillCustomerListCode(dataT);
    this.FillCustomerListPhone(dataT);
    this.FillCustomerListEmployee(dataT);
    this.FillListPreviewStatus();
    this.FillListPreviewValue();
  }

  FillCustomerListName(dataT:any){
    const ListLoad = dataT.map((item: { customerId: any; customerName: any; }) => {
      const container:any = {}; container.id = item.customerId; container.name = item.customerName; return container;
    })
    const key = 'id';
    const arrayUniqueByKey = [...new Map(ListLoad.map((item: { [x: string]: any; }) => [item[key], item])).values()];
    this.dataSearch.filter.ListName=arrayUniqueByKey;
  }
  FillCustomerListCode(dataT:any){
    const ListLoad = dataT.map((item: { customerId: any; customerCode: any; }) => {
      const container:any = {}; container.id = item.customerId; container.name = item.customerCode; return container;
    })
    const key = 'id';
    const arrayUniqueByKey = [...new Map(ListLoad.map((item: { [x: string]: any; }) => [item[key], item])).values()];
    this.dataSearch.filter.ListCode=arrayUniqueByKey;
  }
  FillCustomerListPhone(dataT:any){
    const ListLoad = dataT.map((item: { customerId: any; mainPhoneNo: any; }) => {
      const container:any = {}; container.id = item.customerId; container.name = item.mainPhoneNo; return container;
    })
    const key = 'id';
    const arrayUniqueByKey = [...new Map(ListLoad.map((item: { [x: string]: any; }) => [item[key], item])).values()];
    this.dataSearch.filter.ListPhone=arrayUniqueByKey;
  }
  FillCustomerListEmployee(dataT:any){
    const ListLoad = dataT.map((item: { previewChairperson: any; chairpersonName: any; }) => {
      const container:any = {}; container.id = item.previewChairperson; container.name = item.chairpersonName; console.log("container",container); return container;   
    })
    const key = 'id';
    const arrayUniqueByKey = [...new Map(ListLoad.map((item: { [x: string]: any; }) => [item[key], item])).values()];
    this.dataSearch.filter.ListEmployee=arrayUniqueByKey;
    this.dataSearch.filter.ListEmployee = this.dataSearch.filter.ListEmployee.filter((d: { id: any }) => (d.id !=null && d.id!=0));
  }

  FillListPreviewStatus(){
    this.dataSearch.filter.ListPreviewStatus= [
      { id: 1, name: 'قيد الإنتظار' },
      { id: 2, name: 'قيد التشغيل' },
      { id: 3, name: 'منتهية' },
    ];
  }
  FillListPreviewValue(){
    this.dataSearch.filter.ListPreviewValue= [
      { id: 1, name: 'نشط' },
      { id: 2, name: 'غير نشط' },
    ];
  }

  RefreshDataCheck(from: any, to: any){
    this.dataSource.data=this.dataSourceTemp;
    if(!(from==null || from=="" || to==null || to==""))
    {
      debugger
      this.dataSource.data = this.dataSource.data.filter((item: any) => {
        var AccDate=new Date(item.date);
        var AccFrom=new Date(from);
        var AccTo=new Date(to);
        return AccDate.getTime() >= AccFrom.getTime() &&
        AccDate.getTime() <= AccTo.getTime();
    });
    }
    if(this.dataSearch.filter.customerId!=null && this.dataSearch.filter.customerId!="")
    {
      this.dataSource.data = this.dataSource.data.filter((d: { customerId: any }) => d.customerId == this.dataSearch.filter.customerId);
    }
    if(this.dataSearch.filter.previewChairperson!=null && this.dataSearch.filter.previewChairperson!="")
    {
      this.dataSource.data = this.dataSource.data.filter((d: { previewChairperson: any }) => d.previewChairperson == this.dataSearch.filter.previewChairperson);
    } 
    if(this.dataSearch.filter.previewStatusId!=null && this.dataSearch.filter.previewStatusId!="")
    {
      this.dataSource.data = this.dataSource.data.filter((d: { previewStatus: any }) => d.previewStatus == this.dataSearch.filter.previewStatusId);
    } 
    if(this.dataSearch.filter.PreviewValueId!=null && this.dataSearch.filter.PreviewValueId!="")
    {
      if(this.dataSearch.filter.PreviewValueId==1)
      {
        this.dataSource.data = this.dataSource.data.filter((d: { totalValue: any }) => !(d.totalValue ==null || d.totalValue ==""));
      }
      else{
        this.dataSource.data = this.dataSource.data.filter((d: { totalValue: any }) => (d.totalValue ==null || d.totalValue ==""));
      }
    } 
   
  }

  ClearDate(){
    if(this.dataSearch.filter.enable==false){ 
      this.dataSearch.filter.date=null;   
      this.RefreshDataCheck(null,null);
    }
  }
  CheckDate(event: any) {
    debugger
    if (event != null) {
      var from = this._sharedService.date_TO_String(event[0]);
      var to = this._sharedService.date_TO_String(event[1]);
      this.RefreshDataCheck(from, to);
    } else {    
      this.RefreshDataCheck(null,null);
    }
  }
  RefreshData(){
    debugger
    if( this.dataSearch.filter.date==null)
    {
    this.RefreshDataCheck(null,null);
    }
    else
    {
    this.RefreshDataCheck(this.dataSearch.filter.date[0],this.dataSearch.filter.date[1]);
    }
  }
  //#endregion 
//------------------------------Search--------------------------------------------------------

}
