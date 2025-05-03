
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

import { MeetingService } from 'src/app/core/services/project-services/meeting.service';
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
import { PreviewService } from 'src/app/core/services/project-services/preview.service';
import { HttpEventType } from '@angular/common/http';
import { filesservice } from 'src/app/core/services/sys_Services/files.service';

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
  selector: 'app-meeting',
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.scss'],
  animations: [fade],
})
export class MeetingComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSourceTemp: any = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource([{}]);
  _MeetingSMS: any = null;
  modal?: BsModalRef;
  modalDetails: any = {};
  load_BranchAccount: any;
  load_CityAndAreas: any;
  customrRowSelected: any;
  BranchId: number;
  allMeetingCount = 0;
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
      link: '/projects/meeting',
    },
    sub: {
      ar: 'الإجتماعات',
      en: 'Meeting',
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
    'previewTypeName',
    'meetingCode',
    'customerCode',
    'customerName',
    'mainPhoneNo',
    'address', 
    'chairpersonName', 
    'date', 
    'meetingStatustxt', 
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
      search_MeetingName: '',
      search_meetingEmail: '',
      search_meetingMobile: '',
      isChecked: false,
    },
  };

  EditModel: any = {
    MeetingId: 0,
    nameAr: null,
    nameEn: null,
  };

  constructor(
    private service: MeetingService,
    private previewservice: PreviewService,
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
  MeetingStatusList: any;

  ngOnInit(): void {
    this.MeetingStatusList = [
      { id: 1, name: { ar: 'قيد الإنتظار', en: 'pending' } },
      { id: 2, name: { ar: 'قيد التشغيل', en: 'in progress' } },
      { id: 3, name: { ar: 'منتهية', en: 'finished' } },
    ];
    this.getAllMeetings();
    this.FillCustomerSelect();
    this.FillEmployeeselect();
    this.FillEmployeeselect_Des();
    this.FilltAllPreviewTypes();
    this.FillMeetingTypesSelect();
  }

  MeetingTypesList: any;
  FillMeetingTypesSelect() {
    this.service.FillMeetingTypesSelect().subscribe((data) => {
      this.MeetingTypesList = data;
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
          (d.meetingCode &&
            d.meetingCode?.trim().toLowerCase().indexOf(val) !== -1) ||
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
  //     this.getAllMeetings();
  //   } else {
  //     this.RefreshData();
  //   }
  // }

  resetandRefresh() {
    if (this.searchBox.open == false) {
      this.data2.filter.search_MeetingName = null;
      this.data2.filter.search_meetingMobile = null;
      this.data.type = 0;
      this.getAllMeetings();
    }
  }
  //------------------ Fill DATA ----------------------------------

  fillBranchByUserId() {
    this.service.FillBranchByUserIdSelect().subscribe((data) => {
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

  // load_BarcodesCustomer: any=[];
  // GetAllPreviewsSelectBarcodeFinished() {
  //   this.previewservice.GetAllPreviewsSelectBarcodeFinished().subscribe((data) => {
  //     this.load_BarcodesCustomer = data;
  //     console.log(this.load_BarcodesCustomer);
  //   });
  // }
  load_BarcodesCodes: any=[];  
  load_BarcodesCodesTemp: any=[];

  GetAllPreviewsCodeFinished() {
    this.previewservice.GetAllPreviewsCodeFinished().subscribe((data) => {
      this.load_BarcodesCodes = data;
      this.load_BarcodesCodesTemp=data;
      console.log(this.load_BarcodesCodes);
    });
  }
  GetAllPreviewsCodeAll() {
    this.previewservice.GetAllPreviewsCodeAll().subscribe((data) => {
      this.load_BarcodesCodes = data;
      this.load_BarcodesCodesTemp=data;
      console.log(this.load_BarcodesCodes);
    });
  }

  PreviewTypesList: any=[];
  FilltAllPreviewTypes() {
    this.previewservice.FilltAllPreviewTypes().subscribe((data) => {
      this.PreviewTypesList = data;
    });
  }

  load_Employees: any=[];
  FillEmployeeselect() {
    this.employeeService.FillEmployeeselect(3).subscribe((data) => {
      this.load_Employees = data;
    });
  }
  load_Employees_Des: any=[];
  FillEmployeeselect_Des() {
    this.employeeService.FillEmployeeselect(4).subscribe((data) => {
      this.load_Employees_Des = data;
    });
  }

  GenerateMeetingNumber(){
    debugger
    this.service.GenerateMeetingNumber().subscribe(data=>{
      this.modalDetails.meetingCode=data.reasonPhrase;
    });
  }
  GenerateMeetingNumberByBarcodeNum(){
    debugger
    if(!(this.modalDetails.orderBarcode==null || this.modalDetails.orderBarcode==""))
    {
      this.service.GenerateMeetingNumberByBarcodeNum(this.modalDetails.orderBarcode).subscribe(data=>{
        this.modalDetails.meetingCode=data.reasonPhrase;
      });
    }  
  }

  //-----------------------OPEN MODAL--------------------------------------------------

  openModal(template: TemplateRef<any>, data?: any, modalType?: any) {
    this.resetModal();
    //this.GetAllPreviewsSelectBarcodeFinished();

    debugger
    if (modalType == 'addMeeting') {
      this.GetAllPreviewsCodeFinished();
      //this.GenerateMeetingNumber(); 
    }
    console.log('this.modalDetails');
    console.log(this.modalDetails);


    if (data) {
      this.modalDetails = data;
      this.fillBranchByUserId();
      if (modalType == 'editMeeting' || modalType == 'MeetingView') {
        this.GetAllPreviewsCodeAll();
        if(this.modalDetails.date!=null)
        {
          this.modalDetails.date = this._sharedService.String_TO_date(this.modalDetails.date);
          this.modalDetails.meetDateTime = this.modalDetails.date;
        }
        if(this.modalDetails.designDate!=null)
        {
          this.modalDetails.designDate = this._sharedService.String_TO_date(this.modalDetails.designDate);
          this.modalDetails.desDateTime = this.modalDetails.desingDate;
        }    
        if (data.agentAttachmentUrl != null) {
          this.modalDetails.attachmentUrl =
            environment.PhotoURL + data.agentAttachmentUrl;
          //this.modalDetails.attachmentUrl = this.domSanitizer.bypassSecurityTrustUrl(environment.PhotoURL+data.agentAttachmentUrl)
        }
      }
      console.log(this.modalDetails);
    }
    else
    {
      this.fillBranchByUserId();
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
  modalDetailsPublic: any = {};

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
    if(type === 'ShowMeetingFiles')
    {
      if (data) {
        this.modalDetailsPublic = data;
      }
      this.GetAllMeetingFiles(this.modalDetails.meetingId,this.modalDetails.previewId);
    }
    this.ngbModalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        size: type ? 'xl' : 'lg',
        centered:type == 'PreviewNotes' ? true : !type ? true : false,
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


  MeetingIdPublic: any = 0;
  setMeetingid_P(id: any) {
    this.MeetingIdPublic = id;
    console.log('this.MeetingIdPublic');
    console.log(this.MeetingIdPublic);
  }

  disableButtonSave_Meeting = false;

  addMeeting() {
    debugger;
    var val = this.validateForm();
    if (val.status == false) {
      this.toast.error(val.msg, 'رسالة');
      return;
    }
    var prevObj: any = {};
    prevObj.meetingId = this.modalDetails.meetingId;

    if(this.modalDetails.meetingStatus==3){
      if(this.modalDetails.designDate==null){
        this.toast.error(this.translate.instant("من فضلك أختر تاريخ التصميم"),this.translate.instant('Message'));
        return;
      }
      if((this.modalDetails.desDateTime == null ||this.modalDetails.desDateTime == '')){
        this.toast.error(this.translate.instant("من فضلك أختر وقت التصميم"),this.translate.instant('Message'));
        return;
      }
      if(this.modalDetails.designChairperson==null){
        this.toast.error(this.translate.instant("من فضلك أختر القائم بالتصميم"),this.translate.instant('Message'));
        return;
      }
      if (this.modalDetails.designDate != null) {
        prevObj.designDate = this._sharedService.date_TO_String(this.modalDetails.designDate);
      }
      if (this.modalDetails.desDateTime != null) {
        prevObj.desDateTime = this._sharedService.formatAMPM(this.modalDetails.desDateTime);
      }
      prevObj.designChairperson=this.modalDetails.designChairperson;
      prevObj.designCode=this.modalDetails.designCode;

    }

    prevObj.branchId = this.modalDetails.branchId;
    prevObj.previewId = this.modalDetails.previewId;
    prevObj.meetingCode = this.modalDetails.meetingCode;
    prevObj.customerId = this.modalDetails.customerId;
    prevObj.meetingChairperson = this.modalDetails.meetingChairperson;
    prevObj.meetingTypeId = this.modalDetails.meetingTypeId;
    prevObj.meetingStatus = this.modalDetails.meetingStatus;
    if (this.modalDetails.date != null) {
      prevObj.date = this._sharedService.date_TO_String(this.modalDetails.date);
    }
    debugger
    if (this.modalDetails.meetDateTime != null) {
      prevObj.meetDateTime = this._sharedService.formatAMPM(this.modalDetails.meetDateTime);
    }

    prevObj.notes = this.modalDetails.notes;

    console.log('prevObj');
    console.log(prevObj);

    const formData = new FormData();
    for (const key of Object.keys(prevObj)) {
      const value = prevObj[key] == null ? '' : prevObj[key];
      formData.append(key, value);
      formData.append('MeetingId', prevObj.meetingId.toString());
    }
    this.disableButtonSave_Meeting = true;
    setTimeout(() => {
      this.disableButtonSave_Meeting = false;
    }, 5000);
    this.service.SaveMeeting(formData).subscribe((result: any) => {
      if (result.statusCode == 200) {
        this.toast.success(
          this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
        this.decline();
        this.getAllMeetings();
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
      this.modalDetails.branchId == null ||
      this.modalDetails.branchId == ''
    ) {
      this.ValidateObjMsg = { status: false, msg: 'أختر فرع الإجتماع' };
      return this.ValidateObjMsg;
    } else if (
      this.modalDetails.previewId == null ||
      this.modalDetails.previewId == ''
    ) {
      this.ValidateObjMsg = { status: false, msg: 'أدخل كود المعاينة' };
      return this.ValidateObjMsg;
    } else if (this.modalDetails.meetingCode == null || this.modalDetails.meetingCode == '') {
      this.ValidateObjMsg = { status: false, msg: 'اختر كود الإجتماع' };
      return this.ValidateObjMsg;
    } else if (
      this.modalDetails.customerId == null ||
      this.modalDetails.customerId == ''
    ) {
      this.ValidateObjMsg = { status: false, msg: 'اختر عميل' };
      return this.ValidateObjMsg;
    }
    else if ((this.modalDetails.meetingChairperson == null ||this.modalDetails.meetingChairperson == '')
    ) {
      this.ValidateObjMsg = { status: false, msg: 'اختر القائم بالإجتماع' };
      return this.ValidateObjMsg;
    }
    else if ((this.modalDetails.meetingTypeId == null ||this.modalDetails.meetingTypeId == '')
    ) {
      this.ValidateObjMsg = { status: false, msg: 'اختر نوع الإجتماع' };
      return this.ValidateObjMsg;
    }
    else if ((this.modalDetails.meetingStatus == null ||this.modalDetails.meetingStatus == '')
    ) {
      this.ValidateObjMsg = { status: false, msg: 'اختر حالة الإجتماع' };
      return this.ValidateObjMsg;
    }
    else if ((this.modalDetails.date == null ||this.modalDetails.date == '')) {
      this.ValidateObjMsg = {status: false, msg: 'ادخل تاريخ الإجتماع',};
      return this.ValidateObjMsg;
    }
    else if ((this.modalDetails.meetDateTime == null ||this.modalDetails.meetDateTime == '')) {
      this.ValidateObjMsg = {
        status: false,
        msg: 'ادخل وقت الإجتماع',
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
        meetingCode: this.dataSourceTemp[index].meetingCode,
        customerName: this.dataSourceTemp[index].customerName,
        chairpersonName: this.dataSourceTemp[index].chairpersonName,
        meetingStatus: this.dataSourceTemp[index].meetingStatustxt,
        designConvert: this.dataSourceTemp[index].designConverttxt,
      });
    }
    this.service.customExportExcel(x, 'Meetings');
  }

  DesignNumber_Reservation(BranchId:any,orderBarcode:any,modalType:any){
    debugger
    if(!(BranchId==null))
    {
      this.service.DesignNumber_Reservation(BranchId,orderBarcode).subscribe(data=>{
        this.modalDetails.designCode=data.reasonPhrase;
      });
    }
  }

  meetingStatusChange(){
    if(this.modalDetails.meetingStatus==3)
    {
      this.DesignNumber_Reservation(this.modalDetails.branchId,this.modalDetails.orderBarcode,this.modalDetails.type);
    }
  }

  getAllMeetings() {
    this.service.GetAllMeetings_Branch().subscribe((data: any) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSourceTemp = data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.allMeetingCount = data.length;
      this.FillSerachLists(data);
    });
  }

  getmeetingdata(previewId:any){
    let data = this.load_BarcodesCodes.filter((d: { id: any }) => d.id == previewId); 
    this.modalDetails.orderBarcode=data[0].name;
    this.modalDetails.customerId=data[0].customerId;
    this.modalDetails.previewTypeId=data[0].previewTypeId;
    this.GenerateMeetingNumberByBarcodeNum();
  }

  CustomerChange(customerId:any){
    debugger
    this.modalDetails.previewId=null;
    this.modalDetails.previewTypeId=null;

    if(customerId==null)
    {
      this.load_BarcodesCodes=this.load_BarcodesCodesTemp;
      return;
    }
    let data = this.load_BarcodesCodesTemp.filter((d: { customerId: any }) => d.customerId == customerId); 
    this.load_BarcodesCodes = data;
    if(data.length==1)
    {
      this.modalDetails.previewId=data[0].id;
      this.modalDetails.previewTypeId=data[0].previewTypeId;
      this.getmeetingdata(data[0].id);  
    }
  }
  previewTypeChange(previewTypeId:any){
    debugger
    this.modalDetails.previewId=null;
    this.modalDetails.customerId=null;

    if(previewTypeId==null)
    {
      this.load_BarcodesCodes=this.load_BarcodesCodesTemp;
      return;
    }
    let data = this.load_BarcodesCodesTemp.filter((d: { previewTypeId: any }) => d.previewTypeId == previewTypeId); 
    this.load_BarcodesCodes = data;
    if(data.length==1)
    {
      this.modalDetails.previewId=data[0].id;
      this.modalDetails.customerId=data[0].customerId;
      this.getmeetingdata(data[0].id);  
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
      type: 'addMeeting',
      nameAr: null,
      nameEn: null,
      id: null,
      name: null,
      meetingId: 0,
      branchId: null,
      orderBarcode:null,
      previewId: null,
      previewTypeId:null,
      meetingCode: null,
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
      addedmeetingImg: null,
      designCode: null,
      designDate: null,
      designChairperson: null,
      meetDateTime:null,
    };
  }

  confirm(): void {
    this.service.DeleteMeeting(this.modalDetails.meetingId).subscribe((result) => {
        if (result.statusCode == 200) {
          this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
          this.getAllMeetings();
          this.modal?.hide();
        } else {
          this.toast.error(result.reasonPhrase, this.translate.instant('Message'));
        }
      });
  }

  confirmConvert(): void {
    this.service.ConvertMeeting(this.modalDetails.meetingId).subscribe((result) => {
        if (result.statusCode == 200) {
          this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
          this.getAllMeetings();
          this.modal?.hide();
        } else {
          this.toast.error(result.reasonPhrase, this.translate.instant('Message'));
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
      _Files.meetingId=this.modalDetails.meetingId;
      _Files.fileName=this.dataFile.FileName;
      _Files.transactionTypeId=38;
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
            this.getAllMeetings();
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

  MeetingFileRowSelected: any;
  
  getMeetingFileRow(row: any) {
    debugger
    this.MeetingFileRowSelected = row;
  }
  confirmDeleteMeetingFile(): void {
    this.files.DeleteFiles(this.MeetingFileRowSelected.fileId).subscribe((result) => {
        if (result.statusCode == 200) {
          this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
          this.GetAllMeetingFiles(this.modalDetailsPublic.meetingId,this.modalDetailsPublic.previewId);
          this.modal?.hide();
        } else {
          this.toast.error(result.reasonPhrase, this.translate.instant('Message'));
        }
      });
  }
  
  MeetingFilesList: any=[];
  
  GetAllMeetingFiles(MeetingId:any,PreviewId:any) {
    this.MeetingFilesList=[];
    this.files.GetAllMeetingFiles(MeetingId).subscribe((data: any) => {
      this.MeetingFilesList = data;
      console.log(data);
    });
    this.GetAllPreviewFiles(PreviewId);
  }
  PreviewFilesList: any=[];

  GetAllPreviewFiles(PreviewId:any) {
    this.PreviewFilesList=[];
    this.files.GetAllPreviewFiles(PreviewId).subscribe((data: any) => {
      this.PreviewFilesList = data;
      console.log(data);
    });
  }
  
  
  //#endregion
    //-------------------------------EndUploadFiles-------------------------------------

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
    ListMeetingStatus:[],
    ListMeetingValue:[],
    customerId:null,
    meetingChairperson:null,
    meetingStatusId:null,
    showFilters:false
  },
};

  FillSerachLists(dataT:any){
    this.FillCustomerListName(dataT);
    this.FillCustomerListCode(dataT);
    this.FillCustomerListPhone(dataT);
    this.FillCustomerListEmployee(dataT);
    this.FillListMeetingStatus();
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
    const ListLoad = dataT.map((item: { meetingChairperson: any; chairpersonName: any; }) => {
      const container:any = {}; container.id = item.meetingChairperson; container.name = item.chairpersonName; console.log("container",container); return container;   
    })
    const key = 'id';
    const arrayUniqueByKey = [...new Map(ListLoad.map((item: { [x: string]: any; }) => [item[key], item])).values()];
    this.dataSearch.filter.ListEmployee=arrayUniqueByKey;
    this.dataSearch.filter.ListEmployee = this.dataSearch.filter.ListEmployee.filter((d: { id: any }) => (d.id !=null && d.id!=0));
  }

  FillListMeetingStatus(){
    this.dataSearch.filter.ListMeetingStatus= [
      { id: 1, name: 'قيد الإنتظار' },
      { id: 2, name: 'قيد التشغيل' },
      { id: 3, name: 'منتهية' },
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
    if(this.dataSearch.filter.meetingChairperson!=null && this.dataSearch.filter.meetingChairperson!="")
    {
      this.dataSource.data = this.dataSource.data.filter((d: { meetingChairperson: any }) => d.meetingChairperson == this.dataSearch.filter.meetingChairperson);
    } 
    if(this.dataSearch.filter.meetingStatusId!=null && this.dataSearch.filter.meetingStatusId!="")
    {
      this.dataSource.data = this.dataSource.data.filter((d: { meetingStatus: any }) => d.meetingStatus == this.dataSearch.filter.meetingStatusId);
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
