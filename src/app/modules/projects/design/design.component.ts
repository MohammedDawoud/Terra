
import { LiveAnnouncer } from '@angular/cdk/a11y';
import {AfterViewInit,ChangeDetectorRef,Component,OnInit,TemplateRef,ViewChild,
  HostListener,Pipe,PipeTransform,} from '@angular/core';
import { EmailValidator, NgForm } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {FileUploadControl,FileUploadValidators,} from '@iplab/ngx-file-upload';
import {BsModalService,BsModalRef,ModalDirective,} from 'ngx-bootstrap/modal';
import { BehaviorSubject, Subscription } from 'rxjs';
import { DesignService } from 'src/app/core/services/project-services/design.service';
import { ExportationService } from 'src/app/core/services/exportation-service/exportation.service';
import { fade } from 'src/app/shared/animations/toggleBtn.animation';
import { RestApiService } from 'src/app/shared/services/api.service';
import { combineLatest } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import {ModalDismissReasons,NgbModal,NgbModalOptions,} from '@ng-bootstrap/ng-bootstrap';
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


@Component({
  selector: 'app-design',
  templateUrl: './design.component.html',
  styleUrls: ['./design.component.scss'],
  animations: [fade],
})
export class DesignComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSourceTemp: any = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource([{}]);
  _DesignSMS: any = null;
  modal?: BsModalRef;
  modalDetails: any = {};
  load_BranchAccount: any;
  load_CityAndAreas: any;
  customrRowSelected: any;
  BranchId: number;
  allDesignCount = 0;
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
      link: '/projects/design',
    },
    sub: {
      ar: 'التصميمات',
      en: 'Design',
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
    'designCode',
    'customerCode',
    'customerName',
    'mainPhoneNo',
    'address',
    'chairpersonName',
    'date',
    'designStatustxt',
    'contractCode', 
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
      search_DesignName: '',
      search_designEmail: '',
      search_designMobile: '',
      isChecked: false,
    },
  };

  EditModel: any = {
    DesignId: 0,
    nameAr: null,
    nameEn: null,
  };

  constructor(
    private service: DesignService,
    private previewservice: PreviewService,
    private modalService: BsModalService,
    private api: RestApiService,
    private changeDetection: ChangeDetectorRef,
    private toast: ToastrService,
    private files: filesservice,
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
  DesignStatusList: any;

  ngOnInit(): void {
    this.DesignStatusList = [
      { id: 1, name: { ar: 'قيد الإنتظار', en: 'pending' } },
      { id: 2, name: { ar: 'قيد التشغيل', en: 'in progress' } },
      { id: 3, name: { ar: 'منتهية', en: 'finished' } },
    ];
    this.getAllDesigns();
    this.FillCustomerSelect();
    this.FillEmployeeselect();
    this.FilltAllPreviewTypes();
    // this.FillDesignTypesSelect();
  }

  // DesignTypesList: any;
  // FillDesignTypesSelect() {
  //   this.service.FillDesignTypesSelect().subscribe((data) => {
  //     this.DesignTypesList = data;
  //   });
  // }


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
          (d.designCode &&
            d.designCode?.trim().toLowerCase().indexOf(val) !== -1) ||
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
  //     this.getAllDesigns();
  //   } else {
  //     this.RefreshData();
  //   }
  // }

  resetandRefresh() {
    if (this.searchBox.open == false) {
      this.data2.filter.search_DesignName = null;
      this.data2.filter.search_designMobile = null;
      this.data.type = 0;
      this.getAllDesigns();
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

  GetAllPreviewsCodeFinishedMeeting() {
    this.previewservice.GetAllPreviewsCodeFinishedMeeting().subscribe((data) => {
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
    this.employeeService.FillEmployeeselect(4).subscribe((data) => {
      this.load_Employees = data;
    });
  }
  load_Employees_Con: any=[];
  FillEmployeeselect_Des() {
    this.employeeService.FillEmployeeselect(5).subscribe((data) => {
      this.load_Employees_Con = data;
    });
  }


  GenerateDesignNumber(){
    debugger
    this.service.GenerateDesignNumber().subscribe(data=>{
      this.modalDetails.designCode=data.reasonPhrase;
    });
  }
  GenerateDesignNumberByBarcodeNum(){
    debugger
    if(!(this.modalDetails.orderBarcode==null || this.modalDetails.orderBarcode==""))
    {
      this.service.GenerateDesignNumberByBarcodeNum(this.modalDetails.orderBarcode).subscribe(data=>{
        this.modalDetails.designCode=data.reasonPhrase;
      });
    }  
  }

  //-----------------------OPEN MODAL--------------------------------------------------

  openModal(template: TemplateRef<any>, data?: any, modalType?: any) {
    this.resetModal();
    //this.GetAllPreviewsSelectBarcodeFinished();

    debugger
    if (modalType == 'addDesign') {
      this.GetAllPreviewsCodeFinishedMeeting();
      //this.GenerateDesignNumber(); 
    }
    console.log('this.modalDetails');
    console.log(this.modalDetails);


    if (data) {
      this.modalDetails = data;
      this.fillBranchByUserId();
      if (modalType == 'editDesign' || modalType == 'DesignView') {
        this.GetAllPreviewsCodeAll();
        if(this.modalDetails.date!=null)
        {
          this.modalDetails.date = this._sharedService.String_TO_date(this.modalDetails.date);
          this.modalDetails.desDateTime = this.modalDetails.date;
        }
        // if(this.modalDetails.designDate!=null)
        // {
        //   this.modalDetails.designDate = this._sharedService.String_TO_date(this.modalDetails.designDate);
        // }    
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
  ConvertToContract:boolean=false;
  modalDetailsPublic: any = {};

  open(content: any, data?: any, type?: any, idRow?: any, model?: any) {
    this.ConvertToContract=false;
    this.publicidRow = 0;

    if (idRow != null) {

    }
    if (data) {
      this.modalDetails = data;
    }
    if (type === 'deleteModalPerm') {
      this.publicidRow = data.idRow;
    }
    if(type === 'ShowDesignFiles')
    {
      if (data) {
        this.modalDetailsPublic = data;
      }
      this.GetAllDesignFiles(this.modalDetails.designId,this.modalDetails.meetingId,this.modalDetails.previewId);
    }
    this.ngbModalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        size: type ? 'xl' : 'lg',
        centered:type == 'PreviewNotes' ? true : type == 'MeetingNotes' ? true :  !type ? true : false,
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


  DesignIdPublic: any = 0;
  setDesignid_P(id: any) {
    this.DesignIdPublic = id;
    console.log('this.DesignIdPublic');
    console.log(this.DesignIdPublic);
  }

  disableButtonSave_Design = false;

  addDesign() {
    debugger;
    var val = this.validateForm();
    if (val.status == false) {
      this.toast.error(val.msg, 'رسالة');
      return;
    }
    var prevObj: any = {};
    prevObj.designId = this.modalDetails.designId;

    if(this.modalDetails.designStatus==3 || this.ConvertToContract==true){
      if(this.modalDetails.contractDate==null){
        this.toast.error(this.translate.instant("من فضلك أختر تاريخ العقد"),this.translate.instant('Message'));
        return;
      }
      // if(this.modalDetails.contractChairperson==null){
      //   this.toast.error(this.translate.instant("من فضلك أختر القائم بالعقد"),this.translate.instant('Message'));
      //   return;
      // }
      if (this.modalDetails.contractDate != null) {
        prevObj.contractDate = this._sharedService.date_TO_String(this.modalDetails.contractDate);
      }
      if (this.modalDetails.conDateTime != null) {
        prevObj.conDateTime = this._sharedService.formatAMPM(this.modalDetails.conDateTime);
      }
      //prevObj.contractChairperson=this.modalDetails.contractChairperson;
      prevObj.contractCode=this.modalDetails.contractCode;
    }
    
    prevObj.branchId = this.modalDetails.branchId;
    prevObj.previewId = this.modalDetails.previewId;
    prevObj.meetingId = this.modalDetails.meetingId;
    prevObj.designCode = this.modalDetails.designCode;
    prevObj.customerId = this.modalDetails.customerId;
    prevObj.designChairperson = this.modalDetails.designChairperson;
    // prevObj.designTypeId = this.modalDetails.designTypeId;
    prevObj.designStatus = this.modalDetails.designStatus;
    if (this.modalDetails.date != null) {
      prevObj.date = this._sharedService.date_TO_String(this.modalDetails.date);
    }
    if (this.modalDetails.desDateTime != null) {
      prevObj.desDateTime = this._sharedService.formatAMPM(this.modalDetails.desDateTime);
    }

    prevObj.notes = this.modalDetails.notes;

    console.log('prevObj');
    console.log(prevObj);
    const formData = new FormData();
    for (const key of Object.keys(prevObj)) {
      const value = prevObj[key] == null ? '' : prevObj[key];
      formData.append(key, value);
      formData.append('DesignId', prevObj.designId.toString());
    }
    this.disableButtonSave_Design = true;
    setTimeout(() => {
      this.disableButtonSave_Design = false;
    }, 5000);
    this.service.SaveDesign(formData).subscribe((result: any) => {
      if (result.statusCode == 200) {
        this.toast.success(
          this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
        this.decline();
        this.getAllDesigns();
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
      this.ValidateObjMsg = { status: false, msg: 'أختر فرع التصميم' };
      return this.ValidateObjMsg;
    } else if (
      this.modalDetails.previewId == null ||
      this.modalDetails.previewId == ''
    ) {
      this.ValidateObjMsg = { status: false, msg: 'أدخل كود المعاينة' };
      return this.ValidateObjMsg;
    } else if (this.modalDetails.designCode == null || this.modalDetails.designCode == '') {
      this.ValidateObjMsg = { status: false, msg: 'اختر كود التصميم' };
      return this.ValidateObjMsg;
    } else if (
      this.modalDetails.customerId == null ||
      this.modalDetails.customerId == ''
    ) {
      this.ValidateObjMsg = { status: false, msg: 'اختر عميل' };
      return this.ValidateObjMsg;
    }
    else if ((this.modalDetails.designChairperson == null ||this.modalDetails.designChairperson == '')
    ) {
      this.ValidateObjMsg = { status: false, msg: 'اختر القائم بالتصميم' };
      return this.ValidateObjMsg;
    }
    else if ((this.modalDetails.designStatus == null ||this.modalDetails.designStatus == '')
    ) {
      this.ValidateObjMsg = { status: false, msg: 'اختر حالة التصميم' };
      return this.ValidateObjMsg;
    }
    else if ((this.modalDetails.date == null ||this.modalDetails.date == '')) {
      this.ValidateObjMsg = {
        status: false,
        msg: 'ادخل تاريخ التصميم',
      };
      return this.ValidateObjMsg;
    }
    else if ((this.modalDetails.desDateTime == null ||this.modalDetails.desDateTime == '')) {
      this.ValidateObjMsg = {
        status: false,
        msg: 'ادخل وقت التصميم',
      };
      return this.ValidateObjMsg;
    }
    this.ValidateObjMsg = { status: true, msg: null };
    return this.ValidateObjMsg;
  }
  locale = 'en-US';
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    formatMatcher:"basic"
  };
  exportData() {
    let x = [];
    var AccDataSource=this.dataSource.data;
    for (let index = 0; index < AccDataSource.length; index++) {
      const formatter = new Intl.DateTimeFormat(this.locale, this.options);
      x.push({
        branchName: AccDataSource[index].branchName,
        orderBarcode: AccDataSource[index].orderBarcode,
        previewCode: AccDataSource[index].previewCode, 
        previewTypeName: AccDataSource[index].previewTypeName, 
        meetingCode: AccDataSource[index].meetingCode,    
        designCode: AccDataSource[index].designCode,
        customerCode: AccDataSource[index].customerCode,
        customerName: AccDataSource[index].customerName,
        mainPhoneNo: AccDataSource[index].mainPhoneNo,
        subMainPhoneNo: AccDataSource[index].subMainPhoneNo,
        cityName: AccDataSource[index].cityName,
        address: AccDataSource[index].address,
        socialMediaName: AccDataSource[index].socialMediaName,
        chairpersonName: AccDataSource[index].chairpersonName,
        date: formatter.format(new Date(AccDataSource[index].date)),
        designStatus:AccDataSource[index].designStatustxt,
        designConvert: AccDataSource[index].designConverttxt,
        addDate: formatter.format(new Date(AccDataSource[index].addDate)),
      });
    }
    this.service.customExportExcel(x, 'Designs');
  }

  ContractNumber_Reservation(BranchId:any,modalType:any){
    debugger
    if(!(BranchId==null))
    {
      this.service.ContractNumber_Reservation(BranchId).subscribe(data=>{
        this.modalDetails.contractCode=data.reasonPhrase;
      });
    }
  }

  designStatusChange(){
    if(this.modalDetails.designStatus==3)
    {
      this.ContractNumber_Reservation(this.modalDetails.branchId,this.modalDetails.type);
    }
  }
  designStatusChangebtn(){
    if(this.modalDetails.designStatus==2)
      {
        this.ContractNumber_Reservation(this.modalDetails.branchId,this.modalDetails.type);
      }
  }

  getAllDesigns() {
    this.service.GetAllDesigns_Branch().subscribe((data: any) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSourceTemp = data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.allDesignCount = data.length;
      this.FillSerachLists(data);
    });
  }

  getdesigndata(previewId:any){
    let data = this.load_BarcodesCodes.filter((d: { id: any }) => d.id == previewId); 
    this.modalDetails.orderBarcode=data[0].name;
    this.modalDetails.customerId=data[0].customerId;
    this.modalDetails.previewTypeId=data[0].previewTypeId;
    this.modalDetails.meetingId=data[0].meetingId;

    this.GenerateDesignNumberByBarcodeNum();
  }

  CustomerChange(customerId:any){
    debugger
    this.modalDetails.previewId=null;
    this.modalDetails.previewTypeId=null;
    this.modalDetails.meetingId=null;

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
      this.modalDetails.meetingId=data[0].meetingId;
      this.getdesigndata(data[0].id);  
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
      this.modalDetails.meetingId=data[0].meetingId;
      this.getdesigndata(data[0].id);  
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
      type: 'addDesign',
      nameAr: null,
      nameEn: null,
      id: null,
      name: null,
      designId: 0,
      branchId: null,
      orderBarcode:null,
      previewId: null,
      previewTypeId:null,
      meetingId:null,
      designCode: null,
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
      addeddesignImg: null,
      contractCode: null,
      contractDate: null,
      contractChairperson: null,
      desDateTime:null,
    };
  }

  confirm(): void {
    this.service.DeleteDesign(this.modalDetails.designId).subscribe((result) => {
        if (result.statusCode == 200) {
          this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
          this.getAllDesigns();
          this.modal?.hide();
        } else {
          this.toast.error(result.reasonPhrase, this.translate.instant('Message'));
        }
      });
  }

  confirmConvert(): void {
    this.service.ConvertDesign(this.modalDetails.designId).subscribe((result) => {
        if (result.statusCode == 200) {
          this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
          this.getAllDesigns();
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
        _Files.designId=this.modalDetails.designId;
        _Files.fileName=this.dataFile.FileName;
        _Files.transactionTypeId=39;
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
              this.getAllDesigns();
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
  
    DesignFileRowSelected: any;
    
    getDesignFileRow(row: any) {
      debugger
      this. DesignFileRowSelected = row;
    }
    confirmDeleteDesignFile(): void {
      this.files.DeleteFiles(this. DesignFileRowSelected.fileId).subscribe((result) => {
          if (result.statusCode == 200) {
            this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
            this.GetAllDesignFiles(this.modalDetailsPublic.designId,this.modalDetailsPublic.meetingId,this.modalDetailsPublic.previewId);
            this.modal?.hide();
          } else {
            this.toast.error(result.reasonPhrase, this.translate.instant('Message'));
          }
        });
    }
    
    DesignFilesList: any=[];
    
    GetAllDesignFiles(DesignId:any,MeetingId:any,PreviewId:any) {
      this.DesignFilesList=[];
      this.files.GetAllDesignFiles(DesignId).subscribe((data: any) => {
        this.DesignFilesList = data;
        console.log(data);
      });
      this.GetAllMeetingFiles(MeetingId);
      this.GetAllPreviewFiles(PreviewId);
    }
    MeetingFilesList: any=[];
  
    GetAllMeetingFiles(MeetingId:any) {
      this.MeetingFilesList=[];
      this.files.GetAllMeetingFiles(MeetingId).subscribe((data: any) => {
        this.MeetingFilesList = data;
        console.log(data);
      });
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
    ListDesignStatus:[],
    ListDesignValue:[],
    customerId:null,
    designChairperson:null,
    designStatusId:null,
    showFilters:false
  },
};

  FillSerachLists(dataT:any){
    this.FillCustomerListName(dataT);
    this.FillCustomerListCode(dataT);
    this.FillCustomerListPhone(dataT);
    this.FillCustomerListEmployee(dataT);
    this.FillListDesignStatus();
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
    const ListLoad = dataT.map((item: { designChairperson: any; chairpersonName: any; }) => {
      const container:any = {}; container.id = item.designChairperson; container.name = item.chairpersonName; console.log("container",container); return container;   
    })
    const key = 'id';
    const arrayUniqueByKey = [...new Map(ListLoad.map((item: { [x: string]: any; }) => [item[key], item])).values()];
    this.dataSearch.filter.ListEmployee=arrayUniqueByKey;
    this.dataSearch.filter.ListEmployee = this.dataSearch.filter.ListEmployee.filter((d: { id: any }) => (d.id !=null && d.id!=0));
  }

  FillListDesignStatus(){
    this.dataSearch.filter.ListDesignStatus= [
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
    if(this.dataSearch.filter.designChairperson!=null && this.dataSearch.filter.designChairperson!="")
    {
      this.dataSource.data = this.dataSource.data.filter((d: { designChairperson: any }) => d.designChairperson == this.dataSearch.filter.designChairperson);
    } 
    if(this.dataSearch.filter.designStatusId!=null && this.dataSearch.filter.designStatusId!="")
    {
      this.dataSource.data = this.dataSource.data.filter((d: { designStatus: any }) => d.designStatus == this.dataSearch.filter.designStatusId);
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
