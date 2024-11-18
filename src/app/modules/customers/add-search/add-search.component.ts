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
    'branchName',
    'customerCode',
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
      search_CustomerName: '',
      search_customerEmail: '',
      search_customerMobile: '',
      isChecked: false,
    },
  };

  EditModel: any = {
    CustomerId: 0,
    nameAr: null,
    nameEn: null,
  };

  constructor(
    private service: CustomerService,
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
          (d.customerName &&
            d.customerName?.trim().toLowerCase().indexOf(val) !== -1) ||
          (d.nationalId &&
            d.nationalId?.trim().toLowerCase().indexOf(val) !== -1) ||
          (d.customerTypeName &&
            d.customerTypeName?.trim().toLowerCase().indexOf(val) !== -1) ||
          (d.email &&
            d.email?.trim().toLowerCase().indexOf(val) !== -1) ||
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
  //     this.getAllCustomers();
  //   } else {
  //     this.RefreshData();
  //   }
  // }

  resetandRefresh() {
    if (this.searchBox.open == false) {
      this.data2.filter.search_CustomerName = null;
      this.data2.filter.search_customerMobile = null;
      this.data.type = 0;
      this.getAllCustomers();
    }
  }
  //------------------ Fill DATA ----------------------------------

  fillBranchByUserId() {
    this.service.FillBranchByUserIdSelect().subscribe((data) => {
      this.load_BranchUserId = data;
      if (this.load_BranchUserId.length == 1) {
        this.modalDetails.branchId = this.load_BranchUserId[0].id;
        this.getBranchAccount(this.modalDetails.branchId);
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

  FillSocialMediaSelect_Cus() {
    this.service.FillSocialMediaSelect().subscribe((data) => {
      this.SocialMedia_Cus = data;
    });
  }

  GenerateCustomerNumber(){
    this.service.GenerateCustomerNumber().subscribe(data=>{
      this.modalDetails.customerCode=data.reasonPhrase;
    });
  }
  objBranchAccount: any = null;
  getBranchAccount(BranchId: any) {
    debugger
    this.objBranchAccount = null;
    this.modalDetails.accountName = null;
    this.service.GetCustMainAccByBranchId(BranchId).subscribe({next: (data: any) => {
      if(data.result.accountId!=0)
      {
        this.modalDetails.accountName =data.result.nameAr + ' - ' + data.result.accountCode;
        this.objBranchAccount = data.result;
      }    
      },
      error: (error) => {},
    });
  }


  //-----------------------OPEN MODAL--------------------------------------------------

  openModal(template: TemplateRef<any>, data?: any, modalType?: any) {
    this.fillBranchByUserId();
    this.FillCitySelect_Cus();
    this.FillPaytypeSelect_Cus();
    this.FillSocialMediaSelect_Cus();


    this.resetModal();
    //this.getEmailOrganization();
    debugger
    if (modalType == 'addClient') {
      this.GenerateCustomerNumber();
    }
    console.log('this.modalDetails');
    console.log(this.modalDetails);

    if (data) {
      this.modalDetails = data;

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
    }, 7000);
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
    } else if (
      this.modalDetails.nameEn == null ||
      this.modalDetails.nameEn == ''
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
    else if ((this.modalDetails.mainPhoneNo == null ||this.modalDetails.mainPhoneNo == '')
    ) {
      this.ValidateObjMsg = { status: false, msg: 'ادخل جوال العميل' };
      return this.ValidateObjMsg;
    }
    else if ((this.modalDetails.email == null ||
        this.modalDetails.email == '')
    ) {
      this.ValidateObjMsg = {
        status: false,
        msg: 'ادخل البريد الالكتروني للعميل',
      };
      return this.ValidateObjMsg;
    }
    if ((this.modalDetails.nationalId == null ||
      this.modalDetails.nationalId == '')) {
    this.ValidateObjMsg = { status: false, msg: 'ادخل رقم هوية العميل' };
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
        customerCode: this.dataSourceTemp[index].customerCode,
        customerName: this.dataSourceTemp[index].nameAr,
        mainPhoneNo: this.dataSourceTemp[index].mainPhoneNo,
        nationalId: this.dataSourceTemp[index].nationalId,
        statusName: this.dataSourceTemp[index].statusName,
      });
    }
    debugger;
    this.service.customExportExcel(x, 'Customers');
  }

  getAllCustomers() {
    this.service.GetAllCustomers_Branch().subscribe((data: any) => {
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
      type: 'addClient',
      nameAr: null,
      nameEn: null,
      id: null,
      name: null,
      customerId: 0,
      branchId: null,
      customerCode: null,
      customerName: null,
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

}
