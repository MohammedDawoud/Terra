
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
import { Customer } from 'src/app/core/Classes/DomainObjects/customer';

import { CustomerService } from 'src/app/core/services/customer-services/customer.service';
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
import { OrganizationService } from 'src/app/core/services/sys_Services/organization.service';

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
  selector: 'app-add-search',
  templateUrl: './add-search.component.html',
  styleUrls: ['./add-search.component.scss'],
  animations: [fade],
})
export class AddSearchComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  public uploadedFiles: Array<File> = [];
  dataSourceTemp: any = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource([{}]);
  _CustomerSMS: any = null;
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
  customer = new Customer();

  selectedDateType = DateType.Hijri;

  title: any = {
    main: {
      name: {
        ar: 'العملاء',
        en: 'Customers',
      },
      link: '/customers',
    },
    sub: {
      ar: 'الإضافة والبحث',
      en: 'Search and inquire',
    },
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
    'customerCode',
    'nameAr',
    'mainPhoneNo',
    'cityName',
    'address',
    'paytypeName',
    'socialMediaName',
    'statusName',
    'addDate',
    'operations',
  ];
  displayedColumn: any = {
    usersMail: ['select', 'name', 'email'],
    usersMobile: ['select', 'name', 'mobile'],
  };



  EditModel: any = {
    CustomerId: 0,
    nameAr: null,
    nameEn: null,
  };
  userG: any = {};
  constructor(
    private service: CustomerService,
    private _organization: OrganizationService,
    private _sharedService: SharedService,
    private modalService: BsModalService, 
    private api: RestApiService,
    private changeDetection: ChangeDetectorRef,
    private toast: ToastrService,
    private ngbModalService: NgbModal,
    private authenticationService: AuthenticationService,
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
    this.getAllCustomers();
  }

  applyFilter(event: any) {
    const val = event.target.value.toLowerCase();
    var tempsource = this.dataSourceTemp;
    if (val) {
      tempsource = this.dataSourceTemp.filter((d: any) => {
        return (
          (d.branchName &&
            d.branchName?.trim().toLowerCase().indexOf(val) !== -1) ||
          (d.cityName &&
            d.cityName?.trim().toLowerCase().indexOf(val) !== -1) ||
          (d.customerCode &&
            d.customerCode?.trim().toLowerCase().indexOf(val) !== -1) ||
            (d.nameAr &&
              d.nameAr?.trim().toLowerCase().indexOf(val) !== -1) ||
          (d.address &&
            d.address?.trim().toLowerCase().indexOf(val) !== -1) ||
          (d.mainPhoneNo &&
            d.mainPhoneNo?.trim().toLowerCase().indexOf(val) !== -1) ||
            (d.subMainPhoneNo &&
              d.subMainPhoneNo?.trim().toLowerCase().indexOf(val) !== -1) ||
            (d.socialMediaName &&
              d.socialMediaName?.trim().toLowerCase().indexOf(val) !== -1) ||
          (d.paytypeName &&
            d.paytypeName?.trim().toLowerCase().indexOf(val) !== -1)
        );
      });
    }

    this.dataSource = new MatTableDataSource(tempsource);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  //------------------ Fill DATA ----------------------------------

  fillBranchByUserId(modalType:any) {
    this.service.FillBranchByUserIdSelect().subscribe((data) => {
      this.load_BranchUserId = data;
      if (this.load_BranchUserId.length == 1) {
        this.modalDetails.branchId = this.load_BranchUserId[0].id;
        if (modalType == 'addClient'){
          this.getBranchAccount(this.modalDetails.branchId,modalType);
        }
      }
      else
      {
        if (modalType == 'addClient'){
          debugger
          this.modalDetails.branchId = parseInt(this._sharedService.getStoBranch());
          this.getBranchAccount(this.modalDetails.branchId,modalType);
        }     
      }
    });
  }

  City_Cus: any;
  CityTypesPopup_Cus: any;

  FillCitySelect_Cus() {
    this.service.FillCitySelect().subscribe((data) => {
      this.City_Cus = data;
      this.CityTypesPopup_Cus = data;
    });
  }

  Paytype_Cus: any;

  FillPaytypeSelect_Cus() {
    this.service.FillPayTypeSelect().subscribe((data) => {
      this.Paytype_Cus = data;
    });
  }
  SocialMedia_Cus: any;
  SocialMediaPopup_Cus: any;

  FillSocialMediaSelect_Cus() {
    this.service.FillSocialMediaSelect().subscribe((data) => {
      this.SocialMedia_Cus = data;
      this.SocialMediaPopup_Cus=data;
    });
  }

  // GenerateCustomerNumber(){
  //   this.service.GenerateCustomerNumber().subscribe(data=>{
  //     this.modalDetails.customerCode=data.reasonPhrase;
  //   });
  // }
  CustomerNumber_Reservation(BranchId:any){
    this.service.CustomerNumber_Reservation(BranchId).subscribe(data=>{
      this.modalDetails.customerCode=data.reasonPhrase;
    });
  }
  

  objBranchAccount: any = null;
  getBranchAccount(BranchId: any,modalType:any) {
    debugger
    this.objBranchAccount = null;
    this.modalDetails.accountName = null;
    this.service.GetCustMainAccByBranchId(BranchId).subscribe({next: (data: any) => {
      debugger
      if(data.result.accountId!=0)
      {
        this.modalDetails.accountName =data.result.nameAr + ' - ' + data.result.accountCode;
        this.objBranchAccount = data.result;
        if(modalType == 'addClient')
        {
          this.CustomerNumber_Reservation(BranchId);
        }
      }
      else
      {
        this.modalDetails.customerCode=null;
      }    
      },
      error: (error) => {},
    });
  }


  //-----------------------OPEN MODAL--------------------------------------------------

  openModal(template: TemplateRef<any>, data?: any, modalType?: any) {
    this.fillBranchByUserId(modalType);
    this.FillCitySelect_Cus();
    this.FillPaytypeSelect_Cus();
    this.FillSocialMediaSelect_Cus();


    this.resetModal();
    //this.getEmailOrganization();
    debugger
    if (modalType == 'addClient') {
      // this.GenerateCustomerNumber();
      //this.CustomerNumber_Reservation();
    }
    console.log('this.modalDetails');
    console.log(this.modalDetails);

    if (data) {
      this.modalDetails = data;

      if (modalType == 'editClient') {
        this.getBranchAccount(this.modalDetails.branchId,modalType);
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

  CustomerIdPublic: any = 0;
  setCustomerid_P(id: any) {
    this.CustomerIdPublic = id;
    console.log('this.CustomerIdPublic');
    console.log(this.CustomerIdPublic);
  }

  disableButtonSave_Customer = false;

  addCustomer() {
    debugger;
    var val = this.validateForm();
    if (val.status == false) {
      this.toast.error(val.msg, 'رسالة');
      return;
    }
    var custObj: any = {};
    custObj.customerId = this.modalDetails.customerId;
    custObj.nameAr = this.modalDetails.nameAr;
    custObj.nameEn = this.modalDetails.nameEn;
    custObj.nationalId = this.modalDetails.nationalId;
    custObj.cityId = this.modalDetails.cityId;
    custObj.customerCode = this.modalDetails.customerCode;
    custObj.socialMediaId = this.modalDetails.socialMediaId;
    custObj.payTypeId = this.modalDetails.payTypeId;
    custObj.branchId = this.modalDetails.branchId;
    custObj.accountId = this.modalDetails.accountId;
    custObj.subMainPhoneNo = this.modalDetails.subMainPhoneNo;
    custObj.mainPhoneNo = this.modalDetails.mainPhoneNo;
    custObj.status = this.modalDetails.status;
    custObj.email = this.modalDetails.email;
    custObj.address = this.modalDetails.address;
    custObj.notes = this.modalDetails.notes;
    console.log('custObj');
    console.log(custObj);

    const formData = new FormData();
    for (const key of Object.keys(custObj)) {
      const value = custObj[key] == null ? '' : custObj[key];
      formData.append(key, value);
      formData.append('CustomerId', custObj.customerId.toString());
    }
    this.disableButtonSave_Customer = true;
    setTimeout(() => {
      this.disableButtonSave_Customer = false;
    }, 5000);
    this.service.SaveCustomer(formData).subscribe((result: any) => {
      if (result.statusCode == 200) {
        this.toast.success(
          this.translate.instant(result.reasonPhrase),
          this.translate.instant('Message')
        );
        this.decline();
        this.getAllCustomers();
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
      this.ValidateObjMsg = { status: false, msg: ' أدخل أسم العميل عربي' };
      return this.ValidateObjMsg;
    } else if (this.modalDetails.branchId == null) {
      this.ValidateObjMsg = { status: false, msg: 'اختر فرع العميل' };
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
      this.ValidateObjMsg = { status: false, msg: 'ادخل تليفون العميل  الرئيسي' };
      return this.ValidateObjMsg;
    }
    // else if(this.modalDetails.mainPhoneNo.length<11)
    // {
    //   this.ValidateObjMsg = { status: false, msg: 'لا يمكنك الحفظ أقل من 11 رقم' };
    //   return this.ValidateObjMsg;
    // }
    else if ((this.modalDetails.address == null ||this.modalDetails.address == '')
    ) {
      this.ValidateObjMsg = { status: false, msg: 'ادخل العنوان' };
      return this.ValidateObjMsg;
    }
    else if ((this.modalDetails.address == null ||this.modalDetails.address == '')
    ) {
      this.ValidateObjMsg = { status: false, msg: 'ادخل المنطقة' };
      return this.ValidateObjMsg;
    }
    else if ((this.modalDetails.payTypeId == null ||this.modalDetails.payTypeId == '')
    ) {
      this.ValidateObjMsg = { status: false, msg: 'ادخل طريقة الدفع' };
      return this.ValidateObjMsg;
    }
    else if ((this.modalDetails.socialMediaId == null ||this.modalDetails.socialMediaId == '')
    ) {
      this.ValidateObjMsg = { status: false, msg: 'ادخل عرفتنا عن طريق' };
      return this.ValidateObjMsg;
    }
    this.ValidateObjMsg = { status: true, msg: null };
    return this.ValidateObjMsg;
  }

  keyPress(event: any) {
    var ew = event.which;
    if (ew > 31 && (ew < 48 || ew > 57)) {
      return false;
    }
    return true;
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
      let date = new Date(AccDataSource[index].addDate);
      const formatter = new Intl.DateTimeFormat(this.locale, this.options);
      const formattedDate = formatter.format(date);
      x.push({
        branchName: AccDataSource[index].branchName,
        customerCode: AccDataSource[index].customerCode,
        customerName: AccDataSource[index].nameAr,
        mainPhoneNo: AccDataSource[index].mainPhoneNo,
        subMainPhoneNo: AccDataSource[index].subMainPhoneNo,
        email: AccDataSource[index].email,
        cityName: AccDataSource[index].cityName,
        address: AccDataSource[index].address,
        paytypeName: AccDataSource[index].paytypeName,
        socialMediaName: AccDataSource[index].socialMediaName,
        statusName: AccDataSource[index].statusName,
        addDate:formattedDate,
      });
    }
    debugger;
    this.service.customExportExcel(x, 'Customers');
  }

  getAllCustomers() {
    this.service.GetAllCustomers_Branch().subscribe((data: any) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSourceTemp = data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.allCount = data.length;
      this.FillSerachLists(data);    
    });
  }
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
    ListPhone2:[],
    ListCity:[],
    customerId:null,
    cityId:null,
    showFilters:false
  },
};

  FillSerachLists(dataT:any){
    this.FillCustomerListName(dataT);
    this.FillCustomerListCode(dataT);
    this.FillCustomerListPhone(dataT);
    this.FillCustomerListPhone2(dataT);
    this.FillCustomerListCity(dataT);
  }

  FillCustomerListName(dataT:any){
    const ListLoad = dataT.map((item: { customerId: any; nameAr: any; }) => {
      const container:any = {}; container.id = item.customerId; container.name = item.nameAr; return container;
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
  FillCustomerListPhone2(dataT:any){
    const ListLoad = dataT.map((item: { customerId: any; subMainPhoneNo: any; }) => {
      const container:any = {}; container.id = item.customerId; container.name = item.subMainPhoneNo; return container;
    })
    const key = 'id';
    const arrayUniqueByKey = [...new Map(ListLoad.map((item: { [x: string]: any; }) => [item[key], item])).values()];
    this.dataSearch.filter.ListPhone2=arrayUniqueByKey;
    this.dataSearch.filter.ListPhone2 = this.dataSearch.filter.ListPhone2.filter((d: { name: any }) => (d.name !=null && d.name!=""));

  }
  FillCustomerListCity(dataT:any){
    const ListLoad = dataT.map((item: { cityId: any; cityName: any; }) => {
      const container:any = {}; container.id = item.cityId; container.name = item.cityName; console.log("container",container); return container;   
    })
    const key = 'id';
    const arrayUniqueByKey = [...new Map(ListLoad.map((item: { [x: string]: any; }) => [item[key], item])).values()];
    this.dataSearch.filter.ListCity=arrayUniqueByKey;
    this.dataSearch.filter.ListCity = this.dataSearch.filter.ListCity.filter((d: { id: any }) => (d.id !=null && d.id!=0));
  }

  RefreshDataCheck(from: any, to: any){
    this.dataSource.data=this.dataSourceTemp;
    if(!(from==null || from=="" || to==null || to==""))
    {
      debugger
      this.dataSource.data = this.dataSource.data.filter((item: any) => {
        var AccDate=new Date(item.addDate);
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
    if(this.dataSearch.filter.cityId!=null && this.dataSearch.filter.cityId!="")
    {
      this.dataSource.data = this.dataSource.data.filter((d: { cityId: any }) => d.cityId == this.dataSearch.filter.cityId);
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
      type: 'addClient',
      nameAr: null,
      nameEn: null,
      id: null,
      name: null,
      customerId: 0,
      branchId: null,
      customerCode: null,
      socialMediaId:null,
      payTypeId:null,
      nationalId: null,
      address: null,
      email: null,
      mainPhoneNo: null,
      subMainPhoneNo: null,
      notes: null,
      accountId: null,
      accountName: null,
      addDate: null,
      addUser: [],
      cityId: null,
      cityName: null,
      addedcustomerImg: null,
      accountCodee: null,
      status:true,
    };
  }

  confirm(): void {
    this.service.DeleteCustomer(this.modalDetails.customerId).subscribe((result) => {
        if (result.statusCode == 200) {
          this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
          this.getAllCustomers();
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

  AddDataType: any = {
    Citydata: {
      id: 0,
      namear: null,
      nameen: null,
    },
    socialMediadata: {
      id: 0,
      namear: null,
      nameen: null,
    },
  };
  //-----------------------------------SaveCity-------------------------------
  //#region 
  selectedCity: any;


  CityRowSelected: any;
  getCityRow(row: any) {
    this.CityRowSelected = row;
  }
  setCityInSelect(data: any, modal: any) {
    this.modalDetails.cityId=data.id;
  }
  confirmCityDelete() {
    this._organization.DeleteCity(this.CityRowSelected.id).subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
          this.FillCitySelect_Cus();
        } else {
          this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
        }
      });
  }

  saveCity() {
    if (
      this.AddDataType.Citydata.namear == null ||
      this.AddDataType.Citydata.nameen == null
    ) {
      this.toast.error('من فضلك أكمل البيانات', 'رسالة');
      return;
    }
    var CityObj: any = {};
    CityObj.CityId = this.AddDataType.Citydata.id;
    CityObj.NameAr = this.AddDataType.Citydata.namear;
    CityObj.NameEn = this.AddDataType.Citydata.nameen;

    var obj = CityObj;
    this._organization.SaveCity(obj).subscribe((result: any) => {
      if (result.statusCode == 200) {
        this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
        this.resetCity();
        this.FillCitySelect_Cus();
      } else {
        this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
      }
    });
  }
  resetCity() {
    this.AddDataType.Citydata.id = 0;
    this.AddDataType.Citydata.namear = null;
    this.AddDataType.Citydata.nameen = null;
  }
  //#endregion
  //----------------------------------EndSaveCity-----------------------------

    //-----------------------------------SavesocialMedia-------------------------------
  //#region 
  selectedsocialMedia: any;
  socialMediaRowSelected: any;
  getsocialMediaRow(row: any) {
    this.socialMediaRowSelected = row;
  }
  setsocialMediaInSelect(data: any, modal: any) {
    this.modalDetails.socialMediaId=data.id;
  }
  confirmsocialMediaDelete() {
    this._organization.DeleteSocialMedia(this.socialMediaRowSelected.id).subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
          this.FillSocialMediaSelect_Cus();
        } else {
          this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
        }
      });
  }

  SaveSocialMedia() {
    if (
      this.AddDataType.socialMediadata.namear == null ||
      this.AddDataType.socialMediadata.nameen == null
    ) {
      this.toast.error('من فضلك أكمل البيانات', 'رسالة');
      return;
    }
    var socialMediaObj: any = {};
    socialMediaObj.socialMediaId = this.AddDataType.socialMediadata.id;
    socialMediaObj.NameAr = this.AddDataType.socialMediadata.namear;
    socialMediaObj.NameEn = this.AddDataType.socialMediadata.nameen;

    var obj = socialMediaObj;
    this._organization.SaveSocialMedia(obj).subscribe((result: any) => {
      if (result.statusCode == 200) {
        this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
        this.resetsocialMedia();
        this.FillSocialMediaSelect_Cus();
      } else {
        this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
      }
    });
  }
  resetsocialMedia() {
    this.AddDataType.socialMediadata.id = 0;
    this.AddDataType.socialMediadata.namear = null;
    this.AddDataType.socialMediadata.nameen = null;
  }
  //#endregion
  //----------------------------------EndSavesocialMedia-----------------------------


}
