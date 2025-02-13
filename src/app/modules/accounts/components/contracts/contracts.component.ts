
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
import { CategoryService } from 'src/app/core/services/acc_Services/category.service';


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
    'contractCode',
    'customerCode',
    'customerName',
    'mainPhoneNo',
    'address',
    'chairpersonName',
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
  ContractStatusList: any;

  ngOnInit(): void {
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
      contractCode: [null, [Validators.required]],
      documentNo: [null],
      documentStatus: [null],
      date: [null],
      conDateTime: [null],
      deliveryDate: [null],
      delDateTime: [null],
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
  }

  SetFormData(data:any){
    this.FormGroup01.controls['branchId'].setValue(data.branchId);
    this.FormGroup01.controls['previewId'].setValue(data.previewId);
    this.FormGroup01.controls['previewTypeId'].setValue(data.previewTypeId);
    this.FormGroup01.controls['customerId'].setValue(data.customerId);
    this.FormGroup01.controls['contractCode'].setValue(data.contractCode);
    this.FormGroup01.controls['date'].setValue(data.date);
    this.FormGroup01.controls['conDateTime'].setValue(data.conDateTime);
  }


  DisabledBtn(){
    // this.FormGroup01.controls['branchId'].disable();
    // this.FormGroup01.controls['previewId'].disable();
    // this.FormGroup01.controls['previewTypeId'].disable();
    // this.FormGroup01.controls['customerId'].disable();
    // this.FormGroup01.controls['contractCode'].disable();
  }

  resetContractDataList(){
    this.ContractNewServices=[];
  }

  FormGroup01: FormGroup;
  FormGroup02: FormGroup;
  ContractNewServices: any = [];
  servicesListdisplayedColumns: string[] = ['name', 'price'];

  modalDetailsContractNew:any={
    total_amount:null,
    ContractAmountBefore:null,
    ContractTax:null,
    total_amount_text:null,
  }
  resetmodalDetailsContractNew(){
    this.ContractNewServices=[];
    this.modalDetailsContractNew={
      taxtype:2,
      total_amount:null,
      ContractAmountBefore:null,
      ContractTax:null,
      total_amount_text:null,
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
      AccJournalid: null,
      UnitConst: null,
      QtyConst: null,
      accountJournaltxt: null,
      Amounttxt: null,
      taxAmounttxt: null,
      TotalAmounttxt: null,
    });
  }

  deleteServiceContractNew(idRow: any) {
    let index = this.ContractNewServices.findIndex((d: { idRow: any; }) => d.idRow == idRow);
    this.ContractNewServices.splice(index, 1);
    this.CalculateTotal_ContractNew();
  }

  selectedServiceRowContractNew: any;

  setServiceRowValue_ContractNew(element: any) {
    this.ContractNewServices.filter((a: { idRow: any; })=>a.idRow==this.selectedServiceRowContractNew)[0].AccJournalid = element.servicesId;
    this.ContractNewServices.filter((a: { idRow: any; })=>a.idRow==this.selectedServiceRowContractNew)[0].UnitConst = element.serviceTypeName;
    this.ContractNewServices.filter((a: { idRow: any; })=>a.idRow==this.selectedServiceRowContractNew)[0].QtyConst = 1;
    this.ContractNewServices.filter((a: { idRow: any; })=>a.idRow==this.selectedServiceRowContractNew)[0].accountJournaltxt = element.servicesName;
    this.ContractNewServices.filter((a: { idRow: any; })=>a.idRow==this.selectedServiceRowContractNew)[0].Amounttxt = element.amount;
    //this.SetAmountPackage(this.selectedServiceRowOffer, element);
    this.CalculateTotal_ContractNew();
  }

  setServiceRowValueNew_ContractNew(indexRow:any,item: any, Qty: any,servamount: any) {
    debugger
    this.addServiceContractNew();
    this.ContractNewServices.filter((a: { idRow: any; })=>a.idRow==indexRow)[0].AccJournalid = item.servicesId;
    this.ContractNewServices.filter((a: { idRow: any; })=>a.idRow==indexRow)[0].UnitConst = item.serviceTypeName;
    this.ContractNewServices.filter((a: { idRow: any; })=>a.idRow==indexRow)[0].QtyConst = Qty;
    this.ContractNewServices.filter((a: { idRow: any; })=>a.idRow==indexRow)[0].accountJournaltxt = item.name;
    this.ContractNewServices.filter((a: { idRow: any; })=>a.idRow==indexRow)[0].Amounttxt = servamount;
    this.CalculateTotal_ContractNew();
  }


  CalculateTotal_ContractNew() {
    var totalwithtaxes = 0;var totalAmount = 0;var totaltax = 0;var totalAmountIncludeT = 0;var vAT_TaxVal = parseFloat(this.userG.orgVAT??0);
    debugger
    this.ContractNewServices.forEach((element: any) => {
      var Value = parseFloat((element.Amounttxt??0).toString()).toFixed(2);
      var FVal = +Value * element.QtyConst;
      var FValIncludeT = FVal;
      var taxAmount = 0;
      var totalwithtax = 0;
      var TaxV8erS = parseFloat((+parseFloat((+Value * vAT_TaxVal).toString()).toFixed(2) / 100).toString()).toFixed(2);
      var TaxVS =parseFloat((+Value- +parseFloat((+Value/((vAT_TaxVal / 100) + 1)).toString()).toFixed(2)).toString()).toFixed(2);
      if (this.modalDetailsContractNew.taxtype == 2) {
          taxAmount = +TaxV8erS * element.QtyConst;
          totalwithtax = +parseFloat((+parseFloat(Value) + +parseFloat(TaxV8erS)).toString()).toFixed(2);
      }
      else {
          taxAmount=+TaxVS * element.QtyConst;
          FValIncludeT = +parseFloat((+parseFloat(Value).toFixed(2) - +TaxVS).toString()).toFixed(2);
          totalwithtax = +parseFloat(Value).toFixed(2);
      }
      this.ContractNewServices.filter((a: { idRow: any; })=>a.idRow==element.idRow)[0].taxAmounttxt= parseFloat(taxAmount.toString()).toFixed(2);
      this.ContractNewServices.filter((a: { idRow: any; })=>a.idRow==element.idRow)[0].TotalAmounttxt= parseFloat((totalwithtax * element.QtyConst).toString()).toFixed(2);

      totalwithtaxes += totalwithtax;
      totalAmount +=(FVal) ;
      totalAmountIncludeT += (totalwithtax);
      totaltax += taxAmount;
    });
    this.CalcSumTotal_ContractNew();
    //this.CalcOfferDet(1);
  }
  CalcSumTotal_ContractNew(){
    let sum=0;
    let sumbefore=0;
    let sumtax=0;
    debugger
    this.ContractNewServices.forEach((element: any) => {
      sum= +sum + +parseFloat((element.TotalAmounttxt??0)).toFixed(2);
      sumbefore= +sumbefore + (+parseFloat((element.Amounttxt??0)).toFixed(2) * +parseFloat((element.QtyConst??0)).toFixed(2));
      sumtax= +sumtax + +parseFloat((element.taxAmounttxt??0)).toFixed(2);   
    });
    this.modalDetailsContractNew.total_amount=parseFloat(sum.toString()).toFixed(2);
    this.modalDetailsContractNew.ContractAmountBefore=parseFloat(sumbefore.toString()).toFixed(2);
    this.modalDetailsContractNew.ContractTax=parseFloat(sumtax.toString()).toFixed(2);
    //this.ConvertNumToString_Contract(this.modalDetailsContractNew.total_amount);
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
    this.category.GetAllCategories_Branch().subscribe(data=>{
        this.serviceListDataSource_ContractNew = new MatTableDataSource(data.result);
        this.servicesList_ContractNew=data.result;
        this.serviceListDataSourceTemp_ContractNew=data.result;
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

    debugger
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
    if(type === 'ShowContractFiles')
    {
      this.GetAllDesignFiles(this.modalDetails.designId,this.modalDetails.meetingId,this.modalDetails.previewId);
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

  disableButtonSave_Contract = false;

  addContract() {
    debugger;
    var val = this.validateForm();
    if (val.status == false) {
      this.toast.error(val.msg, 'رسالة');
      return;
    }
    var prevObj: any = {};
    prevObj.contractId = this.modalDetails.contractId;

    // if(this.modalDetails.contractStatus==3){
    //   if(this.modalDetails.contractDate==null){
    //     this.toast.error(this.translate.instant("من فضلك أختر تاريخ العقد"),this.translate.instant('Message'));
    //     return;
    //   }
    //   if(this.modalDetails.contractChairperson==null){
    //     this.toast.error(this.translate.instant("من فضلك أختر القائم بالعقد"),this.translate.instant('Message'));
    //     return;
    //   }
    //   if (this.modalDetails.contractDate != null) {
    //     prevObj.contractDate = this._sharedService.date_TO_String(this.modalDetails.contractDate);
    //   }
    //   if (this.modalDetails.desDateTime != null) {
    //     prevObj.desDateTime = this._sharedService.formatAMPM(this.modalDetails.desDateTime);
    //   }
    //   prevObj.contractChairperson=this.modalDetails.contractChairperson;
    //   prevObj.contractCode=this.modalDetails.contractCode;
    // }
    
    prevObj.branchId = this.modalDetails.branchId;
    prevObj.previewId = this.modalDetails.previewId;
    prevObj.meetingId = this.modalDetails.meetingId;
    prevObj.contractCode = this.modalDetails.contractCode;
    prevObj.customerId = this.modalDetails.customerId;
    prevObj.contractChairperson = this.modalDetails.contractChairperson;
    // prevObj.contractTypeId = this.modalDetails.contractTypeId;
    prevObj.contractStatus = this.modalDetails.contractStatus;
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
      formData.append('ContractId', prevObj.contractId.toString());
    }
    this.disableButtonSave_Contract = true;
    setTimeout(() => {
      this.disableButtonSave_Contract = false;
    }, 5000);
    this.service.SaveContract(formData).subscribe((result: any) => {
      if (result.statusCode == 200) {
        this.toast.success(
          this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
        this.decline();
        this.getAllContracts();
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
      this.ValidateObjMsg = { status: false, msg: 'أختر فرع العقد' };
      return this.ValidateObjMsg;
    } else if (
      this.modalDetails.previewId == null ||
      this.modalDetails.previewId == ''
    ) {
      this.ValidateObjMsg = { status: false, msg: 'أدخل كود المعاينة' };
      return this.ValidateObjMsg;
    } else if (this.modalDetails.contractCode == null || this.modalDetails.contractCode == '') {
      this.ValidateObjMsg = { status: false, msg: 'اختر كود العقد' };
      return this.ValidateObjMsg;
    } else if (
      this.modalDetails.customerId == null ||
      this.modalDetails.customerId == ''
    ) {
      this.ValidateObjMsg = { status: false, msg: 'اختر عميل' };
      return this.ValidateObjMsg;
    }
    else if ((this.modalDetails.contractChairperson == null ||this.modalDetails.contractChairperson == '')
    ) {
      this.ValidateObjMsg = { status: false, msg: 'اختر القائم بالعقد' };
      return this.ValidateObjMsg;
    }
    else if ((this.modalDetails.contractStatus == null ||this.modalDetails.contractStatus == '')
    ) {
      this.ValidateObjMsg = { status: false, msg: 'اختر حالة العقد' };
      return this.ValidateObjMsg;
    }
    else if ((this.modalDetails.date == null ||this.modalDetails.date == '')) {
      this.ValidateObjMsg = {
        status: false,
        msg: 'ادخل تاريخ العقد',
      };
      return this.ValidateObjMsg;
    }
    else if ((this.modalDetails.desDateTime == null ||this.modalDetails.desDateTime == '')) {
      this.ValidateObjMsg = {
        status: false,
        msg: 'ادخل وقت العقد',
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
        contractCode: this.dataSourceTemp[index].contractCode,
        customerName: this.dataSourceTemp[index].customerName,
        chairpersonName: this.dataSourceTemp[index].chairpersonName,
        contractStatus: this.dataSourceTemp[index].contractStatustxt,
        contractConvert: this.dataSourceTemp[index].contractConverttxt,
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
        _Files.contractId=this.modalDetails.contractId;
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
      debugger
      this. ContractFileRowSelected = row;
    }
    confirmDeleteContractFile(): void {
      this.files.DeleteFiles(this. ContractFileRowSelected.fileId).subscribe((result) => {
          if (result.statusCode == 200) {
            this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
            this.GetAllDesignFiles(this.ContractFileRowSelected.designId,this.ContractFileRowSelected.meetingId,this.ContractFileRowSelected.previewId);
            this.modal?.hide();
          } else {
            this.toast.error(result.reasonPhrase, this.translate.instant('Message'));
          }
        });
    }
    
    ContractFilesList: any=[];
    
    GetAllDesignFiles(DesignId:any,MeetingId:any,PreviewId:any) {
      this.ContractFilesList=[];
      this.files.GetAllDesignFiles(DesignId).subscribe((data: any) => {
        this.ContractFilesList = data;
      });
      this.GetAllMeetingFiles(MeetingId);
      this.GetAllPreviewFiles(PreviewId);
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
    contractStatusId:null,
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
    if(this.dataSearch.filter.contractChairperson!=null && this.dataSearch.filter.contractChairperson!="")
    {
      this.dataSource.data = this.dataSource.data.filter((d: { contractChairperson: any }) => d.contractChairperson == this.dataSearch.filter.contractChairperson);
    } 
    if(this.dataSearch.filter.contractStatusId!=null && this.dataSearch.filter.contractStatusId!="")
    {
      this.dataSource.data = this.dataSource.data.filter((d: { contractStatus: any }) => d.contractStatus == this.dataSearch.filter.contractStatusId);
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
