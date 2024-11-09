import { SelectionModel } from '@angular/cdk/collections';

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

import { CustomerVM } from 'src/app/core/Classes/ViewModels/customerVM';
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
  load_CustomerName: any;
  load_CustomerMobile: any;
  load_CustomerMail: any;
  load_BranchAccount: any;
  load_CityAndAreas: any;
  public _CustomerVM: CustomerVM;
  customrRowSelected: any;
  obj: CustomerVM;
  BranchId: number;
  getEmailOrgnize: any;
  governmentCount = 0;
  InvestorCompanyCount = 0;
  CitizensCount = 0;
  allCount = 0;
  load_FileType: any;
  load_BranchUserId: any;
  nameAr: any;
  nameEn: any;
  isSubmit: boolean = false;
  modalRef?: BsModalRef;
  subscriptions: Subscription[] = [];
  messages: string[] = [];
  load_filesTypes: any;
  customer = new Customer();
  emailModalDetils: any;
  uploadModalDetils: any;
  modalSMSDetails: any;

  userG: any = {};
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

  data: any = {
    type: '0',
    orgEmail: 'asdwd@dwa',
    numbers: {
      all: 0,
      citizens: 0,
      investor: 0,
      government: 0,
    },
    fileType: {
      NameAr: '',
      Id: '',
      NameEn: '',
    },
    documents: [],
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
    'name',
    'nationalId',
    'customerType',
    'email',
    'phone',
    'mobile',
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
      search_CustomerName: '',
      search_customerEmail: '',
      search_customerMobile: '',
      isChecked: false,
    },
  };

  EditModel: any = {
    CustomerId: 0,
    CustomerName: null,
    CustomerNameEn: null,
  };

  constructor(
    private service: CustomerService,
    private modalService: BsModalService,
    private api: RestApiService,
    private exportationService: ExportationService,
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
    this._CustomerVM = new CustomerVM();
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
  showOfferValue: any = false;
  offerTerms: any = [];
  offerServices: any = [];
  offerPayments: any = [
    {
      id: 1,
      statement: '',
      statementEn: '',
      status: false,
      ratio: 0,
      amount: 0,
    },
  ];

  serviceDetails: any;

  selectAllValue = false;

  userPermissionsColumns: string[] = [
    'userName',
    'watch',
    'add',
    'edit',
    'delete',
    'operations',
  ];
  projectGoalsColumns: string[] = [
    'serial',
    'requirements',
    'name',
    'duration',
    'choose',
  ];

  projectGoalsDataSource = new MatTableDataSource();

  projectGoals: any;
  WhatsAppData: any={
    sendactivation:false,
    sendactivationOffer:false,
    sendactivationProject:false,
    sendactivationSupervision:false,
  };
  ngOnInit(): void {
    this.getData();
  }

  ///////////////////////////////FILTER/////////////////

  onChange(value: any) {
    this.searchBox.searchType = value;
    if (this.searchBox.searchType == 1) {
      this.fill_CustomerName();
    } else if (this.searchBox.searchType == 3) {
      this.fill_CustomerMobile();
    }
    // else if (this.searchBox.searchType == 2) {
    //   this.fill_CustomerMail();
    // }
  }

  filterData(array: any[], type?: any) {
    if (!type) {
      return array;
    }
    return array.filter((ele) => {
      return ele.customerTypeId == type;
    });
  }

  /////////////////////////////Filter//////////////////

  RefreshData() {
    this._CustomerVM = new CustomerVM();
    if (this.searchBox.searchType == 1) {
      if (this.data2.filter.search_CustomerName == null) {
        this.getData();
        return;
      }
      this._CustomerVM.customerId = this.data2.filter.search_CustomerName;
    } else if (this.searchBox.searchType == 2) {
      if (this.data2.filter.search_customerEmail == null) {
        this.getData();
        return;
      }
      this._CustomerVM.email = this.data2.filter.search_customerEmail;
    } else if (this.searchBox.searchType == 3) {
      if (this.data2.filter.search_customerMobile == null) {
        this.getData();
        return;
      }
      this._CustomerVM.mainPhoneNo = this.data2.filter.search_customerMobile;
    }

    var obj = this._CustomerVM;
    this.service.SearchFn(obj).subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSourceTemp = data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: any) {
    const val = event.target.value.toLowerCase();
    var tempsource = this.dataSourceTemp;
    if (val) {
      tempsource = this.dataSourceTemp.filter((d: any) => {
        return (
          (d.customerName &&
            d.customerName?.trim().toLowerCase().indexOf(val) !== -1) ||
          (d.customerNationalId &&
            d.customerNationalId?.trim().toLowerCase().indexOf(val) !== -1) ||
          (d.customerTypeName &&
            d.customerTypeName?.trim().toLowerCase().indexOf(val) !== -1) ||
          (d.customerEmail &&
            d.customerEmail?.trim().toLowerCase().indexOf(val) !== -1) ||
          (d.customerPhone &&
            d.customerPhone?.trim().toLowerCase().indexOf(val) !== -1) ||
          (d.customerMobile &&
            d.customerMobile?.trim().toLowerCase().indexOf(val) !== -1)
        );
      });
    }

    this.dataSource = new MatTableDataSource(tempsource);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  checkValue(event: any) {
    if (event == 'A') {
      this.getData();
    } else {
      this.RefreshData();
    }
  }

  resetandRefresh() {
    if (this.searchBox.open == false) {
      this.data2.filter.search_CustomerName = null;
      this.data2.filter.search_customerMobile = null;
      this.data.type = 0;
      this.getData();
    }
  }
  //------------------ Fill DATA ----------------------------------

  fill_CustomerName() {
    this.service.FillCustomerNameSelect().subscribe((data) => {
      this.load_CustomerName = data;
    });
  }
  fill_CustomerMobile() {
    this.service.FillCustomerMobileSelect().subscribe((data: any) => {
      this.load_CustomerMobile = data;
      this.load_CustomerMobile = this.load_CustomerMobile.filter(
        (x: { customerMobile: any }) => !!x.customerMobile
      );
    });
  }
  fill_CustomerMail() {
    this.service.FillCustomerMailSelect().subscribe((data) => {
      this.load_CustomerMail = data;
    });
  }

  getEmailOrganization() {
    this.service.getEmailOrganization().subscribe((data) => {
      this.getEmailOrgnize = data.email;
    });
  }

  fillFileTypeSelect() {
    this.service.fillFileTypeSelect().subscribe((data) => {
      this.load_FileType = data;
    });
  }

  fillBranchByUserId() {
    this.service.fillBranchByUserId().subscribe((data) => {
      this.load_BranchUserId = data;
      if (this.load_BranchUserId.length == 1) {
        this.modalDetails.branchId = this.load_BranchUserId[0].id;
        this.getBranchAccount(this.modalDetails.branchId);
      }
    });
  }

  // getCityAndAreas() {
  //   this.service.FillCitySelect().subscribe(data => {
  //     this.load_CityAndAreas = data;
  //   });
  // }

  City_Cus: any;
  CityTypesPopup_Cus: any;

  FillCitySelect_Cus() {
    this.service.FillCitySelect().subscribe((data) => {
      this.City_Cus = data;
      this.CityTypesPopup_Cus = data;
    });
  }

  objBranchAccount: any = null;
  getBranchAccount(BranchId: any) {
    this.objBranchAccount = null;
    this.modalDetails.accountName = null;
    this.service.getCustMainAccByBranch(BranchId).subscribe({
      next: (data: any) => {
        //this.modalDetails.CustMainAccByBranchId = data.result;
        this.modalDetails.accountName =
          data.result.nameAr + ' - ' + data.result.code;
        this.objBranchAccount = data.result;
      },
      error: (error) => {},
    });
  }

  setCustomersType(type: any) {
    // change table cells
    if (type == '0' || type == '1') {
      this.displayedColumns = [
        'name',
        'nationalId',
        'customerType',
        'email',
        'phone',
        'mobile',
        'operations',
      ];
    } else {
      this.displayedColumns = [
        'name',
        // 'nationalId',
        'customerType',
        'email',
        'phone',
        'mobile',
        'operations',
      ];
    }
    // assign data
    // const filteredData = this.filterData(this.data.clients, type);
    // this.dataSource = new MatTableDataSource(filteredData);

    this.service.getAllCustomersByCustomerTypeId(type).subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSourceTemp = data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  //-----------------------OPEN MODAL--------------------------------------------------

  openModal(template: TemplateRef<any>, data?: any, modalType?: any) {
    this.fillBranchByUserId();
    this.FillCitySelect_Cus();

    this.resetModal();
    this.getEmailOrganization();

    if (modalType == 'addClient') {
    }
    console.log('this.modalDetails');
    console.log(this.modalDetails);

    if (data) {
      //  console.log('xxx');
      this.modalDetails = data;

      this.emailModalDetils = data;

      this.modalSMSDetails = data;

      this.modalDetails.country = 'المملكة العربية السعودية';

      if (modalType == 'editClient') {
        this.getBranchAccount(this.modalDetails.branchId);
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

  selection = new SelectionModel<any>(true, []);

  CustomerMailIsRequired: any = false;
  MailIsRequired: any = false;
  CustomerNationalIdIsRequired: any = false;
  NationalIdIsRequired: any = false;
  CustomerphoneIsRequired: any = false;
  phoneIsRequired: any = false;

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
      this.emailModalDetils = data;
      this.modalSMSDetails = data;
    }
    if (type === 'deleteModalPerm') {
      this.publicidRow = data.idRow;
    }
    this.fillFileTypeSelect();
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
    this.modalDetails.customerNameAr = null;
    this.modalDetails.customerNameEn = null;
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

  urlAgent: any = null;
  // cleanURL(url:any):SafePipe{
  //   this.urlAgent=null;
  //   return this.domSanitizer.bypassSecurityTrustResourceUrl(url);
  // }
  CustomerIdPublic: any = 0;
  setCustomerid_P(id: any) {
    this.CustomerIdPublic = id;
    console.log('this.CustomerIdPublic');
    console.log(this.CustomerIdPublic);
  }

  PopupAfterSaveObj_Customer: any = {
    CustomerId: 0,
    AccountNo: null,
    MainAccountNo: null,
    MainAccountName: null,
    CustomerName: null,
    BranchName: null,
  };

  // EmailValue_Customer: any;PhoneValue_Customer: any;
  checkedEmail: any;
  checkedPhone: any;
  clientAddedCheckedEmail: any = false;
  clientAddedCheckedPhone: any = false;

  GetCustomersByCustomerId_Cust(id: any, BranchName: any) {
    this.service.GetCustomersByCustomerId(id).subscribe((data) => {
      console.log(data);
      console.log('this.objBranchAccount');
      console.log(this.objBranchAccount);
      this.setCustomerid_P(id);
      this.PopupAfterSaveObj_Customer = {
        CustomerId: id,
        AccountNo: data.result.accountCodee,
        MainAccountNo: this.objBranchAccount.code,
        MainAccountName: this.objBranchAccount.nameAr,
        CustomerName: data.result.customerNameAr,
        BranchName: BranchName,
        EmailValue_Customer: data.result.customerEmail,
        PhoneValue_Customer: data.result.customerMobile,
      };
    });
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
    custObj.customerNameAr = this.modalDetails.customerNameAr;
    custObj.customerNameEn = this.modalDetails.customerNameEn;
    custObj.customerNationalId = this.modalDetails.customerNationalId;
    custObj.cityId = this.modalDetails.cityId;
    custObj.customerTypeId = this.modalDetails.customerTypeId ?? 1;

    custObj.branchId = this.modalDetails.branchId;
    custObj.accountId = this.modalDetails.accountId;
    //this.customer.accountName = this.modalDetails.accountName;
    //this.customer.addDate = this.modalDetails.addDate;

    custObj.generalManager = this.modalDetails.generalManager;
    //custObj.attachmentUrl = this.modalDetails.attachmentUrl;
    custObj.customerMobile = this.modalDetails.customerMobile;
    custObj.customerPhone = this.modalDetails.customerPhone;

    custObj.customerEmail = this.modalDetails.customerEmail;
    custObj.commercialActivity = this.modalDetails.commercialActivity;

    custObj.commercialRegDate = this.modalDetails.commercialRegDate;
    custObj.commercialRegHijriDate = this.modalDetails.commercialRegHijriDate;

    custObj.postalCodeFinal = this.modalDetails.postalCodeFinal;
    custObj.country = this.modalDetails.country;

    custObj.streetName = this.modalDetails.streetName;
    custObj.buildingNumber = this.modalDetails.buildingNumber;

    custObj.neighborhood = this.modalDetails.neighborhood;
    custObj.customerAddress = this.modalDetails.customerAddress;

    //this.customer.commercialRegInvoice = this.modalDetails.commercialRegInvoice;
    custObj.commercialRegister = this.modalDetails.commercialRegister;
    custObj.responsiblePerson = this.modalDetails.responsiblePerson;

    custObj.externalPhone = this.modalDetails.externalPhone;
    custObj.compAddress = this.modalDetails.compAddress;

    custObj.agentName = this.modalDetails.agentName;
    custObj.agentAttachmentUrl = this.modalDetails.agentAttachmentUrl;
    custObj.agentNumber = this.modalDetails.agentNumber;
    custObj.agentType = this.modalDetails.agentType;

    custObj.notes = this.modalDetails.notes;
    console.log('custObj');
    console.log(custObj);

    const formData = new FormData();
    for (const key of Object.keys(custObj)) {
      const value = custObj[key] == null ? '' : custObj[key];
      formData.append(key, value);
      formData.append('CustomerId', custObj.customerId.toString());
      if (this.control?.value.length > 0) {
        formData.append('UploadedAgentImage', this.control?.value[0]);
      }
    }
    this.disableButtonSave_Customer = true;
    setTimeout(() => {
      this.disableButtonSave_Customer = false;
    }, 9000);
    this.service.SaveCustomer(formData).subscribe((result: any) => {
      if (result.statusCode == 200) {
        this.toast.success(
          this.translate.instant(result.reasonPhrase),
          this.translate.instant('Message')
        );
        this.decline();
        this.getData();
        this.ngbModalService.dismissAll();
        if (this.modalDetails.type == 'addClient') {
          this.ngbModalService.open(this.optionsModal, {
            size: 'xl',
            backdrop: 'static',
            keyboard: false,
          });
          var branname = this.load_BranchUserId.filter(
            (a: { id: any }) => a.id == this.modalDetails.branchId
          )[0].name;
          this.GetCustomersByCustomerId_Cust(result.returnedParm, branname);
        }
      } else {
        this.toast.error(result.reasonPhrase, 'رسالة');
      }
    });
  }
  ValidateObjMsg: any = { status: true, msg: null };
  validateForm() {
    this.ValidateObjMsg = { status: true, msg: null };

    if (
      this.modalDetails.customerNameAr == null ||
      this.modalDetails.customerNameAr == ''
    ) {
      this.ValidateObjMsg = { status: false, msg: ' أدخل أسم العميل عربي' };
      return this.ValidateObjMsg;
    } else if (
      this.modalDetails.customerNameEn == null ||
      this.modalDetails.customerNameEn == ''
    ) {
      this.ValidateObjMsg = { status: false, msg: 'أدخل أسم العميل انجليزي' };
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
    // else if (this.modalDetails.customerMobile==null || this.modalDetails.customerMobile=="") {
    else if (
      this.CustomerphoneIsRequired == true &&
      (this.modalDetails.customerMobile == null ||
        this.modalDetails.customerMobile == '')
    ) {
      this.ValidateObjMsg = { status: false, msg: 'ادخل جوال العميل' };
      return this.ValidateObjMsg;
    }
    // else if (this.modalDetails.customerEmail==null || this.modalDetails.customerEmail=="") {
    else if (
      this.CustomerMailIsRequired == true &&
      (this.modalDetails.customerEmail == null ||
        this.modalDetails.customerEmail == '')
    ) {
      this.ValidateObjMsg = {
        status: false,
        msg: 'ادخل البريد الالكتروني للعميل',
      };
      return this.ValidateObjMsg;
    }
    if (this.modalDetails.customerTypeId == 1) {
      // if (this.modalDetails.customerNationalId==null || this.modalDetails.customerNationalId=="" ) {
      if (
        this.CustomerNationalIdIsRequired == true &&
        (this.modalDetails.customerNationalId == null ||
          this.modalDetails.customerNationalId == '')
      ) {
        this.ValidateObjMsg = { status: false, msg: 'ادخل رقم هوية العميل' };
        return this.ValidateObjMsg;
      }
    } else if (this.modalDetails.customerTypeId == 2) {
      if (!this.modalDetails.generalManager) {
        this.ValidateObjMsg = { status: false, msg: 'ادخل اسم المدير العام' };
        return this.ValidateObjMsg;
      }
      if (!this.modalDetails.commercialActivity) {
        this.ValidateObjMsg = { status: false, msg: 'ادخل النشاط التجاري' };
        return this.ValidateObjMsg;
      }
      if (!this.modalDetails.commercialRegister) {
        this.ValidateObjMsg = { status: false, msg: 'ادخل السجل التجاري' };
        return this.ValidateObjMsg;
      }
    } else if (this.modalDetails.customerTypeId == 3) {
      if (!this.modalDetails.responsiblePerson) {
        this.ValidateObjMsg = { status: false, msg: 'ادخل الشخص المسؤول' };
        return this.ValidateObjMsg;
      }
    }
    this.ValidateObjMsg = { status: true, msg: null };
    return this.ValidateObjMsg;
  }

  ///////////////////// EPORT DATA/////////////////////////////////////////////

  customExportExcel(dataExport: any) {
    let exportation = JSON.parse(JSON.stringify(dataExport));
    let itemsToExeclude: string[] = [];

    let excelData: any[] = [];
    let headers: string[] = [];
    let objectKeys = Object.keys(dataExport[0]);
    objectKeys = objectKeys.filter(
      (item: string) => !itemsToExeclude.includes(item)
    );

    objectKeys.forEach((element) => {
      headers.push(element.toUpperCase());
    });

    exportation.forEach((ele: any) => {
      // ele = (ele) => {
      var sorted: any = {},
        key,
        a = [];

      for (key in ele) {
        if (ele.hasOwnProperty(key)) {
          a.push(key);
        }
      }
      a = a.filter((item: string) => !itemsToExeclude.includes(item));

      // a.sort();

      for (key = 0; key < a.length; key++) {
        sorted[a[key]] = ele[a[key]];
      }
      // return sorted;
      ele = sorted;
      // }
      let props = Object.getOwnPropertyNames(ele).filter((prop) =>
        exportation.some((ex: any) => ex === prop)
      );
      props.forEach((pp) => {
        delete ele[pp];
      });

      excelData.push(ele);
    });

    this.exportationService.exportExcel(
      excelData,
      'Customers' + new Date().getTime(),
      headers
    );
  }

  exportData() {
    this.service.getAllCustomers().subscribe((data: any) => {
      // console.log(data);

      this.dataSource = new MatTableDataSource(data);
      this.dataSourceTemp = data;
      let dataExport = data as CustomerVM[];
      let x = [];

      for (let index = 0; index < dataExport.length; index++) {
        x.push({
          customerName: dataExport[index].nameAr,
          customerNationalId: dataExport[index].nationalId,
          customerEmail: dataExport[index].email,
          customerPhone: dataExport[index].mainPhoneNo,
          customerMobile: dataExport[index].subMainPhoneNo,
        });
      }

      console.log(dataExport);
      // data as CustomerVM[]
      this.customExportExcel(x);
      this.getData();
    });
  }

  getData() {
    this.service.getAllCustomers().subscribe((data: any) => {
      // console.log(data);

      this.dataSource = new MatTableDataSource(data);
      this.dataSourceTemp = data;

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.allCount = data.length;

      this.CitizensCount = data.filter(
        (data: { customerTypeId: 1 }) => data.customerTypeId == 1
      ).length;
      this.InvestorCompanyCount = data.filter(
        (data: { customerTypeId: 2 }) => data.customerTypeId == 2
      ).length;
      this.governmentCount = data.filter(
        (data: { customerTypeId: 3 }) => data.customerTypeId == 3
      ).length;
    });
  }

  ////////////////////RESET MODAL//////////////////////////////

  resetModal() {
    this.isSubmit = false;
    this.control.clear();
    this.modalDetails = {
      CustMainAccByBranchId: {
        code: '',
        accountName: null,
        nameAr: '',
        nameEn: '',
      },
      organizationEmail: '',
      type: 'addClient',
      agencData: null,
      customerNameAr: null,
      customerNameEn: null,
      id: null,
      responsiblePerson: null,
      name: null,
      customerId: 0,
      branchId: null,
      customerCode: null,
      customerName: null,
      customerNationalId: null,
      nationalIdSource: null,
      customerAddress: null,
      customerEmail: null,
      customerPhone: null,
      customerMobile: null,
      customerTypeId: '1',
      notes: null,
      logoUrl: null,
      attachmentUrl: null,
      commercialActivity: null,
      commercialRegister: null,
      commercialRegDate: null,
      commercialRegHijriDate: null,
      accountId: null,
      projectNo: null,
      generalManager: null,
      agentName: null,
      agentType: null,
      agentNumber: null,
      agentAttachmentUrl: null,
      accountName: null,
      addDate: null,
      customerTypeName: null,
      addUser: [],
      compAddress: null,
      postalCodeFinal: null,
      externalPhone: null,
      country: null,
      neighborhood: null,
      streetName: null,
      buildingNumber: null,
      commercialRegInvoice: null,
      cityId: null,
      cityName: null,
      noOfCustProj: null,
      noOfCustProjMark: null,
      addedcustomerImg: null,
      projects: null,
      accountCodee: null,
      totalRevenue: null,
      totalExpenses: null,
      invoices: null,
      transactions: null,
    };
  }


  //////////////////DELETE //////////////////////////////

  confirm(): void {
    this.service
      .deleteCustomer(this.modalDetails.customerId)
      .subscribe((result) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        } else {
          this.toast.error(result.reasonPhrase, 'رسالة');
        }

        this.getData();
      });
    this.modal?.hide();
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
