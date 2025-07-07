
import { LiveAnnouncer } from '@angular/cdk/a11y';
import {AfterViewInit,ChangeDetectorRef,Component,OnInit,TemplateRef,ViewChild,
  HostListener,Pipe,PipeTransform,} from '@angular/core';
import { EmailValidator, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {FileUploadControl,FileUploadValidators,} from '@iplab/ngx-file-upload';
import {BsModalService,BsModalRef,ModalDirective,} from 'ngx-bootstrap/modal';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ContractService } from 'src/app/core/services/project-services/contract.service';
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
import { SharedService } from 'src/app/core/services/shared.service';
import { CustomerService } from 'src/app/core/services/customer-services/customer.service';
import { EmployeeService } from 'src/app/core/services/employee-services/employee.service';
import { PreviewService } from 'src/app/core/services/project-services/preview.service';
import { HttpEventType } from '@angular/common/http';
import { filesservice } from 'src/app/core/services/sys_Services/files.service';
import { CategoryService } from 'src/app/core/services/acc_Services/category.service';
import { MatStepper } from '@angular/material/stepper';
import { NgxPrintElementService } from 'ngx-print-element';
import { VoucherService } from 'src/app/core/services/acc_Services/voucher.service';


@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.scss']
})

export class ContractsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSourceTemp: any = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource([{}]);
  _ContractSMS: any = null;
  modal?: BsModalRef;
  modalDetails: any = {};
  load_BranchAccount: any;
  load_CityAndAreas: any;
  customrRowSelected: any;
  BranchId: number;
  allContractCount = 0;
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
        ar: 'الحسابات',
        en: 'Accounts',
      },
      link: '/accounts/contract',
    },
    sub: {
      ar: 'العقود',
      en: 'Contract',
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
    'contractCode',
    'customerCode',
    'customerName',
    'mainPhoneNo',
    'address',
    'date',
    'contractStatustxt',
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
      search_ContractName: '',
      search_contractEmail: '',
      search_contractMobile: '',
      isChecked: false,
    },
  };

  EditModel: any = {
    ContractId: 0,
    nameAr: null,
    nameEn: null,
  };

  constructor(
    private service: ContractService,
    private category: CategoryService,
    private print: NgxPrintElementService,
    private previewservice: PreviewService,
    private modalService: BsModalService,
    private api: RestApiService,
    private changeDetection: ChangeDetectorRef,
    private toast: ToastrService,
    private files: filesservice,
    private _formBuilder: FormBuilder,
    private ngbModalService: NgbModal,
    private _sharedService: SharedService,
    private authenticationService: AuthenticationService,
    private customerService: CustomerService,
    private employeeService: EmployeeService,
    private translate: TranslateService,
    private _voucherService: VoucherService,
    private domSanitizer: DomSanitizer
  ) {
    this.userG = this.authenticationService.userGlobalObj;
    this.subscription = this.control.valueChanges.subscribe(
      (values: Array<File>) => this.getImage(values[0])
    );
    this.GetOrganizationData();
  }
  OrganizationData: any;
  environmentPho: any;
  dateprint: any;
  GetOrganizationData(){
    this.api.GetOrganizationDataLogin().subscribe((data: any) => {
      this.OrganizationData = data.result;
      this.dateprint =this._sharedService.date_TO_String(new Date());
      this.environmentPho =environment.PhotoURL + this.OrganizationData.logoUrl;
    });
  }
  BranchData: any;
  environmentPhoBranch: any;
  GetBranchData(BranchId:any){
    this.api.GetBranchByBranchIdNew(BranchId).subscribe((data: any) => {
      this.BranchData = data;
      if(!(this.BranchData.logoUrl==null || this.BranchData.logoUrl==""))
      {
        this.environmentPhoBranch =environment.PhotoURL + this.BranchData.logoUrl;
      }
      else
      {
        this.environmentPhoBranch=this.environmentPho;
      }
    });
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
  ContractStatusList: any;

  ngOnInit(): void {
    this.VoucherStatusList = [
      { id: 1, name: { ar: 'مسودة', en: 'draft' } },
      { id: 2, name: { ar: 'مراجع', en: 'References' } },
      { id: 3, name: { ar: 'نهائي', en: 'finished' } },
    ];
    this.ContractStatusList = [
      { id: 1, name: 'مبدئي' },
      { id: 2, name: 'مراجع' },
      { id: 3, name: 'نهائي' },
    ];
    this.getAllContracts();
    this.FillCustomerSelect();
    this.FillEmployeeselect();
    this.FilltAllPreviewTypes();
    this.SetContractDefData();
    this.GetAllServicesPrice_ContractNew();
  }

  SetContractDefData(){
    this.intialForms();
    this.DisabledBtn();
    this.resetContractDataList();
  }

  intialForms() {
    console.log("this.modalDetails",this.modalDetails)

    this.FormGroup01 = this._formBuilder.group({
      branchId: [null],
      previewId: [null],
      previewTypeId: [null],
      customerId: [null],
      contractId: [null],
      contractCode: [null, [Validators.required]],
      documentNo: [null],
      documentStatus: [null,[Validators.required]],
      date: [null],
      conDateTime: [null],
      deliveryDate: [null],
      delDateTime: [null],
      deliveryDateFinal: [null],
      delDateTimeFinal: [null],
      storageDate: [null],
      stoDateTime: [null],
      notes: [null],
      previewNotes: [null],
      meetingNotes: [null],
      designNotes: [null],
      type: [null],   
      check:[false],
    });
    this.FormGroup02 = this._formBuilder.group({
      total_amount: [null],
    });
    this.FormGroup03 = this._formBuilder.group({
      total_payment: [null],
    });
  }

  SetFormData(data:any){
    debugger
    this.FormGroup01.controls['branchId'].setValue(data.branchId);
    this.FormGroup01.controls['previewId'].setValue(data.previewId);
    this.FormGroup01.controls['previewTypeId'].setValue(data.previewTypeId);
    this.FormGroup01.controls['customerId'].setValue(data.customerId);
    this.FormGroup01.controls['contractId'].setValue(data.contractId);
    this.FormGroup01.controls['contractCode'].setValue(data.contractCode);
    this.FormGroup01.controls['date'].setValue(data.date);
    this.FormGroup01.controls['conDateTime'].setValue(data.conDateTime);
    this.FormGroup01.controls['deliveryDate'].setValue(data.deliveryDate);
    this.FormGroup01.controls['delDateTime'].setValue(data.delDateTime);
    this.FormGroup01.controls['deliveryDateFinal'].setValue(data.deliveryDateFinal);
    this.FormGroup01.controls['delDateTimeFinal'].setValue(data.delDateTimeFinal);
    this.FormGroup01.controls['storageDate'].setValue(data.storageDate);
    this.FormGroup01.controls['stoDateTime'].setValue(data.stoDateTime);
    this.FormGroup01.controls['documentNo'].setValue(data.documentNo);
    this.FormGroup01.controls['documentStatus'].setValue(data.documentStatus);
    this.FormGroup01.controls['notes'].setValue(data.notes);
    this.resetmodalDetailsContractNew();
    this.modalDetailsContractNew.discountValue=data.discountValue;
    this.modalDetailsContractNew.discountPercentage=data.discountPercentage;
    this.GetCategoriesByContractId();
    this.GetAllPaymentsByContractId();
  }


  DisabledBtn(){
    this.FormGroup01.controls['branchId'].disable();
    this.FormGroup01.controls['previewId'].disable();
    this.FormGroup01.controls['previewTypeId'].disable();
    this.FormGroup01.controls['customerId'].disable();
    this.FormGroup01.controls['contractCode'].disable();
  }


  GetCategoriesByContractId(){
    var contractId=(this.FormGroup01.controls['contractId'].value??0);
    this.service.GetCategoriesByContractId(contractId).subscribe(data=>{
      data.forEach((element: any) => {
        var maxVal=0;
        if(this.ContractNewServices.length>0)
        {
          maxVal = Math.max(...this.ContractNewServices.map((o: { idRow: any; }) => o.idRow))
        }
        else{
          maxVal=0;
        }
        this.setServiceRowValueNew_ContractNew(maxVal+1,element);
      }); 
      this.CalculateTotal_ContractNew();
   
    });
  }
  ContractNewPayments: any = [];
  modalPayments:any={
    sumamountPayment:0,
    counts:0,
    paymentId:0,
    amount:null,
    notes:null,
    paymentDate:null,
  }
  resetPayments(){
    this.ContractNewPayments=[];
    this.modalPayments={
      sumamountPayment:0,
      counts:0,
      paymentId:0,
      amount:null,
      notes:null,
      paymentDate:null,
    }
  }
  resetPaymentsModel(){
    this.modalPayments.paymentId=0;
    this.modalPayments.amount=null;
    this.modalPayments.notes=null;
    this.modalPayments.paymentDate=null;
  }
  GetAllPaymentsByContractId(){
    var contractId=(this.FormGroup01.controls['contractId'].value??0);
    this.resetPayments();
    this.service.GetAllPaymentsByContractId(contractId).subscribe(data=>{
      this.ContractNewPayments=data; 
      this.modalPayments.counts=this.ContractNewPayments.length;
      debugger
      this.ContractNewPayments.forEach((element: any) => {
        this.modalPayments.sumamountPayment= +this.modalPayments.sumamountPayment + +parseFloat((element.amount??0)).toFixed(2);
      });  
    });
  }
  PaymentRow:any;
  confirmDeletePayment(): void {
    this.service.DeletePayment(this.PaymentRow.paymentId).subscribe((result) => {
        if (result.statusCode == 200) {
          this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
          this.GetAllPaymentsByContractId();
        } else {
          this.toast.error(result.reasonPhrase, this.translate.instant('Message'));
        }
      });
  }
  

  disableButtonSave_Payment=false;
  SavePaymentbtn(modal:any){
    debugger
    var contractId=(this.FormGroup01.controls['contractId'].value??0);
    var sumtotalAfterDisc=(this.modalDetailsContractNew.sumtotalAfterDisc??0);

    if(this.modalPayments.paymentId>0){
      this.modalPayments.sumamountPayment=0;
      this.ContractNewPayments.forEach((element: any) => {
        if(element.paymentId!=this.modalPayments.paymentId){
          this.modalPayments.sumamountPayment= +this.modalPayments.sumamountPayment + +parseFloat((element.amount??0)).toFixed(2);
        }
      });  
    }

    if(+(sumtotalAfterDisc- +this.modalPayments.sumamountPayment) < +this.modalPayments.amount)
    {
      this.toast.error(this.translate.instant( "لقد تخطيت قيمة العقد"),this.translate.instant("Message"));
      return;
    }

    if (this.modalPayments.paymentDate == null || this.modalPayments.paymentDate == ""){
      this.toast.error(this.translate.instant( "من فضلك أدخل تاريخ الدفعة"),this.translate.instant("Message"));
      return;
    }
    if (this.modalPayments.amount == null || this.modalPayments.amount == ""|| this.modalPayments.amount <=0){
      this.toast.error(this.translate.instant( "من فضلك أدخل مبلغ الدفعة"),this.translate.instant("Message"));
      return;
    }

    var PaymentObj:any = {};
    PaymentObj.PaymentId = this.modalPayments.paymentId;
    PaymentObj.ContractId = contractId;
    PaymentObj.paymentNo = (this.modalPayments.counts+1);
    PaymentObj.Amount = this.modalPayments.amount;
    PaymentObj.notes = this.modalPayments.notes;
    if (this.modalPayments.paymentDate != null) {
      PaymentObj.paymentDate = this._sharedService.date_TO_String(this.modalPayments.paymentDate);
    }
    else
    {
      PaymentObj.paymentDate=null;
    }
    console.log("PaymentObj",PaymentObj);
    this.disableButtonSave_Payment = true;
    setTimeout(() => { this.disableButtonSave_Payment = false }, 15000);
    this.service.SavePayment(PaymentObj).subscribe((result: any)=>{
      debugger
      if(result.statusCode==200){
        this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
        this.GetAllPaymentsByContractId();
        modal.dismiss();
        this.disableButtonSave_Payment = false;
      }
      else{
        this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
        this.disableButtonSave_Payment = false;
      }
    });
  }




  resetContractDataList(){
    this.ContractNewServices=[];
  }

  FormGroup01: FormGroup;
  FormGroup02: FormGroup;
  FormGroup03: FormGroup;

  ContractNewServices: any = [];
  servicesListdisplayedColumns: string[] = ['categoryTypeName', 'nameAr', 'amount'];

  modalDetailsContractNew:any={
    sumamount:null,
    sumtotal:null,
    sumqty:null,
    discountValue:null,
    discountPercentage:null,
    sumtotalAfterDisc:null,
  }
  resetmodalDetailsContractNew(){
    this.ContractNewServices=[];
    this.modalDetailsContractNew={
      sumamount:null,
      sumtotal:null,
      sumqty:null,
      discountValue:null,
      discountPercentage:null,
      sumtotalAfterDisc:null,
    }
  }

  addServiceContractNew() {
    var maxVal=0;
    if(this.ContractNewServices.length>0)
    {
      maxVal = Math.max(...this.ContractNewServices.map((o: { idRow: any; }) => o.idRow))
    }
    else{
      maxVal=0;
    }
    this.ContractNewServices?.push({
      idRow: maxVal+1,
      categoryTypeId: null,
      categoryTypeName: null,
      categoryId: null,
      nameAr: null,
      unitId: null,
      unitName: null,
      qty: null,
      amount: null,
      accamount:null,
      totalValue: null,
    });
  }

  deleteServiceContractNew(idRow: any) {
    this.modalDetailsContractNew={
      sumamount:null,
      sumtotal:null,
      sumqty:null,
      discountValue:0,
      discountPercentage:0,
      sumtotalAfterDisc:null,
    }
    let index = this.ContractNewServices.findIndex((d: { idRow: any; }) => d.idRow == idRow);
    this.ContractNewServices.splice(index, 1);
    this.CalculateTotal_ContractNew();
  }

  selectedServiceRowContractNew: any;

  setServiceRowValue_ContractNew(element: any) {
    debugger
    var ItemCat= this.ContractNewServices.filter((d: { categoryId: any }) => (d.categoryId ==element.categoryId));
    if(ItemCat.length>0)
    {
      this.toast.error(this.translate.instant("تم اختيار هذا الصنف مسبقا"),this.translate.instant("Message"));
      return;
    }
    this.modalDetailsContractNew={
      sumamount:null,
      sumtotal:null,
      sumqty:null,
      discountValue:0,
      discountPercentage:0,
      sumtotalAfterDisc:null,
    }
    this.ContractNewServices.filter((a: { idRow: any; })=>a.idRow==this.selectedServiceRowContractNew)[0].categoryTypeId = element.categoryTypeId;
    this.ContractNewServices.filter((a: { idRow: any; })=>a.idRow==this.selectedServiceRowContractNew)[0].categoryTypeName = element.categoryTypeName;
    this.ContractNewServices.filter((a: { idRow: any; })=>a.idRow==this.selectedServiceRowContractNew)[0].nameAr = element.nameAr;
    this.ContractNewServices.filter((a: { idRow: any; })=>a.idRow==this.selectedServiceRowContractNew)[0].categoryId = element.categoryId;
    this.ContractNewServices.filter((a: { idRow: any; })=>a.idRow==this.selectedServiceRowContractNew)[0].unitId = element.unitId;
    this.ContractNewServices.filter((a: { idRow: any; })=>a.idRow==this.selectedServiceRowContractNew)[0].unitName = element.unitName;
    this.ContractNewServices.filter((a: { idRow: any; })=>a.idRow==this.selectedServiceRowContractNew)[0].qty = 1;
   
    debugger
    if(this.CategoryPriceStatus)
    {
      this.ContractNewServices.filter((a: { idRow: any; })=>a.idRow==this.selectedServiceRowContractNew)[0].amount = element.amount;
    }
    else
    {
      this.ContractNewServices.filter((a: { idRow: any; })=>a.idRow==this.selectedServiceRowContractNew)[0].amount = null;
    }  
    this.ContractNewServices.filter((a: { idRow: any; })=>a.idRow==this.selectedServiceRowContractNew)[0].accamount = element.amount;

    this.CalculateTotal_ContractNew();
  }

  setServiceRowValueNew_ContractNew(indexRow:any,item: any) {
    debugger
    this.addServiceContractNew();
    this.ContractNewServices.filter((a: { idRow: any; })=>a.idRow==indexRow)[0].categoryTypeId = item.categoryTypeId;
    this.ContractNewServices.filter((a: { idRow: any; })=>a.idRow==indexRow)[0].categoryTypeName = item.categoryTypeName;
    this.ContractNewServices.filter((a: { idRow: any; })=>a.idRow==indexRow)[0].nameAr = item.nameAr;
    this.ContractNewServices.filter((a: { idRow: any; })=>a.idRow==indexRow)[0].categoryId = item.categoryId;
    this.ContractNewServices.filter((a: { idRow: any; })=>a.idRow==indexRow)[0].unitId = item.unitId;
    this.ContractNewServices.filter((a: { idRow: any; })=>a.idRow==indexRow)[0].unitName = item.unitName;
    this.ContractNewServices.filter((a: { idRow: any; })=>a.idRow==indexRow)[0].qty = item.qty;
    this.ContractNewServices.filter((a: { idRow: any; })=>a.idRow==indexRow)[0].amount = item.amount;
    this.ContractNewServices.filter((a: { idRow: any; })=>a.idRow==indexRow)[0].accamount = item.amount;  
    //this.CalculateTotal_ContractNew();
  }

  CalculateTotal_ContractNew() {
    var amount_T = 0;var totalValue_T = 0;var qty_T = 0;
    debugger
    this.ContractNewServices.forEach((element: any) => {
      var Value = parseFloat((element.amount??0).toString()).toFixed(2);
      var FVal = +Value * element.qty;
      var totalValue = 0;
      this.ContractNewServices.filter((a: { idRow: any; })=>a.idRow==element.idRow)[0].totalValue= parseFloat((FVal).toString()).toFixed(2);
      amount_T += element.amount;
      totalValue_T +=(totalValue) ;
      qty_T += (element.qty);
    });
    this.CalcSumTotal_ContractNew();
    this.CalcDisc(1)
  }
  CalcSumTotal_ContractNew(){
    let sumamount=0;
    let sumtotal=0;
    let sumqty=0;
    debugger
    this.ContractNewServices.forEach((element: any) => {
      sumamount= +sumamount + +parseFloat((element.amount??0)).toFixed(2);
      sumtotal= +sumtotal + +parseFloat((element.totalValue??0)).toFixed(2);
      sumqty= +sumqty + +parseFloat((element.qty??0)).toFixed(2);
    });
    this.modalDetailsContractNew.sumamount=parseFloat(sumamount.toString()).toFixed(2);
    this.modalDetailsContractNew.sumtotal=parseFloat(sumtotal.toString()).toFixed(2);
    this.modalDetailsContractNew.sumqty=parseFloat(sumqty.toString()).toFixed(2);
  }

  CalcDisc(type:any){
    var ValueAmount = parseFloat((this.modalDetailsContractNew.sumtotal ?? 0).toString()).toFixed(2);
    var DiscountValue_Det;
    if (type == 1)
       {
        DiscountValue_Det = parseFloat((this.modalDetailsContractNew.discountValue ?? 0).toString()).toFixed(2);
    } else {
      var Discountper_Det = parseFloat((this.modalDetailsContractNew.discountPercentage ?? 0).toString()).toFixed(2);
      DiscountValue_Det = parseFloat(((+Discountper_Det * +ValueAmount) / 100).toString()).toFixed(2);
      this.modalDetailsContractNew.discountValue= parseFloat(DiscountValue_Det.toString()).toFixed(2);
    }
    var Value = parseFloat( (+ValueAmount - +DiscountValue_Det).toString()).toFixed(2);
    if (!(+Value >= 0)) {
      this.modalDetailsContractNew.discountValue=0;
      this.modalDetailsContractNew.discountPercentage=0;
      DiscountValue_Det = 0;
      Value = parseFloat((+ValueAmount - +DiscountValue_Det).toString()).toFixed(2);
    }
    if (type == 1) {
      var DiscountPercentage_Det;
      if (+ValueAmount > 0) 
        { DiscountPercentage_Det = (+DiscountValue_Det * 100) / +ValueAmount;
      } else {
        DiscountPercentage_Det = 0;
      }
      DiscountPercentage_Det = parseFloat( DiscountPercentage_Det.toString()).toFixed(2);
      this.modalDetailsContractNew.discountPercentage=DiscountPercentage_Det;
    }

    this.modalDetailsContractNew.sumtotalAfterDisc = parseFloat((Value).toString()).toFixed(2);
  }

  ContractRowSelected: any;
  
  getContractRow(row: any) {
    this. ContractRowSelected = row;
  }
  confirmReturnContract(): void {
    this.service.ReturnContract(this.modalDetails.contractId).subscribe((result) => {
        if (result.statusCode == 200) {
          this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
          this.getAllContracts();
          this.modal?.hide();
        } else {
          this.toast.error(result.reasonPhrase, this.translate.instant('Message'));
        }
      });
  }

  disableButtonSave_Contract=false;

  saveContractbtn(modal:any,stepper: MatStepper){
    debugger
    var contractId=(this.FormGroup01.controls['contractId'].value??0);
    var sumtotalAfterDisc=(this.modalDetailsContractNew.sumtotalAfterDisc??0);
    if(sumtotalAfterDisc<=0)
    {
      this.toast.error(this.translate.instant("لا مكنك حفظ عقد بقيمة لا تتخطي الصفر"),this.translate.instant("Message"));
      return;
    }
    var ContractObj:any = {};
    ContractObj.ContractId = contractId;
    ContractObj.ContractCode = this.FormGroup01.controls['contractCode'].value;
    if (this.FormGroup01.controls['date'].value != null) {
      ContractObj.date = this._sharedService.date_TO_String(this.FormGroup01.controls['date'].value);
    }
    if (this.FormGroup01.controls['conDateTime'].value != null) {
      ContractObj.conDateTime = this._sharedService.formatAMPM(this.FormGroup01.controls['conDateTime'].value);
    }
    if (this.FormGroup01.controls['deliveryDate'].value != null) {
      ContractObj.deliveryDate = this._sharedService.date_TO_String(this.FormGroup01.controls['deliveryDate'].value);
    }
    if (this.FormGroup01.controls['delDateTime'].value != null) {
      ContractObj.delDateTime = this._sharedService.formatAMPM(this.FormGroup01.controls['delDateTime'].value);
    }
    if (this.FormGroup01.controls['deliveryDateFinal'].value != null) {
      ContractObj.deliveryDateFinal = this._sharedService.date_TO_String(this.FormGroup01.controls['deliveryDateFinal'].value);
    }
    if (this.FormGroup01.controls['delDateTimeFinal'].value != null) {
      ContractObj.delDateTimeFinal = this._sharedService.formatAMPM(this.FormGroup01.controls['delDateTimeFinal'].value);
    }
    if (this.FormGroup01.controls['storageDate'].value != null) {
      if(this.modalDetails.storageDateStatus)
      {
        ContractObj.storageDate = this._sharedService.date_TO_String(this.FormGroup01.controls['storageDate'].value);
      }
      else
      {
        ContractObj.storageDate=null;
      }
    }
    if (this.FormGroup01.controls['stoDateTime'].value != null) {
      if(this.modalDetails.storageDateStatus)
      {
        ContractObj.stoDateTime = this._sharedService.formatAMPM(this.FormGroup01.controls['stoDateTime'].value);
      }
      else
      {
        ContractObj.stoDateTime=null;
      }
    }

    ContractObj.BranchId = this.FormGroup01.controls['branchId'].value;
    ContractObj.PreviewId = this.FormGroup01.controls['previewId'].value;
    ContractObj.PreviewTypeId = this.FormGroup01.controls['previewTypeId'].value;
    ContractObj.CustomerId = this.FormGroup01.controls['customerId'].value;
    ContractObj.DocumentNo = this.FormGroup01.controls['documentNo'].value;
    ContractObj.DocumentStatus = this.FormGroup01.controls['documentStatus'].value;
    ContractObj.Notes = this.FormGroup01.controls['notes'].value;


    ContractObj.DiscountValue = (this.modalDetailsContractNew.discountValue??0);
    ContractObj.DiscountPercentage = (this.modalDetailsContractNew.discountPercentage??0);
    ContractObj.TotalValue = sumtotalAfterDisc;

    var input = { valid: true, message: "" }
    var ServicesDetailsList:any = [];
    this.ContractNewServices.forEach((element: any) => {

      if(element.categoryTypeId == null || element.categoryTypeName == null || element.categoryTypeName == "") {
        input.valid = false; input.message = "من فضلك أختر تصنيف صحيح";return;
      }
      if (element.nameAr == null || element.nameAr == "") {
        input.valid = false; input.message = "من فضلك أختر صنف صحيح";return;
      }
      if(element.unitId == null || element.unitName == null || element.unitName == "") {
        input.valid = false; input.message = "من فضلك أختر وحدة صحيحة";return;
      }
      if (element.qty == null || element.qty == 0 || element.qty == "") {
        input.valid = false; input.message = "من فضلك أختر كمية صحيحة";return;
      }
      if (element.amount == null || element.amount == 0 || element.amount == "") {
        input.valid = false; input.message = "من فضلك أختر مبلغ صحيح";return;
      }
      if (element.amount <element.accamount) {
        input.valid = false; input.message = "من فضلك أختر سعر يساوي سعر الصنف المحفوظ مسبقا او أكبر منه";return;
      }
      var Contractserviceobj:any  = {};
      debugger
      Contractserviceobj.CategoryTypeId = element.categoryTypeId;
      Contractserviceobj.NameAr = element.nameAr;
      Contractserviceobj.CategoryId = element.categoryId;
      Contractserviceobj.UnitId = element.unitId;
      Contractserviceobj.Amount = element.amount;
      Contractserviceobj.Status = element.status;
      Contractserviceobj.Qty = element.qty;
      Contractserviceobj.TotalValue = element.totalValue;
      ServicesDetailsList.push(Contractserviceobj);

    });
    if (!input.valid) {
      this.toast.error(input.message);return;
    }
    ContractObj.ContractCategories = ServicesDetailsList;
    console.log("ContractObj",ContractObj);

    this.disableButtonSave_Contract = true;
    setTimeout(() => { this.disableButtonSave_Contract = false }, 15000);

    this.service.SaveContract(ContractObj).subscribe((result: any)=>{
      debugger
      if(result.statusCode==200){
        this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
        this.getAllContracts();
        this.goForward(stepper);
        //modal?.hide();
        this.disableButtonSave_Contract = false ;
      }
      else{
        this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
        this.disableButtonSave_Contract = false;
      }
    });
  }

  goForward(stepper: MatStepper){
    stepper.next();
}
  // ConvertNumToString_Contract(val:any){
  //   this._contractService.ConvertNumToString(val).subscribe(data=>{
  //     this.modalDetailsContractNew.total_amount_text=data?.reasonPhrase;
  //   });
  // }
  applyFilterServiceList_ContractNew(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.serviceListDataSource_ContractNew.filter = filterValue.trim().toLowerCase();
  }

  serviceListDataSourceTemp_ContractNew:any=[];
  servicesList_ContractNew: any;
  serviceListDataSource_ContractNew = new MatTableDataSource();

  GetAllServicesPrice_ContractNew(){
    this.category.GetAllCategories_BranchActive().subscribe(data=>{
        this.serviceListDataSource_ContractNew = new MatTableDataSource(data);
        this.servicesList_ContractNew=data;
        this.serviceListDataSourceTemp_ContractNew=data;
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
          (d.contractCode &&
            d.contractCode?.trim().toLowerCase().indexOf(val) !== -1) ||
          (d.previewTypeName &&
            d.previewTypeName?.trim().toLowerCase().indexOf(val) !== -1) ||
            (d.customerName &&
            d.customerName?.trim().toLowerCase().indexOf(val) !== -1) ||
            (d.address &&
            d.address?.trim().toLowerCase().indexOf(val) !== -1) ||
          (d.designCode &&
            d.designCode?.trim().toLowerCase().indexOf(val) !== -1) ||
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
  //     this.getAllContracts();
  //   } else {
  //     this.RefreshData();
  //   }
  // }

  resetandRefresh() {
    if (this.searchBox.open == false) {
      this.data2.filter.search_ContractName = null;
      this.data2.filter.search_contractMobile = null;
      this.data.type = 0;
      this.getAllContracts();
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
      console.log("customer : ",this.load_Customers);
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

  GenerateContractNumber(){
    debugger
    this.service.GenerateContractNumber().subscribe(data=>{
      this.modalDetails.contractCode=data.reasonPhrase;
    });
  }
  GenerateContractNumberByBarcodeNum(){
    debugger
    if(!(this.modalDetails.orderBarcode==null || this.modalDetails.orderBarcode==""))
    {
      this.service.GenerateContractNumberByBarcodeNum(this.modalDetails.orderBarcode).subscribe(data=>{
        this.modalDetails.contractCode=data.reasonPhrase;
      });
    }  
  }

  //-----------------------OPEN MODAL--------------------------------------------------

  openModal(template: TemplateRef<any>, data?: any, modalType?: any) {
    this.resetModal();
    //this.GetAllPreviewsSelectBarcodeFinished();
    if (modalType == 'addContract') {     
      this.GetAllPreviewsCodeFinishedMeeting();
      //this.GenerateContractNumber(); 
    }

    if (data) {
      this.modalDetails = data;
      this.fillBranchByUserId();
      if (modalType == 'editContract' || modalType == 'ContractView') {
        this.GetAllPreviewsCodeAll();
        if(this.modalDetails.date!=null)
        {
          this.modalDetails.date = this._sharedService.String_TO_date(this.modalDetails.date);
          this.modalDetails.conDateTime = this.modalDetails.date;
        }
        if(this.modalDetails.deliveryDate!=null)
        {
          this.modalDetails.deliveryDate = this._sharedService.String_TO_date(this.modalDetails.deliveryDate);
          this.modalDetails.delDateTime = this.modalDetails.deliveryDate;
        }
        if(this.modalDetails.deliveryDateFinal!=null)
        {
          this.modalDetails.deliveryDateFinal = this._sharedService.String_TO_date(this.modalDetails.deliveryDateFinal);
          this.modalDetails.delDateTimeFinal = this.modalDetails.deliveryDateFinal;
        }
        if(this.modalDetails.storageDate!=null)
        {
          this.modalDetails.storageDate = this._sharedService.String_TO_date(this.modalDetails.storageDate);
          this.modalDetails.stoDateTime = this.modalDetails.storageDate;
          this.modalDetails.storageDateStatus=true;
        }
        else
        {
          this.modalDetails.storageDateStatus=false;
        }
        // if(this.modalDetails.contractDate!=null)
        // {
        //   this.modalDetails.contractDate = this._sharedService.String_TO_date(this.modalDetails.contractDate);
        // }    
        if (data.agentAttachmentUrl != null) {
          this.modalDetails.attachmentUrl =
            environment.PhotoURL + data.agentAttachmentUrl;
          //this.modalDetails.attachmentUrl = this.domSanitizer.bypassSecurityTrustUrl(environment.PhotoURL+data.agentAttachmentUrl)
        }
        this.SetFormData(this.modalDetails);
      }
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
    if(model=='addVoucherRe')
    {
      this.fillBranchByUserIdReVoucher(model);
      this.setReVoucherData(data);
    }
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


    if (data) {
      this.modalDetails = data;
    }
    debugger
    if (type == 'deletepayment') {     
      this.PaymentRow=data;
    }
    if (type === 'AddPayment') {
      this.resetPaymentsModel();
    }
    if (type == 'accountingentry') {
      this.GetAllVoucherTransactions_Contract(data.contractId);
    } 
    if (type === 'editPayment') {
      this.resetPaymentsModel();
      if(data.paymentDate!=null)
      {
        this.modalPayments.paymentDate = this._sharedService.String_TO_date(data.paymentDate);
      }
      this.modalPayments.paymentId=data.paymentId;
      this.modalPayments.amount=data.amount;
      this.modalPayments.notes=data.notes;
    }
    if (type === 'deleteModalPerm') {
      this.publicidRow = data.idRow;
    }
    if(type === 'ShowContractFiles')
    {
      if (data) {
        this.modalDetailsPublic = data;
      }
      this.GetAllContractFiles(this.modalDetails.contractId,this.modalDetails.designId,this.modalDetails.meetingId,this.modalDetails.previewId);
    }
    if (idRow != null) {
      this.selectedServiceRowContractNew = idRow;
    }



    if(type=="servicesList_Contract"){
      var input = { valid: true, message: "" }
      this.ContractNewServices.forEach((element: any) => {
        if (element.amount <element.accamount) {
          console.log("element",element);
          input.valid = false; input.message = "من فضلك أختر سعر يساوي سعر الصنف المحفوظ مسبقا او أكبر منه" 
          +" "+ "الصنف "+"("+element.nameAr+")" +" رقم "+element.idRow +" "+"تصنيف "+element.categoryTypeName;
          return;
        }
      });
      if (!input.valid) {
        this.toast.error(input.message);return;
      }
    }





    this.ngbModalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        size: type ? 'xl' : 'lg',
        centered:type == 'Notes' ? true :
         !type ? true : false,
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


  ContractIdPublic: any = 0;
  setContractid_P(id: any) {
    this.ContractIdPublic = id;
    console.log('this.ContractIdPublic');
    console.log(this.ContractIdPublic);
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
        contractCode: AccDataSource[index].contractCode,
        customerCode: AccDataSource[index].customerCode,
        customerName: AccDataSource[index].customerName,
        mainPhoneNo: AccDataSource[index].mainPhoneNo,
        subMainPhoneNo: AccDataSource[index].subMainPhoneNo,
        cityName: AccDataSource[index].cityName,
        address: AccDataSource[index].address,
        nationalId: AccDataSource[index].nationalId,
        paytypeName: AccDataSource[index].paytypeName,
        socialMediaName: AccDataSource[index].socialMediaName,
        date:AccDataSource[index].date!=null? formatter.format(new Date(AccDataSource[index].date)):null,
        deliveryDate: AccDataSource[index].deliveryDate!=null?formatter.format(new Date(AccDataSource[index].deliveryDate)):null,
        deliveryDateFinal:AccDataSource[index].deliveryDateFinal!=null? formatter.format(new Date(AccDataSource[index].deliveryDateFinal)):null,
        storageDate:AccDataSource[index].storageDate!=null? formatter.format(new Date(AccDataSource[index].storageDate)):null,
        addDate:AccDataSource[index].addDate!=null? formatter.format(new Date(AccDataSource[index].addDate)):null,
        contractStatustxt: AccDataSource[index].contractStatustxt,
      });
    }
    this.service.customExportExcel(x, 'Contracts');
  }

  getAllContracts() {
    this.service.GetAllContracts_Branch().subscribe((data: any) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSourceTemp = data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.allContractCount = data.length;
      this.FillSerachLists(data);
    });
  }

  getcontractdata(previewId:any){
    let data = this.load_BarcodesCodes.filter((d: { id: any }) => d.id == previewId); 
    this.modalDetails.orderBarcode=data[0].name;
    this.modalDetails.customerId=data[0].customerId;
    this.modalDetails.previewTypeId=data[0].previewTypeId;
    this.modalDetails.meetingId=data[0].meetingId;

    this.GenerateContractNumberByBarcodeNum();
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
      this.getcontractdata(data[0].id);  
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
      this.getcontractdata(data[0].id);  
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
      type: 'addContract',
      nameAr: null,
      nameEn: null,
      id: null,
      name: null,
      contractId: 0,
      branchId: null,
      orderBarcode:null,
      previewId: null,
      previewTypeId:null,
      meetingId:null,
      contractCode: null,
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
      addedcontractImg: null,
      contractDate: null,
      contractChairperson: null,
      desDateTime:null,
    };
  }

  confirm(): void {
    this.service.DeleteContract(this.modalDetails.contractId).subscribe((result) => {
        if (result.statusCode == 200) {
          this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
          this.getAllContracts();
          this.modal?.hide();
        } else {
          this.toast.error(result.reasonPhrase, this.translate.instant('Message'));
        }
      });
  }

  confirmConvert(): void {
    this.service.ConvertContract(this.modalDetails.contractId).subscribe((result) => {
        if (result.statusCode == 200) {
          this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
          this.getAllContracts();
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

  CategoryPriceStatus:any=true;
  CategoryPriceStatusChange(){
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
    debugger
      var _Files: any = {};
      _Files.fileId=0;
      _Files.contractId=this.modalDetails.contractId;
      _Files.fileName=this.dataFile.FileName;
      _Files.transactionTypeId=40;
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
            this.getAllContracts();
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

  ContractFileRowSelected: any;
  
  getContractFileRow(row: any) {
    this. ContractFileRowSelected = row;
  }
  confirmDeleteContractFile(): void {
    this.files.DeleteFiles(this. ContractFileRowSelected.fileId).subscribe((result) => {
        if (result.statusCode == 200) {
          this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
          debugger
          this.GetAllContractFiles(this.modalDetailsPublic.contractId,this.modalDetailsPublic.designId,this.modalDetailsPublic.meetingId,this.modalDetailsPublic.previewId);
          this.modal?.hide();
        } else {
          this.toast.error(result.reasonPhrase, this.translate.instant('Message'));
        }
      });
  }

  
  ContractFilesList: any=[];
  
  GetAllContractFiles(ContractId:any,DesignId:any,MeetingId:any,PreviewId:any) {
    this.ContractFilesList=[];
    this.files.GetAllContractFiles(ContractId).subscribe((data: any) => {
      this.ContractFilesList = data;
    });
    this.GetAllDesignFiles(DesignId);
    this.GetAllMeetingFiles(MeetingId);
    this.GetAllPreviewFiles(PreviewId);
  }
  DesignFilesList: any=[];

  GetAllDesignFiles(DesignId:any) {
    this.DesignFilesList=[];
    this.files.GetAllDesignFiles(DesignId).subscribe((data: any) => {
      this.DesignFilesList = data;
    });
  }
  MeetingFilesList: any=[];

  GetAllMeetingFiles(MeetingId:any) {
    this.MeetingFilesList=[];
    this.files.GetAllMeetingFiles(MeetingId).subscribe((data: any) => {
      this.MeetingFilesList = data;
    });
  }
  PreviewFilesList: any=[];

  GetAllPreviewFiles(PreviewId:any) {
    this.PreviewFilesList=[];
    this.files.GetAllPreviewFiles(PreviewId).subscribe((data: any) => {
      this.PreviewFilesList = data;
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
      ListContractStatus:[],
      ListContractValue:[],
      customerId:null,
      contractChairperson:null,
      documentStatus:null,
      showFilters:false
    },
  };

    FillSerachLists(dataT:any){
      this.FillCustomerListName(dataT);
      this.FillCustomerListCode(dataT);
      this.FillCustomerListPhone(dataT);
      this.FillCustomerListEmployee(dataT);
      this.FillListContractStatus();
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
      const ListLoad = dataT.map((item: { contractChairperson: any; chairpersonName: any; }) => {
        const container:any = {}; container.id = item.contractChairperson; container.name = item.chairpersonName; console.log("container",container); return container;   
      })
      const key = 'id';
      const arrayUniqueByKey = [...new Map(ListLoad.map((item: { [x: string]: any; }) => [item[key], item])).values()];
      this.dataSearch.filter.ListEmployee=arrayUniqueByKey;
      this.dataSearch.filter.ListEmployee = this.dataSearch.filter.ListEmployee.filter((d: { id: any }) => (d.id !=null && d.id!=0));
    }

    FillListContractStatus(){
      this.dataSearch.filter.ListContractStatus= [
        { id: 1, name: 'مبدئي' },
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
      // if(this.dataSearch.filter.contractChairperson!=null && this.dataSearch.filter.contractChairperson!="")
      // {
      //   this.dataSource.data = this.dataSource.data.filter((d: { contractChairperson: any }) => d.contractChairperson == this.dataSearch.filter.contractChairperson);
      // } 
      if(this.dataSearch.filter.documentStatus!=null && this.dataSearch.filter.documentStatus!="")
      {
        this.dataSource.data = this.dataSource.data.filter((d: { documentStatus: any }) => d.documentStatus == this.dataSearch.filter.documentStatus);
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


//-------------------------------------------Print------------------------------------------
//#region 
ContractPrintData:any=null;
resetCustomData2Contract(){
  this.ContractPrintData=null;
}
serviceDetailsPrint: any;
paymentDetailsPrint: any;

serviceDetailsPrintObj:any=[];
serviceDetailsList:any=[];

GetDofAsaatContractsPrint(obj:any){
  this.serviceDetailsPrintObj=[];
  this.serviceDetailsList=[];
  this.paymentDetailsPrint=[];
  this.ContractPrintData=obj;
  console.log("this.ContractPrintData",this.ContractPrintData);
  this.modalDetailsContractNew_Print.discountValue=this.ContractPrintData.discountValue;
    this.modalDetailsContractNew_Print.discountPercentage=this.ContractPrintData.discountPercentage;
  this.service.GetCategoriesByContractId(obj.contractId).subscribe(data=>{
    this.serviceDetailsList=data;
    console.log("this.serviceDetailsList",this.serviceDetailsList);
    this.CalcSumTotal_ContractNew_Print(this.serviceDetailsList);
    this.CalcDisc_Print(1)
  });
  this.service.GetAllPaymentsByContractId(obj.contractId).subscribe(data=>{
    this.paymentDetailsPrint=data;
    console.log("this.paymentDetailsPrint",this.paymentDetailsPrint);
  });
  debugger
  this.GetBranchData(obj.branchId);
  console.log("this.OrganizationData",this.OrganizationData);
  

}
printDiv(id: any) {
  this.print.print(id, environment.printConfig);
}

dateToday: any = new Date();

  modalDetailsContractNew_Print:any={
    sumamount:null,
    sumtotal:null,
    sumqty:null,
    discountValue:null,
    discountPercentage:null,
    sumtotalAfterDisc:null,
  }

  CalcSumTotal_ContractNew_Print(serviceDetailsList:any){
    let sumamount=0;
    let sumtotal=0;
    let sumqty=0;
    debugger
    serviceDetailsList.forEach((element: any) => {
      sumamount= +sumamount + +parseFloat((element.amount??0)).toFixed(2);
      sumtotal= +sumtotal + +parseFloat((element.totalValue??0)).toFixed(2);
      sumqty= +sumqty + +parseFloat((element.qty??0)).toFixed(2);
    });
    this.modalDetailsContractNew_Print.sumamount=parseFloat(sumamount.toString()).toFixed(2);
    this.modalDetailsContractNew_Print.sumtotal=parseFloat(sumtotal.toString()).toFixed(2);
    this.modalDetailsContractNew_Print.sumqty=parseFloat(sumqty.toString()).toFixed(2);
  }

  CalcDisc_Print(type:any){
    var ValueAmount = parseFloat((this.modalDetailsContractNew_Print.sumtotal ?? 0).toString()).toFixed(2);
    var DiscountValue_Det;
    if (type == 1)
       {
        DiscountValue_Det = parseFloat((this.modalDetailsContractNew_Print.discountValue ?? 0).toString()).toFixed(2);
    } else {
      var Discountper_Det = parseFloat((this.modalDetailsContractNew_Print.discountPercentage ?? 0).toString()).toFixed(2);
      DiscountValue_Det = parseFloat(((+Discountper_Det * +ValueAmount) / 100).toString()).toFixed(2);
      this.modalDetailsContractNew_Print.discountValue= parseFloat(DiscountValue_Det.toString()).toFixed(2);
    }
    var Value = parseFloat( (+ValueAmount - +DiscountValue_Det).toString()).toFixed(2);
    if (!(+Value >= 0)) {
      this.modalDetailsContractNew_Print.discountValue=0;
      this.modalDetailsContractNew_Print.discountPercentage=0;
      DiscountValue_Det = 0;
      Value = parseFloat((+ValueAmount - +DiscountValue_Det).toString()).toFixed(2);
    }
    if (type == 1) {
      var DiscountPercentage_Det;
      if (+ValueAmount > 0) 
        { DiscountPercentage_Det = (+DiscountValue_Det * 100) / +ValueAmount;
      } else {
        DiscountPercentage_Det = 0;
      }
      DiscountPercentage_Det = parseFloat( DiscountPercentage_Det.toString()).toFixed(2);
      this.modalDetailsContractNew_Print.discountPercentage=DiscountPercentage_Det;
    }

    this.modalDetailsContractNew_Print.sumtotalAfterDisc = parseFloat((Value).toString()).toFixed(2);
  }
//#endregion

//-------------------------------------------EndPrint----------------------------------------


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
GetAllVoucherTransactions_Contract(voucherId: any) {
  this._voucherService.GetAllVoucherTransactions_Contract(voucherId).subscribe((data) => {
      this.AllJournalEntries = data;
    });
}


  //---------------------------------AddReVoucher-----------------------------------
  //#region 
  modalDetailsReVoucher: any = {};
  VoucherStatusList: any;
  OpenType:any=1;
  VoucherModels:any={
    type:6,
  }
  fillBranchByUserIdReVoucher(modalType:any) {
    this.service.FillBranchByUserIdSelect().subscribe((data) => {
      this.load_BranchUserId = data;
      var BranchId=this.FormGroup01.controls['branchId'].value;
      this.modalDetailsReVoucher.branchId = parseInt(BranchId);
      this.BranchChange(this.modalDetailsReVoucher.branchId,modalType);
    });
  }

  BranchChange(BranchId: any,modalType:any) {
    debugger
    if(modalType == 'addVoucherRe')
    {
      this.VoucherNumber_Reservation(BranchId);
    }
  }

  VoucherNumber_Reservation(BranchId:any){
    this._voucherService.VoucherNumber_Reservation(this.VoucherModels.type,BranchId).subscribe(data=>{
      this.modalDetailsReVoucher.voucherNo=data.reasonPhrase;
    });
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
      CreditDepitStatus: 'D',
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
    this._voucherService.FillAllAccountsSelect().subscribe((data) => {
      this.AccountListDataSource = new MatTableDataSource(data);
      this.AccountListDataSource.paginator = this.paginatorAccount;
      this.AccountList = data;
      this.AccountListDataSourceTemp = data;
    });
  }

  FillSubAccountLoadTable(parentId:any) {
    this._voucherService.FillAllAccountsSelectByParentId(parentId).subscribe((data) => {
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
    var totalDebit = 0,totalCredit = 0, totalBalance = 0;
    this.journalDebitNmRows = 0;this.journalCreditNmRows = 0;
    this.VoucherDetailsRows.forEach((element: any, index: any) => {
      var Value = 0;
      Value = element.amount;
      if (element.CreditDepitStatus == 'D') {
        this.journalDebitNmRows += 1;
        totalDebit += +Value;
        totalBalance = +parseFloat((+totalDebit - +totalCredit).toString()).toFixed(2);
      } else {
        this.journalCreditNmRows += 1;
        totalCredit += +Value;
        totalBalance = +parseFloat((+totalDebit - +totalCredit).toString()).toFixed(2);
      }
    });
    this.modalDetailsReVoucher.totalCredit = +parseFloat(totalCredit.toString()).toFixed(2);
    this.modalDetailsReVoucher.totalDepit = +parseFloat(totalDebit.toString()).toFixed(2);
    this.modalDetailsReVoucher.diff = +parseFloat((+totalDebit - +totalCredit).toString()).toFixed(2);
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
    voucObj.voucherId = this.modalDetailsReVoucher.voucherId;
    voucObj.voucherNo = this.modalDetailsReVoucher.voucherNo;
    voucObj.documentNo = this.modalDetailsReVoucher.documentNo;
    voucObj.type = this.modalDetailsReVoucher.type;
    voucObj.totalValue = this.modalDetailsReVoucher.totalCredit;
    voucObj.branchId = this.modalDetailsReVoucher.branchId;
    if (this.modalDetailsReVoucher.date != null) {
      voucObj.date = this._sharedService.date_TO_String(this.modalDetailsReVoucher.date);
    }
    voucObj.paymentId = this.modalDetailsReVoucher.paymentId;
    voucObj.status = this.modalDetailsReVoucher.status;
    voucObj.notes = this.modalDetailsReVoucher.notes;
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
      if(this.modalDetailsReVoucher.voucherId>0)
      {
        Transobj.voucherId = this.modalDetailsReVoucher.voucherId;
      }
      Transobj.Type = this.modalDetailsReVoucher.type;
      Transobj.Status = this.modalDetailsReVoucher.status;
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
    this._voucherService.SaveVoucher(voucObj).subscribe((result: any) => {
      if (result.statusCode == 200) {
        this.toast.success(
          this.translate.instant(result.reasonPhrase),
          this.translate.instant('Message')
        );
        //this.decline();
        this.GetAllPaymentsByContractId();
        this.ngbModalService.dismissAll();
      } else {
        this.toast.error(result.reasonPhrase, 'رسالة');
      }
    });
  }
  ValidateObjMsg: any = { status: true, msg: null };
  validateForm() {
    this.ValidateObjMsg = { status: true, msg: null };

   if (this.modalDetailsReVoucher.branchId == null) {
      this.ValidateObjMsg = { status: false, msg: 'اختر فرع السند' };
      return this.ValidateObjMsg;
    }  
    else if ((this.modalDetailsReVoucher.status == null ||this.modalDetailsReVoucher.status == '')
    ) {
      this.ValidateObjMsg = { status: false, msg: 'اختر حالة الإذن' };
      return this.ValidateObjMsg;
    }
    else if ((this.modalDetailsReVoucher.date == null ||this.modalDetailsReVoucher.date == '')
    ) {
      this.ValidateObjMsg = { status: false, msg: 'أختر التاريخ' };
      return this.ValidateObjMsg;
    }
    this.ValidateObjMsg = { status: true, msg: null };
    return this.ValidateObjMsg;
  }

  setReVoucherData(data:any)
  {
    console.log("data",data);
    var contractId=(this.FormGroup01.controls['contractId'].value??0);
    this.VoucherDetailsRows = [];

    this.modalDetailsReVoucher = {
      type:6,
      vouchertype: 'addVoucherRe',
      documentNo: null,
      id: null,
      name: null,
      voucherId: 0,
      mainAccountId: null,
      subAccountId: null,
      date: new Date(),
      journalNo: null,
      totalValue: null,
      isPost: null,
      postDate: null,
      yearId: null,
      status: 3,
      notes: null,
      addDate: null,
      addUser: null,
      addedvoucherImg: null,
      totalCredit:0.00,
      totalDepit:0.00,
      diff:0.00,
      paymentId:data.paymentId,
    };
    this.GetReVoucherAccounts(data);
    console.log("modalDetailsReVoucher",this.modalDetailsReVoucher);
  }

  addVoucherRow_Re(data:any,AccountData:any) {
    console.log("data",data);
    console.log("AccountData",AccountData);
    this.VoucherDetailsRows?.push({
      idRow: 1,
      amount: data.amount,
      mainAccountId: AccountData.salesAccIdParentId,
      mainAccountIdtxt:  AccountData.salesAccIdParentName,
      subAccountId: AccountData.salesAccId,
      subAccountIdtxt: AccountData.salesAccIdName,
      CreditDepitStatus: 'D',
      collectorName: null,
      notes: null,
      lineMain:false,
    });
    this.VoucherDetailsRows?.push({
      idRow: 2,
      amount: data.amount,
      mainAccountId: AccountData.salesAccId2ParentId,
      mainAccountIdtxt:  AccountData.salesAccId2ParentName,
      subAccountId: AccountData.salesAccId2,
      subAccountIdtxt: AccountData.salesAccId2Name,
      CreditDepitStatus: 'C',
      collectorName: null,
      notes: null,
      lineMain:false,
    });

    this.CalculateVoucher();
  }

  GetReVoucherAccounts(ItemData:any) {
    var branchId=(this.FormGroup01.controls['branchId'].value??0);
    this.service.GetReVoucherAccounts(branchId).subscribe((data) => {
      debugger
      var Result = data.result;
      this.addVoucherRow_Re(ItemData,Result);
    });
  }
  backgroungColor(row: any) {
    if (Object.keys(row).length === 0) return '';
    if ((row.isPaid ==true)) {
      return 'PaymentColor';
    } else if (row.lineMain ==false) {
      return '';
    }
    return '';
  }

  //#endregion
  //------------------------------End ReVocuher-------------------------------------



}
