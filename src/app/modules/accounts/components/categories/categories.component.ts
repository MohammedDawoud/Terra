
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
import { CategoryService } from 'src/app/core/services/acc_Services/category.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSourceTemp: any = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource([{}]);
  _CategorySMS: any = null;
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
        ar: 'الأصناف',
        en: 'Category',
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
    'code',
    'nameAr',
    'amount',
    'statusName',
    'categoryTypeName',
    'categoryTypeStatusName',
    'unitName',
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
      search_CategoryName: '',
      search_categoryEmail: '',
      search_categoryMobile: '',
      isChecked: false,
    },
  };

  EditModel: any = {
    CategoryId: 0,
    nameAr: null,
    nameEn: null,
  };

  constructor(
    private service: CategoryService,
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
    this.getAllCategorys();
  }

  applyFilter(event: any) {
    const val = event.target.value.toLowerCase();
    var tempsource = this.dataSourceTemp;
    if (val) {
      tempsource = this.dataSourceTemp.filter((d: any) => {
        return (
          (d.branchName &&
            d.branchName?.trim().toLowerCase().indexOf(val) !== -1) ||
          (d.code &&
            d.code?.trim().toLowerCase().indexOf(val) !== -1) ||
          (d.nameAr &&
            d.nameAr?.trim().toLowerCase().indexOf(val) !== -1) ||
          (d.amount &&
            d.amount?.trim().toLowerCase().indexOf(val) !== -1) ||
          (d.statusName &&
            d.statusName?.trim().toLowerCase().indexOf(val) !== -1) ||
            (d.categoryTypeName &&
              d.categoryTypeName?.trim().toLowerCase().indexOf(val) !== -1) ||
              (d.categoryTypeStatusName &&
                d.categoryTypeStatusName?.trim().toLowerCase().indexOf(val) !== -1) ||
                (d.unitName &&
                  d.unitName?.trim().toLowerCase().indexOf(val) !== -1) ||
          (d.addDate &&
            d.addDate?.trim().toLowerCase().indexOf(val) !== -1)
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
      }
      else
      {
        if (modalType == 'addCategory'){
          debugger
          this.modalDetails.branchId = parseInt(this._sharedService.getStoBranch());
          this.BranchChange(this.modalDetails.branchId,modalType);
        }     
      }
    });
  }

  BranchChange(BranchId: any,modalType:any) {
    debugger
    if(modalType == 'addCategory')
    {
      this.CategoryNumber_Reservation(BranchId);
    }
  }

  CategoryNumber_Reservation(BranchId:any){
    this.service.CategoryNumber_Reservation(BranchId).subscribe(data=>{
      this.modalDetails.code=data.reasonPhrase;
    });
  }

  //-----------------------OPEN MODAL--------------------------------------------------

  openModal(template: TemplateRef<any>, data?: any, modalType?: any) {
    this.fillBranchByUserId(modalType);
    this.FillCategoryTypeSelect();
    this.FillUnitSelect();
    this.resetModal();
    //this.getEmailOrganization();
    debugger
    if (modalType == 'addCategory') {
      // this.GenerateCategoryNumber();
    }
    console.log('this.modalDetails');
    console.log(this.modalDetails);

    if (data) {
      this.modalDetails = data;
      if (modalType == 'editCategory') {
        // debugger;
        // if (data.agentAttachmentUrl != null) {
        //   this.modalDetails.attachmentUrl =environment.PhotoURL + data.agentAttachmentUrl;
        // }
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

  CategoryIdPublic: any = 0;
  setCategoryid_P(id: any) {
    this.CategoryIdPublic = id;
    console.log('this.CategoryIdPublic');
    console.log(this.CategoryIdPublic);
  }

  disableButtonSave_Category = false;

  addCategory() {
    debugger;
    var val = this.validateForm();
    if (val.status == false) {
      this.toast.error(val.msg, 'رسالة');
      return;
    }
    var custObj: any = {};
    custObj.categoryId = this.modalDetails.categoryId;
    custObj.code = this.modalDetails.code;
    custObj.nameAr = this.modalDetails.nameAr;
    custObj.nameEn = this.modalDetails.nameEn;
    custObj.branchId = this.modalDetails.branchId;
    custObj.amount = this.modalDetails.amount;
    custObj.categoryTypeId = this.modalDetails.categoryTypeId;
    custObj.unitId = this.modalDetails.unitId;
    custObj.status = this.modalDetails.status;
    custObj.notes = this.modalDetails.notes;
    console.log('custObj');
    console.log(custObj);

    const formData = new FormData();
    for (const key of Object.keys(custObj)) {
      const value = custObj[key] == null ? '' : custObj[key];
      formData.append(key, value);
      formData.append('CategoryId', custObj.categoryId.toString());
    }
    this.disableButtonSave_Category = true;
    setTimeout(() => {
      this.disableButtonSave_Category = false;
    }, 5000);
    this.service.SaveCategory(formData).subscribe((result: any) => {
      if (result.statusCode == 200) {
        this.toast.success(
          this.translate.instant(result.reasonPhrase),
          this.translate.instant('Message')
        );
        this.decline();
        this.getAllCategorys();
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
      this.ValidateObjMsg = { status: false, msg: ' أدخل أسم الصنف عربي' };
      return this.ValidateObjMsg;
    }
    else if ((this.modalDetails.code == null ||
      this.modalDetails.code == '')
  ) {
    this.ValidateObjMsg = {status: false, msg: 'ادخل كود الصنف',};
    return this.ValidateObjMsg;
  } 
  else if (this.modalDetails.branchId == null) {
      this.ValidateObjMsg = { status: false, msg: 'اختر فرع الصنف' };
      return this.ValidateObjMsg;
    }  
    else if ((this.modalDetails.amount == null ||this.modalDetails.amount == '')
    ) {
      this.ValidateObjMsg = { status: false, msg: 'ادخل سعر الصنف' };
      return this.ValidateObjMsg;
    }
    else if ((this.modalDetails.categoryTypeId == null ||this.modalDetails.categoryTypeId == '')
    ) {
      this.ValidateObjMsg = { status: false, msg: 'ادخل التصنيف' };
      return this.ValidateObjMsg;
    }
    else if ((this.modalDetails.unitId == null ||this.modalDetails.unitId == '')
    ) {
      this.ValidateObjMsg = { status: false, msg: 'ادخل الوحدة' };
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
        code: this.dataSourceTemp[index].code,
        categoryName: this.dataSourceTemp[index].nameAr,
        amount: this.dataSourceTemp[index].amount,
        statusName: this.dataSourceTemp[index].statusName,
        categoryTypeName: this.dataSourceTemp[index].categoryTypeName,
        categoryTypeStatusName: this.dataSourceTemp[index].categoryTypeStatusName,
        unitName: this.dataSourceTemp[index].unitName,
        addDate: formattedDate,

      });
    }
    debugger;
    this.service.customExportExcel(x, 'Categorys');
  }




  getAllCategorys() {
    this.service.GetAllCategories_Branch().subscribe((data: any) => {
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
      type: 'addCategory',
      nameAr: null,
      nameEn: null,
      id: null,
      name: null,
      categoryId: 0,
      branchId: null,
      code: null,
      amount: null,
      categoryTypeId: null,
      unitId: null,
      status:true,
      notes: null,
      addDate: null,
      addUser: null,
      addedcategoryImg: null,
    };
  }

  confirm(): void {
    this.service.DeleteCategory(this.modalDetails.categoryId).subscribe((result) => {
        if (result.statusCode == 200) {
          this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
          this.getAllCategorys();
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
      ListCategoryType:[],
      ListUnit:[],
      categoryId:null,
      categoryTypeId:null,
      unitId:null,
      showFilters:false
    },
  };

FillSerachLists(dataT:any){
  this.FillCategoryListName(dataT);
  this.FillCategoryListCode(dataT);
  this.FillCategoryListType(dataT);
  this.FillCategoryListUnit(dataT);
}

FillCategoryListName(dataT:any){
  const ListLoad = dataT.map((item: { categoryId: any; nameAr: any; }) => {
    const container:any = {}; container.id = item.categoryId; container.name = item.nameAr; return container;
  })
  const key = 'id';
  const arrayUniqueByKey = [...new Map(ListLoad.map((item: { [x: string]: any; }) => [item[key], item])).values()];
  this.dataSearch.filter.ListName=arrayUniqueByKey;
}
FillCategoryListCode(dataT:any){
  const ListLoad = dataT.map((item: { categoryId: any; code: any; }) => {
    const container:any = {}; container.id = item.categoryId; container.name = item.code; return container;
  })
  const key = 'id';
  const arrayUniqueByKey = [...new Map(ListLoad.map((item: { [x: string]: any; }) => [item[key], item])).values()];
  this.dataSearch.filter.ListCode=arrayUniqueByKey;
}
FillCategoryListType(dataT:any){
  const ListLoad = dataT.map((item: { categoryTypeId: any; categoryTypeName: any; }) => {
    const container:any = {}; container.id = item.categoryTypeId; container.name = item.categoryTypeName; return container;
  })
  const key = 'id';
  const arrayUniqueByKey = [...new Map(ListLoad.map((item: { [x: string]: any; }) => [item[key], item])).values()];
  this.dataSearch.filter.ListCategoryType=arrayUniqueByKey;
  this.dataSearch.filter.ListCategoryType = this.dataSearch.filter.ListCategoryType.filter((d: { id: any }) => (d.id !=null && d.id!=0));
}
FillCategoryListUnit(dataT:any){
  const ListLoad = dataT.map((item: { unitId: any; unitName: any; }) => {
    const container:any = {}; container.id = item.unitId; container.name = item.unitName; console.log("container",container); return container;   
  })
  const key = 'id';
  const arrayUniqueByKey = [...new Map(ListLoad.map((item: { [x: string]: any; }) => [item[key], item])).values()];
  this.dataSearch.filter.ListUnit=arrayUniqueByKey;
  this.dataSearch.filter.ListUnit = this.dataSearch.filter.ListUnit.filter((d: { id: any }) => (d.id !=null && d.id!=0));
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
  if(this.dataSearch.filter.categoryId!=null && this.dataSearch.filter.categoryId!="")
  {
    this.dataSource.data = this.dataSource.data.filter((d: { categoryId: any }) => d.categoryId == this.dataSearch.filter.categoryId);
  }
  if(this.dataSearch.filter.categoryTypeId!=null && this.dataSearch.filter.categoryTypeId!="")
  {
    this.dataSource.data = this.dataSource.data.filter((d: { categoryTypeId: any }) => d.categoryTypeId == this.dataSearch.filter.categoryTypeId);
  } 
  if(this.dataSearch.filter.unitId!=null && this.dataSearch.filter.unitId!="")
  {
    this.dataSource.data = this.dataSource.data.filter((d: { unitId: any }) => d.unitId == this.dataSearch.filter.unitId);
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


AddDataType: any = {
  CategoryTypedata: {
    id: 0,
    code:null,
    namear: null,
    nameen: null,
    status: true,
  },
  Unitdata: {
    id: 0,
    code:null,
    namear: null,
    nameen: null,
    status: true,
  },
};

  //-----------------------------------SaveCategoryType-------------------------------
  //#region 

  GenerateCategoryTypeNumber(){
    this.service.GenerateCategoryTypeNumber().subscribe(data=>{
      this.AddDataType.CategoryTypedata.code=data.reasonPhrase;
    });
  }

  CategoryTypeList: any;
  CategoryTypePopup: any;

  FillCategoryTypeSelect() {
    this.service.FillCategoryTypeSelect().subscribe((data) => {
      console.log(data);
      this.CategoryTypeList= data.filter((d: { status: any }) => (d.status ==true));
      this.CategoryTypePopup = data;
    });
  }

  selectedCategoryType: any;

  CategoryTypeRowSelected: any;
  getCategoryTypeRow(row: any) {
    this.CategoryTypeRowSelected = row;
  }
  setCategoryTypeInSelect(data: any, modal: any) {
    this.modalDetails.categoryTypeId=data.id;
  }
  confirmCategoryTypeDelete() {
    this.service.DeleteCategoryType(this.CategoryTypeRowSelected.id).subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
          this.FillCategoryTypeSelect();
        } else {
          this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
        }
      });
  }

  saveCategoryType() {
    if (
      this.AddDataType.CategoryTypedata.namear == null ||
      this.AddDataType.CategoryTypedata.nameen == null
    ) {
      this.toast.error('من فضلك أكمل البيانات', 'رسالة');
      return;
    }
    var CategoryTypeObj: any = {};
    CategoryTypeObj.CategoryTypeId = this.AddDataType.CategoryTypedata.id;
    CategoryTypeObj.Code = this.AddDataType.CategoryTypedata.code;
    CategoryTypeObj.NameAr = this.AddDataType.CategoryTypedata.namear;
    CategoryTypeObj.NameEn = this.AddDataType.CategoryTypedata.nameen;
    CategoryTypeObj.Status = this.AddDataType.CategoryTypedata.status;

    var obj = CategoryTypeObj;
    this.service.SaveCategoryType(obj).subscribe((result: any) => {
      if (result.statusCode == 200) {
        this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
        this.resetCategoryType();
        this.FillCategoryTypeSelect();
      } else {
        this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
      }
    });
  }
  resetCategoryType() {
    this.AddDataType.CategoryTypedata.id = 0;
    this.AddDataType.CategoryTypedata.code = null;
    this.AddDataType.CategoryTypedata.namear = null;
    this.AddDataType.CategoryTypedata.nameen = null;
    this.AddDataType.CategoryTypedata.status = true;
    this.GenerateCategoryTypeNumber();
  }
  //#endregion
  //----------------------------------EndSaveCategoryType-----------------------------


//-----------------------------------SaveUnit-------------------------------
//#region 

GenerateUnitNumber(){
  this.service.GenerateUnitNumber().subscribe(data=>{
    this.AddDataType.Unitdata.code=data.reasonPhrase;
  });
}

UnitList: any;
UnitPopup: any;

FillUnitSelect() {
  this.service.FillUnitSelect().subscribe((data) => {
    console.log(data);
    this.UnitList= data.filter((d: { status: any }) => (d.status ==true));
    this.UnitPopup = data;
  });
}

selectedUnit: any;

UnitRowSelected: any;
getUnitRow(row: any) {
  this.UnitRowSelected = row;
}
setUnitInSelect(data: any, modal: any) {
  this.modalDetails.unitId=data.id;
}
confirmUnitDelete() {
  this.service.DeleteUnit(this.UnitRowSelected.id).subscribe((result: any) => {
      if (result.statusCode == 200) {
        this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
        this.FillUnitSelect();
      } else {
        this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
      }
    });
}

saveUnit() {
  if (
    this.AddDataType.Unitdata.namear == null ||
    this.AddDataType.Unitdata.nameen == null
  ) {
    this.toast.error('من فضلك أكمل البيانات', 'رسالة');
    return;
  }
  var UnitObj: any = {};
  UnitObj.UnitId = this.AddDataType.Unitdata.id;
  UnitObj.Code = this.AddDataType.Unitdata.code;
  UnitObj.NameAr = this.AddDataType.Unitdata.namear;
  UnitObj.NameEn = this.AddDataType.Unitdata.nameen;
  UnitObj.Status = this.AddDataType.Unitdata.status;

  var obj = UnitObj;
  this.service.SaveUnit(obj).subscribe((result: any) => {
    if (result.statusCode == 200) {
      this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
      this.resetUnit();
      this.FillUnitSelect();
    } else {
      this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
    }
  });
}
resetUnit() {
  this.AddDataType.Unitdata.id = 0;
  this.AddDataType.Unitdata.code = null;
  this.AddDataType.Unitdata.namear = null;
  this.AddDataType.Unitdata.nameen = null;
  this.AddDataType.Unitdata.status = true;
  this.GenerateUnitNumber();
}
//#endregion
//----------------------------------EndSaveUnit-----------------------------

}