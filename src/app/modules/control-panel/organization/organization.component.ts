import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {
  FileUploadControl,
  FileUploadValidators,
} from '@iplab/ngx-file-upload';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { BehaviorSubject, Subscription, forkJoin } from 'rxjs';
import { OrganizationService } from 'src/app/core/services/sys_Services/organization.service';
import { RestApiService } from 'src/app/shared/services/api.service';
import { TreeMode } from 'tree-ngx';
import { Children, Groups } from 'src/app/shared/models/groups';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { event } from 'jquery';
import { SharedService } from 'src/app/core/services/shared.service';
import { TreeviewConfig } from 'ngx-treeview';
import { NgTranscludeDirective } from 'ngx-bootstrap/tabs';
import { formatDate } from '@angular/common';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss'],
  providers: [DatePipe],
})
export class OrganizationComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent | any;

  mainInfoForm: FormGroup;
  BranchInfoForm: FormGroup;
  staffTimeForm: FormGroup;
  vacationForm: FormGroup;
  staffTimeDetailsForm: FormGroup;
  systemoptionsForm: FormGroup;
  ContactBranchesForm: FormGroup;
  SocialDataModalForm: FormGroup;
  NewsModalForm: FormGroup;
  SavesmsSettingForm: FormGroup;
  SaveWhatsAppSettingForm: FormGroup;
  saveEmailSettingForm: FormGroup;
  saveEmailForm: FormGroup;
  submitted = false;
  title: any = {
    main: {
      name: {
        ar: 'لوحة التحكم',
        en: 'Control Panel',
      },
      link: '/controlpanel',
    },
    sub: {
      ar: 'تجهيز بيانات المنشأة',
      en: 'Building Data',
    },
  };

  closeResult: any;

  selectedUser: any;
  users: any;

  isEditable: any = {};

  rows = [

  ];
  temp: any = [
   
  ];

  public readonly uploadedFile: BehaviorSubject<string> = new BehaviorSubject(
    ''
  );
  public readonly uploadedFileOutputImg: BehaviorSubject<string> =
    new BehaviorSubject('');
  public readonly uploadedFileImgNewsModal: BehaviorSubject<string> =
    new BehaviorSubject('');

  public readonly control = new FileUploadControl(
    {
      listVisible: true,
      accept: ['image/*'],
      discardInvalid: true,
      multiple: false,
    },
    [
      // FileUploadValidators.accept(['image/*']),
      FileUploadValidators.filesLimit(1),
    ]
  );
  public readonly controlImgUrlfile = new FileUploadControl(
    {
      listVisible: true,
      // accept: ['image/*'],
      discardInvalid: true,
      multiple: false,
    },
    [
      // FileUploadValidators.accept(['image/*']),
      FileUploadValidators.filesLimit(1),
    ]
  );

  private subscription?: Subscription;

  displayedColumns: string[] = [
    'code',
    'nameAr',
    'nameEn',
    'operations',
  ];

  newsDisplayedColumns: string[] = ['nameAr', 'nameEn', 'operations'];

  dataSource: MatTableDataSource<any>;

  newsDataSource: MatTableDataSource<any>;

  news: any = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild('optToggleActivationModal') optToggleActivationModal: any;

  branches: any;
  options = {
    mode: TreeMode.MultiSelect,
    checkboxes: true,
    alwaysEmitSelected: false,
  };
  today = new Date();
  userG: any = {};

  environmenturl: any;
  lang: any = 'ar';
  useradmin: any;
  constructor(
    private modalService: NgbModal,
    private api: RestApiService,
    private toast: ToastrService,
    private translate: TranslateService,
    private router: Router,
    private datePipe: DatePipe,
    private organizationService: OrganizationService,
    private _sharedService: SharedService,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService
  ) {
    this.dataSource = new MatTableDataSource([{}]);
    this.newsDataSource = new MatTableDataSource([{}]);

    this.environmenturl = environment.PhotoURL;
    this.subscription = this.control.valueChanges.subscribe(
      (values: Array<File>) => {
        this.getImage(values[0]);
      }
    );
    this.subscription = this.controlImgUrlfile.valueChanges.subscribe(
      (values: Array<File>) => {
        this.controlImgUrlfilegetImage(values[0]);
      }
    );
    api.lang.subscribe((res) => {
      this.lang = res;
    });
    this.userG = this.authenticationService.userGlobalObj;
    this.useradmin = this.userG.userName;
  }
  CityList: any = [];

  FillCitySelect() {
    this.organizationService.FillCitySelect().subscribe((data) => {
      this.CityList = data;
    });
  }

  GetOrganizationData(){
    this.organizationService.GetBranchOrganization().subscribe((response) => {
      debugger
      response.result.logoUrl =
        response.result.logoUrl == '' ? null : response.result.logoUrl;
      response.result.oRGlogoUrl =
        response.result.logoUrl == '' ? null : response.result.logoUrl;

      this.mainInfoForm.setValue(response.result);
    });
  }


  ngOnInit(): void {

    this.intialModel();
    this.intialModelBranchInfoForm();
    this.GetOrganizationData();
    this.FillCitySelect();
    this.GetAllBranches();
    this.FillAllAccountsSelectAll();
    this.branches = [
    ];

    this.dataSource = new MatTableDataSource(this.branches);
    this.news = [];
    this.newsDataSource = new MatTableDataSource(this.news);
  }
  isValidDate(date: any): boolean {
    return date instanceof Date && !isNaN(date.getTime());
  }
  branchname: any;
  editeBransh: boolean = false;
  cityiddelete:any;
  open(content: any, data?: any, type?: any, info?: any) {
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        size: type ? 'xl' : 'lg',
        centered: true,
      })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );

    if (data && type == 'editBranch') {
      this.setBranchData(data);
      this.editeBransh = true;
      this.branchname = data?.branchName;
    }

    if (data && type == 'citydeleted') {
      this.cityiddelete = data.cityId;
    }
  }

  private getDismissReason(reason: any, type?: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  updateFilter(event: any) {
    const val = event.target.value.toLowerCase();

    const temp = this.temp.filter(function (d: any) {
      return d.name_ar.toLowerCase().indexOf(val) !== -1 || !val;
    });

    this.rows = temp;

    if (this.table) {
      this.table!.offset = 0;
    }
  }

  // Save row
  save(row: any, rowIndex: any) {
    this.isEditable[rowIndex] = !this.isEditable[rowIndex];
    console.log('Row saved: ' + rowIndex);
    console.log(row);
  }

  // Delete row
  delete(row: any, rowIndex: any) {
    this.isEditable[rowIndex] = !this.isEditable[rowIndex];
    this.rows.splice(rowIndex, 1);
    console.log('Row deleted: ' + rowIndex);
  }

  imageFileOutput: any = null;
  private getImage(file: File): void {
    if (FileReader && file) {
      const fr = new FileReader();
      fr.onload = (e: any) => {
        this.mainInfoForm.controls['logoUrl'].setValue(null);
        this.uploadedFile.next(e.target.result);
      };
      this.imageFileOutput = file;
      fr.readAsDataURL(file);

      this.imageFileOutputreq = false;
    } else {
      this.imageFileOutput = null;
      this.uploadedFile.next('');
      this.imageFileOutputreq = false;
    }
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  intialModel() {
    this.mainInfoForm = this.formBuilder.group({
      // uploadedFile: [null, []],
      organizationId: [0, [Validators.required]],
      nameAr: [null, [Validators.required]],
      nameEn: [null, [Validators.required]],
      code: [null, []],
      previewPath: [null, []],
      mobile: [null, [Validators.required]],
      fax: [null, [Validators.required]],
      cityId: [null, [Validators.required]],
      taxCode: [null,[Validators.required,Validators.minLength(15),Validators.maxLength(15),],],
      email: [null, [Validators.required]],
      address: [null, []],
      webSite: [null, []],
      oRGlogoUrl: [null, []],
      logoUrl: [null, []],
    });
  }
  get f() {
    return this.mainInfoForm.controls;
  }

  imageFileOutputreq: boolean = false;
  saveMainInfo() {
    debugger
    // let text = this.mainInfoForm.controls['taxCode'].value;
    // let firstChar = text.charAt(0);
    // let lastChar = text.charAt(text.length - 1);
    // if (firstChar != '3' && lastChar != '3') {
    //   this.toast.error(
    //     this.translate.instant('يجب ان يبدأ الرقم الضريبي برقم 3 وينتهي برقم 3')
    //   );
    //   return;
    // }
    // if (this.mainInfoForm.controls['taxCode'].value.length != 15) {
    //   this.toast.error(
    //     this.translate.instant('يجب ان يكون الرقم الضريبي 15 رقم')
    //   );
    //   return;
    // }

    const formData = new FormData();
    if (
      this.mainInfoForm.controls['logoUrl'].value == null &&
      this.imageFileOutput != null
    ) {
      formData.append('UploadedFile', this.imageFileOutput);
    }


    formData.append('OrganizationId',this.mainInfoForm.controls['organizationId'].value ?? 0);
    formData.append('NameAr', this.mainInfoForm.controls['nameAr'].value);
    formData.append('NameEn', this.mainInfoForm.controls['nameEn'].value);
    formData.append('Mobile', this.mainInfoForm.controls['mobile'].value);
    formData.append('Fax', this.mainInfoForm.controls['fax'].value);
    formData.append('CityId', this.mainInfoForm.controls['cityId'].value ?? 0);
    formData.append('Email', this.mainInfoForm.controls['email'].value);
    formData.append('Address', this.mainInfoForm.controls['address'].value);
    formData.append('WebSite', this.mainInfoForm.controls['webSite'].value);
    formData.append('TaxCode', this.mainInfoForm.controls['taxCode'].value);

    this.organizationService.SaveOrganizations(formData).subscribe(
      (result) => {
        if (result.statusCode == 200) {
          this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant('Message') );
        } else {
          this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant('Message') );
        }
      }
    );
    // }
  }
  MaintenanceFunc(id: any) {
    this.organizationService.MaintenanceFunc(id).subscribe(
      (result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
        } else {
          this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant('Message')
          );
        }
      }
    );
  }

  GetAllBranches() {
    this.organizationService.GetAllBranches().subscribe((response: any) => {
      this.dataSource = new MatTableDataSource(response.result);
    });
  }


  goDash() {
    this.router.navigate(['/dash/home']);
  }


  otp = this.formBuilder.control('');

  openModal(Value: any) {
    if (Value) {
      this.modalService.open(this.optToggleActivationModal);
    }
  }

  confiremOtp() {
    console.log(this.otp?.value);
  }

  addBranch(Data: any) {}

  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  PasswordBefore:any=null;
  PasswordAfter:any=null;
  EncryptPassword(){
    if(!(this.PasswordBefore=="" || this.PasswordBefore==null))
    {
      this.organizationService.EncryptPassword(this.PasswordBefore).subscribe((result: any) => {
        debugger
        this.PasswordAfter = result.reasonPhrase;
      });
    }
  }



  //---------------------branch----------------------------------

  branchesAcc: any;
  setBranchData(item: any) {
    this.controlImgUrlfile.clear();
    this.BranchInfoForm.controls['BranchId'].setValue(item?.branchId);
    this.BranchInfoForm.controls['NameAr'].setValue(item?.nameAr);
    this.BranchInfoForm.controls['NameEn'].setValue(item?.nameEn);
    this.BranchInfoForm.controls['BranchNamePrint'].setValue(item?.branchNamePrint);
    this.BranchInfoForm.controls['BoxAccId'].setValue(item?.boxAccId);
    this.BranchInfoForm.controls['SalesAccId'].setValue(item?.salesAccId);
    this.BranchInfoForm.controls['DiscountAccId'].setValue(item?.discountAccId);
    this.BranchInfoForm.controls['CustomersAccId'].setValue(item?.customersAccId);
    this.BranchInfoForm.controls['EmployeesAccId'].setValue(item?.employeesAccId);
    this.BranchInfoForm.controls['CustomerPhone'].setValue(item?.customerPhone);
    this.BranchInfoForm.controls['CustomerPhone2'].setValue(item?.customerPhone2);
    this.BranchInfoForm.controls['ComplaintsNumber'].setValue(item?.complaintsNumber);

    if(item.logoUrl == '' || item.logoUrl == null)
    {
      this.BranchInfoForm.controls['uploadedFile'].setValue(null)
    }
    else
    {
      this.BranchInfoForm.controls['uploadedFile'].setValue(item?.logoUrl);
    }
  }

  FillAllAccountsSelectAll() {
    this.organizationService.FillAllAccountsSelectAll().subscribe((data) => {
      this.branchesAcc = data;
    });
  }
  intialModelBranchInfoForm() {
    this.BranchInfoForm = this.formBuilder.group({
      BranchId: [null, []],
      NameAr: [null, [Validators.required]],
      NameEn: [null, [Validators.required]],
      BranchNamePrint: [null, [Validators.required]],
      BoxAccId: [null, [Validators.required]],
      SalesAccId: [null, [Validators.required]],
      DiscountAccId: [null, [Validators.required]],
      CustomersAccId: [null, [Validators.required]],
      EmployeesAccId: [null, [Validators.required]],
      CustomerPhone: [null, []],
      CustomerPhone2: [null, []],
      ComplaintsNumber: [null, []],
      uploadedFile: [null, []],
    });
  }
  imageFileOutputImgUrlfile: any = null;
  private controlImgUrlfilegetImage(file: File): void {
    if (FileReader && file) {
      const fr = new FileReader();
      fr.onload = (e: any) => {
        this.BranchInfoForm.controls['uploadedFile'].setValue(null);
        this.uploadedFileOutputImg.next(e.target.result);
      };
      this.imageFileOutputImgUrlfile = file;
      fr.readAsDataURL(file);
    } else {
      this.uploadedFileOutputImg.next('');
      this.imageFileOutputImgUrlfile = null;
    }
  }
  saveBranchInfoForm(modal: any) {

    const formData = new FormData();
    if (
      this.BranchInfoForm.controls['uploadedFile'].value == null && this.imageFileOutputImgUrlfile != null) {
      formData.append('UploadedFile', this.imageFileOutputImgUrlfile);
    }
    formData.append('BranchId', this.BranchInfoForm.controls['BranchId'].value);
    formData.append('NameAr', this.BranchInfoForm.controls['NameAr'].value);
    formData.append('NameEn', this.BranchInfoForm.controls['NameEn'].value);
    formData.append('BranchNamePrint', this.BranchInfoForm.controls['BranchNamePrint'].value);
    formData.append('BoxAccId', this.BranchInfoForm.controls['BoxAccId'].value);
    formData.append('SalesAccId', this.BranchInfoForm.controls['SalesAccId'].value);
    formData.append('DiscountAccId', this.BranchInfoForm.controls['DiscountAccId'].value);
    formData.append('CustomersAccId', this.BranchInfoForm.controls['CustomersAccId'].value);
    formData.append('EmployeesAccId', this.BranchInfoForm.controls['EmployeesAccId'].value);
    formData.append('CustomerPhone', this.BranchInfoForm.controls['CustomerPhone'].value);
    formData.append('CustomerPhone2', this.BranchInfoForm.controls['CustomerPhone2'].value);
    formData.append('ComplaintsNumber', this.BranchInfoForm.controls['ComplaintsNumber'].value);

    this.organizationService.SaveBranchPart(formData).subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
          modal.dismiss();
          this.GetAllBranches();
        } else {
          this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
        }
      }
    );
  }
  //-------------------end branch--------------------------------

}
