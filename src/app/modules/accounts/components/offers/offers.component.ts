
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
import { OfferService } from 'src/app/core/services/project-services/offer.service';
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
import { OrganizationService } from 'src/app/core/services/sys_Services/organization.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss']
})

export class OffersComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSourceTemp: any = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource([{}]);
  _OfferSMS: any = null;
  modal?: BsModalRef;
  modalDetails: any = {};
  load_BranchAccount: any;
  load_CityAndAreas: any;
  customrRowSelected: any;
  BranchId: number;
  allOfferCount = 0;
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
      link: '/accounts/offer',
    },
    sub: {
      ar: 'طلبات التسعير',
      en: 'Offer',
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
    'offerCode',
    'nameAr',
    'mainPhoneNo',
    'cityName',
    'address',
    'paytypeName',
    'socialMediaName',
    'date',
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
      search_OfferName: '',
      search_offerEmail: '',
      search_offerMobile: '',
      isChecked: false,
    },
  };

  EditModel: any = {
    OfferId: 0,
    nameAr: null,
    nameEn: null,
  };

  constructor(
    private service: OfferService,
    private _organization: OrganizationService,
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
    private domSanitizer: DomSanitizer
  ) {
    this.userG = this.authenticationService.userGlobalObj;
    this.subscription = this.control.valueChanges.subscribe(
      (values: Array<File>) => this.getImage(values[0])
    );
    this.GetOrganizationData();
    this.GetBranchData();
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
  GetBranchData(){
    this.api.GetBranchByBranchId().subscribe((data: any) => {
      this.BranchData = data;
      this.environmentPhoBranch =environment.PhotoURL + this.BranchData.logoUrl;
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
  OfferStatusList: any;

  ngOnInit(): void {
    this.OfferStatusList = [
      { id: 1, name: 'مبدئي' },
      { id: 2, name: 'مراجع' },
      { id: 3, name: 'نهائي' },
    ];
    this.getAllOffers();
    this.FillCustomerSelect();
    this.FillEmployeeselect();
    this.SetOfferDefData();
    this.GetAllServicesPrice_OfferNew();
  }

  SetOfferDefData(){
    this.intialForms();
    this.DisabledBtn();
    this.resetOfferDataList();
  }

  intialForms() {
    console.log("this.modalDetails",this.modalDetails)

    this.FormGroup01 = this._formBuilder.group({
      branchId: [null],
      offerId: [null],
      offerCode: [null, [Validators.required]],
      customerId: [null],
      nameAr: [null],
      nameEn: [null],
      nationalId: [null],
      mainPhoneNo: [null],
      subMainPhoneNo: [null],
      email: [null],
      address: [null],
      cityId: [null],
      payTypeId: [null],
      socialMediaId: [null],
      offerTypeId: [null],
      offerChairperson: [null],
      date: [null],
      offDateTime: [null],
      notes: [null],
    });
    this.FormGroup02 = this._formBuilder.group({
      total_amount: [null],
    });
  }

  SetFormData(data:any){
    debugger
    this.FormGroup01.controls['branchId'].setValue(data.branchId);
    this.FormGroup01.controls['customerId'].setValue(data.customerId);
    this.FormGroup01.controls['offerId'].setValue(data.offerId);
    this.FormGroup01.controls['offerCode'].setValue(data.offerCode);
    this.FormGroup01.controls['nameAr'].setValue(data.nameAr);
    this.FormGroup01.controls['nameEn'].setValue(data.nameEn);
    this.FormGroup01.controls['nationalId'].setValue(data.nationalId);
    this.FormGroup01.controls['mainPhoneNo'].setValue(data.mainPhoneNo);
    this.FormGroup01.controls['subMainPhoneNo'].setValue(data.subMainPhoneNo);
    this.FormGroup01.controls['email'].setValue(data.email);
    this.FormGroup01.controls['address'].setValue(data.address);
    this.FormGroup01.controls['cityId'].setValue(data.cityId);
    this.FormGroup01.controls['payTypeId'].setValue(data.payTypeId);
    this.FormGroup01.controls['socialMediaId'].setValue(data.socialMediaId);
    this.FormGroup01.controls['offerTypeId'].setValue(data.previewTypeId);
    this.FormGroup01.controls['offerChairperson'].setValue(data.offerChairperson);
    this.FormGroup01.controls['date'].setValue(data.date);
    this.FormGroup01.controls['offDateTime'].setValue(data.offDateTime);
    this.FormGroup01.controls['notes'].setValue(data.notes);
    this.resetmodalDetailsOfferNew();
    this.modalDetailsOfferNew.discountValue=data.discountValue;
    this.modalDetailsOfferNew.discountPercentage=data.discountPercentage;
    this.GetCategoriesByOfferId();
  }


  DisabledBtn(){
    this.FormGroup01.controls['offerCode'].disable();
  }
  DisabledCustomerBtn(){
    this.FormGroup01.controls['nameAr'].disable();
    this.FormGroup01.controls['nameEn'].disable();
    this.FormGroup01.controls['nationalId'].disable();
    this.FormGroup01.controls['mainPhoneNo'].disable();
    this.FormGroup01.controls['subMainPhoneNo'].disable();
    this.FormGroup01.controls['email'].disable();
    this.FormGroup01.controls['address'].disable();
    this.FormGroup01.controls['cityId'].disable();
    this.FormGroup01.controls['payTypeId'].disable();
    this.FormGroup01.controls['socialMediaId'].disable();
  }
  EnabledCustomerBtn(){
    this.FormGroup01.controls['nameAr'].enable();
    this.FormGroup01.controls['nameEn'].enable();
    this.FormGroup01.controls['nationalId'].enable();
    this.FormGroup01.controls['mainPhoneNo'].enable();
    this.FormGroup01.controls['subMainPhoneNo'].enable();
    this.FormGroup01.controls['email'].enable();
    this.FormGroup01.controls['address'].enable();
    this.FormGroup01.controls['cityId'].enable();
    this.FormGroup01.controls['payTypeId'].enable();
    this.FormGroup01.controls['socialMediaId'].enable();
  }


  GetCategoriesByOfferId(){
    var offerId=(this.FormGroup01.controls['offerId'].value??0);
    this.service.GetCategoriesByOfferId(offerId).subscribe(data=>{
      data.forEach((element: any) => {
        var maxVal=0;
        if(this.OfferNewServices.length>0)
        {
          maxVal = Math.max(...this.OfferNewServices.map((o: { idRow: any; }) => o.idRow))
        }
        else{
          maxVal=0;
        }
        this.setServiceRowValueNew_OfferNew(maxVal+1,element);
      });    
    });
  }

  resetOfferDataList(){
    this.OfferNewServices=[];
  }

  FormGroup01: FormGroup;
  FormGroup02: FormGroup;

  OfferNewServices: any = [];
  servicesListdisplayedColumns: string[] = ['categoryTypeName', 'nameAr', 'amount'];

  modalDetailsOfferNew:any={
    sumamount:null,
    sumtotal:null,
    sumqty:null,
    discountValue:null,
    discountPercentage:null,
    sumtotalAfterDisc:null,
  }
  resetmodalDetailsOfferNew(){
    this.OfferNewServices=[];
    this.modalDetailsOfferNew={
      sumamount:null,
      sumtotal:null,
      sumqty:null,
      discountValue:null,
      discountPercentage:null,
      sumtotalAfterDisc:null,
    }
  }

  addServiceOfferNew() {
    var maxVal=0;
    if(this.OfferNewServices.length>0)
    {
      maxVal = Math.max(...this.OfferNewServices.map((o: { idRow: any; }) => o.idRow))
    }
    else{
      maxVal=0;
    }
    this.OfferNewServices?.push({
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

  deleteServiceOfferNew(idRow: any) {
    this.modalDetailsOfferNew={
      sumamount:null,
      sumtotal:null,
      sumqty:null,
      discountValue:0,
      discountPercentage:0,
      sumtotalAfterDisc:null,
    }
    let index = this.OfferNewServices.findIndex((d: { idRow: any; }) => d.idRow == idRow);
    this.OfferNewServices.splice(index, 1);
    this.CalculateTotal_OfferNew();
  }

  selectedServiceRowOfferNew: any;

  setServiceRowValue_OfferNew(element: any) {
    debugger
    var ItemCat= this.OfferNewServices.filter((d: { categoryId: any }) => (d.categoryId ==element.categoryId));
    if(ItemCat.length>0)
    {
      this.toast.error(this.translate.instant("تم اختيار هذا الصنف مسبقا"),this.translate.instant("Message"));
      return;
    }
    this.modalDetailsOfferNew={
      sumamount:null,
      sumtotal:null,
      sumqty:null,
      discountValue:0,
      discountPercentage:0,
      sumtotalAfterDisc:null,
    }
    this.OfferNewServices.filter((a: { idRow: any; })=>a.idRow==this.selectedServiceRowOfferNew)[0].categoryTypeId = element.categoryTypeId;
    this.OfferNewServices.filter((a: { idRow: any; })=>a.idRow==this.selectedServiceRowOfferNew)[0].categoryTypeName = element.categoryTypeName;
    this.OfferNewServices.filter((a: { idRow: any; })=>a.idRow==this.selectedServiceRowOfferNew)[0].nameAr = element.nameAr;
    this.OfferNewServices.filter((a: { idRow: any; })=>a.idRow==this.selectedServiceRowOfferNew)[0].categoryId = element.categoryId;
    this.OfferNewServices.filter((a: { idRow: any; })=>a.idRow==this.selectedServiceRowOfferNew)[0].unitId = element.unitId;
    this.OfferNewServices.filter((a: { idRow: any; })=>a.idRow==this.selectedServiceRowOfferNew)[0].unitName = element.unitName;
    this.OfferNewServices.filter((a: { idRow: any; })=>a.idRow==this.selectedServiceRowOfferNew)[0].qty = 1;
   
    debugger
    if(this.CategoryPriceStatus)
    {
      this.OfferNewServices.filter((a: { idRow: any; })=>a.idRow==this.selectedServiceRowOfferNew)[0].amount = element.amount;
    }
    else
    {
      this.OfferNewServices.filter((a: { idRow: any; })=>a.idRow==this.selectedServiceRowOfferNew)[0].amount = null;
    }  
    this.OfferNewServices.filter((a: { idRow: any; })=>a.idRow==this.selectedServiceRowOfferNew)[0].accamount = element.amount;

    this.CalculateTotal_OfferNew();
  }

  setServiceRowValueNew_OfferNew(indexRow:any,item: any) {
    debugger
    this.addServiceOfferNew();
    this.OfferNewServices.filter((a: { idRow: any; })=>a.idRow==indexRow)[0].categoryTypeId = item.categoryTypeId;
    this.OfferNewServices.filter((a: { idRow: any; })=>a.idRow==indexRow)[0].categoryTypeName = item.categoryTypeName;
    this.OfferNewServices.filter((a: { idRow: any; })=>a.idRow==indexRow)[0].nameAr = item.nameAr;
    this.OfferNewServices.filter((a: { idRow: any; })=>a.idRow==indexRow)[0].categoryId = item.categoryId;
    this.OfferNewServices.filter((a: { idRow: any; })=>a.idRow==indexRow)[0].unitId = item.unitId;
    this.OfferNewServices.filter((a: { idRow: any; })=>a.idRow==indexRow)[0].unitName = item.unitName;
    this.OfferNewServices.filter((a: { idRow: any; })=>a.idRow==indexRow)[0].qty = item.qty;
    this.OfferNewServices.filter((a: { idRow: any; })=>a.idRow==indexRow)[0].amount = item.amount;
    this.OfferNewServices.filter((a: { idRow: any; })=>a.idRow==indexRow)[0].accamount = item.amount;  
    this.CalculateTotal_OfferNew();
  }

  CalculateTotal_OfferNew() {
    var amount_T = 0;var totalValue_T = 0;var qty_T = 0;
    debugger
    this.OfferNewServices.forEach((element: any) => {
      var Value = parseFloat((element.amount??0).toString()).toFixed(2);
      var FVal = +Value * element.qty;
      var totalValue = 0;
      this.OfferNewServices.filter((a: { idRow: any; })=>a.idRow==element.idRow)[0].totalValue= parseFloat((FVal).toString()).toFixed(2);
      amount_T += element.amount;
      totalValue_T +=(totalValue) ;
      qty_T += (element.qty);
    });
    this.CalcSumTotal_OfferNew();
    this.CalcDisc(1)
  }
  CalcSumTotal_OfferNew(){
    let sumamount=0;
    let sumtotal=0;
    let sumqty=0;
    debugger
    this.OfferNewServices.forEach((element: any) => {
      sumamount= +sumamount + +parseFloat((element.amount??0)).toFixed(2);
      sumtotal= +sumtotal + +parseFloat((element.totalValue??0)).toFixed(2);
      sumqty= +sumqty + +parseFloat((element.qty??0)).toFixed(2);
    });
    this.modalDetailsOfferNew.sumamount=parseFloat(sumamount.toString()).toFixed(2);
    this.modalDetailsOfferNew.sumtotal=parseFloat(sumtotal.toString()).toFixed(2);
    this.modalDetailsOfferNew.sumqty=parseFloat(sumqty.toString()).toFixed(2);
  }

  CalcDisc(type:any){
    var ValueAmount = parseFloat((this.modalDetailsOfferNew.sumtotal ?? 0).toString()).toFixed(2);
    var DiscountValue_Det;
    if (type == 1)
       {
        DiscountValue_Det = parseFloat((this.modalDetailsOfferNew.discountValue ?? 0).toString()).toFixed(2);
    } else {
      var Discountper_Det = parseFloat((this.modalDetailsOfferNew.discountPercentage ?? 0).toString()).toFixed(2);
      DiscountValue_Det = parseFloat(((+Discountper_Det * +ValueAmount) / 100).toString()).toFixed(2);
      this.modalDetailsOfferNew.discountValue= parseFloat(DiscountValue_Det.toString()).toFixed(2);
    }
    var Value = parseFloat( (+ValueAmount - +DiscountValue_Det).toString()).toFixed(2);
    if (!(+Value >= 0)) {
      this.modalDetailsOfferNew.discountValue=0;
      this.modalDetailsOfferNew.discountPercentage=0;
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
      this.modalDetailsOfferNew.discountPercentage=DiscountPercentage_Det;
    }

    this.modalDetailsOfferNew.sumtotalAfterDisc = parseFloat((Value).toString()).toFixed(2);
  }

  disableButtonSave_Offer=false;

  saveOfferbtn(modal:any,stepper: MatStepper){
    debugger
    var offerId=(this.FormGroup01.controls['offerId'].value??0);
    var sumtotalAfterDisc=(this.modalDetailsOfferNew.sumtotalAfterDisc??0);
    if(sumtotalAfterDisc<=0)
    {
      this.toast.error(this.translate.instant("لا يمكنك حفظ طلب تسعير بقيمة لا تتخطي الصفر"),this.translate.instant("Message"));
      return;
    }
    var OfferObj:any = {};
    OfferObj.OfferId = offerId;
    OfferObj.OfferCode = this.FormGroup01.controls['offerCode'].value;
    if (this.FormGroup01.controls['date'].value != null) {
      OfferObj.date = this._sharedService.date_TO_String(this.FormGroup01.controls['date'].value);
    }
    else
    {
      this.toast.error(this.translate.instant("اختر تاريخ"),this.translate.instant("Message"));
      return;
    }
    if (this.FormGroup01.controls['offDateTime'].value != null) {
      OfferObj.offDateTime = this._sharedService.formatAMPM(this.FormGroup01.controls['offDateTime'].value);
    }
    else
    {
      this.toast.error(this.translate.instant("اختر وقت"),this.translate.instant("Message"));
      return;
    }

    OfferObj.BranchId = this.FormGroup01.controls['branchId'].value;
    OfferObj.CustomerId = this.FormGroup01.controls['customerId'].value;
    OfferObj.OfferCode = this.FormGroup01.controls['offerCode'].value;
    OfferObj.NameAr = this.FormGroup01.controls['nameAr'].value;
    OfferObj.NameEn = this.FormGroup01.controls['nameEn'].value;
    OfferObj.NationalId = this.FormGroup01.controls['nationalId'].value;
    OfferObj.MainPhoneNo = this.FormGroup01.controls['mainPhoneNo'].value;
    OfferObj.SubMainPhoneNo = this.FormGroup01.controls['subMainPhoneNo'].value;
    OfferObj.Email = this.FormGroup01.controls['email'].value;
    OfferObj.Address = this.FormGroup01.controls['address'].value;
    OfferObj.CityId = this.FormGroup01.controls['cityId'].value;
    OfferObj.PayTypeId = this.FormGroup01.controls['payTypeId'].value;
    OfferObj.SocialMediaId = this.FormGroup01.controls['socialMediaId'].value;
    OfferObj.OfferTypeId = this.FormGroup01.controls['offerTypeId'].value;
    OfferObj.OfferChairperson = this.FormGroup01.controls['offerChairperson'].value;
    OfferObj.Notes = this.FormGroup01.controls['notes'].value;

    OfferObj.DiscountValue = (this.modalDetailsOfferNew.discountValue??0);
    OfferObj.DiscountPercentage = (this.modalDetailsOfferNew.discountPercentage??0);
    OfferObj.TotalValue = sumtotalAfterDisc;

    var input = { valid: true, message: "" }
    var ServicesDetailsList:any = [];
    this.OfferNewServices.forEach((element: any) => {

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
      var Offerserviceobj:any  = {};
      debugger
      Offerserviceobj.CategoryTypeId = element.categoryTypeId;
      Offerserviceobj.NameAr = element.nameAr;
      Offerserviceobj.CategoryId = element.categoryId;
      Offerserviceobj.UnitId = element.unitId;
      Offerserviceobj.Amount = element.amount;
      Offerserviceobj.Status = element.status;
      Offerserviceobj.Qty = element.qty;
      Offerserviceobj.TotalValue = element.totalValue;
      ServicesDetailsList.push(Offerserviceobj);

    });
    if (!input.valid) {
      this.toast.error(input.message);return;
    }
    OfferObj.OfferCategories = ServicesDetailsList;
    console.log("OfferObj",OfferObj);

    this.disableButtonSave_Offer = true;
    setTimeout(() => { this.disableButtonSave_Offer = false }, 15000);

    this.service.SaveOffer(OfferObj).subscribe((result: any)=>{
      debugger
      if(result.statusCode==200){
        this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
        this.getAllOffers();
        modal?.hide();
        this.disableButtonSave_Offer = false ;
      }
      else{
        this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
        this.disableButtonSave_Offer = false;
      }
    });
  }

  goForward(stepper: MatStepper){
    stepper.next();
}
  // ConvertNumToString_Offer(val:any){
  //   this._offerService.ConvertNumToString(val).subscribe(data=>{
  //     this.modalDetailsOfferNew.total_amount_text=data?.reasonPhrase;
  //   });
  // }
  applyFilterServiceList_OfferNew(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.serviceListDataSource_OfferNew.filter = filterValue.trim().toLowerCase();
  }

  serviceListDataSourceTemp_OfferNew:any=[];
  servicesList_OfferNew: any;
  serviceListDataSource_OfferNew = new MatTableDataSource();

  GetAllServicesPrice_OfferNew(){
    this.category.GetAllCategories_BranchActive().subscribe(data=>{
        this.serviceListDataSource_OfferNew = new MatTableDataSource(data);
        this.servicesList_OfferNew=data;
        this.serviceListDataSourceTemp_OfferNew=data;
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
          (d.offerCode &&
            d.offerCode?.trim().toLowerCase().indexOf(val) !== -1) ||
          (d.nameAr &&
            d.nameAr?.trim().toLowerCase().indexOf(val) !== -1) ||
          (d.mainPhoneNo &&
            d.mainPhoneNo?.trim().toLowerCase().indexOf(val) !== -1) ||
            (d.cityName &&
            d.cityName?.trim().toLowerCase().indexOf(val) !== -1) ||
            (d.address &&
            d.address?.trim().toLowerCase().indexOf(val) !== -1) ||
          (d.paytypeName &&
            d.paytypeName?.trim().toLowerCase().indexOf(val) !== -1) ||
          (d.socialMediaName &&
            d.socialMediaName?.trim().toLowerCase().indexOf(val) !== -1) ||
          (d.date &&
            d.date?.trim().toLowerCase().indexOf(val) !== -1) ||
          (d.addDate &&
            d.addDate?.trim().toLowerCase().indexOf(val) !== -1) ||
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
  //     this.getAllOffers();
  //   } else {
  //     this.RefreshData();
  //   }
  // }

  resetandRefresh() {
    if (this.searchBox.open == false) {
      this.data2.filter.search_OfferName = null;
      this.data2.filter.search_offerMobile = null;
      this.data.type = 0;
      this.getAllOffers();
    }
  }
  //------------------ Fill DATA ----------------------------------

  fillBranchByUserId(modalType:any) {
    this.service.FillBranchByUserIdSelect().subscribe((data) => {
      debugger
      this.load_BranchUserId = data;
      if (this.load_BranchUserId.length == 1) {
        this.FormGroup01.controls['branchId'].setValue(this.load_BranchUserId[0].id);
        if (modalType == 'addOffer'){
        this.BranchChange(this.FormGroup01.controls['branchId'].value,modalType);
        }
      }
      else
      {
        if (modalType == 'addOffer'){
          debugger
          this.FormGroup01.controls['branchId'].setValue(parseInt(this._sharedService.getStoBranch()));
          this.BranchChange(this.FormGroup01.controls['branchId'].value,modalType);
        }     
      }
    });
  }

  BranchChange(BranchId: any,modalType:any) {
    debugger
    if(modalType == 'addOffer')
    {
      this.OfferNumber_Reservation(BranchId);
    }
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

  OfferNumber_Reservation(BranchId:any){
    this.service.OfferNumber_Reservation(BranchId).subscribe(data=>{
    this.FormGroup01.controls['offerCode'].setValue(data.reasonPhrase);
    });
  }


  load_Customers: any=[];
  FillCustomerSelect() {
    this.customerService.FillCustomerSelect().subscribe((data) => {
      this.load_Customers = data.result;
    });
  }

getcustomerdata(){
  var customerId=this.FormGroup01.controls['customerId'].value;
  if(customerId>0)
  {
    this.DisabledCustomerBtn();
    var Cust= this.load_Customers.filter((d: { customerId: any }) => (d.customerId ==customerId));
    if(Cust.length>0)
    {
      console.log("Cust[0]",Cust[0]);
      this.FormGroup01.controls['nameAr'].setValue(Cust[0].nameAr);   
      this.FormGroup01.controls['nameEn'].setValue(Cust[0].nameEn);   
      this.FormGroup01.controls['nationalId'].setValue(Cust[0].nationalId);   
      this.FormGroup01.controls['mainPhoneNo'].setValue(Cust[0].mainPhoneNo);   
      this.FormGroup01.controls['subMainPhoneNo'].setValue(Cust[0].subMainPhoneNo);   
      this.FormGroup01.controls['email'].setValue(Cust[0].email);   
      this.FormGroup01.controls['address'].setValue(Cust[0].address);   
      this.FormGroup01.controls['cityId'].setValue(Cust[0].cityId);   
      this.FormGroup01.controls['payTypeId'].setValue(Cust[0].payTypeId);   
      this.FormGroup01.controls['socialMediaId'].setValue(Cust[0].socialMediaId);   
    }
  }
  else
  {
    this.EnabledCustomerBtn();
      this.FormGroup01.controls['nameAr'].setValue(null);   
      this.FormGroup01.controls['nameEn'].setValue(null);   
      this.FormGroup01.controls['nationalId'].setValue(null);   
      this.FormGroup01.controls['mainPhoneNo'].setValue(null);   
      this.FormGroup01.controls['subMainPhoneNo'].setValue(null);   
      this.FormGroup01.controls['email'].setValue(null);   
      this.FormGroup01.controls['address'].setValue(null);   
      this.FormGroup01.controls['cityId'].setValue(null);   
      this.FormGroup01.controls['payTypeId'].setValue(null);   
      this.FormGroup01.controls['socialMediaId'].setValue(null);   
  }
}


  load_Employees: any=[];
  FillEmployeeselect() {
    this.employeeService.FillEmployeeselect(0).subscribe((data) => {
      this.load_Employees = data;
    });
  }

  GenerateOfferNumber(){
    debugger
    this.service.GenerateOfferNumber().subscribe(data=>{
      this.modalDetails.offerCode=data.reasonPhrase;
    });
  }
  GenerateOfferNumberByBarcodeNum(){
    debugger
    if(!(this.modalDetails.orderBarcode==null || this.modalDetails.orderBarcode==""))
    {
      this.service.GenerateOfferNumberByBarcodeNum(this.modalDetails.orderBarcode).subscribe(data=>{
        this.modalDetails.offerCode=data.reasonPhrase;
      });
    }  
  }

  //-----------------------OPEN MODAL--------------------------------------------------

  openModal(template: TemplateRef<any>, data?: any, modalType?: any) {
    this.fillBranchByUserId(modalType);
    this.FillCitySelect_Cus();
    this.FillPaytypeSelect_Cus();
    this.FillSocialMediaSelect_Cus();
    //this.resetModal();
    //this.GetAllPreviewsSelectBarcodeFinished();
    if (modalType == 'addOffer') {     
      //this.GenerateOfferNumber(); 
    }
    if (data) {
      this.modalDetails = data;
      if (modalType == 'editOffer' || modalType == 'OfferView') {
        if(this.modalDetails.date!=null)
        {
          this.modalDetails.date = this._sharedService.String_TO_date(this.modalDetails.date);
          this.modalDetails.offDateTime = this.modalDetails.date;
        }
        this.SetFormData(this.modalDetails);
      }
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
    debugger
    if (type === 'deleteModalPerm') {
      this.publicidRow = data.idRow;
    }
    if(type === 'ShowOfferFiles')
    {
      if (data) {
        this.modalDetailsPublic = data;
      }
      this.GetAllOfferFiles(this.modalDetails.offerId,this.modalDetails.designId,this.modalDetails.meetingId,this.modalDetails.previewId);
    }
    if (idRow != null) {
      this.selectedServiceRowOfferNew = idRow;
    }
    if(type=="servicesList_Offer"){
      var input = { valid: true, message: "" }
      this.OfferNewServices.forEach((element: any) => {
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


  OfferIdPublic: any = 0;
  setOfferid_P(id: any) {
    this.OfferIdPublic = id;
    console.log('this.OfferIdPublic');
    console.log(this.OfferIdPublic);
  }

  exportData() {
    let x = [];
    var AccDataSource=this.dataSource.data;
    for (let index = 0; index < AccDataSource.length; index++) {
      x.push({
        branchName: AccDataSource[index].branchName,
        offerCode: AccDataSource[index].offerCode,
        nameAr: AccDataSource[index].nameAr,      
        mainPhoneNo: AccDataSource[index].mainPhoneNo,
        cityName: AccDataSource[index].cityName,
        address: AccDataSource[index].address,
        paytypeName: AccDataSource[index].paytypeName,
        customerName: AccDataSource[index].customerName,
        socialMediaName: AccDataSource[index].socialMediaName,
        date: AccDataSource[index].date,
        addDate: AccDataSource[index].addDate,
      });
    }
    this.service.customExportExcel(x, 'Offers');
  }

  getAllOffers() {
    this.service.GetAllOffers_Branch().subscribe((data: any) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSourceTemp = data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.allOfferCount = data.length;
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
      type: 'addOffer',
      nameAr: null,
      nameEn: null,
      id: null,
      name: null,
      offerId: 0,
      branchId: null,
      orderBarcode:null,
      previewId: null,
      previewTypeId:null,
      meetingId:null,
      offerCode: null,
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
      addedofferImg: null,
      offerDate: null,
      offerChairperson: null,
      desDateTime:null,
    };
  }

  confirm(): void {
    var offerId=(this.FormGroup01.controls['offerId'].value??0);
    this.service.DeleteOffer(offerId).subscribe((result) => {
        if (result.statusCode == 200) {
          this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
          this.getAllOffers();
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
      _Files.offerId=this.modalDetails.offerId;
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
            this.getAllOffers();
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

  OfferFileRowSelected: any;
  
  getOfferFileRow(row: any) {
    this. OfferFileRowSelected = row;
  }
  confirmDeleteOfferFile(): void {
    this.files.DeleteFiles(this. OfferFileRowSelected.fileId).subscribe((result) => {
        if (result.statusCode == 200) {
          this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
          debugger
          this.GetAllOfferFiles(this.modalDetailsPublic.offerId,this.modalDetailsPublic.designId,this.modalDetailsPublic.meetingId,this.modalDetailsPublic.previewId);
          this.modal?.hide();
        } else {
          this.toast.error(result.reasonPhrase, this.translate.instant('Message'));
        }
      });
  }
  
  OfferFilesList: any=[];
  
  GetAllOfferFiles(OfferId:any,DesignId:any,MeetingId:any,PreviewId:any) {
    this.OfferFilesList=[];
    // this.files.GetAllOfferFiles(OfferId).subscribe((data: any) => {
    //   this.OfferFilesList = data;
    // });
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
      ListPhone:[],
      customerId:null,
      customerName:null,
      mainPhoneNo:null,
      offerChairperson:null,
      documentStatus:null,
      showFilters:false
    },
  };

    FillSerachLists(dataT:any){
      this.FillCustomerListName(dataT);
      this.FillCustomerListPhone(dataT);
    }

    FillCustomerListName(dataT:any){
      const ListLoad = dataT.map((item: { customerName: any; }) => {
        const container:any = {}; container.id = item.customerName; container.name = item.customerName; return container;
      })
      const key = 'id';
      const arrayUniqueByKey = [...new Map(ListLoad.map((item: { [x: string]: any; }) => [item[key], item])).values()];
      this.dataSearch.filter.ListName=arrayUniqueByKey;
    }
    FillCustomerListPhone(dataT:any){
      const ListLoad = dataT.map((item: { mainPhoneNo: any; }) => {
        const container:any = {}; container.id = item.mainPhoneNo; container.name = item.mainPhoneNo; return container;
      })
      const key = 'id';
      const arrayUniqueByKey = [...new Map(ListLoad.map((item: { [x: string]: any; }) => [item[key], item])).values()];
      this.dataSearch.filter.ListPhone=arrayUniqueByKey;
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
      if(this.dataSearch.filter.customerName!=null && this.dataSearch.filter.customerName!="")
      {
        this.dataSource.data = this.dataSource.data.filter((d: { customerName: any }) => d.customerName == this.dataSearch.filter.customerName);
      }
      if(this.dataSearch.filter.mainPhoneNo!=null && this.dataSearch.filter.mainPhoneNo!="")
      {
        this.dataSource.data = this.dataSource.data.filter((d: { mainPhoneNo: any }) => d.mainPhoneNo == this.dataSearch.filter.mainPhoneNo);
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

OfferPrintData:any=null;
resetCustomData2Offer(){
  this.OfferPrintData=null;
}
serviceDetailsPrint: any;

serviceDetailsPrintObj:any=[];
serviceDetailsList:any=[];

GetDofAsaatOffersPrint(obj:any){
  this.serviceDetailsPrintObj=[];
  this.serviceDetailsList=[];

  this.service.GetCategoriesByOfferId(obj.offerId).subscribe(data=>{
    this.serviceDetailsList=data;
    console.log("this.serviceDetailsList",this.serviceDetailsList);
  });
  this.OfferPrintData=obj;
  console.log("this.OfferPrintData",this.OfferPrintData);
  console.log("this.OrganizationData",this.OrganizationData);
  console.log("this.BranchData",this.BranchData);
  

}
printDiv(id: any) {
  this.print.print(id, environment.printConfig);
}

dateToday: any = new Date();

//-------------------------------------------EndPrint----------------------------------------

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
