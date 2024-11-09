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
  branchesAccForm: FormGroup;
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
  public readonly uploadedFileImgUrlfileheader: BehaviorSubject<string> =
    new BehaviorSubject('');
  public readonly uploadedFileImgUrlfilefooter: BehaviorSubject<string> =
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
  public readonly controlImgUrlfileheader = new FileUploadControl(
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
  public readonly controlImgUrlfilefooter = new FileUploadControl(
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

  public readonly controlNewsModaImage = new FileUploadControl(
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
    'Name',
    'CommercialRegister',
    'CommerialRegistration',
    'city/region',
    'coins',
    'operations',
  ];
  staffTimeDisplayedColumns: string[] = [
    'NameAr',
    'NameEn',
    'notes',
    'operations',
  ];
  vacationDisplayedColumns: string[] = ['name', 'from', 'to', 'operations'];

  shifftsDisplayedColumns: string[] = [
    'day',
    'from',
    'to',
    'secondFrom',
    'secondTo',
    'operations',
  ];

  contentDisplayedColumns: string[] = [
    'name',
    'address',
    'mobile',
    'customerService',
    'email',
    'operations',
  ];

  newsDisplayedColumns: string[] = ['nameAr', 'nameEn', 'operations'];

  dataSource: MatTableDataSource<any>;

  staffTimeDataSource: MatTableDataSource<any>;

  vacationsDataSource: MatTableDataSource<any>;
  shifftsDataSource: MatTableDataSource<any>;
  contentDataSource: MatTableDataSource<any>;
  newsDataSource: MatTableDataSource<any>;

  staffTimes: any = [];

  staffts: any = [];

  vacations: any = [];

  contents: any = [];

  news: any = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild('optToggleActivationModal') optToggleActivationModal: any;

  branches: any;
  nodeItems: any = [];
  selectedTaskss1: any;
  selectedTask2: any;
  selectedTask3: any;
  selectedTask4: any;
  options = {
    mode: TreeMode.MultiSelect,
    checkboxes: true,
    alwaysEmitSelected: false,
  };
  today = new Date();
  userG: any = {};

  nationalitysourceselected: any = [];
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
    this.staffTimeDataSource = new MatTableDataSource([{}]);
    this.vacationsDataSource = new MatTableDataSource([{}]);
    this.shifftsDataSource = new MatTableDataSource([{}]);
    this.contentDataSource = new MatTableDataSource([{}]);
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
    this.subscription = this.controlImgUrlfileheader.valueChanges.subscribe(
      (values: Array<File>) => {
        this.controlImgUrlfileeheadergetImage(values[0]);
      }
    );
    this.subscription = this.controlImgUrlfilefooter.valueChanges.subscribe(
      (values: Array<File>) => {
        this.controlImgUrlfilefootergetImage(values[0]);
      }
    );
    this.subscription = this.controlNewsModaImage.valueChanges.subscribe(
      (values: Array<File>) => {
        this.NewsModaImage(values[0]);
      }
    );

    this.userG = this.authenticationService.userGlobalObj;

    api.lang.subscribe((res) => {
      this.lang = res;
    });
    this.userG = this.authenticationService.userGlobalObj;
    console.log('user data', this.userG);

    this.useradmin = this.userG.userName;
  }
  citylist:any;
  getAllCities() {
    this.organizationService.GetAllCities().subscribe((data) => {
      this.citylist = data.result;
    });
  }
  FillCitySelect() {
    this.organizationService.FillCitySelect().subscribe((data) => {
      this.nationalitysourceselected = data;
    });
  }
  bankselect: any;

  FillBankSelect() {
    this.organizationService.FillBankSelect().subscribe((data) => {
      this.bankselect = data;
    });
  }
  MessageServiceProvidersList: any;
  WhatsAppServiceProvidersList: any;

  ngOnInit(): void {
    this.organizationService.GetBranchOrganization().subscribe((response) => {
      response.result.isFooter == '1'
        ? (response.result.isFooter = true)
        : (response.result.isFooter = false);
      response.result.as = null;
      response.result.NationalId = null;
      response.result.logoUrl =
        response.result.logoUrl == '' ? null : response.result.logoUrl;
      response.result.oRGlogoUrl =
        response.result.logoUrl == '' ? null : response.result.logoUrl;
      response.result.OrgDataIsRequired = null;
      // response.result.engineering_LicenseDate = response.result.engineering_LicenseDate == (''||null) ?
      // null :response.result.engineering_LicenseDate

      response.result.engineering_LicenseDate = new Date(
        response.result.engineering_LicenseDate
      );
      if (this.isValidDate(response.result.engineering_LicenseDate)) {
        response.result.engineering_LicenseDate =
          response.result.engineering_LicenseDate;
      } else {
        response.result.engineering_LicenseDate = null;
      }
      response.result.representorEmpId =
        response.result.representorEmpId == null
          ? 0
          : response.result.representorEmpId;
      response.result.accountBank == 'null'
        ? (response.result.accountBank = null)
        : (response.result.accountBank = response.result.accountBank);
      response.result.bankId == 0
        ? (response.result.bankId = null)
        : (response.result.bankId = response.result.bankId);

      response.result.accountBank2 == 'null'
        ? (response.result.accountBank2 = null)
        : (response.result.accountBank2 = response.result.accountBank2);
      if (!(response.result.logoUrl == "" || response.result.logoUrl == null)) {
        this.imageFileOutputreq = false;
      }
      response.result.bankId2 == 0
        ? (response.result.bankId2 = null)
        : (response.result.bankId2 = response.result.bankId2);
      this.saveEmailForm.controls['email'].setValue(response.result?.email);
      this.saveEmailForm.controls['password'].setValue(
        response.result?.password
      );
      this.saveEmailForm.controls['senderName'].setValue(
        response.result?.senderName
      );
      this.saveEmailForm.controls['host'].setValue(response.result?.host);
      this.saveEmailForm.controls['port'].setValue(response.result?.port);
      this.saveEmailForm.controls['ssl'].setValue(response.result?.ssl);
      this.saveEmailForm.controls['sendCustomerMail'].setValue(
        response.result?.sendCustomerMail
      );

      this.mainInfoForm.setValue(response.result);

    });
    this.GetLaw_Regulations();
    this.GetLaw_Regulations();

    this.intialModelBranchOrganization();
    this.intialModel();
    this.intialModelbranchesAccForm();
    this.intialModelstaffTimeForm();
    this.intialModelvacationForm();
    this.intialModelstaffTimeDetailsForm();
    this.intialModelsystemoptionsFormForm();
    this.intialModelSavesmsSetting();
    this.intialModelSaveWhatsAppSetting();
    this.intialModelsaveEmailSetting();
    this.intialmainInfoFormEmail();
    this.intialModelContactBranchesFormForm();
    this.intialaddSocialDataModalForm();
    this.intialNewsModalForm();
    this.FillBankSelect();
    this.FillCitySelect();
    this.getAllCities();
    this.GetAllSocialMediaLinks();
    this.GetAllStaffTime();
    this.GetSystemSettingsByUserId();
    this.GetAllBranches();
    this.GetALLOrgData();
    this.GetAllContactBranches();
    this.ChangeSSL({ checked: true });
    this.ChangeSSLEmailSetting({ checked: true });

    this.ChangesmsSetting({ checked: true });
    this.ChangeWhatsAppSetting({ checked: true });

    this.MessageServiceProvidersList = [

    ];
    this.WhatsAppServiceProvidersList = [

    ];
    this.users = [
    ];

    this.branches = [
      //   {
      //     Name: 'awdawd',
      //     CommercialRegister: 46486468,
      //     CommerialRegistration: 46486468,
      //     location: 'awdawdwd',
      //     coins: 'awdawd',
      //   },
      //   {
      //     Name: 'awdawd',
      //     CommercialRegister: 46486468,
      //     CommerialRegistration: 46486468,
      //     location: 'awdawdwd',
      //     coins: 'awdawd',
      //   },
      //   {
      //     Name: 'awdawd',
      //     CommercialRegister: 46486468,
      //     CommerialRegistration: 46486468,
      //     location: 'awdawdwd',
      //     coins: 'awdawd',
      //   },
    ];

    this.dataSource = new MatTableDataSource(this.branches);
    this.getData();

    this.staffTimes = [

    ];
    this.staffTimeDataSource = new MatTableDataSource(this.staffTimes);

    this.vacations = [

    ];
    this.vacationsDataSource = new MatTableDataSource(this.vacations);

    this.staffts = [
      {
        day: 'adwawd',
        from: new Date(),
        to: new Date(),
        secondFrom: new Date(),
        secondTo: new Date(),
      },
      {
        day: 'adwawd',
        from: new Date(),
        to: new Date(),
        secondFrom: new Date(),
        secondTo: new Date(),
      },
      {
        day: 'adwawd',
        from: new Date(),
        to: new Date(),
        secondFrom: new Date(),
        secondTo: new Date(),
      },
      {
        day: 'adwawd',
        from: new Date(),
        to: new Date(),
        secondFrom: new Date(),
        secondTo: new Date(),
      },
    ];
    this.shifftsDataSource = new MatTableDataSource(this.staffts);

    this.contents = [
      {
        name: 'adawdawd',
        address: 'adawdawd',
        mobile: 'adawdawd',
        customerService: 'adawdawd',
        email: 'adawdawd',
      },
      {
        name: 'adawdawd',
        address: 'adawdawd',
        mobile: 'adawdawd',
        customerService: 'adawdawd',
        email: 'adawdawd',
      },
      {
        name: 'adawdawd',
        address: 'adawdawd',
        mobile: 'adawdawd',
        customerService: 'adawdawd',
        email: 'adawdawd',
      },
    ];
    this.contentDataSource = new MatTableDataSource(this.contents);

    this.news = [
      { nameAr: 'asdadwd', nameEn: 'asdadwd' },
      { nameAr: 'asdadwd', nameEn: 'asdadwd' },
      { nameAr: 'asdadwd', nameEn: 'asdadwd' },
      { nameAr: 'asdadwd', nameEn: 'asdadwd' },
      { nameAr: 'asdadwd', nameEn: 'asdadwd' },
    ];
    this.newsDataSource = new MatTableDataSource(this.news);
  }
  isValidDate(date: any): boolean {
    return date instanceof Date && !isNaN(date.getTime());
  }
  getData() {
    this.api.get('../../../../../../assets/cpanel.json').subscribe({
      next: (data: any) => {
        this.nodeItems = data.tree;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  branchname: any;
  editeBransh: boolean = false;
  cityiddelete:any;
  open(content: any, data?: any, type?: any, info?: any) {
    this.confirmepassword = null;
    this.confirmepasswordSetting = null;
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

    if (data && type == 'citydeleted') {
      this.cityiddelete = data.cityId;
    }
    if (data && type == 'editBranch') {
      this.editBranch(data);
      this.editeBransh = true;
      this.branchname = data?.branchName;
    }
    if (data && type == 'deleteBranch') {
      this.Branchiddelete = data.branchId;
    }
    if (type == 'addBranchModal') {
      this.editeBransh = false;
      this.GenerateNextBranchNumber();
      this.FillBankSelect();
      this.FillCitySelect();
      this.getAllCities();
    }
    if (type == 'branchesAccountsModal') {
      this.branchesAccounts(data);
    }
    if (type == 'incomeAccountsModal') {
      this.branchname = data?.branchName;
      this.GetAccountTree(data);
    }
    if (type == 'addvacationModal') {
      this.intialModelvacationForm();
    }

    if (type == 'editvacationModal') {
      this.Getvacation(data);
    }
    if (type == 'deletevacationModal') {
      this.vacationiddelete = data.id;
    }
    if (type == 'editstaffTimeModal') {
      this.GetstaffTime(data);
    }
    if (type == 'deletestaffTimeModal') {
      this.staffTimeIddelete = data.timeId;
    }
    if (type == 'detailsstaffTime') {
      this.resetTimeseft();
      this.GetstaffTimedetails(data.timeId);
    }
    if (type == 'deletestaffTimeDetails') {
      this.DetailsstaffTimeIddelete = data.timeDetailsId;
      this.attTimeId = data.attTimeId;
    }
    if (type == 'addstaffTimeModal') {
      this.intialModelstaffTimeForm();
    }
    if (type == 'addOfficialVacationsModal') {
      this.intialModelvacationForm();
      this.GetAllOfficalHoliday();
    }
    if (data && type == 'EditBranchDataModal') {
      this.addBranchDataModal(data);
    }
    if (type == 'deleteBranchDataModal') {
      this.deleteBranchDataModal = data.contactId;
    }
    if (type == 'addBranchDataModal') {
      this.intialModelContactBranchesFormForm();
      this.BranchPhoneError = false;
      this.BranchCSError = false;
    }
    if (type == 'addSocialDataModal') {
      if (this.SocialDataModalForm.controls['LinksId'].value == '0') {
        this.intialaddSocialDataModalForm();
      } else {
        this.GetAllSocialMediaLinks();
      }
    }
    if (type == 'emailSettingModal') {
      // this.mainInfoForm.controls["OrgDataIsRequired"].setValue(null)
    }
    if (type == 'addNews') {
      this.intialNewsModalForm();
      this.NewsBodyArError = false;
      this.NewsBodyEnError = false;
      this.NewsTitleArError = false;
      this.NewsTitleEnError = false;
      this.uploadedFileImgNewsModal.next('');
      this.controlNewsModaImage.clear();
      this.GetAllNews();
    }
    if (type == 'deleteNewsModal') {
      this.deleteNewsModalId = data.newsId;
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
  imageFileOutputImgUrlfileheader: any = null;
  private controlImgUrlfileeheadergetImage(file: File): void {
    if (FileReader && file) {
      const fr = new FileReader();
      fr.onload = (e: any) => {
        this.BranchInfoForm.controls['uploadedFileheader'].setValue(null);
        this.uploadedFileImgUrlfileheader.next(e.target.result);
      };
      fr.readAsDataURL(file);
      this.imageFileOutputImgUrlfileheader = file;
    } else {
      this.imageFileOutputImgUrlfileheader = null;
      this.uploadedFileImgUrlfileheader.next('');
    }
  }
  imageFileOutputImgUrlfilefooter: any = null;
  private controlImgUrlfilefootergetImage(file: File): void {
    if (FileReader && file) {
      const fr = new FileReader();
      fr.onload = (e: any) => {
        this.BranchInfoForm.controls['uploadedFilefooter'].setValue(null);
        this.uploadedFileImgUrlfilefooter.next(e.target.result);
      };
      this.imageFileOutputImgUrlfilefooter = file;
      fr.readAsDataURL(file);
    } else {
      this.imageFileOutputImgUrlfilefooter = null;
      this.uploadedFileImgUrlfilefooter.next('');
    }
  }

  NewsModalimageFileOutput: any = null;
  private NewsModaImage(file: File): void {
    if (FileReader && file) {
      const fr = new FileReader();
      fr.onload = (e: any) => {
        this.NewsModalForm.controls['UploadedImage'].setValue(null);
        this.uploadedFileImgNewsModal.next(e.target.result);
      };
      this.NewsModalimageFileOutput = file;
      fr.readAsDataURL(file);
    } else {
      this.NewsModalimageFileOutput = null;
      this.uploadedFileImgNewsModal.next('');
    }
  }
  // imagePath: any

  // fileChangeEvent(fileInput: any) {
  //   if (fileInput.target.files && fileInput.target.files[0]) {
  //     const reader = new FileReader();
  //     reader.onload = (e: any) => {
  //       this.imagePath = e.target.result;
  //     };
  //     reader.readAsDataURL(fileInput.target.files[0]);
  //     this.imageFileOutput = fileInput.target.files[0];
  //   }
  // }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  applyFilterStaffTime(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.staffTimeDataSource.filter = filterValue.trim().toLowerCase();
  }
  applyFilterShiffts(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.shifftsDataSource.filter = filterValue.trim().toLowerCase();
  }
  applyContentFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.contentDataSource.filter = filterValue.trim().toLowerCase();
  }

  intialModel() {
    this.mainInfoForm = this.formBuilder.group({
      // uploadedFile: [null, []],
      organizationId: [0, [Validators.required]],
      nameAr: [null, [Validators.required]],
      nameEn: [null, [Validators.required]],
      mobile: [null, [Validators.required]],
      fax: [null, [Validators.required]],
      postalCode: [null, [Validators.required]],
      country: [null, [Validators.required]],
      cityId: [null, [Validators.required]],
      cityName: [null, []],
      neighborhood: [null, [Validators.required]],
      streetName: [null, [Validators.required]],
      buildingNumber: [null, [Validators.required]],
      externalPhone: [null, [Validators.required]],
      taxCode: [
        null,
        [
          Validators.required,
          Validators.minLength(15),
          Validators.maxLength(15),
        ],
      ],
      postalCodeFinal: [null, [Validators.required]],
      email: [null, [Validators.required]],
      address: [null, []],
      webSite: [null, []],
      bankId: [null, [Validators.required]],
      accountBank: [null, [Validators.required]],

      representorEmpId: [0, []],

      bankId2: [null, []],
      accountBank2: [null, []],
      engineering_License: [null, []],
      engineering_LicenseDate: [null, []],
      isFooter: [null, []],

      password: [null, []],
      port: [null, []],
      host: [null, []],
      ssl: [false, []],

      oRGlogoUrl: [null, []],
      supportMessageAr: [null, []],
      supportMessageEn: [null, []],
      apiBaseUri: [null, []],
      tameerAPIURL: [null, []],
      comDomainAddress: [null, []],
      comDomainLink: [null, []],
      logoUrl: [null, []],
      notificationsMail: [null, []],
      lastversionIOS: [null, []],
      lastvesionAndroid: [null, []],
      messageUpdateAr: [null, []],
      messageUpdateEn: [null, []],

      reportType: [null, []],
      orgName: [null, []],
      bankId2ImgURL: [null, []],
      bankIdImgURL: [null, []],
      csr: [null, []],
      editUserDate: [null, []],
      editUserName: [null, []],
      privateKey: [null, []],
      publicKey: [null, []],
      secreteKey: [null, []],
      senderName: [null, []],
      serverName: [null, []],
      vat: [null, []],
      vatSetting: [null, []],
      as: [null, []],
      NationalId: [null, []],
      OrgDataIsRequired: [false, []],
    });
  }
  get f() {
    return this.mainInfoForm.controls;
  }
  Changeorgisreq(event: any) {
    const prames = {
      isreq: event.checked,
    };
    this.organizationService
      .UpdateOrgdaterequire(prames)
      .subscribe((result) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }

  confirmepassword: any;
  validate_password(event: any) {
    if (this.saveEmailForm.controls['password'].value == event.target.value) {
      this.confirmepassword = true;
    } else {
      this.confirmepassword = false;
    }
  }
  confirmepasswordSetting: any;
  validate_passwordSetting(event: any) {
    if (
      this.saveEmailSettingForm.controls['password'].value == event.target.value
    ) {
      this.confirmepasswordSetting = true;
    } else {
      this.confirmepasswordSetting = false;
    }
  }

  imageFileOutputreq: boolean = false;
  saveMainInfo() {
    let text = this.mainInfoForm.controls['taxCode'].value;
    let firstChar = text.charAt(0);
    let lastChar = text.charAt(text.length - 1);
    if (firstChar != '3' && lastChar != '3') {
      this.toast.error(
        this.translate.instant('يجب ان يبدأ الرقم الضريبي برقم 3 وينتهي برقم 3')
      );
      return;
    }
    if (this.mainInfoForm.controls['taxCode'].value.length != 15) {
      this.toast.error(
        this.translate.instant('يجب ان يكون الرقم الضريبي 15 رقم')
      );
      return;
    }
    // if (this.imageFileOutput == null && this.mainInfoForm.controls['logoUrl'].value == null) {
    //   this.imageFileOutputreq = true
    //   return
    // } else {
    //   this.imageFileOutputreq = false
    // }
    // if (
    //   // this.mainInfoForm.invalid

    //   this.mainInfoForm.controls['organizationId'].value == null ||
    //   this.mainInfoForm.controls['nameAr'].value == null ||
    //   this.mainInfoForm.controls['nameEn'].value == null ||
    //   this.mainInfoForm.controls['mobile'].value == null ||
    //   this.mainInfoForm.controls['fax'].value == null ||
    //   this.mainInfoForm.controls['postalCode'].value == null ||
    //   this.mainInfoForm.controls['country'].value == null ||
    //   this.mainInfoForm.controls['cityId'].value == null ||
    //   this.mainInfoForm.controls['neighborhood'].value == null ||
    //   this.mainInfoForm.controls['streetName'].value == null ||
    //   this.mainInfoForm.controls['buildingNumber'].value == null ||
    //   this.mainInfoForm.controls['externalPhone'].value == null ||
    //   this.mainInfoForm.controls['taxCode'].value == null ||
    //   this.mainInfoForm.controls['postalCodeFinal'].value == null ||
    //   this.mainInfoForm.controls['email'].value == null ||
    //   this.mainInfoForm.controls['bankId'].value == null ||
    //   this.mainInfoForm.controls['accountBank'].value == null
    // ) {
    //   return;
    // } else {
    this.mainInfoForm.controls['isFooter'].value == true
      ? this.mainInfoForm.controls['isFooter'].setValue('1')
      : this.mainInfoForm.controls['isFooter'].setValue('0');

    //   const imgwidth ="50";
    //  const imghight="50"

    if (this.mainInfoForm.controls['bankId2'].value == null) {
      this.mainInfoForm.controls['bankId2'].setValue(0);
    }
    const formData = new FormData();
    if (
      this.mainInfoForm.controls['logoUrl'].value == null &&
      this.imageFileOutput != null
    ) {
      formData.append('UploadedFile', this.imageFileOutput);
    }
    debugger;
    var BankNum = this.mainInfoForm.controls['accountBank'].value ?? 0;
    var BankNum2 = this.mainInfoForm.controls['accountBank2'].value ?? 0;
    var BankId = this.mainInfoForm.controls['bankId'].value ?? 0;
    var BankId2 = this.mainInfoForm.controls['bankId2'].value ?? 0;
    if (BankId2 > 0) {
      if (
        BankNum2 == 0 ||
        BankNum2 == '0' ||
        BankNum2 == null ||
        BankNum2 == 'null' ||
        BankNum2 == 'NULL'
      ) {
        this.toast.error(
          'أكمل بيانات الحساب البنكي 2',
          this.translate.instant('Message')
        );
        return;
      }
    }
    if (
      !(
        BankNum2 == 0 ||
        BankNum2 == '0' ||
        BankNum2 == null ||
        BankNum2 == 'null' ||
        BankNum2 == 'NULL'
      )
    ) {
      if (!(BankId2 > 0)) {
        this.toast.error(
          ' أختر اسم البنك 2 ',
          this.translate.instant('Message')
        );
        return;
      }
    }

    formData.append(
      'OrganizationId',
      this.mainInfoForm.controls['organizationId'].value ?? 0
    );
    formData.append('NameAr', this.mainInfoForm.controls['nameAr'].value);
    formData.append('NameEn', this.mainInfoForm.controls['nameEn'].value);
    formData.append('Mobile', this.mainInfoForm.controls['mobile'].value);
    formData.append('Fax', this.mainInfoForm.controls['fax'].value);
    formData.append('CityId', this.mainInfoForm.controls['cityId'].value ?? 0);
    formData.append('Email', this.mainInfoForm.controls['email'].value);
    formData.append('Password', this.mainInfoForm.controls['password'].value);
    formData.append('Host', this.mainInfoForm.controls['host'].value);
    formData.append('Port', this.mainInfoForm.controls['port'].value);
    formData.append('SSL', this.mainInfoForm.controls['ssl'].value);
    formData.append('Address', this.mainInfoForm.controls['address'].value);
    formData.append(
      'senderName',
      this.mainInfoForm.controls['senderName'].value
    );
    formData.append('WebSite', this.mainInfoForm.controls['webSite'].value);
    formData.append('TaxCode', this.mainInfoForm.controls['taxCode'].value);
    formData.append(
      'NotificationsMail',
      this.mainInfoForm.controls['notificationsMail'].value
    );
    formData.append(
      'AccountBank',
      this.mainInfoForm.controls['accountBank'].value ?? 0
    );
    formData.append(
      'AccountBank2',
      this.mainInfoForm.controls['accountBank2'].value ?? 0
    );
    formData.append(
      'Engineering_License',
      this.mainInfoForm.controls['engineering_License'].value
    );
    if (
      this.mainInfoForm.controls['engineering_LicenseDate'].value != null &&
      typeof this.mainInfoForm.controls['engineering_LicenseDate'].value !=
        'string'
    ) {
      formData.append(
        'Engineering_LicenseDate',
        this._sharedService.date_TO_String(
          this.mainInfoForm.controls['engineering_LicenseDate'].value
        )
      );
    } else {
      formData.append(
        'Engineering_LicenseDate',
        this.mainInfoForm.controls['engineering_LicenseDate'].value ?? null
      );
    }
    formData.append(
      'PostalCode',
      this.mainInfoForm.controls['postalCode'].value ?? 0
    );
    formData.append(
      'RepresentorEmpId',
      this.mainInfoForm.controls['representorEmpId'].value ?? 0
    );
    formData.append('BankId', this.mainInfoForm.controls['bankId'].value);
    formData.append(
      'BankId2',
      this.mainInfoForm.controls['bankId2'].value ?? 0
    );
    // formData.append('IsFooter', this.mainInfoForm.controls['isFooter'].value);
    formData.append('IsFooter', '0');

    formData.append(
      'PostalCodeFinal',
      this.mainInfoForm.controls['postalCodeFinal'].value
    );
    formData.append(
      'ExternalPhone',
      this.mainInfoForm.controls['externalPhone'].value
    );
    formData.append('Country', this.mainInfoForm.controls['country'].value);
    formData.append(
      'Neighborhood',
      this.mainInfoForm.controls['neighborhood'].value
    );
    formData.append(
      'StreetName',
      this.mainInfoForm.controls['streetName'].value
    );
    formData.append(
      'BuildingNumber',
      this.mainInfoForm.controls['buildingNumber'].value
    );

    formData.append(
      'ComDomainLink',
      this.mainInfoForm.controls['comDomainLink'].value
    );
    formData.append(
      'ComDomainAddress',
      this.mainInfoForm.controls['comDomainAddress'].value
    );
    formData.append(
      'ApiBaseUri',
      this.mainInfoForm.controls['apiBaseUri'].value
    );
    formData.append(
      'TameerAPIURL',
      this.mainInfoForm.controls['tameerAPIURL'].value
    );

    formData.append(
      'SupportMessageAr',
      this.mainInfoForm.controls['supportMessageAr'].value
    );
    formData.append(
      'SupportMessageEn',
      this.mainInfoForm.controls['supportMessageEn'].value
    );

    formData.append(
      'LastversionIOS',
      this.mainInfoForm.controls['lastversionIOS'].value
    );
    formData.append(
      'LastvesionAndroid',
      this.mainInfoForm.controls['lastvesionAndroid'].value
    );
    formData.append(
      'MessageUpdateAr',
      this.mainInfoForm.controls['messageUpdateAr'].value
    );
    formData.append(
      'MessageUpdateEn',
      this.mainInfoForm.controls['messageUpdateEn'].value
    );

    this.organizationService.SaveOrganizations(formData).subscribe(
      (result) => {
        if (result.statusCode == 200) {
          if (this.mainInfoForm.controls['bankId2'].value == 0) {
            this.mainInfoForm.controls['bankId2'].setValue(null);
          }
          if (this.mainInfoForm.controls['accountBank2'].value == 'null') {
            this.mainInfoForm.controls['accountBank2'].setValue(null);
          }
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      },
      (error) => {
        this.toast.error(
          this.translate.instant(error.reasonPhrase),
          this.translate.instant('Message')
        );
      }
    );
    // }
  }
  ChangeSSL(event: any) {
    if (event.checked == false) {
      this.saveEmailForm.controls['email'].disable();
      this.saveEmailForm.controls['password'].disable();
      this.saveEmailForm.controls['senderName'].disable();
      this.saveEmailForm.controls['host'].disable();
      this.saveEmailForm.controls['port'].disable();
      this.saveEmailForm.controls['OrgDataIsRequired'].disable();
    } else {
      this.saveEmailForm.controls['email'].enable();
      this.saveEmailForm.controls['password'].enable();
      this.saveEmailForm.controls['senderName'].enable();
      this.saveEmailForm.controls['host'].enable();
      this.saveEmailForm.controls['port'].enable();
      this.saveEmailForm.controls['OrgDataIsRequired'].enable();
    }
  }
  ChangeSSLEmailSetting(event: any) {
    if (event.checked == false) {
      this.saveEmailSettingForm.controls['email'].disable();
      this.saveEmailSettingForm.controls['password'].disable();
      this.saveEmailSettingForm.controls['DisplayName'].disable();
      this.saveEmailSettingForm.controls['host'].disable();
      this.saveEmailSettingForm.controls['senderName'].disable();
      this.saveEmailSettingForm.controls['port'].disable();
      this.saveEmailSettingForm.controls['OrgDataIsRequired'].disable();
    } else {
      this.saveEmailSettingForm.controls['email'].enable();
      this.saveEmailSettingForm.controls['DisplayName'].enable();
      this.saveEmailSettingForm.controls['password'].enable();
      this.saveEmailSettingForm.controls['senderName'].enable();
      this.saveEmailSettingForm.controls['host'].enable();
      this.saveEmailSettingForm.controls['port'].enable();
      this.saveEmailSettingForm.controls['OrgDataIsRequired'].enable();
    }
  }
  intialModelsaveEmailSetting() {
    this.saveEmailSettingForm = this.formBuilder.group({
      email: [null, []],
      password: [null, []],
      senderName: [null, []],
      port: [null, []],
      host: [null, []],
      DisplayName: [null, []],
      OrgDataIsRequired: [null, []],
      ssl: [false, []],
      SettingId: [null, []],
      CompanyCodedevices: [null, []],
      usernamedevices: [null, []],
      passworddevices: [null, []],
      DeviceNamedevices: [null, []],
      AttDeviceSittingId: [null, []],
    });
  }
  intialmainInfoFormEmail() {
    this.saveEmailForm = this.formBuilder.group({
      email: [null, []],
      password: [null, []],
      senderName: [null, []],
      port: [null, []],
      host: [null, []],
      OrgDataIsRequired: [null, []],
      ssl: [false, []],
      sendCustomerMail: [false, []],
      EmailTest: [null, []],
    });
  }
  saveEmail(modal?: any) {
    if (this.confirmepassword == true) {
      const prames = {
        organizationId: this.mainInfoForm.controls['organizationId'].value,
        email: this.saveEmailForm.controls['email'].value,
        password: this.saveEmailForm.controls['password'].value,
        port: this.saveEmailForm.controls['port'].value,
        host: this.saveEmailForm.controls['host'].value,
        senderName: this.saveEmailForm.controls['senderName'].value,
        ssl: this.saveEmailForm.controls['ssl'].value,
        sendCustomerMail: this.saveEmailForm.controls['sendCustomerMail'].value,
      };
      this.organizationService.saveEmail(prames).subscribe(
        (result: any) => {
          if (result.statusCode == 200) {
            if (modal) {
              modal.dismiss();
            }
            this.mainInfoForm.controls['email'].setValue(
              this.saveEmailForm.controls['email'].value
            );
            this.mainInfoForm.controls['senderName'].setValue(
              this.saveEmailForm.controls['senderName'].value
            );
            this.mainInfoForm.controls['host'].setValue(
              this.saveEmailForm.controls['host'].value
            );
            this.mainInfoForm.controls['port'].setValue(
              this.saveEmailForm.controls['port'].value
            );
            this.mainInfoForm.controls['ssl'].setValue(
              this.saveEmailForm.controls['ssl'].value
            );
            this.mainInfoForm.controls['sendCustomerMail'].setValue(
              this.saveEmailForm.controls['sendCustomerMail'].value
            );
            this.toast.success(
              this.translate.instant(result.reasonPhrase),
              this.translate.instant('Message')
            );
          } else {
            this.toast.error(
              this.translate.instant(result.reasonPhrase),
              this.translate.instant('Message')
            );
          }
        },
        (error) => {
          this.toast.error(
            this.translate.instant(error.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      );
    } else {
      this.confirmepassword = false;
      this.toast.error(this.translate.instant('confirmepassword'));
    }
  }
  ChangesmsSetting(event: any) {
    if (event.checked == false) {
      this.SavesmsSettingForm.controls['apiUrl'].disable();
      this.SavesmsSettingForm.controls['bearerTokens'].disable();
      this.SavesmsSettingForm.controls['messageServiceProviders'].disable();
      this.SavesmsSettingForm.controls['senderNamesms'].disable();
      this.SavesmsSettingForm.controls['phone'].disable();
      this.SavesmsSettingForm.controls['username'].disable();
    } else {
      this.SavesmsSettingForm.controls['apiUrl'].enable();
      this.SavesmsSettingForm.controls['bearerTokens'].enable();
      this.SavesmsSettingForm.controls['messageServiceProviders'].enable();
      this.SavesmsSettingForm.controls['senderNamesms'].enable();
      this.SavesmsSettingForm.controls['phone'].enable();
      this.SavesmsSettingForm.controls['username'].enable();
    }
  }
  ChangeWhatsAppSetting(event: any) {
    if (event.checked == false) {
      this.SaveWhatsAppSettingForm.controls['WhatsAppServiceProviders'].disable();
      this.SaveWhatsAppSettingForm.controls['phoneW'].disable();
      this.SaveWhatsAppSettingForm.controls['InstanceId'].disable();
      this.SaveWhatsAppSettingForm.controls['Token'].disable();
      this.SaveWhatsAppSettingForm.controls['usernameW'].disable();
      this.SaveWhatsAppSettingForm.controls['SenderNameW'].disable();
    } else {
      this.SaveWhatsAppSettingForm.controls['WhatsAppServiceProviders'].enable();
      this.SaveWhatsAppSettingForm.controls['phoneW'].enable();
      this.SaveWhatsAppSettingForm.controls['InstanceId'].enable();
      this.SaveWhatsAppSettingForm.controls['Token'].enable();
      this.SaveWhatsAppSettingForm.controls['usernameW'].enable();
      this.SaveWhatsAppSettingForm.controls['SenderNameW'].enable();
    }
  }
  intialModelSavesmsSetting() {
    this.SavesmsSettingForm = this.formBuilder.group({
      apiUrl: [null, []],
      bearerTokens: [null, []],
      messageServiceProviders: [null, []],
      senderNamesms: [null, []],
      phone: [null, []],
      username: [null, []],
      SettingId: [null, []],
      SendCustomerSMS: [null, []],
      SMSTest: [null, []],
    });
  }
  intialModelSaveWhatsAppSetting() {
    this.SaveWhatsAppSettingForm = this.formBuilder.group({
      WhatsAppServiceProviders: [null, []],
      phoneW: [null, []],
      InstanceId: [null, []],
      Token: [null, []],
      usernameW: [null, []],
      SenderNameW: [null, []],
      SettingId: [null, []],
      Sendactivation: [null, []],
      SendactivationOffer: [null, []],
      SendactivationProject: [null, []],
      SendactivationSupervision: [null, []],
      WhatsAppTest: [null, []],
    });
  }
  MaintenanceFunc(id: any) {
    this.organizationService.MaintenanceFunc(id).subscribe(
      (result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        } else {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      },
      (error) => {
        this.toast.error(
          this.translate.instant(error.reasonPhrase),
          this.translate.instant('Message')
        );
      }
    );
  }
  SaveComDomainLink() {
    const prames = {
      organizationId: this.mainInfoForm.controls['organizationId'].value,
      ComDomainLink: this.mainInfoForm.controls['comDomainLink'].value,
      ComDomainAddress: this.mainInfoForm.controls['comDomainAddress'].value,
      ApiBaseUri: this.mainInfoForm.controls['apiBaseUri'].value,
      TameerAPIURL: this.mainInfoForm.controls['tameerAPIURL'].value,
    };
    this.organizationService
      .SaveComDomainLink(prames)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }
  SaveAppVersionSMS() {
    const prames = {
      OrganizationId: this.mainInfoForm.controls['organizationId'].value,
      // LastvesionAndroid: data.Android,
      // LastversionIOS: data.versionIOS,
      // MessageUpdateAr: data.UpdateArabic,
      // MessageUpdateEn: data.UpdateEnglish,
      LastversionIOS: this.mainInfoForm.controls['lastversionIOS'].value,
      LastvesionAndroid: this.mainInfoForm.controls['lastvesionAndroid'].value,
      MessageUpdateAr: this.mainInfoForm.controls['messageUpdateAr'].value,
      MessageUpdateEn: this.mainInfoForm.controls['messageUpdateEn'].value,
    };
    this.organizationService.SaveAppVersion(prames).subscribe((result: any) => {
      if (result.statusCode == 200) {
        this.toast.success(
          this.translate.instant(result.reasonPhrase),
          this.translate.instant('Message')
        );
      } else {
        this.toast.error(
          this.translate.instant(result.reasonPhrase),
          this.translate.instant('Message')
        );
      }
    });
  }

  intialModelBranchOrganization() {
    this.BranchInfoForm = this.formBuilder.group({
      organizationId: [null, [Validators.required]],

      isPrintInvoice: [false, []],
      nameAr: [null, [Validators.required]],
      nameEn: [null, [Validators.required]],
      projectStartCode: [null, [Validators.required]],
      offerStartCode: [null, [Validators.required]],
      country: [null, [Validators.required]],
      address: [null, [Validators.required]],
      postalCodeFinal: [null, [Validators.required]],
      taxCode: [
        null,
        [
          Validators.required,
          Validators.minLength(15),
          Validators.maxLength(15),
        ],
      ],
      postalCode: [null, [Validators.required]],
      neighborhood: [null, [Validators.required]],
      streetName: [null, [Validators.required]],
      buildingNumber: [null, [Validators.required]],
      externalPhone: [null, [Validators.required]],
      bankId: [null, [Validators.required]],
      accountBank: [null, [Validators.required]],
      bankId2: [null, []],
      accountBank2: [null, []],
      engineering_License: [null, [Validators.required]],
      engineering_LicenseDate: [null, [Validators.required]],
      cityId: [null, [Validators.required]],
      headerPrintInvoice: [false, []],
      headerPrintrevoucher: [false, []],
      headerprintdarvoucher: [false, []],
      headerPrintpayvoucher: [false, []],
      uploadedFile: [null, []],
      uploadedFileheader: [null, []],
      uploadedFilefooter: [null, []],

      branchId: [0, []],
      code: ['0', []],

      phone: [null, []],
      mailbox: [null, []],
      engineeringLicense: [null, []],
      labLicense: [null, []],
      branchLogoUrl: [null, []],
      headerLogoUrl: [null, []],
      footerLogoUrl: [null, []],

      addUser: [null, []],
      updateUser: [null, []],
      deleteUser: [null, []],
      addDate: [null, []],
      updateDate: [null, []],
      deleteDate: [null, []],
      isDeleted: [null, []],
      branchManager: [null, []],

      warehouseId: [null, []],
      currencyId: [null, []],
      boxAccId: [null, []],
      stockAccd: [null, []],
      saleCostAccId: [null, []],
      saleCashAccId: [null, []],
      saleDelayAccId: [null, []],
      saleDiscountAccId: [null, []],
      saleReturnCashAccId: [null, []],
      saleReturnDelayAccId: [null, []],
      saleReturnDiscountAccId: [null, []],
      purchaseCashAccId: [null, []],
      purchaseDelayAccId: [null, []],
      purchaseApprovalAccId: [null, []],
      purchaseOutCashAccId: [null, []],
      purchaseOutDelayAccId: [null, []],
      purchaseDiscAccId: [null, []],
      purchaseReturnCashAccId: [null, []],
      purchaseReturnDelayAccId: [null, []],
      purchaseReturnApprovAccId: [null, []],
      purchaseReturnDiscAccId: [null, []],
      revenuesAccountId: [null, []],
      suspendedFundAccId: [null, []],
      cashInvoicesAccId: [null, []],
      delayInvoicesAccId: [null, []],
      discountInvoicesAccId: [null, []],
      cashReturnInvoicesAccId: [null, []],
      delayReturnInvoicesAccId: [null, []],
      discountReturnInvoiceAccId: [null, []],
      checkInvoicesAccId: [null, []],
      visaInvoicesAccId: [null, []],
      teleInvoicesAccId: [null, []],
      americanAccId: [null, []],
      customersAccId: [null, []],
      suppliersAccId: [null, []],
      employeesAccId: [null, []],
      guaranteeAccId: [null, []],
      contractsAccId: [null, []],
      taxsAccId: [null, []],
      lastExport: [null, []],
      lastExportInner: [null, []],
      loanAccId: [null, []],
      boxAccId2: [null, []],
      isActive: [null, []],
      bublicRevenue: [null, []],
      otherRevenue: [null, []],
    });
  }

  GetAllBranches() {
    this.organizationService.GetAllBranches().subscribe((response: any) => {
      this.dataSource = new MatTableDataSource(response.result);
    });
  }
  GenerateNextBranchNumber() {
    // this.organizationService.GenerateNextBranchNumber().subscribe((result: any) => {

    // });

    this.organizationService.GetBranchById(1).subscribe((res: any) => {
      this.BranchInfoForm.controls['postalCodeFinal'].setValue(
        res?.result[0]?.postalCodeFinal
      );
      this.BranchInfoForm.controls['taxCode'].setValue(res?.result[0]?.taxCode);
      this.BranchInfoForm.controls['postalCode'].setValue(
        res?.result[0]?.postalCode
      );
      this.BranchInfoForm.controls['externalPhone'].setValue(
        res?.result[0]?.externalPhone
      );
      this.BranchInfoForm.controls['engineering_License'].setValue(
        res?.result[0]?.engineering_License
      );
    });

    this.controlImgUrlfile.clear();
    this.controlImgUrlfileheader.clear();
    this.controlImgUrlfilefooter.clear();
    this.intialModelBranchOrganization();
    this.organizationService
      .GetBranchOrganization()
      .subscribe((response: any) => {
        response.result.engineering_LicenseDate = new Date(
          response.result.engineering_LicenseDate
        );
        response.result.isFooter == '1'
          ? (response.result.isFooter = true)
          : (response.result.isFooter = false);

        this.BranchInfoForm.controls['organizationId'].setValue(
          response?.result?.organizationId
        );
        // this.BranchInfoForm.setValue(response.result);
      });
  }

  setSaveBranches(modal: any) {
    let text = this.BranchInfoForm.controls['taxCode'].value;
    let firstChar = text.charAt(0);
    let lastChar = text.charAt(text.length - 1);
    if (firstChar != '3' && lastChar != '3') {
      this.toast.error(
        this.translate.instant('يجب ان يبدأ الرقم الضريبي برقم 3 وينتهي برقم 3')
      );
      return;
    }
    if (this.BranchInfoForm.controls['taxCode'].value.length != 15) {
      this.toast.error(
        this.translate.instant('يجب ان يكون الرقم الضريبي 15 رقم')
      );
      return;
    }

    if (this.BranchInfoForm.controls['bankId2'].value == null) {
      this.BranchInfoForm.controls['bankId2'].setValue(0);
    }

    const formData = new FormData();
    if (
      this.BranchInfoForm.controls['uploadedFile'].value == null &&
      this.imageFileOutputImgUrlfile != null
    ) {
      formData.append('UploadedFile', this.imageFileOutputImgUrlfile);
      formData.append('postedFiles', this.imageFileOutputImgUrlfile);
    }
    if (
      this.BranchInfoForm.controls['uploadedFileheader'].value == null &&
      this.imageFileOutputImgUrlfileheader != null
    ) {
      formData.append(
        'UploadedFileheader',
        this.imageFileOutputImgUrlfileheader
      );
      formData.append(
        'postedFilesheader',
        this.imageFileOutputImgUrlfileheader
      );
    }
    if (
      this.BranchInfoForm.controls['uploadedFilefooter'].value == null &&
      this.imageFileOutputImgUrlfilefooter != null
    ) {
      formData.append(
        'UploadedFilefooter',
        this.imageFileOutputImgUrlfilefooter
      );
      formData.append(
        'postedFilesfooter',
        this.imageFileOutputImgUrlfilefooter
      );
    }

    formData.append(
      'branchLogoUrl',
      this.BranchInfoForm.controls['uploadedFile'].value ?? ''
    );
    formData.append(
      'headerLogoUrl',
      this.BranchInfoForm.controls['uploadedFileheader'].value ?? ''
    );
    formData.append(
      'footerLogoUrl',
      this.BranchInfoForm.controls['uploadedFilefooter'].value ?? ''
    );

    formData.append('branchId', this.BranchInfoForm.controls['branchId'].value);
    formData.append('NameAr', this.BranchInfoForm.controls['nameAr'].value);
    formData.append('NameEn', this.BranchInfoForm.controls['nameEn'].value);
    formData.append(
      'ProjectStartCode',
      this.BranchInfoForm.controls['projectStartCode'].value
    );
    formData.append(
      'OfferStartCode',
      this.BranchInfoForm.controls['offerStartCode'].value
    );
    formData.append(
      'OrganizationId',
      this.BranchInfoForm.controls['organizationId'].value
    );
    formData.append(
      'AccountBank',
      this.BranchInfoForm.controls['accountBank'].value
    );
    formData.append(
      'AccountBank2',
      this.BranchInfoForm.controls['accountBank2'].value
    );
    formData.append('CityId', this.BranchInfoForm.controls['cityId'].value);
    if (
      this.BranchInfoForm.controls['code'].value == 0 ||
      this.BranchInfoForm.controls['code'].value == null
    ) {
      formData.append('code', this.BranchInfoForm.controls['nameAr'].value);
    } else {
      formData.append(
        'code',
        this.BranchInfoForm.controls['code'].value.toString()
      );
    }
    formData.append('BankId', this.BranchInfoForm.controls['bankId'].value);
    formData.append(
      'BankId2',
      this.BranchInfoForm.controls['bankId2'].value ?? 0
    );
    formData.append(
      'Engineering_License',
      this.BranchInfoForm.controls['engineering_License'].value
    );
    if (
      this.BranchInfoForm.controls['engineering_LicenseDate'].value != null &&
      typeof this.BranchInfoForm.controls['engineering_LicenseDate'].value !=
        'string'
    ) {
      formData.append(
        'Engineering_LicenseDate',
        this._sharedService.date_TO_String(
          this.BranchInfoForm.controls['engineering_LicenseDate'].value
        )
      );
    } else {
      formData.append(
        'Engineering_LicenseDate',
        this.BranchInfoForm.controls['engineering_LicenseDate'].value ?? ''
      );
    }
    formData.append(
      'PostalCodeFinal',
      this.BranchInfoForm.controls['postalCodeFinal'].value
    );
    formData.append(
      'PostalCode',
      this.BranchInfoForm.controls['postalCode'].value
    );
    formData.append(
      'ExternalPhone',
      this.BranchInfoForm.controls['externalPhone'].value
    );
    formData.append('Country', this.BranchInfoForm.controls['country'].value);
    formData.append(
      'Neighborhood',
      this.BranchInfoForm.controls['neighborhood'].value
    );
    formData.append(
      'StreetName',
      this.BranchInfoForm.controls['streetName'].value
    );
    formData.append(
      'BuildingNumber',
      this.BranchInfoForm.controls['buildingNumber'].value
    );
    formData.append('Address', this.BranchInfoForm.controls['address'].value);
    formData.append('TaxCode', this.BranchInfoForm.controls['taxCode'].value);
    formData.append(
      'IsPrintInvoice',
      this.BranchInfoForm.controls['isPrintInvoice'].value
    );
    formData.append(
      'headerPrintInvoice',
      this.BranchInfoForm.controls['headerPrintInvoice'].value
    );
    formData.append(
      'headerPrintrevoucher',
      this.BranchInfoForm.controls['headerPrintrevoucher'].value
    );
    formData.append(
      'headerprintdarvoucher',
      this.BranchInfoForm.controls['headerprintdarvoucher'].value
    );
    formData.append(
      'headerPrintpayvoucher',
      this.BranchInfoForm.controls['headerPrintpayvoucher'].value
    );

    // formData.append('BranchLogoUrl', $("#ImgUrl").val());
    // formData.append('HeaderLogoUrl', $("#ImgUrlheader").val());
    // formData.append('FooterLogoUrl', $("#ImgUrlfooter").val());
    // formData.append('Mobile', $('#BranchMobiletxt').val());
    // formData.append('Phone', $('#BranchPhonetxt').val());
    // formData.append('Mailbox', $('#Mailboxtxt').val());
    // formData.append('EngineeringLicense', $('#EngineeringLicensetxt').val());
    // formData.append('LabLicense', $('#LabLicensetxt').val());
    // formData.append('BranchId', $('#BranchId').val());
    // formData.append('Code', $('#BranchCodetxt').val());

    this.organizationService.SaveBranches(formData).subscribe((result: any) => {
      if (result.statusCode == 200) {
        this.toast.success(
          this.translate.instant(result.reasonPhrase),
          this.translate.instant('Message')
        );
        modal.dismiss();
        if (this.BranchInfoForm.controls['bankId2'].value == 0) {
          this.BranchInfoForm.controls['bankId2'].setValue(null);
        }

        this.uploadedFileOutputImg.next('');
        this.uploadedFileImgUrlfileheader.next('');
        this.uploadedFileImgUrlfilefooter.next('');

        this.imageFileOutputImgUrlfile = null;
        this.controlImgUrlfile.clear();
        this.controlImgUrlfileheader.clear();
        this.controlImgUrlfilefooter.clear();

        this.imageFileOutputImgUrlfileheader = null;
        this.imageFileOutputImgUrlfilefooter = null;
        this.intialModelBranchOrganization();
        this.GetAllBranches();
      } else {
        this.toast.error(
          this.translate.instant(result.reasonPhrase),
          this.translate.instant('Message')
        );
      }
    });
  }

  branchesAcc: any;
  branchesAccounts(item: any) {
    this.organizationService
      .FillAllAccountsSelect()
      .subscribe((result: any) => {
        this.branchesAcc = result;
        if (
          item.taxsAccId == null &&
          item.checkInvoicesAccId == null &&
          item.cashInvoicesAccId == null &&
          item.purchaseDelayAccId == null &&
          item.revenuesAccountId == null &&
          item.purchaseApprovalAccId == null &&
          item.purchaseDiscAccId == null &&
          item.saleDiscountAccId == null &&
          item.cashReturnInvoicesAccId == null &&
          item.purchaseReturnCashAccId == null &&
          item.loanAccId == null &&
          item.employeesAccId == null &&
          item.suppliersAccId == null &&
          item.contractsAccId == null &&
          item.guaranteeAccId == null &&
          item.customersAccId == null &&
          item.suspendedFundAccId == null &&
          item.boxAccId2 == null &&
          item.boxAccId == null
        ) {
          this.organizationService
            .GetFirstBranch()
            .subscribe((resultFirstBranch: any) => {
              this.branchesAccForm.controls['BranchId'].setValue(
                item?.branchId
              );
              this.branchesAccForm.controls['BoxAccId'].setValue(
                resultFirstBranch?.boxAccId
              );
              this.branchesAccForm.controls['BoxAccId2'].setValue(
                resultFirstBranch?.boxAccId2
              );
              this.branchesAccForm.controls['SuspendedFundAccId'].setValue(
                resultFirstBranch?.suspendedFundAccId
              );
              this.branchesAccForm.controls['CustomersAccId'].setValue(
                resultFirstBranch?.customersAccId
              );
              this.branchesAccForm.controls['GuaranteeAccId'].setValue(
                resultFirstBranch?.guaranteeAccId
              );
              this.branchesAccForm.controls['ContractsAccId'].setValue(
                resultFirstBranch?.contractsAccId
              );
              this.branchesAccForm.controls['SuppliersAccId'].setValue(
                resultFirstBranch?.suppliersAccId
              );
              this.branchesAccForm.controls['EmployeesAccId'].setValue(
                resultFirstBranch?.employeesAccId
              );
              this.branchesAccForm.controls['LoanAccId'].setValue(
                resultFirstBranch?.loanAccId
              );
              this.branchesAccForm.controls['PurchaseReturnCashAccId'].setValue(
                resultFirstBranch?.purchaseReturnCashAccId
              );
              this.branchesAccForm.controls['CashReturnInvoicesAccId'].setValue(
                resultFirstBranch?.cashReturnInvoicesAccId
              );
              this.branchesAccForm.controls['SaleDiscountAccId'].setValue(
                resultFirstBranch?.saleDiscountAccId
              );
              this.branchesAccForm.controls['PurchaseDiscAccId'].setValue(
                resultFirstBranch?.purchaseDiscAccId
              );
              this.branchesAccForm.controls['PurchaseDelayAccId'].setValue(
                resultFirstBranch?.purchaseDelayAccId
              );
              this.branchesAccForm.controls['CheckInvoicesAccId'].setValue(
                resultFirstBranch?.checkInvoicesAccId
              );
              this.branchesAccForm.controls['CashInvoicesAccId'].setValue(
                resultFirstBranch?.cashInvoicesAccId
              );
              this.branchesAccForm.controls['SaleCashAccId'].setValue(
                resultFirstBranch?.saleCashAccId
              );
              this.branchesAccForm.controls['SaleCostAccId'].setValue(
                resultFirstBranch?.saleCostAccId
              );
              this.branchesAccForm.controls['TaxsAccId'].setValue(
                resultFirstBranch?.taxsAccId
              );
              this.branchesAccForm.controls['PurchaseApprovalAccId'].setValue(
                resultFirstBranch?.purchaseApprovalAccId
              );
              this.branchesAccForm.controls['RevenuesAccountId'].setValue(
                resultFirstBranch?.revenuesAccountId
              );
            });
        } else {
          this.branchesAccForm.controls['BranchId'].setValue(item?.branchId);
          this.branchesAccForm.controls['BoxAccId'].setValue(item?.boxAccId);
          this.branchesAccForm.controls['BoxAccId2'].setValue(item?.boxAccId2);
          this.branchesAccForm.controls['SuspendedFundAccId'].setValue(
            item?.suspendedFundAccId
          );
          this.branchesAccForm.controls['CustomersAccId'].setValue(
            item?.customersAccId
          );
          this.branchesAccForm.controls['GuaranteeAccId'].setValue(
            item?.guaranteeAccId
          );
          this.branchesAccForm.controls['ContractsAccId'].setValue(
            item?.contractsAccId
          );
          this.branchesAccForm.controls['SuppliersAccId'].setValue(
            item?.suppliersAccId
          );
          this.branchesAccForm.controls['EmployeesAccId'].setValue(
            item?.employeesAccId
          );
          this.branchesAccForm.controls['LoanAccId'].setValue(item?.loanAccId);
          this.branchesAccForm.controls['PurchaseReturnCashAccId'].setValue(
            item?.purchaseReturnCashAccId
          );
          this.branchesAccForm.controls['CashReturnInvoicesAccId'].setValue(
            item?.cashReturnInvoicesAccId
          );
          this.branchesAccForm.controls['SaleDiscountAccId'].setValue(
            item?.saleDiscountAccId
          );
          this.branchesAccForm.controls['PurchaseDiscAccId'].setValue(
            item?.purchaseDiscAccId
          );
          this.branchesAccForm.controls['PurchaseDelayAccId'].setValue(
            item?.purchaseDelayAccId
          );
          this.branchesAccForm.controls['CheckInvoicesAccId'].setValue(
            item?.checkInvoicesAccId
          );
          this.branchesAccForm.controls['CashInvoicesAccId'].setValue(
            item?.cashInvoicesAccId
          );
          this.branchesAccForm.controls['SaleCashAccId'].setValue(
            item?.saleCashAccId
          );
          this.branchesAccForm.controls['SaleCostAccId'].setValue(
            item?.saleCostAccId
          );
          this.branchesAccForm.controls['TaxsAccId'].setValue(item?.taxsAccId);
          this.branchesAccForm.controls['PurchaseApprovalAccId'].setValue(
            item?.purchaseApprovalAccId
          );
          this.branchesAccForm.controls['RevenuesAccountId'].setValue(
            item?.revenuesAccountId
          );
        }
      });
  }

  // getbranchDet: any
  // getbranchbyId(item :any) {
  //   this.branchesAccForm.controls["BranchId"].setValue(item.branchId)
  //   this.organizationService.getbranchbyId(this.branchesAccForm.controls["BranchId"].value).subscribe((result: any) => {
  //     this.getbranchDet = result
  //   });
  // }
  intialModelbranchesAccForm() {
    this.branchesAccForm = this.formBuilder.group({
      BoxAccId: [null, [Validators.required]],
      BoxAccId2: [null, [Validators.required]],
      SuspendedFundAccId: [null, [Validators.required]],
      CustomersAccId: [null, [Validators.required]],
      GuaranteeAccId: [null, [Validators.required]],
      ContractsAccId: [null, [Validators.required]],
      SuppliersAccId: [null, [Validators.required]],
      EmployeesAccId: [null, [Validators.required]],
      LoanAccId: [null, [Validators.required]],
      PurchaseReturnCashAccId: [null, [Validators.required]],
      CashReturnInvoicesAccId: [null, [Validators.required]],
      SaleDiscountAccId: [null, [Validators.required]],
      PurchaseDiscAccId: [null, [Validators.required]],
      PurchaseDelayAccId: [null, [Validators.required]],
      CheckInvoicesAccId: [null, [Validators.required]],
      CashInvoicesAccId: [null, [Validators.required]],
      SaleCashAccId: [null, [Validators.required]],
      SaleCostAccId: [null, [Validators.required]],
      TaxsAccId: [null, [Validators.required]],
      BranchId: [null, []],

      PurchaseApprovalAccId: [null, []],
      RevenuesAccountId: [null, []],
    });
  }
  savebranchesAccForm(modal: any) {
    this.organizationService
      .SaveBranchesAccs(this.branchesAccForm.value)
      .subscribe(
        (result: any) => {
          if (result.statusCode == 200) {
            this.toast.success(
              this.translate.instant(result.reasonPhrase),
              this.translate.instant('Message')
            );
            modal.dismiss();
            this.GetAllBranches();
          } else {
            this.toast.error(
              this.translate.instant(result.reasonPhrase),
              this.translate.instant('Message')
            );
          }
        },
        (error) => {
          this.toast.error(
            this.translate.instant(error.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      );
  }
  accountTree: any;
  branchTree: any;
  PurchaseReturnDiscAccId: any;
  AccountTreeListEA: any;
  AccountTreeListKD: any;
  AccountTreeListpublicrev: any;
  AccountTreeListotherrev: any;
  AccountngxTreeListEA: any;
  AccountngxTreeListKD: any;
  AccountngxTreeListpublicrev: any;
  AccountngxTreeListotherrev: any;
  PrivList = [];
  GetAccountTree(item: any) {
    this.PurchaseReturnDiscAccId = item.purchaseReturnDiscAccId;
    this.organizationService
      .FillAllAccountsSelect()
      .subscribe((result: any) => {
        this.branchesAcc = result;
      });
    this.branchTree = item.branchId;
    this.organizationService.GetAccountTree().subscribe((result: any) => {
      this.PrivList = JSON.parse(JSON.stringify(result));
      this.AccountTreeListEA = JSON.parse(JSON.stringify(result));
      this.AccountTreeListKD = JSON.parse(JSON.stringify(result));
      this.AccountTreeListpublicrev = JSON.parse(JSON.stringify(result));
      this.AccountTreeListotherrev = JSON.parse(JSON.stringify(result));
      // forkJoin([
      //   this.organizationService.GetAccountTreeEA(),
      //   this.organizationService.GetAccountTreeKD(),
      //   this.organizationService.GetAccountTreepublicrev(),
      //   this.organizationService.GetAccountTreeotherrev(),
      // ]).subscribe(
      //   results => {
      //     this.AccountTreeEA = results[0]
      //     this.AccountTreeKD = results[1]
      //     this.AccountTreepublicrev = results[2]
      //     this.AccountTreeotherrev = results[3]

      //     this.selectedTask1 = []
      //     this.selectedTask2 = []
      //     this.selectedTask3 = []
      //     this.selectedTask4 = []
      // result.forEach((element: any) => {
      //   element.children = []
      //   element.name = element.text
      //   element.item = {
      //     phrase: element.text,
      //     id: element.id
      //   }
      //   result.forEach((ele: any) => {
      //     if (element.id == ele.parent) {
      //       element.isparent = true
      //       element.children.push(ele)
      //     }

      //   });

      // });

      // const filteraccountTree = []
      // result.forEach((element: any) => {
      //   if (element.isparent == true) {
      //     filteraccountTree.push(element)
      //   }
      // })
      // this.accountTree = []
      // result.forEach((element: any) => {
      //   if (element.parent == "#") {
      //     this.accountTree.push(element)
      //   }
      // })
      // console.log(this.accountTree)

      // });

      // this.selectedTask1 = []
      // this.selectedTask2 = []
      // this.selectedTask3 = []
      // this.selectedTask4 = []

      this.organizationService
        .GetAccountTreeEA()
        .subscribe((AccountTreeKD: any) => {
          // this.AccountTreeKD = result
          this.AccountTreeListKD.forEach((element: any) => {
            element.children = [];
            element.name = element.text;
            element.item = {
              phrase: element.text,
              id: element.id,
            };
            element.selected = false;
            this.AccountTreeListKD.forEach((ele: any) => {
              if (element.id == ele.parent) {
                element.isparent = true;
                element.children.push(ele);
              }
            });

            AccountTreeKD.forEach((TreeEA: any) => {
              if (element.id == TreeEA) {
                element.expanded = true;
                element.selected = true;
                this.selectedTaskss1.push(element.item);
              }
            });
          });

          const filteraccountTree = [];
          this.AccountTreeListKD.forEach((element: any) => {
            if (element.isparent == true) {
              filteraccountTree.push(element);
            }
          });
          this.AccountngxTreeListKD = [];
          this.AccountTreeListKD.forEach((element: any) => {
            if (element.parent == '#') {
              this.AccountngxTreeListKD.push(element);
            }
          });
        });

      this.organizationService
        .GetAccountTreeKD()
        .subscribe((AccountTreeEA: any) => {
          // this.AccountTreeEA = result
          this.AccountTreeListEA.forEach((element: any) => {
            element.children = [];
            element.name = element.text;
            element.item = {
              phrase: element.text,
              id: element.id,
            };
            element.selected = false;
            this.AccountTreeListEA.forEach((ele: any) => {
              if (element.id == ele.parent) {
                element.isparent = true;
                element.children.push(ele);
              }
            });

            AccountTreeEA.forEach((TreeEA: any) => {
              if (element.id == TreeEA) {
                element.expanded = true;
                element.selected = true;
                this.selectedTask2.push(element.item);
              }
            });
          });

          const filteraccountTree = [];
          this.AccountTreeListEA.forEach((element: any) => {
            if (element.isparent == true) {
              filteraccountTree.push(element);
            }
          });
          this.AccountngxTreeListEA = [];
          this.AccountTreeListEA.forEach((element: any) => {
            if (element.parent == '#') {
              this.AccountngxTreeListEA.push(element);
            }
          });
        });

      this.organizationService
        .GetAccountTreepublicrev()
        .subscribe((AccountTreepublicrev: any) => {
          // this.AccountTreepublicrev = result
          this.AccountTreeListpublicrev.forEach((element: any) => {
            element.children = [];
            element.name = element.text;
            element.item = {
              phrase: element.text,
              id: element.id,
            };
            element.selected = false;
            this.AccountTreeListpublicrev.forEach((ele: any) => {
              if (element.id == ele.parent) {
                element.isparent = true;
                element.children.push(ele);
              }
            });

            AccountTreepublicrev.forEach((TreeEA: any) => {
              if (element.id == TreeEA) {
                element.expanded = true;
                element.selected = true;
                this.selectedTask3.push(element.item);
              }
            });
          });

          const filteraccountTree = [];
          this.AccountTreeListpublicrev.forEach((element: any) => {
            if (element.isparent == true) {
              filteraccountTree.push(element);
            }
          });
          this.AccountngxTreeListpublicrev = [];
          this.AccountTreeListpublicrev.forEach((element: any) => {
            if (element.parent == '#') {
              this.AccountngxTreeListpublicrev.push(element);
            }
          });
        });
      this.organizationService
        .GetAccountTreeotherrev()
        .subscribe((AccountTreeotherrev: any) => {
          // this.AccountTreeotherrev = result
          this.AccountTreeListotherrev.forEach((element: any) => {
            element.children = [];
            element.name = element.text;
            element.item = {
              phrase: element.text,
              id: element.id,
            };
            element.selected = false;
            this.AccountTreeListotherrev.forEach((ele: any) => {
              if (element.id == ele.parent) {
                element.isparent = true;
                element.children.push(ele);
              }
            });

            AccountTreeotherrev.forEach((TreeEA: any) => {
              if (element.id == TreeEA) {
                element.expanded = true;
                element.selected = true;
                this.selectedTask4.push(element.item);
              }
            });
          });

          const filteraccountTree = [];
          this.AccountTreeListotherrev.forEach((element: any) => {
            if (element.isparent == true) {
              filteraccountTree.push(element);
            }
          });
          this.AccountngxTreeListotherrev = [];
          this.AccountTreeListotherrev.forEach((element: any) => {
            if (element.parent == '#') {
              this.AccountngxTreeListotherrev.push(element);
            }
          });
        });
    });
  }
  onCheckboxChange(node: any): void {
    node.isSelected = !node.isSelected;
  }
  AccountTreeKD: any;
  AccountTreeEA: any;
  AccountTreepublicrev: any;
  AccountTreeotherrev: any;
  editBranch(item: any) {
    this.intialModelBranchOrganization();

    this.controlImgUrlfile.clear();
    this.controlImgUrlfileheader.clear();
    this.controlImgUrlfilefooter.clear();
    // this.organizationService.GetBranchById(itemB.branchId).subscribe((res: any) => {
    // const item = res.result[0]

    // this.organizationService.GenerateNextBranchNumber().subscribe((result: any) => {
    //   if (item.code == null || item.code == 0) {
    //     this.BranchInfoForm.controls["code"].setValue(result.reasonPhrase)
    //   } else {
    //     this.BranchInfoForm.controls["code"].setValue(item.code)
    //   }
    // });
    if (item.branchId == 1) {
      this.organizationService.GetBranchOrganization().subscribe((response) => {
        item.engineering_LicenseDate = new Date(item?.engineering_LicenseDate);

        if (this.isValidDate(item.engineering_LicenseDate)) {
          item.engineering_LicenseDate = item.engineering_LicenseDate;
        } else {
          item.engineering_LicenseDate = null;
        }
        this.BranchInfoForm.controls['code'].setValue(item?.code);
        this.BranchInfoForm.controls['organizationId'].setValue(
          item?.organizationId
        );
        this.BranchInfoForm.controls['isPrintInvoice'].setValue(
          item?.isPrintInvoice
        );
        this.BranchInfoForm.controls['nameAr'].setValue(item?.nameAr);
        this.BranchInfoForm.controls['nameEn'].setValue(item?.nameEn);
        this.BranchInfoForm.controls['projectStartCode'].setValue(
          item?.projectStartCode
        );
        this.BranchInfoForm.controls['offerStartCode'].setValue(
          item?.offerStartCode
        );
        this.BranchInfoForm.controls['country'].setValue(
          item?.country ?? response?.result?.country
        );
        this.BranchInfoForm.controls['address'].setValue(
          item?.address ?? response?.result?.address
        );
        this.BranchInfoForm.controls['postalCodeFinal'].setValue(
          item?.postalCodeFinal ?? response?.result?.postalCodeFinal
        );
        this.BranchInfoForm.controls['taxCode'].setValue(
          item?.taxCode ?? response?.result?.taxCode
        );
        this.BranchInfoForm.controls['postalCode'].setValue(
          item?.postalCode ?? response?.result?.postalCode
        );
        this.BranchInfoForm.controls['neighborhood'].setValue(
          item?.neighborhood ?? response?.result?.neighborhood
        );
        this.BranchInfoForm.controls['streetName'].setValue(
          item?.streetName ?? response?.result?.streetName
        );
        this.BranchInfoForm.controls['buildingNumber'].setValue(
          item?.buildingNumber ?? response?.result?.buildingNumber
        );
        this.BranchInfoForm.controls['externalPhone'].setValue(
          item?.externalPhone ?? response?.result?.externalPhone
        );
        this.BranchInfoForm.controls['bankId'].setValue(
          item?.bankId ?? response?.result?.bankId
        );
        this.BranchInfoForm.controls['accountBank'].setValue(
          item?.accountBank ?? response?.result?.accountBank
        );
        if (item.bankId2 == 0) {
          this.BranchInfoForm.controls['bankId2'].setValue(null);
        } else {
          this.BranchInfoForm.controls['bankId2'].setValue(
            item?.bankId2 ?? response?.result?.bankId2
          );
        }
        this.BranchInfoForm.controls['accountBank2'].setValue(
          item?.accountBank2 ?? response?.result?.accountBank2
        );
        this.BranchInfoForm.controls['engineering_License'].setValue(
          item?.engineering_License ?? response?.result?.engineering_License
        );
        if (item?.engineering_LicenseDate == null) {
          this.BranchInfoForm.controls['engineering_LicenseDate'].setValue('');
        } else {
          this.BranchInfoForm.controls['engineering_LicenseDate'].setValue(
            new Date(item?.engineering_LicenseDate)
          );
        }
        this.BranchInfoForm.controls['headerPrintInvoice'].setValue(
          item?.headerPrintInvoice
        );
        this.BranchInfoForm.controls['headerPrintrevoucher'].setValue(
          item?.headerPrintrevoucher
        );
        this.BranchInfoForm.controls['headerprintdarvoucher'].setValue(
          item?.headerprintdarvoucher
        );
        this.BranchInfoForm.controls['headerPrintpayvoucher'].setValue(
          item?.headerPrintpayvoucher
        );
        // this.BranchInfoForm.controls["uploadedFile"].setValue(item?.branchLogoUrl == "" ? null : item?.branchLogoUrl)
        // this.BranchInfoForm.controls["uploadedFileheader"].setValue(item?.headerLogoUrl == "" ? null : item?.headerLogoUrl)
        // this.BranchInfoForm.controls["uploadedFilefooter"].setValue(item?.footerLogoUrl == "" ? null : item?.footerLogoUrl)
        this.BranchInfoForm.controls['branchId'].setValue(item?.branchId);
        this.BranchInfoForm.controls['phone'].setValue(item?.phone);
        this.BranchInfoForm.controls['mailbox'].setValue(item?.mailbox);
        // this.BranchInfoForm.controls['engineeringLicense'].setValue(
        //   item?.engineeringLicense
        // );
        this.BranchInfoForm.controls['cityId'].setValue(
          item?.cityId ?? response?.result?.cityId
        );

        this.BranchInfoForm.controls['labLicense'].setValue(item?.labLicense);
        item.branchLogoUrl == ''
          ? this.BranchInfoForm.controls['uploadedFile'].setValue(null)
          : this.BranchInfoForm.controls['uploadedFile'].setValue(
              item.branchLogoUrl
            );
        item.headerLogoUrl == ''
          ? this.BranchInfoForm.controls['uploadedFileheader'].setValue(null)
          : this.BranchInfoForm.controls['uploadedFileheader'].setValue(
              item.headerLogoUrl
            );
        item.footerLogoUrl == ''
          ? this.BranchInfoForm.controls['uploadedFilefooter'].setValue(null)
          : this.BranchInfoForm.controls['uploadedFilefooter'].setValue(
              item.footerLogoUrl
            );

        this.BranchInfoForm.controls['branchLogoUrl'].setValue(
          item?.branchLogoUrl
        );
        this.BranchInfoForm.controls['headerLogoUrl'].setValue(
          item?.headerLogoUrl
        );
        this.BranchInfoForm.controls['footerLogoUrl'].setValue(
          item?.footerLogoUrl
        );
      });
    } else {
      item.engineering_LicenseDate = new Date(item?.engineering_LicenseDate);

      if (this.isValidDate(item.engineering_LicenseDate)) {
        item.engineering_LicenseDate = item.engineering_LicenseDate;
      } else {
        item.engineering_LicenseDate = null;
      }
      this.BranchInfoForm.controls['code'].setValue(item?.code);
      this.BranchInfoForm.controls['organizationId'].setValue(
        item?.organizationId
      );
      this.BranchInfoForm.controls['isPrintInvoice'].setValue(
        item?.isPrintInvoice
      );
      this.BranchInfoForm.controls['nameAr'].setValue(item?.nameAr);
      this.BranchInfoForm.controls['nameEn'].setValue(item?.nameEn);
      this.BranchInfoForm.controls['projectStartCode'].setValue(
        item?.projectStartCode
      );
      this.BranchInfoForm.controls['offerStartCode'].setValue(
        item?.offerStartCode
      );
      this.BranchInfoForm.controls['country'].setValue(item?.country);
      this.BranchInfoForm.controls['address'].setValue(item?.address);
      this.BranchInfoForm.controls['postalCodeFinal'].setValue(
        item?.postalCodeFinal
      );
      this.BranchInfoForm.controls['taxCode'].setValue(item?.taxCode);
      this.BranchInfoForm.controls['postalCode'].setValue(item?.postalCode);
      this.BranchInfoForm.controls['neighborhood'].setValue(item?.neighborhood);
      this.BranchInfoForm.controls['streetName'].setValue(item?.streetName);
      this.BranchInfoForm.controls['buildingNumber'].setValue(
        item?.buildingNumber
      );
      this.BranchInfoForm.controls['externalPhone'].setValue(
        item?.externalPhone
      );
      this.BranchInfoForm.controls['bankId'].setValue(item?.bankId);
      this.BranchInfoForm.controls['accountBank'].setValue(item?.accountBank);
      if (item.bankId2 == 0) {
        this.BranchInfoForm.controls['bankId2'].setValue(null);
      } else {
        this.BranchInfoForm.controls['bankId2'].setValue(item?.bankId2);
      }
      this.BranchInfoForm.controls['accountBank2'].setValue(item?.accountBank2);
      this.BranchInfoForm.controls['engineering_License'].setValue(
        item?.engineering_License
      );
      if (item?.engineering_LicenseDate == null) {
        this.BranchInfoForm.controls['engineering_LicenseDate'].setValue('');
      } else {
        this.BranchInfoForm.controls['engineering_LicenseDate'].setValue(
          new Date(item?.engineering_LicenseDate)
        );
      }
      this.BranchInfoForm.controls['headerPrintInvoice'].setValue(
        item?.headerPrintInvoice
      );
      this.BranchInfoForm.controls['headerPrintrevoucher'].setValue(
        item?.headerPrintrevoucher
      );
      this.BranchInfoForm.controls['headerprintdarvoucher'].setValue(
        item?.headerprintdarvoucher
      );
      this.BranchInfoForm.controls['headerPrintpayvoucher'].setValue(
        item?.headerPrintpayvoucher
      );
      // this.BranchInfoForm.controls["uploadedFile"].setValue(item?.branchLogoUrl == "" ? null : item?.branchLogoUrl)
      // this.BranchInfoForm.controls["uploadedFileheader"].setValue(item?.headerLogoUrl == "" ? null : item?.headerLogoUrl)
      // this.BranchInfoForm.controls["uploadedFilefooter"].setValue(item?.footerLogoUrl == "" ? null : item?.footerLogoUrl)
      this.BranchInfoForm.controls['branchId'].setValue(item?.branchId);
      this.BranchInfoForm.controls['phone'].setValue(item?.phone);
      this.BranchInfoForm.controls['mailbox'].setValue(item?.mailbox);
      // this.BranchInfoForm.controls['engineeringLicense'].setValue(
      //   item?.engineeringLicense
      // );
      this.BranchInfoForm.controls['cityId'].setValue(item?.cityId);

      this.BranchInfoForm.controls['labLicense'].setValue(item?.labLicense);
      item.branchLogoUrl == ''
        ? this.BranchInfoForm.controls['uploadedFile'].setValue(null)
        : this.BranchInfoForm.controls['uploadedFile'].setValue(
            item.branchLogoUrl
          );
      item.headerLogoUrl == ''
        ? this.BranchInfoForm.controls['uploadedFileheader'].setValue(null)
        : this.BranchInfoForm.controls['uploadedFileheader'].setValue(
            item.headerLogoUrl
          );
      item.footerLogoUrl == ''
        ? this.BranchInfoForm.controls['uploadedFilefooter'].setValue(null)
        : this.BranchInfoForm.controls['uploadedFilefooter'].setValue(
            item.footerLogoUrl
          );

      this.BranchInfoForm.controls['branchLogoUrl'].setValue(
        item?.branchLogoUrl
      );
      this.BranchInfoForm.controls['headerLogoUrl'].setValue(
        item?.headerLogoUrl
      );
      this.BranchInfoForm.controls['footerLogoUrl'].setValue(
        item?.footerLogoUrl
      );
    }
    this.BranchInfoForm.controls['bankId2'].setValue(
      this.BranchInfoForm.controls['bankId2'].value == 0
        ? null
        : this.BranchInfoForm.controls['bankId2'].value
    );
  }
  Branchiddelete: any;
  deleteBranch() {
    this.organizationService
      .deleteBranch(this.Branchiddelete)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.GetAllBranches();
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }

  getpriv(privilegeIds: any) {
    privilegeIds.forEach((element: any) => {
      this.PrivList.forEach((ngxTree: any) => {
        if (ngxTree.id == element.id) {
          if (ngxTree.parent != '#') {
            var found = [];
            found = privilegeIds.filter((x: any) => x.id == ngxTree.parent);
            if (found.length == 0) {
              privilegeIds.push({ id: ngxTree.parent });
              this.getpriv(privilegeIds);
            }
          }
        }
      });
    });
  }
  async savetree(modal: any) {
    const KD = {
      BranchId: this.branchTree,
      BublicRevenue: null,
      OtherRevenue: null,
      PurchaseReturnDiscAccId: this.PurchaseReturnDiscAccId,
    };
    this.organizationService.SaveBranchesAccsKD(KD).subscribe((result: any) => {
      if (result.statusCode == 200) {
        this.toast.success(
          this.translate.instant(result.reasonPhrase),
          this.translate.instant('Message')
        );
        modal.dismiss();
        this.GetAllBranches();
      } else {
        this.toast.error(
          this.translate.instant(result.reasonPhrase),
          this.translate.instant('Message')
        );
      }
    });
    debugger;
    await this.getpriv(this.selectedTaskss1);
    const AccountTreeEA: any = [];
    this.selectedTaskss1.forEach((element: any) => {
      AccountTreeEA.push(Number(element.id));
    });

    this.organizationService
      .SaveAccountTreeEA(AccountTreeEA)
      .subscribe((result: any) => {});

    await this.getpriv(this.selectedTask2);
    const AccountTree: any = [];
    this.selectedTask2.forEach((element: any) => {
      AccountTree.push(Number(element.id));
    });

    this.organizationService
      .SaveAccountTree(AccountTree)
      .subscribe((result: any) => {});
    await this.getpriv(this.selectedTask3);
    const AccountTreePublicRev: any = [];
    this.selectedTask3.forEach((element: any) => {
      AccountTreePublicRev.push(Number(element.id));
    });

    this.organizationService
      .SaveAccountTreePublicRev(AccountTreePublicRev)
      .subscribe((result: any) => {});

    await this.getpriv(this.selectedTask4);
    const AccountTreeotherrev: any = [];
    this.selectedTask4.forEach((element: any) => {
      AccountTreeotherrev.push(Number(element.id));
    });
    this.organizationService
      .SaveAccountTreeotherrev(AccountTreeotherrev)
      .subscribe((result: any) => {});
  }
  intialModelvacationForm() {
    this.vacationForm = this.formBuilder.group({
      holidayName: [null, [Validators.required]],
      FromDate: [null, [Validators.required]],
      ToDate: [null, [Validators.required]],
      id: ['0', []],
    });
  }
  vacationList: any;
  GetAllOfficalHoliday() {
    this.organizationService.GetAllOfficalHoliday().subscribe((result: any) => {
      this.vacationList = result.result;
    });
  }
  Getvacation(data: any) {
    this.vacationForm.controls['id'].setValue(data.id);
    this.vacationForm.controls['FromDate'].setValue(new Date(data.fromDate));
    this.vacationForm.controls['ToDate'].setValue(new Date(data.toDate));
    this.vacationForm.controls['holidayName'].setValue(data.description);
  }
  vacationiddelete: any;
  deletevacationItem() {
    this.organizationService
      .DeleteOfficalHoliday(this.vacationiddelete)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.GetAllOfficalHoliday();
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }
  saveVacation(modal: any) {
    if (
      this.vacationForm.controls['id'].value != null &&
      this.vacationForm.controls['FromDate'].value != null &&
      this.vacationForm.controls['ToDate'].value != null &&
      this.vacationForm.controls['holidayName'].value != null
    ) {
      const data = {
        Id: this.vacationForm.controls['id'].value,
        FromDate: this._sharedService.date_TO_String(
          this.vacationForm.controls['FromDate'].value
        ),
        ToDate: this._sharedService.date_TO_String(
          this.vacationForm.controls['ToDate'].value
        ),
        Description: this.vacationForm.controls['holidayName'].value,
      };
      this.organizationService
        .SaveOfficalHoliday(data)
        .subscribe((result: any) => {
          if (result.statusCode == 200) {
            this.toast.success(
              this.translate.instant(result.reasonPhrase),
              this.translate.instant('Message')
            );
            modal.dismiss();
            this.GetAllOfficalHoliday();
          } else {
            this.toast.error(
              this.translate.instant(result.reasonPhrase),
              this.translate.instant('Message')
            );
          }
        });
    }
  }

  intialModelstaffTimeForm() {
    this.staffTimeForm = this.formBuilder.group({
      TimeId: ['0', [Validators.required]],
      nameAr: [null, [Validators.required]],
      nameEn: [null, [Validators.required]],
      notes: [null, [Validators.required]],
      BranchId: [this.userG.branchId, [Validators.required]],
    });
  }
  GetstaffTime(data: any) {
    this.staffTimeForm.controls['TimeId'].setValue(data.timeId);
    this.staffTimeForm.controls['nameAr'].setValue(data.nameAr);
    this.staffTimeForm.controls['nameEn'].setValue(data.nameEn);
    this.staffTimeForm.controls['notes'].setValue(data.notes);
    this.staffTimeForm.controls['BranchId'].setValue(
      data.branchId ?? this.userG.branchId
    );
  }
  AllStaffTime: any;
  GetAllStaffTime() {
    this.organizationService.GetAllStaffTime().subscribe((result: any) => {
      this.AllStaffTime = result.result;
    });
  }
  addStaffTime(modal: any) {
    if (
      this.staffTimeForm.controls['TimeId'].value != null &&
      this.staffTimeForm.controls['nameAr'].value != null &&
      this.staffTimeForm.controls['nameEn'].value != null &&
      this.staffTimeForm.controls['BranchId'].value != null
    ) {
      this.organizationService
        .addStaffTime(this.staffTimeForm.value)
        .subscribe((result: any) => {
          if (result.statusCode == 200) {
            this.toast.success(
              this.translate.instant(result.reasonPhrase),
              this.translate.instant('Message')
            );
            modal.dismiss();
            this.GetAllStaffTime();
          } else {
            this.toast.error(
              this.translate.instant(result.reasonPhrase),
              this.translate.instant('Message')
            );
          }
        });
    }
  }
  staffTimeIddelete: any;
  deletestaffTimeId() {
    this.organizationService
      .deletestaffTimeId(this.staffTimeIddelete)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.GetAllStaffTime();
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }
  daylist = [
    { id: 1, nameAR: 'السبت', nameEN: 'Saturday' },
    { id: 2, nameAR: 'الاحد', nameEN: 'Sunday' },
    { id: 3, nameAR: 'الاتنين', nameEN: 'Monday' },
    { id: 4, nameAR: 'الثلاثاء', nameEN: 'Tuesday' },
    { id: 5, nameAR: 'الاربعاء', nameEN: 'Wednesday' },
    { id: 6, nameAR: 'الخميس', nameEN: 'Thursday' },
    { id: 7, nameAR: 'الجمعه', nameEN: 'Friday' },
    { id: 8, nameAR: 'جميع ايام العمل', nameEN: 'All working days' },
  ];

  intialModelstaffTimeDetailsForm() {
    this.staffTimeDetailsForm = this.formBuilder.group({
      day: [null, [Validators.required]],
      from: [null, [Validators.required]],
      to: [null, [Validators.required]],
      secondPeriod: [null, []],
      from2: [null, []],
      to2: [null, []],
      timeDetailsId: [null, []],
      attTimeId: [null, []],
    });
  }
  day: any;
  from: any;
  to: any;
  secondPeriod: any = false;
  from2: any;
  to2: any;
  timeDetailsId: any = 0;
  attTimeId: any;
  staffTimeDetailsSource: any;
  GetstaffTimedetails(data: any) {
    this.organizationService
      .GetAllAttTimeDetails(data)
      .subscribe((result: any) => {
        this.resetTimeseft();
        this.staffTimeDetailsSource = [];
        this.staffTimeDetailsSource = result.result;

        this.attTimeId = data;
      });
  }
  Changetimeto() {
    const from = this._sharedService.formatAMPM(this.from);
    console.log(from);
  }
  editstaffTimeDetails(result: any) {
    this.day = result.day;
    this.from = new Date(result._1StFromHour);
    this.to = new Date(result._1StToHour);
    if (result._2ndFromHour || result._2ndToHour) {
      this.secondPeriod = true;
    } else {
      this.secondPeriod = false;
    }
    this.from2 = new Date(result._2ndFromHour);
    this.to2 = new Date(result._2ndToHour);
    this.timeDetailsId = result.timeDetailsId;
    this.attTimeId = result.attTimeId;
  }
  resetTimeseft() {
    this.day = null;
    this.from = null;
    this.to = null;
    this.secondPeriod = false;
    this.from2 = null;
    this.to2 = null;
    this.timeDetailsId = 0;
    this.attTimeId = null;
  }
  timeList = [
    { id: '00:00 AM', name: '12:00 AM' },
    { id: '00:30 AM', name: '12:30 AM' },
    { id: '01:00 AM', name: '01:00 AM' },
    { id: '01:30 AM', name: '01:30 AM' },
    { id: '02:00 AM', name: '02:00 AM' },
    { id: '02:30 AM', name: '02:30 AM' },
    { id: '03:00 AM', name: '03:00 AM' },
    { id: '03:30 AM', name: '03:30 AM' },
    { id: '04:00 AM', name: '04:00 AM' },
    { id: '04:30 AM', name: '04:30 AM' },
    { id: '05:00 AM', name: '05:00 AM' },
    { id: '05:30 AM', name: '05:30 AM' },
    { id: '06:00 AM', name: '06:00 AM' },
    { id: '06:30 AM', name: '06:30 AM' },
    { id: '07:00 AM', name: '07:00 AM' },
    { id: '07:30 AM', name: '07:30 AM' },
    { id: '08:00 AM', name: '08:00 AM' },
    { id: '08:30 AM', name: '08:30 AM' },
    { id: '09:00 AM', name: '09:00 AM' },
    { id: '09:30 AM', name: '09:30 AM' },
    { id: '10:00 AM', name: '10:00 AM' },
    { id: '10:30 AM', name: '10:30 AM' },
    { id: '11:00 AM', name: '11:00 AM' },
    { id: '11:30 AM', name: '11:30 AM' },
    { id: '12:00 PM', name: '12:00 PM' },
    { id: '12:30 PM', name: '12:30 PM' },
    { id: '01:00 PM', name: '01:00 PM' },
    { id: '01:30 PM', name: '01:30 PM' },
    { id: '02:00 PM', name: '02:00 PM' },
    { id: '02:30 PM', name: '02:30 PM' },
    { id: '03:00 PM', name: '03:00 PM' },
    { id: '03:30 PM', name: '03:30 PM' },
    { id: '04:00 PM', name: '04:00 PM' },
    { id: '04:30 PM', name: '04:30 PM' },
    { id: '05:00 PM', name: '05:00 PM' },
    { id: '05:30 PM', name: '05:30 PM' },
    { id: '06:00 PM', name: '06:00 PM' },
    { id: '06:30 PM', name: '06:30 PM' },
    { id: '07:00 PM', name: '07:00 PM' },
    { id: '07:30 PM', name: '07:30 PM' },
    { id: '08:00 PM', name: '08:00 PM' },
    { id: '08:30 PM', name: '08:30 PM' },
    { id: '09:00 PM', name: '09:00 PM' },
    { id: '09:30 PM', name: '09:30 PM' },
    { id: '10:00 PM', name: '10:00 PM' },
    { id: '10:30 PM', name: '10:30 PM' },
    { id: '11:00 PM', name: '11:00 PM' },
    { id: '11:30 PM', name: '11:30 PM' },
  ];
  formattime(timeString: any) {
    var hourreplaceForm;
    if (timeString.includes('AM')) {
      hourreplaceForm = timeString.replace(' AM', ':00');
    } else if (timeString.includes('PM')) {
      hourreplaceForm = timeString.replace(' PM', ':00');
      var hourForm = hourreplaceForm.substring(0, 2);
      var minuteForm = Number(hourForm) + 12;
      if (minuteForm == 24) {
        minuteForm = 12;
      }
      hourreplaceForm = hourreplaceForm.replace(
        hourreplaceForm.substring(0, 2),
        minuteForm
      );
    }
    const year =
      String(new Date().getFullYear()).length === 1
        ? '0' + new Date().getFullYear()
        : new Date().getFullYear();
    const month =
      String(new Date().getMonth() + 1).length === 1
        ? '0' + (new Date().getMonth() + 1)
        : new Date().getMonth() + 1;
    const day =
      String(new Date().getDate()).length === 1
        ? '0' + new Date().getDate()
        : new Date().getDate();
    return year + '-' + month + '-' + day + 'T' + hourreplaceForm;
    // return year + "-" + month + "-" + day + ' ' + hourreplaceForm
  }
  setstaffTimeDetails() {
    if (this.day != null && this.from != null && this.to != null) {
      var prames = {};
      if (this.secondPeriod == true && this.from2 != null && this.to2 != null) {
        const from = this.formattime(this.from);
        const to = this.formattime(this.to);
        const from2 = this.formattime(this.from2);
        const to2 = this.formattime(this.to2);
        prames = {
          TimeDetailsId: this.timeDetailsId,
          AttTimeId: this.attTimeId,
          Day: this.day,
          _1StFromHour: from,
          _1StToHour: to,
          _2ndFromHour: from2,
          _2ndToHour: to2,
          BranchId: '1',
          // _1StFromHour: formatDate(this.from, 'yyyy-MM-ddThh:mm:ss', 'en', "GMT+05"),
          // _1StToHour: formatDate(this.to, 'yyyy-MM-ddThh:mm:ss', 'en', "GMT+05"),
          // _2ndFromHour: formatDate(this.from2, 'yyyy-MM-ddThh:mm:ss', 'en', "GMT+05"),
          // _2ndToHour: formatDate(this.to2, 'yyyy-MM-ddThh:mm:ss', 'en', "GMT+05"),
        };
      } else {
        const from = this.formattime(this.from);
        const to = this.formattime(this.to);
        prames = {
          TimeDetailsId: this.timeDetailsId,
          AttTimeId: this.attTimeId,
          Day: this.day,
          _1StFromHour: from,
          _1StToHour: to,
          BranchId: '1',
          // _1StFromHour:formatDate(this.to, 'yyyy-MM-ddThh:mm:ssZZZZZ', 'en', "GMT+05"),
          // _1StToHour: formatDate(this.to, 'yyyy-MM-ddThh:mm:ssZZZZZ', 'en', "GMT+05"),
        };
      }
      this.organizationService
        .SaveAttTimeDetails(prames)
        .subscribe((result: any) => {
          if (result.statusCode == 200) {
            this.GetstaffTimedetails(this.attTimeId);
            this.resetTimeseft();
            this.toast.success(
              this.translate.instant(result.reasonPhrase),
              this.translate.instant('Message')
            );
          } else {
            this.toast.error(
              this.translate.instant(result.reasonPhrase),
              this.translate.instant('Message')
            );
          }
        });
    }
  }
  DetailsstaffTimeIddelete: any;
  deletestaffTimeDetails() {
    this.organizationService
      .deletestaffTimeDetails(this.DetailsstaffTimeIddelete)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.GetstaffTimedetails(this.attTimeId);
          this.resetTimeseft();
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }

  ContractEndNoteList = [
    { id: 1, nameAR: '30 يوم', nameEN: '30 Day' },
    { id: 2, nameAR: '60 يوم', nameEN: '60 Day' },
    { id: 3, nameAR: '90 يوم ', nameEN: '90 Day ' },
    { id: 4, nameAR: '120 يوم', nameEN: '120Day' },
  ];

  intialModelsystemoptionsFormForm() {
    this.systemoptionsForm = this.formBuilder.group({
      PhoneNoDigits: [null, []],
      MobileNoDigits: [null, []],
      NationalIDDigits: [null, []],
      DecimalPoints: [null, []],
      Contract_Con_Code: [null, []],
      ProjGenerateCode: [null, []],
      OfferGenerateCode: [null, []],
      Contract_Sup_Code: [null, []],
      Contract_Des_Code: [null, []],
      ContractGenerateCode: [null, []],
      ContractGenerateCode2: [null, []],
      ResedentEndNote: [null, []],
      ContractEndNote: [null, []],
      CustomerMailIsRequired: [false, []],
      CustomerNationalIdIsRequired: [false, []],
      CustomerphoneIsRequired: [false, []],
      ValueAddedSeparated: [false, []],

      SettingId: [null, []],

      UploadInvZatca: [false, []],
      BranchGenerateCode: [null, []],
      EmpGenerateCode: [null, []],
      VoucherGenerateCode: [null, []],
      SaveSystemSettings: [null, []],

      EditUserName1: [null, []],
      EditUserDate1: [null, []],

      OrganizationId: [null, []],
      VatPercentVal: [null, []],
      VAtACCStatusSelectId: [null, []],
      EditUserName: [null, []],
      EditUserDate: [null, []],
    });
  }
  GetSystemSettingsByUserId() {
    this.organizationService
      .GetSystemSettingsByUserId()
      .subscribe((result: any) => {
        // this.systemoptionsForm.setValue(result)
        this.systemoptionsForm.controls['PhoneNoDigits'].setValue(
          result?.phoneNoDigits
        );
        this.systemoptionsForm.controls['MobileNoDigits'].setValue(
          result?.mobileNoDigits
        );
        this.systemoptionsForm.controls['NationalIDDigits'].setValue(
          result?.nationalIDDigits
        );
        this.systemoptionsForm.controls['DecimalPoints'].setValue(
          result?.decimalPoints
        );
        this.systemoptionsForm.controls['Contract_Con_Code'].setValue(
          result?.contract_Con_Code
        );
        this.systemoptionsForm.controls['ProjGenerateCode'].setValue(
          result?.projGenerateCode
        );
        this.systemoptionsForm.controls['OfferGenerateCode'].setValue(
          result?.offerGenerateCode
        );
        this.systemoptionsForm.controls['Contract_Sup_Code'].setValue(
          result?.contract_Sup_Code
        );
        this.systemoptionsForm.controls['Contract_Des_Code'].setValue(
          result?.contract_Des_Code
        );
        this.systemoptionsForm.controls['ContractGenerateCode'].setValue(
          result?.contractGenerateCode
        );
        this.systemoptionsForm.controls['ContractGenerateCode2'].setValue(
          result?.contractGenerateCode2
        );
        this.systemoptionsForm.controls['ResedentEndNote'].setValue(
          result?.resedentEndNote
        );
        this.systemoptionsForm.controls['ContractEndNote'].setValue(
          result?.contractEndNote
        );
        this.systemoptionsForm.controls['CustomerMailIsRequired'].setValue(
          result?.customerMailIsRequired
        );
        this.systemoptionsForm.controls[
          'CustomerNationalIdIsRequired'
        ].setValue(result?.customerNationalIdIsRequired);
        this.systemoptionsForm.controls['CustomerphoneIsRequired'].setValue(
          result?.customerphoneIsRequired
        );
        this.systemoptionsForm.controls['ValueAddedSeparated'].setValue(
          result?.valueAddedSeparated
        );
        this.systemoptionsForm.controls['SettingId'].setValue(
          result?.settingId
        );
        this.systemoptionsForm.controls['UploadInvZatca'].setValue(
          result?.uploadInvZatca
        );
        this.systemoptionsForm.controls['EditUserName1'].setValue(
          result?.editUserName
        );
        this.systemoptionsForm.controls['EditUserDate1'].setValue(
          result?.editUserDate
        );
        this.mainInfoForm.controls['OrgDataIsRequired'].setValue(
          result?.orgDataIsRequired
        );
      });
  }
  // CustomerMailIsRequired: any = false
  // CustomerNationalIdIsRequired: any = false
  // CustomerphoneIsRequired: any = false
  Savesystemoptions() {
    debugger;
    // if (this.systemoptionsForm.controls["SettingId"].value == null || this.systemoptionsForm.controls["SettingId"].value == '') {
    //   if (this.systemoptionsForm.controls["CustomerMailIsRequired"].value == false) {
    //     this.CustomerMailIsRequired = true
    //     return
    //   } else { this.CustomerMailIsRequired = false }
    //   if (this.systemoptionsForm.controls["CustomerNationalIdIsRequired"].value == false) {
    //     this.CustomerNationalIdIsRequired = true
    //     return
    //   } else { this.CustomerNationalIdIsRequired = false }
    //   if (this.systemoptionsForm.controls["CustomerphoneIsRequired"].value == false) {
    //     this.CustomerphoneIsRequired = true
    //     return
    //   } else {
    //     this.CustomerphoneIsRequired = false
    //   }
    // }
    if (
      this.systemoptionsForm.controls['SettingId'].value != null &&
      this.systemoptionsForm.controls['PhoneNoDigits'].value != null &&
      this.systemoptionsForm.controls['MobileNoDigits'].value != null &&
      this.systemoptionsForm.controls['NationalIDDigits'].value != null &&
      // this.systemoptionsForm.controls['DecimalPoints'].value != null &&
      // this.systemoptionsForm.controls['ProjGenerateCode'].value != null &&
      // this.systemoptionsForm.controls['OfferGenerateCode'].value != null &&
      // this.systemoptionsForm.controls['ContractGenerateCode'].value != null &&
      // this.systemoptionsForm.controls['ContractGenerateCode2'].value != null &&
      this.systemoptionsForm.controls['ResedentEndNote'].value != null &&
      this.systemoptionsForm.controls['ContractEndNote'].value != null &&
      // this.systemoptionsForm.controls['Contract_Con_Code'].value != null &&
      // this.systemoptionsForm.controls['Contract_Sup_Code'].value != null &&
      // this.systemoptionsForm.controls['Contract_Des_Code'].value != null &&
      this.systemoptionsForm.controls['CustomerMailIsRequired'].value != null &&
      this.systemoptionsForm.controls['CustomerphoneIsRequired'].value !=
        null &&
        this.systemoptionsForm.controls['ValueAddedSeparated'].value !=
        null &&
      this.systemoptionsForm.controls['UploadInvZatca'].value != null &&
      this.systemoptionsForm.controls['CustomerNationalIdIsRequired'].value !=
        null
    ) {
      const prames = {
        SettingId:
          this.systemoptionsForm.controls['SettingId'].value.toString(),
        PhoneNoDigits:
          this.systemoptionsForm.controls['PhoneNoDigits'].value.toString(),
        MobileNoDigits:
          this.systemoptionsForm.controls['MobileNoDigits'].value.toString(),
        NationalIDDigits:
          this.systemoptionsForm.controls['NationalIDDigits'].value.toString(),
        DecimalPoints: '2',
        //this.systemoptionsForm.controls['DecimalPoints'].value.toString(),
        ProjGenerateCode:
          this.systemoptionsForm.controls['ProjGenerateCode'].value,
        OfferGenerateCode:
          this.systemoptionsForm.controls['OfferGenerateCode'].value,
        ContractGenerateCode:
          this.systemoptionsForm.controls['ContractGenerateCode'].value,
        ContractGenerateCode2:
          this.systemoptionsForm.controls['ContractGenerateCode2'].value,
        ResedentEndNote:
          this.systemoptionsForm.controls['ResedentEndNote'].value.toString(),
        ContractEndNote:
          this.systemoptionsForm.controls['ContractEndNote'].value.toString(),
        Contract_Con_Code:
          this.systemoptionsForm.controls['Contract_Con_Code'].value,
        Contract_Sup_Code:
          this.systemoptionsForm.controls['Contract_Sup_Code'].value,
        Contract_Des_Code:
          this.systemoptionsForm.controls['Contract_Des_Code'].value,
        CustomerMailIsRequired:
          this.systemoptionsForm.controls['CustomerMailIsRequired'].value,
        CustomerphoneIsRequired:
          this.systemoptionsForm.controls['CustomerphoneIsRequired'].value,
          ValueAddedSeparated:
          this.systemoptionsForm.controls['ValueAddedSeparated'].value,
        UploadInvZatca: this.systemoptionsForm.controls['UploadInvZatca'].value,
        CustomerNationalIdIsRequired:
          this.systemoptionsForm.controls['CustomerNationalIdIsRequired'].value,

        // BranchGenerateCode: this.systemoptionsForm.controls["BranchGenerateCode"].value,
        // EmpGenerateCode: this.systemoptionsForm.controls["EmpGenerateCode"].value,
        // VoucherGenerateCode: this.systemoptionsForm.controls["EmpGenerateCode"].value,
        // SaveSystemSettings: this.systemoptionsForm.controls["SaveSystemSettings"].value,
      };
      this.organizationService.SaveSystemSettings(prames).subscribe(
        (result: any) => {
          if (result.statusCode == 200) {
            this.toast.success(
              this.translate.instant(result.reasonPhrase),
              this.translate.instant('Message')
            );
            this.GetSystemSettingsByUserId();
          } else {
            this.toast.error(
              this.translate.instant(result.reasonPhrase),
              this.translate.instant('Message')
            );
          }
        },
        (error) => {
          this.toast.error(
            this.translate.instant(error.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      );
    } else {
      this.toast.error('أكمل البيانات', this.translate.instant('Message'));
    }
  }
  GetALLOrgData() {
    this.organizationService.GetALLOrgData().subscribe((result: any) => {
      this.systemoptionsForm.controls['OrganizationId'].setValue(
        result?.result?.organizationId
      );
      this.systemoptionsForm.controls['VatPercentVal'].setValue(
        result?.result?.vat
      );
      this.systemoptionsForm.controls['VAtACCStatusSelectId'].setValue(
        result?.result?.vatSetting
      );
      this.systemoptionsForm.controls['EditUserName'].setValue(
        result?.result?.editUserName
      );
      this.systemoptionsForm.controls['EditUserDate'].setValue(
        result?.result?.editUserDate
      );
    });
  }
  SavepartialOrganizations() {
    if (this.systemoptionsForm.controls['VatPercentVal'].value == null) {
      return;
    } else {
      const prames = {
        OrganizationId:
          this.systemoptionsForm.controls['OrganizationId'].value.toString(),
        VAT: this.systemoptionsForm.controls['VatPercentVal'].value.toString(),
        // VATSetting: this.systemoptionsForm.controls["VAtACCStatusSelectId"].value,
      };
      this.organizationService.SavepartialOrganizations(prames).subscribe(
        (result: any) => {
          if (result.statusCode == 200) {
            this.toast.success(
              this.translate.instant(result.reasonPhrase),
              this.translate.instant('Message')
            );
            this.GetSystemSettingsByUserId();
            this.GetALLOrgData();
          } else {
            this.toast.error(
              this.translate.instant(result.reasonPhrase),
              this.translate.instant('Message')
            );
          }
        },
        (error) => {
          this.toast.error(
            this.translate.instant(error.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      );
    }
  }
  ValidateZatcaRequest() {
    if (this.systemoptionsForm.controls['UploadInvZatca'].value == false) {
      this.organizationService
        .ValidateZatcaRequest({
          Isuploadzatca:
            this.systemoptionsForm.controls['UploadInvZatca'].value,
        })
        .subscribe((result: any) => {
          if (result.statusCode == 200) {
            this.toast.success(
              this.translate.instant(result.reasonPhrase),
              this.translate.instant('Message')
            );
          } else {
            this.toast.error(
              this.translate.instant(result.reasonPhrase),
              this.translate.instant('Message')
            );
          }
        });
    }
  }

  ContactBranchesList = [];

  GetAllContactBranches() {
    this.organizationService
      .GetAllContactBranches()
      .subscribe((result: any) => {
        this.resetTimeseft();
        this.ContactBranchesList = result.result;
      });
  }
  BranchPhoneError: any = false;
  BranchCSError: any = false;
  intialModelContactBranchesFormForm() {
    this.ContactBranchesForm = this.formBuilder.group({
      ContactId: [0, []],
      BranchName: [null, [Validators.required]],
      BranchAddress: [null, [Validators.required]],
      BranchPhone: [null, [Validators.required, Validators.minLength(10)]],
      BranchCS: [null, [Validators.required, Validators.minLength(10)]],
      BranchEmail: [null, [Validators.required]],
    });
  }
  checkBranchManagerMobile() {
    this.ContactBranchesForm.controls['BranchPhone'].value.toString().length <
    10
      ? (this.BranchPhoneError = true)
      : (this.BranchPhoneError = false);
  }
  addBranchDataModal(item: any) {
    this.ContactBranchesForm.controls['ContactId'].setValue(item?.contactId);
    this.ContactBranchesForm.controls['BranchName'].setValue(item?.branchName);
    this.ContactBranchesForm.controls['BranchAddress'].setValue(
      item?.branchAddress
    );
    this.ContactBranchesForm.controls['BranchPhone'].setValue(
      item?.branchPhone
    );
    this.ContactBranchesForm.controls['BranchCS'].setValue(item?.branchCS);
    this.ContactBranchesForm.controls['BranchEmail'].setValue(
      item?.branchEmail
    );
  }
  addConectBranch(modal: any) {
    if (
      this.ContactBranchesForm.controls['BranchName'].value != null &&
      this.ContactBranchesForm.controls['BranchAddress'].value != null &&
      this.ContactBranchesForm.controls['BranchPhone'].value != null &&
      this.ContactBranchesForm.controls['BranchCS'].value != null &&
      this.ContactBranchesForm.controls['BranchEmail'].value != null &&
      this.BranchCSError == false &&
      this.BranchPhoneError == false
    ) {
      const prames = {
        ContactId:
          this.ContactBranchesForm.controls['ContactId'].value.toString(),
        BranchName:
          this.ContactBranchesForm.controls['BranchName'].value.toString(),
        BranchAddress:
          this.ContactBranchesForm.controls['BranchAddress'].value.toString(),
        BranchPhone:
          this.ContactBranchesForm.controls['BranchPhone'].value.toString(),
        BranchCS:
          this.ContactBranchesForm.controls['BranchCS'].value.toString(),
        BranchEmail:
          this.ContactBranchesForm.controls['BranchEmail'].value.toString(),
      };
      this.organizationService.SaveContactBranches(prames).subscribe(
        (result: any) => {
          if (result.statusCode == 200) {
            this.toast.success(
              this.translate.instant(result.reasonPhrase),
              this.translate.instant('Message')
            );
            this.GetAllContactBranches();
            modal.dismiss();
          } else {
            this.toast.error(
              this.translate.instant(result.reasonPhrase),
              this.translate.instant('Message')
            );
          }
        },
        (error) => {
          this.toast.error(
            this.translate.instant(error.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      );
    }
  }

  deleteBranchDataModal: any;
  DeleteContactBranches() {
    this.organizationService
      .DeleteContactBranches(this.deleteBranchDataModal)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.GetAllContactBranches();
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }

  intialaddSocialDataModalForm() {
    this.SocialDataModalForm = this.formBuilder.group({
      LinksId: ['0', []],
      FaceBookLink: [null, []],
      TwitterLink: [null, []],
      GooglePlusLink: [null, []],
      InstagramLink: [null, []],
      SnapchatLink: [null, []],
      LinkedInLink: [null, []],
    });
  }
  SocialMediaLinksList: any;
  GetAllSocialMediaLinks() {
    this.organizationService
      .GetAllSocialMediaLinks()
      .subscribe((result: any) => {
        this.SocialMediaLinksList = result.result;
        this.SocialDataModalForm.controls['LinksId'].setValue(
          this.SocialMediaLinksList?.linksId
        );
        this.SocialDataModalForm.controls['FaceBookLink'].setValue(
          this.SocialMediaLinksList?.faceBookLink
        );
        this.SocialDataModalForm.controls['TwitterLink'].setValue(
          this.SocialMediaLinksList?.twitterLink
        );
        this.SocialDataModalForm.controls['GooglePlusLink'].setValue(
          this.SocialMediaLinksList?.googlePlusLink
        );
        this.SocialDataModalForm.controls['InstagramLink'].setValue(
          this.SocialMediaLinksList?.instagramLink
        );
        this.SocialDataModalForm.controls['SnapchatLink'].setValue(
          this.SocialMediaLinksList?.snapchatLink
        );
        this.SocialDataModalForm.controls['LinkedInLink'].setValue(
          this.SocialMediaLinksList?.linkedInLink
        );
      });
  }

  addSocialDataModal() {
    const prames = {
      LinksId: this.SocialDataModalForm.controls['LinksId'].value.toString(),
      FaceBookLink:
        this.SocialDataModalForm.controls['FaceBookLink'].value.toString(),
      TwitterLink:
        this.SocialDataModalForm.controls['TwitterLink'].value.toString(),
      GooglePlusLink:
        this.SocialDataModalForm.controls['GooglePlusLink'].value.toString(),
      InstagramLink:
        this.SocialDataModalForm.controls['InstagramLink'].value.toString(),
      SnapchatLink:
        this.SocialDataModalForm.controls['SnapchatLink'].value.toString(),
      LinkedInLink:
        this.SocialDataModalForm.controls['LinkedInLink'].value.toString(),
    };
    this.organizationService.SaveSocialMediaLinks(prames).subscribe(
      (result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      },
      (error) => {
        this.toast.error(
          this.translate.instant(error.reasonPhrase),
          this.translate.instant('Message')
        );
      }
    );
  }
  AllNewsList: any;
  GetAllNews() {
    this.organizationService.GetAllNews().subscribe((result: any) => {
      this.AllNewsList = result.result;
    });
  }

  intialNewsModalForm() {
    this.NewsModalForm = this.formBuilder.group({
      UploadedImage: [null, []],
      NewsId: ['0', []],
      NewsTitleAr: [null, [Validators.required]],
      NewsTitleEn: [null, [Validators.required]],
      NewsBodyAr: [null, [Validators.required]],
      NewsBodyEn: [null, [Validators.required]],
    });
  }
  NewsBodyArError: any = false;
  NewsBodyEnError: any = false;
  NewsTitleArError: any = false;
  NewsTitleEnError: any = false;
  editNewsModal(item: any) {
    this.NewsModalForm.controls['UploadedImage'].setValue(
      item?.newsImg == '' ? null : item?.newsImg
    );
    this.NewsModalForm.controls['NewsId'].setValue(item?.newsId);
    this.NewsModalForm.controls['NewsTitleAr'].setValue(item?.newsTitleAr);
    this.NewsModalForm.controls['NewsTitleEn'].setValue(item?.newsTitleEn);
    this.NewsModalForm.controls['NewsBodyAr'].setValue(item?.newsBodyAr);
    this.NewsModalForm.controls['NewsBodyEn'].setValue(item?.newsBodyEn);
  }
  saveNews() {
    if (
      this.NewsBodyArError == false &&
      this.NewsBodyEnError == false &&
      this.NewsTitleArError == false &&
      this.NewsTitleEnError == false &&
      this.NewsModalForm.controls['NewsId'].value != null &&
      this.NewsModalForm.controls['NewsTitleAr'].value != null &&
      this.NewsModalForm.controls['NewsTitleEn'].value != null &&
      this.NewsModalForm.controls['NewsBodyAr'].value != null &&
      this.NewsModalForm.controls['NewsBodyEn'].value != null
    ) {
      const formData = new FormData();

      if (
        this.NewsModalForm.controls['UploadedImage'].value == null &&
        this.NewsModalimageFileOutput != null
      ) {
        formData.append('postedFiles', this.NewsModalimageFileOutput);
      }
      formData.append('NewsId', this.NewsModalForm.controls['NewsId'].value);
      formData.append(
        'NewsTitleAr',
        this.NewsModalForm.controls['NewsTitleAr'].value
      );
      formData.append(
        'NewsTitleEn',
        this.NewsModalForm.controls['NewsTitleEn'].value
      );
      formData.append(
        'NewsBodyAr',
        this.NewsModalForm.controls['NewsBodyAr'].value
      );
      formData.append(
        'NewsBodyEn',
        this.NewsModalForm.controls['NewsBodyEn'].value
      );

      this.organizationService.SaveNews(formData).subscribe(
        (result: any) => {
          if (result.statusCode == 200) {
            this.toast.success(
              this.translate.instant(result.reasonPhrase),
              this.translate.instant('Message')
            );
            this.intialNewsModalForm();
            this.controlNewsModaImage.clear();
            this.NewsBodyArError = false;
            this.NewsBodyEnError = false;
            this.NewsTitleArError = false;
            this.NewsTitleEnError = false;
            this.GetAllNews();
            this.uploadedFileImgNewsModal.next('');
            this.NewsModalimageFileOutput = null;
          } else {
            this.toast.error(
              this.translate.instant(result.reasonPhrase),
              this.translate.instant('Message')
            );
          }
        },
        (error) => {
          this.toast.error(
            this.translate.instant(error.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      );
    }
  }

  deleteNewsModalId: any;
  DeleteNews() {
    this.organizationService
      .deleteNews(this.deleteNewsModalId)
      .subscribe((result: any) => {
        this.GetAllNews();
      });
  }

  goDash() {
    this.router.navigate(['/dash/home']);
  }

  setEmailSetting(data: any) {}
  saveOption(data: any) {}

  setSetting(data: any) {}

  saveSetting(data: any) {}

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

  SMSTest: any;
  SendSMS_test() {
    debugger;
    var sms = this.SavesmsSettingForm.controls['SMSTest'].value;
    if (sms == null || sms == '') {
      this.toast.error(
        'ادخل الرقم ',
        this.translate.instant('Message')
      );
      return;
    }
    this.organizationService.SendSMS_test(sms).subscribe(
      (result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      },
      (error) => {
        this.toast.error(
          this.translate.instant(error.reasonPhrase),
          this.translate.instant('Message')
        );
      }
    );
  }

  SendWhatsApp_test() {
    debugger;
    var sms = this.SaveWhatsAppSettingForm.controls['WhatsAppTest'].value;

    if (sms == null || sms == '') {
      this.toast.error(
        'ادخل الرقم ',
        this.translate.instant('Message')
      );
      return;
    }
    this.organizationService.SendWhatsApp_test(sms,environment.PhotoURL).subscribe((result: any) => {
      debugger
        if (result.statusCode == 200) {
          this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant('Message')
          );
        } else {
          this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant('Message')
          );
        }
      }
    );
  }



  EmailTest: any;
  SendMail_test() {
    debugger;
    var mail = this.saveEmailForm.controls['EmailTest'].value;
    if (mail == null || mail == '') {
      this.toast.error(
        'ادخل بريد الكتروني ',
        this.translate.instant('Message')
      );
      return;
    }
    this.organizationService.SendMail_test(mail).subscribe(
      (result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      },
      (error) => {
        this.toast.error(
          this.translate.instant(error.reasonPhrase),
          this.translate.instant('Message')
        );
      }
    );
  }

  emp_LateLists: any;
  emp_AbsenceLists: any;
  GetLaw_Regulations() {
    this.organizationService.GetLaw_Regulations().subscribe((result: any) => {
      this.emp_LateLists = result.emp_LateLists;
      this.emp_AbsenceLists = result.emp_AbsenceLists;
    });
  }

    saveLateLaw(data:any) {
    
    this.organizationService.saveLateLaw(data).subscribe(
      (result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      },
      (error) => {
        this.toast.error(
          this.translate.instant(error.reasonPhrase),
          this.translate.instant('Message')
        );
      }
    );
  }
  saveAbsenceLaw(data:any) {
    
    this.organizationService.saveAbsenceLaw(data).subscribe(
      (result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      },
      (error) => {
        this.toast.error(
          this.translate.instant(error.reasonPhrase),
          this.translate.instant('Message')
        );
      }
    );
  }
}
