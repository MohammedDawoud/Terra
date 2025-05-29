
import {
  AfterViewInit,ChangeDetectorRef,Component,OnInit,TemplateRef,
  ViewChild,HostListener,Pipe,PipeTransform,} from '@angular/core';
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

import { EmployeeService } from 'src/app/core/services/employee-services/employee.service';
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
import { SharedService } from 'src/app/core/services/shared.service';
import { filesservice } from 'src/app/core/services/sys_Services/files.service';
import { HttpEventType } from '@angular/common/http';
import { OrganizationService } from 'src/app/core/services/sys_Services/organization.service';

@Component({
  selector: 'app-add-search',
  templateUrl: './add-search.component.html',
  styleUrls: ['./add-search.component.scss'],
  animations: [fade],
})
export class AddSearchComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSourceTemp: any = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource([{}]);
  _EmployeeSMS: any = null;
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

  selectedDateType = DateType.Hijri;

  title: any = {
    main: {
      name: {
        ar: 'شئون الموظفين',
        en: 'Employees',
      },
      link: '/employees',
    },
    sub: {
      ar: 'الإضافة والبحث',
      en: 'Search and inquire',
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
    'employeeCode',
    'nameAr',
    'mainPhoneNo',
    'salary',
    'address',
    'jobName',
    'managerName',
    'statusName',
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
      search_EmployeeName: '',
      search_employeeEmail: '',
      search_employeeMobile: '',
      isChecked: false,
    },
  };

  EditModel: any = {
    EmployeeId: 0,
    nameAr: null,
    nameEn: null,
  };
  userG: any = {};

  constructor(
    private service: EmployeeService,
    private files: filesservice,
    private _organization: OrganizationService,
    private modalService: BsModalService,
    private api: RestApiService,
    private changeDetection: ChangeDetectorRef,
    private toast: ToastrService,
    private ngbModalService: NgbModal,
    private _sharedService: SharedService,
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
    this.getAllEmployees();
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
          (d.employeeCode &&
            d.employeeCode?.trim().toLowerCase().indexOf(val) !== -1) ||
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
  //     this.getAllEmployees();
  //   } else {
  //     this.RefreshData();
  //   }
  // }

  resetandRefresh() {
    if (this.searchBox.open == false) {
      this.data2.filter.search_EmployeeName = null;
      this.data2.filter.search_employeeMobile = null;
      this.data.type = 0;
      this.getAllEmployees();
    }
  }
  //------------------ Fill DATA ----------------------------------

  fillBranchByUserId(modalType:any) {
    this.service.FillBranchByUserIdSelect().subscribe((data) => {
      this.load_BranchUserId = data;

      if (this.load_BranchUserId.length == 1) {
        this.modalDetails.branchId = this.load_BranchUserId[0].id;
        if (modalType == 'addEmployee'){
          this.getBranchAccountE(this.modalDetails.branchId,modalType);
        }
      }
      else
      {
        if (modalType == 'addEmployee'){
          debugger
          this.modalDetails.branchId = parseInt(this._sharedService.getStoBranch());
          this.getBranchAccountE(this.modalDetails.branchId,modalType);
        }     
      }
    });
  }

  Job_Emp: any;
  JobTypesPopup_Emp: any;

  FillJobSelect_Emp() {
    this.service.FillJobSelect().subscribe((data) => {
      console.log(data);
      this.Job_Emp = data;
      this.JobTypesPopup_Emp = data;
    });
  }

  Managers_Emp: any;

  FillEmployeeselectManagerW(EmpId:any) {
    this.service.FillEmployeeselectManagerW(EmpId).subscribe((data) => {
      this.Managers_Emp = data;
    });
  }


  // GenerateEmployeeNumber(){
  //   this.service.GenerateEmployeeNumber().subscribe(data=>{
  //     this.modalDetails.employeeCode=data.reasonPhrase;
  //   });
  // }

  EmployeeNumber_Reservation(BranchId:any){
    this.service.EmployeeNumber_Reservation(BranchId).subscribe(data=>{
      this.modalDetails.employeeCode=data.reasonPhrase;
    });
  }

  objBranchAccount: any = null;
  getBranchAccountE(BranchId: any,modalType:any) {
    debugger
    this.objBranchAccount = null;
    this.modalDetails.accountName = null;
    this.service.GetEmpMainAccByBranchId(BranchId).subscribe({next: (data: any) => {
      if(data.result.accountId!=0)
      {
        this.modalDetails.accountName =data.result.nameAr + ' - ' + data.result.accountCode;
        this.objBranchAccount = data.result;
        if(modalType == 'addEmployee')
        {
          this.EmployeeNumber_Reservation(BranchId);
        }
      } 
      else
      {
        this.modalDetails.employeeCode=null;
      }    
      },
      error: (error) => {},
    });
  }


  //-----------------------OPEN MODAL--------------------------------------------------

  openModal(template: TemplateRef<any>, data?: any, modalType?: any) {
    this.fillBranchByUserId(modalType);
    this.FillJobSelect_Emp();

    this.resetModal();
    //this.getEmailOrganization();
    debugger
    if (modalType == 'addEmployee') {
      // this.GenerateEmployeeNumber();
      this.FillEmployeeselectManagerW(0);
    }
    console.log('this.modalDetails');
    console.log(this.modalDetails);

    if (data) {
      this.modalDetails = data;
      this.FillEmployeeselectManagerW( this.modalDetails.employeeId);
      if (modalType == 'editEmployee') {
        this.modalDetails.appointmentDate = this._sharedService.String_TO_date(this.modalDetails.appointmentDate);
        this.getBranchAccountE(this.modalDetails.branchId,modalType);
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
    if(type === 'ShowEmployeeFiles')
      {
        this.GetAllEmployeeFiles(this.modalDetails.employeeId);
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

  EmployeeIdPublic: any = 0;
  setEmployeeid_P(id: any) {
    this.EmployeeIdPublic = id;
    console.log('this.EmployeeIdPublic');
    console.log(this.EmployeeIdPublic);
  }

  disableButtonSave_Employee = false;

  addEmployee() {
    debugger;
    var val = this.validateForm();
    if (val.status == false) {
      this.toast.error(val.msg, 'رسالة');
      return;
    }
    var custObj: any = {};
    custObj.employeeId = this.modalDetails.employeeId;
    custObj.nameAr = this.modalDetails.nameAr;
    custObj.nameEn = this.modalDetails.nameEn;
    custObj.nationalId = this.modalDetails.nationalId;
    custObj.employeeCode = this.modalDetails.employeeCode;
    custObj.branchId = this.modalDetails.branchId;
    custObj.accountId = this.modalDetails.accountId;
    custObj.subMainPhoneNo = this.modalDetails.subMainPhoneNo;
    custObj.mainPhoneNo = this.modalDetails.mainPhoneNo;
    custObj.status = this.modalDetails.status;
    custObj.isManager = this.modalDetails.isManager;
    custObj.directManagerId = this.modalDetails.directManagerId;
    custObj.jobId = this.modalDetails.jobId;
    custObj.salary = this.modalDetails.salary;

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
      formData.append('EmployeeId', custObj.employeeId.toString());
    }
    this.disableButtonSave_Employee = true;
    setTimeout(() => {
      this.disableButtonSave_Employee = false;
    }, 5000);
    this.service.SaveEmployee(formData).subscribe((result: any) => {
      if (result.statusCode == 200) {
        this.toast.success(
          this.translate.instant(result.reasonPhrase),
          this.translate.instant('Message')
        );
        this.decline();
        this.getAllEmployees();
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
      this.ValidateObjMsg = { status: false, msg: ' أدخل أسم الموظف عربي' };
      return this.ValidateObjMsg;
    }
    else if ((this.modalDetails.nationalId == null ||
      this.modalDetails.nationalId == '')
  ) {
    this.ValidateObjMsg = {
      status: false,
      msg: 'ادخل رقم الهوية للموظف',
    };
    return this.ValidateObjMsg;
  } 
  else if (this.modalDetails.branchId == null) {
      this.ValidateObjMsg = { status: false, msg: 'اختر فرع الموظف' };
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
      this.ValidateObjMsg = { status: false, msg: 'ادخل تليفون الموظف' };
      return this.ValidateObjMsg;
    }
    else if(this.modalDetails.mainPhoneNo.length<11)
    {
      this.ValidateObjMsg = { status: false, msg: 'لا يمكنك الحفظ أقل من 11 رقم' };
      return this.ValidateObjMsg;
    }
    else if ((this.modalDetails.salary == null ||this.modalDetails.salary == '')
    ) {
      this.ValidateObjMsg = { status: false, msg: 'ادخل مرتب الموظف' };
      return this.ValidateObjMsg;
    }
    else if ((this.modalDetails.address == null ||this.modalDetails.address == '')
    ) {
      this.ValidateObjMsg = { status: false, msg: 'ادخل العنوان' };
      return this.ValidateObjMsg;
    }
    else if ((this.modalDetails.jobId == null ||this.modalDetails.jobId == '')
    ) {
      this.ValidateObjMsg = { status: false, msg: 'ادخل الوظيفة' };
      return this.ValidateObjMsg;
    }
    else if ((this.modalDetails.appointmentDate == null ||this.modalDetails.appointmentDate == '')
    ) {
      this.ValidateObjMsg = { status: false, msg: 'ادخل تاريخ التعيين' };
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

    for (let index = 0; index < this.dataSourceTemp.length; index++) {
      let date = new Date(this.dataSourceTemp[index].addDate);
      const formatter = new Intl.DateTimeFormat(this.locale, this.options);
      const formattedDate = formatter.format(date);
      x.push({
        branchName: this.dataSourceTemp[index].branchName,
        employeeCode: this.dataSourceTemp[index].employeeCode,
        employeeName: this.dataSourceTemp[index].nameAr,
        mainPhoneNo: this.dataSourceTemp[index].mainPhoneNo,
        salary: this.dataSourceTemp[index].salary,
        address: this.dataSourceTemp[index].address,
        jobName: this.dataSourceTemp[index].jobName,
        managerName: this.dataSourceTemp[index].managerName,
        statusName: this.dataSourceTemp[index].statusName,
        addDate: formattedDate,

      });
    }
    debugger;
    this.service.customExportExcel(x, 'Employees');
  }

  getAllEmployees() {
    this.service.GetAllEmployees_Branch().subscribe((data: any) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSourceTemp = data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.allCount = data.length;
      this.FillSerachLists(data);

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
      type: 'addEmployee',
      nameAr: null,
      nameEn: null,
      id: null,
      name: null,
      employeeId: 0,
      branchId: null,
      employeeCode: null,
      nationalId: null,
      address: null,
      mainPhoneNo: null,
      subMainPhoneNo: null,
      directManagerId: null,
      jobId: null,
      salary: null,
      appointmentDate: null,
      status:true,
      isManager:false,
      notes: null,
      accountId: null,
      accountName: null,
      addDate: null,
      addUser: [],
      addedemployeeImg: null,
      accountCodee: null,
    };
  }

  confirm(): void {
    this.service.DeleteEmployee(this.modalDetails.employeeId).subscribe((result) => {
        if (result.statusCode == 200) {
          this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
          this.getAllEmployees();
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
      ListJob:[],
      employeeId:null,
      jobId:null,
      showFilters:false
    },
  };

FillSerachLists(dataT:any){
  this.FillEmployeeListName(dataT);
  this.FillEmployeeListCode(dataT);
  this.FillEmployeeListPhone(dataT);
  this.FillEmployeeListJob(dataT);
}

FillEmployeeListName(dataT:any){
  const ListLoad = dataT.map((item: { employeeId: any; nameAr: any; }) => {
    const container:any = {}; container.id = item.employeeId; container.name = item.nameAr; return container;
  })
  const key = 'id';
  const arrayUniqueByKey = [...new Map(ListLoad.map((item: { [x: string]: any; }) => [item[key], item])).values()];
  this.dataSearch.filter.ListName=arrayUniqueByKey;
}
FillEmployeeListCode(dataT:any){
  const ListLoad = dataT.map((item: { employeeId: any; employeeCode: any; }) => {
    const container:any = {}; container.id = item.employeeId; container.name = item.employeeCode; return container;
  })
  const key = 'id';
  const arrayUniqueByKey = [...new Map(ListLoad.map((item: { [x: string]: any; }) => [item[key], item])).values()];
  this.dataSearch.filter.ListCode=arrayUniqueByKey;
}
FillEmployeeListPhone(dataT:any){
  const ListLoad = dataT.map((item: { employeeId: any; mainPhoneNo: any; }) => {
    const container:any = {}; container.id = item.employeeId; container.name = item.mainPhoneNo; return container;
  })
  const key = 'id';
  const arrayUniqueByKey = [...new Map(ListLoad.map((item: { [x: string]: any; }) => [item[key], item])).values()];
  this.dataSearch.filter.ListPhone=arrayUniqueByKey;
}
FillEmployeeListJob(dataT:any){
  const ListLoad = dataT.map((item: { jobId: any; jobName: any; }) => {
    const container:any = {}; container.id = item.jobId; container.name = item.jobName; console.log("container",container); return container;   
  })
  const key = 'id';
  const arrayUniqueByKey = [...new Map(ListLoad.map((item: { [x: string]: any; }) => [item[key], item])).values()];
  this.dataSearch.filter.ListJob=arrayUniqueByKey;
  this.dataSearch.filter.ListJob = this.dataSearch.filter.ListJob.filter((d: { id: any }) => (d.id !=null && d.id!=0));
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
  if(this.dataSearch.filter.employeeId!=null && this.dataSearch.filter.employeeId!="")
  {
    this.dataSource.data = this.dataSource.data.filter((d: { employeeId: any }) => d.employeeId == this.dataSearch.filter.employeeId);
  }
  if(this.dataSearch.filter.jobId!=null && this.dataSearch.filter.jobId!="")
  {
    this.dataSource.data = this.dataSource.data.filter((d: { jobId: any }) => d.jobId == this.dataSearch.filter.jobId);
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

//-------------------------------------File-------------------------------------------
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
  debugger
    var _Files: any = {};
    _Files.fileId=0;
    _Files.employeeId=this.modalDetails.employeeId;
    _Files.fileName=this.dataFile.FileName;
    _Files.transactionTypeId=36;
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
          this.getAllEmployees();
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

EmployeeFileRowSelected: any;

getEmployeeFileRow(row: any) {
  debugger
  this.EmployeeFileRowSelected = row;
}
confirmDeleteEmployeeFile(): void {
  this.files.DeleteFiles(this.EmployeeFileRowSelected.fileId).subscribe((result) => {
      if (result.statusCode == 200) {
        this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
        this.GetAllEmployeeFiles(this.EmployeeFileRowSelected.employeeId);
        this.modal?.hide();
      } else {
        this.toast.error(result.reasonPhrase, this.translate.instant('Message'));
      }
    });
}

EmployeeFilesList: any=[];

GetAllEmployeeFiles(EmployeeId:any) {
  this.EmployeeFilesList=[];
  this.files.GetAllEmployeeFiles(EmployeeId).subscribe((data: any) => {
    this.EmployeeFilesList = data;
  });
}
//#endregion
//----------------------------------------End File---------------------------------------

AddDataType: any = {
  Jobdata: {
    id: 0,
    namear: null,
    nameen: null,
  },
};

  //-----------------------------------SaveJob-------------------------------
  //#region 
  selectedJob: any;
  JobRowSelected: any;
  getJobRow(row: any) {
    this.JobRowSelected = row;
  }
  setJobInSelect(data: any, modal: any) {
    this.modalDetails.jobId=data.id;
  }
  confirmJobDelete() {
    this._organization.DeleteJob(this.JobRowSelected.id).subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
          this.FillJobSelect_Emp();
        } else {
          this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
        }
      });
  }

  saveJob() {
    if (
      this.AddDataType.Jobdata.namear == null ||
      this.AddDataType.Jobdata.nameen == null
    ) {
      this.toast.error('من فضلك أكمل البيانات', 'رسالة');
      return;
    }
    var JobObj: any = {};
    JobObj.JobId = this.AddDataType.Jobdata.id;
    JobObj.NameAr = this.AddDataType.Jobdata.namear;
    JobObj.NameEn = this.AddDataType.Jobdata.nameen;

    var obj = JobObj;
    this._organization.SaveJob(obj).subscribe((result: any) => {
      if (result.statusCode == 200) {
        this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
        this.resetJob();
        this.FillJobSelect_Emp();
      } else {
        this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
      }
    });
  }
  resetJob() {
    this.AddDataType.Jobdata.id = 0;
    this.AddDataType.Jobdata.namear = null;
    this.AddDataType.Jobdata.nameen = null;
  }
  //#endregion
  //----------------------------------EndSaveJob-----------------------------


}
