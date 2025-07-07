import {AfterViewInit,ChangeDetectorRef,Component,OnInit,TemplateRef,ViewChild,HostListener,Pipe,PipeTransform,} from '@angular/core';
import { EmailValidator, NgForm } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {FileUploadControl,FileUploadValidators,} from '@iplab/ngx-file-upload';
import {BsModalService,BsModalRef,ModalDirective,} from 'ngx-bootstrap/modal';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ExportationService } from 'src/app/core/services/exportation-service/exportation.service';
import { fade } from 'src/app/shared/animations/toggleBtn.animation';
import { RestApiService } from 'src/app/shared/services/api.service';
import { combineLatest } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import {ModalDismissReasons, NgbModal,NgbModalOptions,} from '@ng-bootstrap/ng-bootstrap';
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
import { VoucherService } from 'src/app/core/services/acc_Services/voucher.service';

@Component({
  selector: 'app-revoucher',
  templateUrl: './revoucher.component.html',
  styleUrls: ['./revoucher.component.scss']
})
export class RevoucherComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSourceTemp: any = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource([{}]);
  _VoucherSMS: any = null;
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
        ar: 'إستلام نقدية',
        en: 'Voucher',
      },
      link: '/accounts',
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
    'voucherNo',
    'documentNo',
    'date',
    'notes',
    'statustxt',
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
      search_VoucherName: '',
      search_voucherEmail: '',
      search_voucherMobile: '',
      isChecked: false,
    },
  };

  EditModel: any = {
    VoucherId: 0,
    nameAr: null,
    nameEn: null,
  };

  constructor(
    private service: VoucherService,
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

  VoucherModels:any={
    type:6,
  }

  users: any;
  showPrice: any = false;
  existValue: any = true;

  selectAllValue = false;
  VoucherStatusList: any;

  ngOnInit(): void {
    this.VoucherStatusList = [
      { id: 1, name: { ar: 'مسودة', en: 'draft' } },
      { id: 2, name: { ar: 'مراجع', en: 'References' } },
      { id: 3, name: { ar: 'نهائي', en: 'finished' } },
    ];
    this.getAllVouchers();
  }

  applyFilter(event: any) {
    const val = event.target.value.toLowerCase();
    var tempsource = this.dataSourceTemp;
    if (val) {
      tempsource = this.dataSourceTemp.filter((d: any) => {
        return (
          (d.branchName &&
            d.branchName?.trim().toLowerCase().indexOf(val) !== -1) ||
          (d.voucherNo &&
            d.voucherNo?.trim().toLowerCase().indexOf(val) !== -1) ||
          (d.documentNo &&
            d.documentNo?.trim().toLowerCase().indexOf(val) !== -1) ||
          (d.date &&
            d.date?.trim().toLowerCase().indexOf(val) !== -1) ||
          (d.notes &&
            d.notes?.trim().toLowerCase().indexOf(val) !== -1) ||
            (d.statustxt &&
              d.statustxt?.trim().toLowerCase().indexOf(val) !== -1)
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
        if (modalType == 'addVoucher'){
          this.BranchChange(this.modalDetails.branchId,modalType);
        }
      }
      else
      {
        if (modalType == 'addVoucher'){
          debugger
          this.modalDetails.branchId = parseInt(this._sharedService.getStoBranch());
          this.BranchChange(this.modalDetails.branchId,modalType);
        }     
      }
    });
  }

  BranchChange(BranchId: any,modalType:any) {
    debugger
    if(modalType == 'addVoucher')
    {
      this.VoucherNumber_Reservation(BranchId);
    }
  }

  VoucherNumber_Reservation(BranchId:any){
    this.service.VoucherNumber_Reservation(this.VoucherModels.type,BranchId).subscribe(data=>{
      this.modalDetails.voucherNo=data.reasonPhrase;
    });
  }

  //-----------------------OPEN MODAL--------------------------------------------------

  openModal(template: TemplateRef<any>, data?: any, modalType?: any) {
    this.fillBranchByUserId(modalType);
    //this.FillUnitSelect();
    this.resetModal();
    //this.getEmailOrganization();
    debugger
    if (modalType == 'addVoucher') {
      this.FillMainAccountSelect();
      // this.GenerateVoucherNumber();
    }
    console.log('this.modalDetails');
    console.log(this.modalDetails);

    if (data) {
      this.modalDetails = data;
      var MainAcc=this.modalDetails.mainAccountId; 
      var SubAcc=this.modalDetails.subAccountId;

      if (modalType == 'editVoucher'|| modalType == 'VoucherView') {
        this.FillMainAccountSelect();
        this.modalDetails.mainAccountId = MainAcc;
        this.FillSubAccountSelect();
        this.modalDetails.subAccountId = SubAcc;
        if(this.modalDetails.date!=null)
          {
            this.modalDetails.date = this._sharedService.String_TO_date(this.modalDetails.date);
          }
          this.GetAllTransByVoucherId(this.modalDetails.voucherId);
      }
      console.log(this.modalDetails);
    }
    if (modalType) {
      //console.log(modalType);

      this.modalDetails.vouchertype = modalType;
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
  OpenType:any=1;
  open(content: any, data?: any, type?: any, idRow?: any, model?: any) {
    this.publicidRow = 0;
    if (idRow != null && type == 'AccountsMainListModal') {
      this.selectedAccountRowTable = idRow;
      this.FillMainAccountLoadTable();
      this.OpenType=1;
    }
    
    else if (idRow != null && type == 'AccountsSubListModal') {
      this.selectedAccountRowTable = idRow;
      if(!(data.mainAccountId==null || data.mainAccountId==""))
      {
        this.FillSubAccountLoadTable(data.mainAccountId);
      }
      this.OpenType=2;
    }
    else
    {
      if (data) {
        this.modalDetails = data;
      }
    }

    if (type == 'accountingentry') {
      this.GetAllVoucherTransactions(data.voucherId);
    } 
    if (type == 'decodingPagingModal') {
      this.InvoiceModelPublic=data;
    } 

    if (idRow != null) {

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

  VoucherIdPublic: any = 0;
  setVoucherid_P(id: any) {
    this.VoucherIdPublic = id;
    console.log('this.VoucherIdPublic');
    console.log(this.VoucherIdPublic);
  }

  disableButtonSave_Voucher = false;

  addVoucher() {
    debugger;
    var val = this.validateForm();
    if (val.status == false) {
      this.toast.error(val.msg, 'رسالة');
      return;
    }
    if(this.modalDetails.diff>0)
    {
      this.toast.error("من فضلك أدخل قيد موزون", 'رسالة');
      return;
    }
    var voucObj: any = {};
    voucObj.voucherId = this.modalDetails.voucherId;
    voucObj.voucherNo = this.modalDetails.voucherNo;
    voucObj.documentNo = this.modalDetails.documentNo;
    voucObj.type = this.modalDetails.type;
    voucObj.mainAccountId = this.modalDetails.mainAccountId;
    voucObj.subAccountId = this.modalDetails.subAccountId;
    voucObj.totalValue = this.modalDetails.totalCredit;
    voucObj.branchId = this.modalDetails.branchId;
    if (this.modalDetails.date != null) {
      voucObj.date = this._sharedService.date_TO_String(this.modalDetails.date);
    }
    voucObj.status = this.modalDetails.status;
    voucObj.notes = this.modalDetails.notes;
    console.log('voucObj');
    console.log(voucObj);

    var input = { valid: true, message: "" }
    var TransactionDetailsObjList:any = [];
    this.VoucherDetailsRows.forEach((element: any) => {

      if(element.mainAccountId == null || element.mainAccountId == null || element.mainAccountId == "") {
        input.valid = false; input.message = "من فضلك أختر الحساب الرئيسي ";return;
      }
      if(element.subAccountId == null || element.subAccountId == null || element.subAccountId == "") {
        input.valid = false; input.message = "من فضلك أختر الحساب الفرعي ";return;
      }
      if (element.amount == null || element.amount == 0 || element.amount == "") {
        input.valid = false; input.message = "من فضلك أختر مبلغ صحيح";return;
      }

      var Transobj:any  = {};
      debugger
      Transobj.mainAccountId = element.mainAccountId;
     
      Transobj.subAccountId = element.subAccountId;
      if(element.CreditDepitStatus=="C")
      {
        Transobj.credit = element.amount;
        Transobj.depit = 0;
      }
      else
      {
        Transobj.credit = 0;
        Transobj.depit = element.amount;
      }
      if(this.modalDetails.voucherId>0)
      {
        Transobj.voucherId = this.modalDetails.voucherId;
      }
      Transobj.Type = this.modalDetails.type;
      Transobj.Status = this.modalDetails.status;
      Transobj.collectorName = element.collectorName;
      Transobj.notes = element.notes;
      TransactionDetailsObjList.push(Transobj);

    });
    if (!input.valid) {
      this.toast.error(input.message);return;
    }
    voucObj.TransactionDetails = TransactionDetailsObjList;
    console.log("voucObj",voucObj);

    this.disableButtonSave_Voucher = true;
    setTimeout(() => {
      this.disableButtonSave_Voucher = false;
    }, 5000);
    this.service.SaveVoucher(voucObj).subscribe((result: any) => {
      if (result.statusCode == 200) {
        this.toast.success(
          this.translate.instant(result.reasonPhrase),
          this.translate.instant('Message')
        );
        this.decline();
        this.getAllVouchers();
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
      this.modalDetails.mainAccountId == null ||this.modalDetails.mainAccountId == '') {
      this.ValidateObjMsg = { status: false, msg: 'أختر الحساب الرئيسي' };
      return this.ValidateObjMsg;
    }
    else if ((this.modalDetails.subAccountId == null ||this.modalDetails.subAccountId == '')) {
    this.ValidateObjMsg = {status: false, msg: 'أختر الحساب الفرعي',};
    return this.ValidateObjMsg;
  } 
  else if (this.modalDetails.branchId == null) {
      this.ValidateObjMsg = { status: false, msg: 'اختر فرع السند' };
      return this.ValidateObjMsg;
    }  
    else if ((this.modalDetails.status == null ||this.modalDetails.status == '')
    ) {
      this.ValidateObjMsg = { status: false, msg: 'اختر حالة الإذن' };
      return this.ValidateObjMsg;
    }
    else if ((this.modalDetails.date == null ||this.modalDetails.date == '')
    ) {
      this.ValidateObjMsg = { status: false, msg: 'أختر التاريخ' };
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
        voucherNo: AccDataSource[index].voucherNo,
        documentNo: AccDataSource[index].documentNo,
        date: AccDataSource[index].date,
        notes: AccDataSource[index].notes,
        statustxt: AccDataSource[index].statustxt,
        addDate: formattedDate,

      });
    }
    debugger;
    this.service.customExportExcel(x, 'Vouchers');
  }




  getAllVouchers() {
    this.service.GetAllVouchers_Branch(this.VoucherModels.type).subscribe((data: any) => {
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
      type:6,
      vouchertype: 'addVoucher',
      voucherNo: null,
      documentNo: null,
      id: null,
      name: null,
      voucherId: 0,
      mainAccountId: null,
      subAccountId: null,
      date: null,
      journalNo: null,
      totalValue: null,
      branchId:null,
      isPost: null,
      postDate: null,
      yearId: null,
      status: null,
      notes: null,
      addDate: null,
      addUser: null,
      addedvoucherImg: null,
      totalCredit:0.00,
      totalDepit:0.00,
      diff:0.00,
    };
    this.VoucherDetailsRows = [];
  }

  confirm(): void {
    this.service.DeleteVoucher(this.modalDetails.voucherId).subscribe((result) => {
        if (result.statusCode == 200) {
          this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
          this.getAllVouchers();
          this.modal?.hide();
        } else {
          this.toast.error(result.reasonPhrase, 'رسالة');
        }
      });
  }

  decline(): void {
    this.modal?.hide();
  }
  VoucherDetailsRows: any = [];

  deleteVoucherRow(idRow: any) {
    let index = this.VoucherDetailsRows.findIndex(
      (d: { idRow: any }) => d.idRow == idRow
    );
    this.VoucherDetailsRows.splice(index, 1);
    this.CalculateVoucher();
  }
  addVoucherRow() {
    var maxVal = 0;
    if (this.VoucherDetailsRows.length > 0) {
      maxVal = Math.max(
        ...this.VoucherDetailsRows.map((o: { idRow: any }) => o.idRow)
      );
    } else {
      maxVal = 0;
    }
    this.VoucherDetailsRows?.push({
      idRow: maxVal + 1,
      amount: null,
      mainAccountId: null,
      mainAccountIdtxt: null,
      subAccountId: null,
      subAccountIdtxt: null,
      CreditDepitStatus: 'C',
      collectorName: null,
      notes: null,
      lineMain:false,
    });
  }

  AccountListDataSource = new MatTableDataSource();
  AccountListDataSourceTemp: any;
  AccountList: any;
  RowEntryVouvherData: any;
  selectedAccountRowTable: any;
  AccountListdisplayedColumns: string[] = ['name'];
  @ViewChild('paginatorAccount') paginatorAccount: MatPaginator;

  FillMainAccountLoadTable() {
    this.service.FillAllAccountsSelect().subscribe((data) => {
      this.AccountListDataSource = new MatTableDataSource(data);
      this.AccountListDataSource.paginator = this.paginatorAccount;
      this.AccountList = data;
      this.AccountListDataSourceTemp = data;
    });
  }

  FillSubAccountLoadTable(parentId:any) {
    this.service.FillAllAccountsSelectByParentId(parentId).subscribe((data) => {
      this.AccountListDataSource = new MatTableDataSource(data);
      this.AccountListDataSource.paginator = this.paginatorAccount;
      this.AccountList = data;
      this.AccountListDataSourceTemp = data;
    });
  }


  setAccountRowValue(element: any) {
    if(this.OpenType==1)
    {
      this.VoucherDetailsRows.filter(
        (a: { idRow: any }) => a.idRow == this.selectedAccountRowTable)[0].mainAccountId = element.id;
      this.VoucherDetailsRows.filter(
        (a: { idRow: any }) => a.idRow == this.selectedAccountRowTable)[0].mainAccountIdtxt = element.name;
    }
    else{
      this.VoucherDetailsRows.filter(
        (a: { idRow: any }) => a.idRow == this.selectedAccountRowTable)[0].subAccountId = element.id;
      this.VoucherDetailsRows.filter(
        (a: { idRow: any }) => a.idRow == this.selectedAccountRowTable)[0].subAccountIdtxt = element.name;
    }

  }
  applyFilterAccountsList(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.AccountListDataSource.filter = filterValue.trim().toLowerCase();
  }
  journalDebitNmRows = 0;
  journalCreditNmRows = 0;
  
  CalculateVoucher() {
    this.CalculateVoucherMain();  
    var totalDebit = 0,totalCredit = 0, totalBalance = 0;
    this.journalDebitNmRows = 0;this.journalCreditNmRows = 0;
    this.VoucherDetailsRows.forEach((element: any, index: any) => {
      var Value = 0;
      Value = element.amount;
      if (element.CreditDepitStatus == 'D') {
        this.journalDebitNmRows += 1;
        totalDebit += +Value
        totalBalance = +parseFloat((+totalDebit - +totalCredit).toString()).toFixed(2);
      } else {
        this.journalCreditNmRows += 1;
        totalCredit += +Value;
        totalBalance = +parseFloat((+totalDebit - +totalCredit).toString()).toFixed(2);
      }
    });
    this.modalDetails.totalCredit = +parseFloat(totalCredit.toString()).toFixed(2);
    this.modalDetails.totalDepit = +parseFloat(totalDebit.toString()).toFixed(2);
    this.modalDetails.diff = +parseFloat((+totalDebit - +totalCredit).toString()).toFixed(2);
  }

  CalculateVoucherMain() {
    debugger
    var totalDebit = 0;
    this.VoucherDetailsRows.forEach((element: any, index: any) => {
      var Value = 0;
      Value = element.amount;
      if (element.CreditDepitStatus == 'C') {
        totalDebit += Value
      } 
    });
    var row=this.VoucherDetailsRows.filter((a: { CreditDepitStatus: any }) => a.CreditDepitStatus == "D");
    if(row.length>0)
    {
      row[0].amount=parseFloat(totalDebit.toString()).toFixed(0);
    }

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
      ListvoucherNo:[],
      ListdocumentNo:[],
      Liststatus:[],
      voucherId:null,
      status:null,
      showFilters:false
    },
  };

FillSerachLists(dataT:any){
  this.FillVoucherListvoucherNo(dataT);
  this.FillVoucherListdocumentNo(dataT);
  this.FillVoucherListstatus();
}

FillVoucherListvoucherNo(dataT:any){
  const ListLoad = dataT.map((item: { voucherId: any; voucherNo: any; }) => {
    const container:any = {}; container.id = item.voucherId; container.name = item.voucherNo; return container;
  })
  const key = 'id';
  const arrayUniqueByKey = [...new Map(ListLoad.map((item: { [x: string]: any; }) => [item[key], item])).values()];
  this.dataSearch.filter.ListvoucherNo=arrayUniqueByKey;
}
FillVoucherListdocumentNo(dataT:any){
  const ListLoad = dataT.map((item: { voucherId: any; documentNo: any; }) => {
    const container:any = {}; container.id = item.voucherId; container.name = item.documentNo; return container;
  })
  const key = 'id';
  const arrayUniqueByKey = [...new Map(ListLoad.map((item: { [x: string]: any; }) => [item[key], item])).values()];
  this.dataSearch.filter.ListdocumentNo=arrayUniqueByKey;
  this.dataSearch.filter.ListdocumentNo = this.dataSearch.filter.ListdocumentNo.filter((d: { name: any }) => (d.name !=null && d.name!=""));

}
FillVoucherListstatus(){
  this.dataSearch.filter.Liststatus = [
    { id: 1, name: 'مسودة' },
    { id: 2, name: 'مراجع' },
    { id: 3, name: 'نهائي' },
  ];
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
  if(this.dataSearch.filter.voucherId!=null && this.dataSearch.filter.voucherId!="")
  {
    this.dataSource.data = this.dataSource.data.filter((d: { voucherId: any }) => d.voucherId == this.dataSearch.filter.voucherId);
  }
  if(this.dataSearch.filter.status!=null && this.dataSearch.filter.status!="")
  {
    this.dataSource.data = this.dataSource.data.filter((d: { status: any }) => d.status == this.dataSearch.filter.status);
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

MainAccountList:any;
SubAccountList:any;

FillMainAccountSelect() {
  this.MainAccountList=[];
  this.SubAccountList=[];
  this.modalDetails.mainAccountId=null;
  this.modalDetails.subAccountId=null;
  this.service.FillAllAccountsSelect().subscribe((data) => {
    console.log(data);
    this.MainAccountList = data;
  });
}
FillSubAccountSelect() {
  this.SubAccountList=[];
  this.modalDetails.subAccountId=null;
  if(this.modalDetails.mainAccountId!=null)
  {

    this.service.FillAllAccountsSelectByParentId(this.modalDetails.mainAccountId).subscribe((data) => {
      console.log(data);
      this.SubAccountList = data;
    });

    //this.SubAccountList = this.MainAccountList.filter((d: { parentId: any }) => d.parentId == this.modalDetails.mainAccountId);
  }
}
MainAccountChange(){ 
  this.FillSubAccountSelect();
}
SubAccountChange(){
  debugger
  if(this.modalDetails.subAccountId!=null)    
  {
    this.deleteVoucherRowMain();
    this.addVoucherRowMain();
      // if(this.VoucherDetailsRows.length>0)
      // {
      //   this.VoucherDetailsRows.sort((a: { CreditDepitStatus: string; },b: { CreditDepitStatus: string; }) => a.CreditDepitStatus > b.CreditDepitStatus ? 1 : -1)
      // }
  }
  else
  {
    this.deleteVoucherRowMain();
  }
  
}

deleteVoucherRowMain(){
  debugger
  if(this.VoucherDetailsRows.length>0)
  {
    var row=this.VoucherDetailsRows.filter((a: { CreditDepitStatus: any }) => a.CreditDepitStatus == "D");
    if(row.length>0)
    {
      this.deleteVoucherRow(row[0].idRow);
    }
  }
}

addVoucherRowMain() {
  var Maintxt=this.MainAccountList.filter((a: { id: any }) => a.id == this.modalDetails.mainAccountId)[0].name;
  var Subtxt=this.SubAccountList.filter((a: { id: any }) => a.id == this.modalDetails.subAccountId)[0].name;

  var maxVal = 0;
  if (this.VoucherDetailsRows.length > 0) {
    maxVal = Math.max(
      ...this.VoucherDetailsRows.map((o: { idRow: any }) => o.idRow)
    );
  } else {
    maxVal = 0;
  }
  this.VoucherDetailsRows?.push({
    idRow: maxVal + 1,
    amount: null,
    mainAccountId: this.modalDetails.mainAccountId,
    mainAccountIdtxt: Maintxt,
    subAccountId: this.modalDetails.subAccountId,
    subAccountIdtxt: Subtxt,
    CreditDepitStatus: 'D',
    collectorName: null,
    notes: null,
    lineMain:true,
  });
}

backgroungColor(row: any) {
  if (Object.keys(row).length === 0) return '';
  if ((row.lineMain ==true)) {
    return 'MainColor';
  } else if (row.lineMain ==false) {
    return '';
  }
  return '';
}

get totaldepit() {
  var sum = 0;
  this.AllJournalEntries.forEach((element: any) => {
    sum = +parseFloat(sum.toString()).toFixed(2) + +parseFloat(element.depit.toString()).toFixed(2);
  });
  return parseFloat(sum.toString()).toFixed(2);
}

get totalcredit() {
  var sum = 0;
  this.AllJournalEntries.forEach((element: any) => {
    sum =+parseFloat(sum.toString()).toFixed(2) + +parseFloat(element.credit.toString()).toFixed(2);
  });
  return parseFloat(sum.toString()).toFixed(2);
}

AllJournalEntries: any = [];
GetAllVoucherTransactions(voucherId: any) {
  this.service.GetAllVoucherTransactions(voucherId).subscribe((data) => {
      this.AllJournalEntries = data;
    });
}

GetAllTransByVoucherId(voucherId: any) {
  this.VoucherDetailsRows = [];
  this.service.GetAllVoucherTransactions(voucherId).subscribe((data) => {
    var TotalCredit = 0;var TotalDepit = 0;
    if (data.length > 0) {
      data.forEach((element: any) => {
        var Credit = 0;var Depit = 0;
        if (element.depit < element.credit) {
          Credit = parseFloat(element.credit);
          Depit = 0;
          TotalCredit = TotalCredit + Credit;
        }
        if (element.credit < element.depit) {
          Credit = 0;
          Depit = parseFloat(element.depit);
          TotalDepit = TotalDepit + Depit;
        }
        this.VoucherDetailsRows?.push({
          // idRow: maxVal + 1,
          idRow: element.lineNumber,
          amount: Credit > Depit ? element.credit : element.depit,
          mainAccountId: element.mainAccountId,
          mainAccountIdtxt: element.mainAccountIdtxt,
          subAccountId: element.subAccountId,
          subAccountIdtxt: element.subAccountIdtxt,
          CreditDepitStatus: Credit > Depit ? 'C' : 'D',
          collectorName: element.collectorName,
          notes: element.notes,
          lineMain:Credit > Depit ? false: true,
        });
        this.VoucherDetailsRows.sort((a: { idRow: number }, b: { idRow: number }) =>(a.idRow ?? 0) - (b.idRow ?? 0)); });
      this.modalDetails.totalCredit = parseFloat(TotalCredit.toString()).toFixed(2);
      this.modalDetails.totalDepit = parseFloat(TotalDepit.toString()).toFixed(2);
      this.modalDetails.diff = parseFloat((TotalDepit - TotalCredit).toString()).toFixed(2);
    } else {
      this.VoucherDetailsRows = [];
    }
  });
}


PostBackVoucher() {
  this.service.PostBackVoucher(this.InvoiceModelPublic.voucherId).subscribe((result: any) => {
      if (result.statusCode == 200) {
        this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
        this.getAllVouchers();
      } else {
        this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
      }
    });
}

}
