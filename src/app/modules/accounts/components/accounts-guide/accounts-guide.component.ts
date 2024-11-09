import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { SelectionModel } from '@angular/cdk/collections';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {
  FileUploadControl,
  FileUploadValidators,
} from '@iplab/ngx-file-upload';
import { RestApiService } from 'src/app/shared/services/api.service';
import { Router } from '@angular/router';
import { NodeItem, TreeCallbacks, TreeMode } from 'tree-ngx';
import { SharedService } from 'src/app/core/services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder } from '@angular/forms';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { AccountGuideService } from 'src/app/core/services/acc_Services/accountGuide.service';
import { environment } from 'src/environments/environment';
import { NgxPrintElementService } from 'ngx-print-element';

@Component({
  selector: 'app-accounts-guide',
  templateUrl: './accounts-guide.component.html',
  styleUrls: ['./accounts-guide.component.scss'],
})
export class AccountsGuideComponent implements OnInit {
  nodeItems: any;
  selectedTask1: any;

  options = {
    mode: TreeMode.SingleSelect,
    checkboxes: false,
    alwaysEmitSelected: false,
  };
  accountCode: any;

  // data in runningTasksModal
  accountingEntries = [
    {
      date: '2023-07-01',
      bondNumber: '123',
      bondType: 'Type A',
      registrationNumber: '456',
      accountCode: '789',
      accountName: 'Account A',
      statement: 'Statement A',
      debtor: 100,
      creditor: 50,
    },
    {
      date: '2023-07-02',
      bondNumber: '456',
      bondType: 'Type B',
      registrationNumber: '789',
      accountCode: '012',
      accountName: 'Account B',
      statement: 'Statement B',
      debtor: 200,
      creditor: 150,
    },
  ];

  get totalDebtor() {
    return this.accountingEntries.reduce(
      (total, entry) => total + entry.debtor,
      0
    );
  }

  get totalCreditor() {
    return this.accountingEntries.reduce(
      (total, entry) => total + entry.creditor,
      0
    );
  }

  projects: any;
  @ViewChild('SmartFollower') smartModal: any;
  title: any = {
    main: {
      name: {
        ar: 'الحسابات',
        en: 'Projects Management',
      },
      link: '/accounts',
    },
    sub: {
      ar: '  دليل الحسابات ',
      en: 'Accounts guide',
    },
  };

  selectedUser: any;
  users: any;

  closeResult = '';

  showStats = false;
  showFilters = false;
  showTable = true;

  @ViewChild(DatatableComponent) table: DatatableComponent | any;

  columns: any = [];

  isEditable: any = {};

  openBox: any = false;
  boxId: any;
  displayedColumns: string[] = [
    'offer_id',
    'date',
    'customer',
    'price',
    'user',
    'project_id',
    'project-duration',
    'operations',
  ];
  // dataSource: MatTableDataSource<any>;
  dataSource: MatTableDataSource<any> = new MatTableDataSource([{}]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  delayedProjects: any;
  latedProjects: any;

  currentDate: any;

  selectedProject: any;
  selectedRow: any;

  selectAllValue = false;

  selectedUserPermissions: any = {
    userName: '',
    watch: null,
    add: null,
    edit: null,
    delete: null,
  };
  userPermissions: any = [];

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
  projectDisplayedColumns: string[] = [
    'accountCode',
    'accountNameAR',
    'accountNameLat',
    'accountLevel',
    'AccountClas',
    'accountType',
    'MainAccount',
    'operations',
  ];

  projectUsersColumns: string[] = ['name', 'responsibility'];
  projectTasksColumns: string[] = ['taskName', 'name', 'duration'];

  userPermissionsDataSource = new MatTableDataSource();

  projectGoalsDataSource = new MatTableDataSource();

  projectUsersDataSource = new MatTableDataSource();
  projectTasksDataSource = new MatTableDataSource();

  projectsDataSource = new MatTableDataSource();

  modalDetails: any = {
    accountCode: null,
    projectDuration: null,
    branch: null,
    center: null,
    from: null,
    to: null,
    projectType: null,
    subProjectDetails: null,
    walk: null,
    active: null,
    Creditor: null,
    customer: null,
    buildingType: null,
    service: null,
    user: null,
    region: null,
    projectDescription: null,
    offerPriceNumber: null,
    projectDepartment: null,
    projectPermissions: null,
    projectGoals: null,
  };

  rows = [
    { id: 1, name_ar: 'اسم النشاط 1', name_en: 'test test' },
    { id: 2, name_ar: 'اسم النشاط 2', name_en: 'test test' },
    { id: 3, name_ar: 'اسم النشاط 3', name_en: 'test test' },
    { id: 1, name_ar: 'اسم النشاط', name_en: 'test test' },
    { id: 2, name_ar: 'اسم النشاط', name_en: 'test test' },
    { id: 3, name_ar: 'اسم النشاط', name_en: 'test test' },
    { id: 1, name_ar: 'اسم النشاط', name_en: 'test test' },
    { id: 2, name_ar: 'اسم النشاط', name_en: 'test test' },
    { id: 3, name_ar: 'اسم النشاط', name_en: 'test test' },
    { id: 1, name_ar: 'اسم النشاط', name_en: 'test test' },
    { id: 2, name_ar: 'اسم النشاط', name_en: 'test test' },
    { id: 3, name_ar: 'اسم النشاط', name_en: 'test test' },
  ];
  temp: any = [
    { id: 1, name_ar: 'اسم النشاط 1', name_en: 'test test' },
    { id: 2, name_ar: 'اسم النشاط 2', name_en: 'test test' },
    { id: 3, name_ar: 'اسم النشاط 3', name_en: 'test test' },
    { id: 1, name_ar: 'اسم النشاط', name_en: 'test test' },
    { id: 2, name_ar: 'اسم النشاط', name_en: 'test test' },
    { id: 3, name_ar: 'اسم النشاط', name_en: 'test test' },
    { id: 1, name_ar: 'اسم النشاط', name_en: 'test test' },
    { id: 2, name_ar: 'اسم النشاط', name_en: 'test test' },
    { id: 3, name_ar: 'اسم النشاط', name_en: 'test test' },
    { id: 1, name_ar: 'اسم النشاط', name_en: 'test test' },
    { id: 2, name_ar: 'اسم النشاط', name_en: 'test test' },
    { id: 3, name_ar: 'اسم النشاط', name_en: 'test test' },
  ];

  projectGoals: any = [
    {
      serial: 'adawd',
      requirements: 'adawd',
      name: 'adawd',
      duration: 'adawd',
      choose: true,
    },
    {
      serial: 'adawd',
      requirements: 'adawd',
      name: 'adawd',
      duration: 'adawd',
      choose: false,
    },
    {
      serial: 'adawd',
      requirements: 'adawd',
      name: 'adawd',
      duration: 'adawd',
      choose: false,
    },
  ];

  projectUsers: any = [
    {
      name: 'adawd',
      image: '/assets/images/login-img.png',
      responsibility: 'adawd',
    },
    {
      name: 'adawd',
      image: '/assets/images/login-img.png',
      responsibility: 'adawd',
    },
    {
      name: 'adawd',
      image: '/assets/images/login-img.png',
      responsibility: 'adawd',
    },
  ];

  projectTasks: any = [
    {
      name: 'adawd',
      image: '/assets/images/login-img.png',
      taskName: 'adawd',
      duration: 4,
    },
    {
      name: 'adawd',
      image: '/assets/images/login-img.png',
      taskName: 'adawd',
      duration: 4,
    },
    {
      name: 'adawd',
      image: '/assets/images/login-img.png',
      taskName: 'adawd',
      duration: 4,
    },
  ];
  lang: any = 'ar';

  startDate = new Date();
  endDate = new Date();
  constructor(
    private modalService: NgbModal,
    private api: RestApiService,
    private router: Router,
    private accountGuideService: AccountGuideService,
    private print: NgxPrintElementService,
    private _sharedService: SharedService,
    private toast: ToastrService,
    private translate: TranslateService,
    private fb: FormBuilder, private authenticationService: AuthenticationService
  ) {
    this.dataSource = new MatTableDataSource([{}]);
    this.currentDate = new Date();
    api.lang.subscribe((res) => {
      this.lang = res;
    });
  }

  ngOnInit(): void {
    this.nodeItems = [
      {
        id: '0',
        name: 'Heros',
        children: [
          {
            id: '1',
            name: 'Batman',
            item: {
              phrase: 'I am the batman',
            },
          },
          {
            id: '2',
            name: 'Superman',
            item: {
              phrase: 'Man of steel',
            },
          },
        ],
      },
      {
        id: '3',
        name: 'Villains',
        children: [
          {
            id: '4',
            name: 'Joker',
            item: {
              phrase: 'Why so serius',
            },
          },
          {
            id: '5',
            name: 'Lex luthor',
            item: {
              phrase: 'I am the villain of this story',
            },
          },
        ],
      },
      {
        id: '0',
        name: 'Heros',
        children: [
          {
            id: '1',
            name: 'Batman',
            item: {
              phrase: 'I am the batman',
            },
          },
          {
            id: '2',
            name: 'Superman',
            item: {
              phrase: 'Man of steel',
            },
          },
        ],
      },
      {
        id: '3',
        name: 'Villains',
        children: [
          {
            id: '4',
            name: 'Joker',
            item: {
              phrase: 'Why so serius',
            },
          },
          {
            id: '5',
            name: 'Lex luthor',
            item: {
              phrase: 'I am the villain of this story',
            },
          },
        ],
      },
      {
        id: '0',
        name: 'Heros',
        children: [
          {
            id: '1',
            name: 'Batman',
            item: {
              phrase: 'I am the batman',
            },
          },
          {
            id: '2',
            name: 'Superman',
            item: {
              phrase: 'Man of steel',
            },
          },
        ],
      },
      {
        id: '3',
        name: 'Villains',
        children: [
          {
            id: '4',
            name: 'Joker',
            item: {
              phrase: 'Why so serius',
            },
          },
          {
            id: '5',
            name: 'Lex luthor',
            item: {
              phrase: 'I am the villain of this story',
            },
          },
        ],
      },
      {
        id: '0',
        name: 'Heros',
        children: [
          {
            id: '1',
            name: 'Batman',
            item: {
              phrase: 'I am the batman',
            },
          },
          {
            id: '2',
            name: 'Superman',
            item: {
              phrase: 'Man of steel',
            },
          },
        ],
      },
      {
        id: '3',
        name: 'Villains',
        children: [
          {
            id: '4',
            name: 'Joker',
            item: {
              phrase: 'Why so serius',
            },
          },
          {
            id: '5',
            name: 'Lex luthor',
            item: {
              phrase: 'I am the villain of this story',
            },
          },
        ],
      },
      {
        id: '0',
        name: 'Heros',
        children: [
          {
            id: '1',
            name: 'Batman',
            item: {
              phrase: 'I am the batman',
            },
          },
          {
            id: '2',
            name: 'Superman',
            item: {
              phrase: 'Man of steel',
            },
          },
        ],
      },
      {
        id: '3',
        name: 'Villains',
        children: [
          {
            id: '4',
            name: 'Joker',
            item: {
              phrase: 'Why so serius',
            },
          },
          {
            id: '5',
            name: 'Lex luthor',
            item: {
              phrase: 'I am the villain of this story',
            },
          },
        ],
      },
      {
        id: '0',
        name: 'Heros',
        children: [
          {
            id: '1',
            name: 'Batman',
            item: {
              phrase: 'I am the batman',
            },
          },
          {
            id: '2',
            name: 'Superman',
            item: {
              phrase: 'Man of steel',
            },
          },
        ],
      },
      {
        id: '3',
        name: 'Villains',
        children: [
          {
            id: '4',
            name: 'Joker',
            item: {
              phrase: 'Why so serius',
            },
          },
          {
            id: '5',
            name: 'Lex luthor',
            item: {
              phrase: 'I am the villain of this story',
            },
          },
        ],
      },
      {
        id: '0',
        name: 'Heros',
        children: [
          {
            id: '1',
            name: 'Batman',
            item: {
              phrase: 'I am the batman',
            },
          },
          {
            id: '2',
            name: 'Superman',
            item: {
              phrase: 'Man of steel',
            },
          },
        ],
      },
      {
        id: '3',
        name: 'Villains',
        children: [
          {
            id: '4',
            name: 'Joker',
            item: {
              phrase: 'Why so serius',
            },
          },
          {
            id: '5',
            name: 'Lex luthor',
            item: {
              phrase: 'I am the villain of this story',
            },
          },
        ],
      },
    ];

    this.users = [
      { id: 1, Name: 'محمود نافع' },
      { id: 2, Name: 'محمود نافع' },
    ];

    this.delayedProjects = [
      {
        user: 'adwawd',
        customerName: 'adawdv',
        projectStatus: 4,
        startDate: new Date(),
        endDate: new Date(),
      },
    ];
    this.latedProjects = [
      {
        user: 'adwawd',
        customerName: 'adawdv',
        projectStatus: 0,
        startDate: new Date(),
        endDate: new Date(),
      },
    ];

    this.projects = [
      {
        accountCode: '000056',
        accountNameAR: '2023-06-13',
        accountNameLat: 'أجل',
        accountLevel: '2023-06-13',
        AccountClas: 50,
        accountType: 50,
        MainAccount: 50,
        progress: 50,
      },
      {
        accountCode: '000057',
        accountNameAR: '2023-06-13',
        accountNameLat: 'أجل',
        accountLevel: '2023-06-13',
        AccountClas: 50,
        accountType: 50,
        MainAccount: 50,
        progress: 50,
      },
      {
        accountCode: '000058',
        accountNameAR: '2023-06-13',
        accountNameLat: 'أجل',
        accountLevel: '2023-06-13',
        AccountClas: 50,
        accountType: 50,
        MainAccount: 50,
        progress: 50,
      },
      {
        accountCode: '000059',
        accountNameAR: '2023-06-13',
        accountNameLat: 'أجل',
        accountLevel: '2023-06-13',
        AccountClas: 50,
        accountType: 50,
        MainAccount: 50,
        progress: 50,
      },
      {
        accountCode: '000060',
        accountNameAR: '2023-06-13',
        accountNameLat: 'أجل',
        accountLevel: '2023-06-13',
        AccountClas: 50,
        accountType: 50,
        MainAccount: 50,
        progress: 50,
      },
    ];

    this.userPermissions = [
      {
        userName: 'adawdawd',
        watch: false,
        add: true,
        edit: true,
        delete: false,
      },
      {
        userName: 'adawdawd',
        watch: false,
        add: true,
        edit: true,
        delete: false,
      },
      {
        userName: 'adawdawd',
        watch: false,
        add: true,
        edit: true,
        delete: true,
      },
      {
        userName: 'adawdawd',
        watch: false,
        add: false,
        edit: true,
        delete: false,
      },
      {
        userName: 'adawdawd',
        watch: false,
        add: true,
        edit: true,
        delete: false,
      },
      {
        userName: 'adawdawd',
        watch: true,
        add: true,
        edit: true,
        delete: false,
      },
      {
        userName: 'adawdawd',
        watch: true,
        add: true,
        edit: true,
        delete: true,
      },
    ];

    this.projectsDataSource = new MatTableDataSource();

    this.userPermissionsDataSource = new MatTableDataSource(
      this.userPermissions
    );

    this.projectGoalsDataSource = new MatTableDataSource(this.projectGoals);

    this.projectUsersDataSource = new MatTableDataSource(this.projectUsers);

    this.projectTasksDataSource = new MatTableDataSource(this.projectTasks);


    this.GetAccountTree();
    this.GetAllAccounts();
    this.FillAccountIdAhlakSelect();
    this.FillCurrencySelect();


  }
  accId: any = 0;
  acountCode: any;
  accountNameAR: any;
  accountNameEn: any;
  creditDate: any;
  depitDate: any;
  debtor: any;
  Creditor: any;
  MainAccountCode: any;
  MainAccountName: any;
  debtorEditorial: any;
  CreditorEditorial: any;
  accountLevel: any;
  Nature: any = false;
  accounStatus: any = false;
  AccountIdAhlak: any;
  Type: any;
  classification: any;
  CurrencyId: any = "0";
  ParentId: any;
  LevelNode: any = 1;

  newAccount() {
    this.disabledcreate = false
    this.selectItemOftree = false
    this.accId = 0
    this.acountCode = null
    this.accountNameAR = null
    this.accountNameEn = null
    this.creditDate=null;
    this.depitDate=null;
    this.debtor = 0
    this.Creditor = 0
    this.MainAccountCode = null
    this.MainAccountName = null
    this.debtorEditorial = 0
    this.CreditorEditorial = 0
    this.accountLevel = null
    this.Nature = null
    this.accounStatus = false
    this.AccountIdAhlak = null
    this.Type = null
    this.classification = null
    this.CurrencyId = "0"
    this.ParentId = null
    this.LevelNode = 1
    this.selectItemOftree = false
    this.disabledcreate = false

  }
  TypeList = [
    { id: 1, name: "بدون" },
    { id: 2, name: "ميزانية" },
    { id: 3, name: "قائمة الدخل" },
    { id: 4, name: "متاجرة" },
    { id: 5, name: "أرباح وخسائر " },
  ]

  classificationList = [
    { id: 15, name: " أصول " },
    { id: 16, name: " خصوم " },
    { id: 21, name: " حقوق ملكية " },
    { id: 10, name: " إيرادات" },
    { id: 19, name: " مصروفات " },
  ]

  onAccountCodeClick(element: any) {
    this.GetAccCredit_Depit(element.accountId);
    this.accId = element.accountId
    this.acountCode = element.code
    this.MainAccountCode = element.parentAccountCode
    this.MainAccountName = element.parentAccountName
    this.accountNameAR = element.nameAr
    this.accountNameEn = element.nameEn
    if(element.openAccCreditDate)
    {
      this.creditDate =this._sharedService.String_TO_date(element.openAccCreditDate)
    }
    if(element.openAccDepitDate)
    {
      this.depitDate = this._sharedService.String_TO_date(element.openAccDepitDate)
    }
    this.debtorEditorial = element.openAccDepit
    this.CreditorEditorial = element.openAccCredit
    this.Type = element.type
    this.classification = element.classification
    this.accountLevel = element.level
    this.AccountIdAhlak = element.accountIdAhlak
    this.CurrencyId = element.currencyId
    this.LevelNode = element.level
    this.ParentId = element.parentId
    if (element.nature == 1) { this.Nature = true } else { this.Nature = false }
    if (element.active == 1) { this.accounStatus = true } else { this.accounStatus = false }
    this.selectItemOftree = false


  }
  ngAfterViewInit() {
    // this.open(this.smartModal, null, 'smartModal');
  }

  open(content: any, data?: any, type?: any) {
    if (data && type == 'edit') {
      this.modalDetails = data;
      this.modalDetails['id'] = 1;
    }
    if (type == 'deleteItem') {
      this.deleteItem = data.accountId;
    }
    this.modalService
      // .open(content, {
      //   ariaLabelledBy: 'modal-basic-title',
      //   size: type == 'runningTasksModal' ? 'xxl' : 'xl' ,
      //   centered: type ? false : true
      // })

      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        size: type ? 'xl' : 'lg',
        centered: type ? false : true,
      })

      .result.then(
        (result) => {
          if (type == 'edit') {
            this.modalDetails = {
              projectNo: null,
              accountCode: null,
              projectDuration: null,
              branch: null,
              center: null,
              from: null,
              to: null,
              projectType: null,
              subProjectDetails: null,
              walk: null,
              customer: null,
              buildingType: null,
              service: null,
              user: null,
              region: null,
              projectDescription: null,
              offerPriceNumber: null,
              projectDepartment: null,
              projectPermissions: null,
              projectGoals: null,
            };
          }
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }
  projectsDataSourceTemp: any = [];
  GetAllaccountGuideList: any
  GetAllAccounts() {
    this.accountGuideService.GetAllAccounts().subscribe((data: any) => {
      this.GetAllaccountGuideList = data;
      this.projectsDataSource = new MatTableDataSource(data);
      this.projectsDataSource.sort = this.sort;
      this.projectsDataSourceTemp = data;
      this.projectsDataSource.paginator = this.paginator;
    });
  }

  AccountIdAhlakSelectList: any
  FillAccountIdAhlakSelect() {
    this.accountGuideService.FillAccountIdAhlakSelect().subscribe((data: any) => {
      this.AccountIdAhlakSelectList = data;
    });
  }
  CurrencySelectList: any
  FillCurrencySelect() {
    this.accountGuideService.FillCurrencySelect().subscribe((data: any) => {
      this.CurrencySelectList = data;
    });
  }
  AccCredit_Depit: any
  GetAccCredit_Depit(id: any) {
    this.accountGuideService.GetAccCredit_Depit(id).subscribe((data: any) => {
      this.debtor = data.depit;
      this.Creditor = data.credit;
    });
  }
  AccountngxTree: any
  AccountngxTreelist: any = []
  selectedTask2: any = []
  GetAccountTree() {
    this.accountGuideService.GetAccountTree().subscribe(
      (response: any) => {
        this.AccountngxTreelist = response
        this.AccountngxTreelist.forEach((element: any) => {
          element.children = []
          element.name = this.translate.instant(element.text)
          element.item = {
            phrase: element.text,
            id: element.id
          }
          element.selected = false

          this.AccountngxTreelist.forEach((ele: any) => {
            if (element.id == ele.parent) {
              element.isparent = true
              element.children.push(ele)
            }
          });
        });

        const filteraccountTree = []
        this.AccountngxTreelist.forEach((element: any) => {
          if (element.isparent == true) {
            filteraccountTree.push(element)
          }
        })
        this.AccountngxTree = []
        this.AccountngxTreelist.forEach((element: any) => {
          if (element.parent == "#") {
            this.AccountngxTree.push(element)
          }
        })
      })
  }
  disabledcreate: any = false
  GetAccountByCode() {
    if(this.MainAccountCode != null && this.MainAccountCode != ""){
      this.accountGuideService.GetAccountByCode(this.MainAccountCode).subscribe((data: any) => {
        debugger
        if(data.result!=null)
        {
          this.MainAccountName = data.result.code + "_" + data.result.accountName;
          this.classification = data.result.classification;
          this.Type = data.result.type;
          // this.accounStatus = data.result.level
          this.Nature = data.result.nature == 1 ? true : false
          if (data.result.accountId) {
            this.GetNewCodeByParentId(data.result.accountId)
          }
          this.ParentId = data.result.accountId;
          this.LevelNode = data.result.level + 1;
          this.disabledcreate = true;
        }
        else
        {
          this.MainAccountName = null;
          this.classification = null;
          this.Type = null;
          // this.accounStatus = data.result.level
          this.Nature = false;
          this.ParentId = null;
          this.LevelNode = null;
          this.disabledcreate =false;
        }
      },
        (error: any) => {
          this.ParentId = null;
          this.LevelNode = 1;
        });
    }else{
      this.MainAccountName = null;
      this.classification = null;
      this.Type = null;
      // this.accounStatus = data.result.level
      this.Nature = false;
      this.ParentId = null;
      this.LevelNode = null;
      this.disabledcreate =false;
    }
  }
  GetNewCodeByParentId(id: any) {
    this.accountGuideService.GetNewCodeByParentId(id).subscribe((data: any) => {
      this.acountCode = data
    });
  }
  selectItemOftree = false
  AccountById: any
  GetAccountById(id: any) {
    this.accountGuideService.GetAccountById(id).subscribe((data: any) => {
      this.selectItemOftree = true
      this.accId = data.result.accountId
      this.acountCode = data.result.code
      this.MainAccountCode = data.result.parentAccountCode
      this.MainAccountName = data.result.parentAccountName
      this.accountNameAR = data.result.nameAr
      this.accountNameEn = data.result.nameEn
      if(data.result.openAccCreditDate)
      {
        this.creditDate = this._sharedService.String_TO_date(data.result.openAccCreditDate);

      }
      if(data.result.openAccDepitDate)
      {
        this.depitDate = this._sharedService.String_TO_date(data.result.openAccDepitDate);
      }

      this.debtorEditorial = data.result.openAccDepit
      this.CreditorEditorial = data.result.openAccCredit
      this.Type = data.result.type
      this.classification = data.result.classification
      this.accountLevel = data.result.level
      this.AccountIdAhlak = data.result.accountIdAhlak
      this.CurrencyId = data.result.currencyId
      this.LevelNode = data.result.level
      this.ParentId = data.result.parentId
      if (data.result.nature == 1) { this.Nature = true } else { this.Nature = false }
      if (data.result.active == 1) { this.accounStatus = true } else { this.accounStatus = false }
    });
  }
  selectedTree() {
    if (this.selectedTask1.length > 0) {
      this.GetAccountById(this.selectedTask1[0].id)
      this.GetAccCredit_Depit(this.selectedTask1[0].id)
    }
    else {
      this.newAccount()
    }
  }


  SaveAccount() {
    if (this.debtorEditorial != "" && this.debtorEditorial != null && this.debtorEditorial != 0 &&
      this.CreditorEditorial != "" && this.CreditorEditorial != null && this.CreditorEditorial != 0) {
      this.toast.error(this.translate.instant('Enter the value of the opening balance, credit or debit only'));
      return;
    }

    if (this.accountNameEn == (null || '' || undefined)) {
      this.accountNameEn = this.accountNameAR;
    }
    debugger
    var CreDate=null;var DepDate=null;
    if (this.creditDate != null) {
      CreDate = this._sharedService.date_TO_String(this.creditDate);
    }
    if (this.depitDate != null) {
      DepDate = this._sharedService.date_TO_String(this.depitDate);
    }


    const prames = {
      AccountId: this.accId.toString(),
      Code: this.acountCode.toString(),
      NameAr: this.accountNameAR,
      NameEn: this.accountNameEn,
      Nature: this.Nature == true ? 1 : 2,
      Type: this.Type.toString(),
      CurrencyId: this.CurrencyId,
      Classification: this.classification.toString(),
      AccountIdAhlak: this.AccountIdAhlak?.toString(),
      OpenAccDepit: Number(this.debtorEditorial) ?? 0,
      OpenAccCredit: Number(this.CreditorEditorial) ?? 0,
      OpenAccCreditDate:CreDate,
      OpenAccDepitDate:DepDate,
      Active: this.accounStatus,
      ParentId: this.ParentId,
      Level: this.LevelNode.toString()
    }

    this.accountGuideService.SaveAccount(prames).subscribe((data: any) => {

      if (data.statusCode == 200) {
        this.toast.success(this.translate.instant(data.reasonPhrase), this.translate.instant('Message'));
        //this.MaintenanceFunc_WithoutMsg()
        this.GetAccountTree();
        this.GetAllAccounts();
        this.FillAccountIdAhlakSelect();
        this.FillCurrencySelect();
      } else {
        this.toast.error(this.translate.instant(data.reasonPhrase), this.translate.instant('Message'));
      }
    },
      (error: any) => {
        this.toast.error(this.translate.instant(error.reasonPhrase), this.translate.instant('Message'));
      }
    );
  }

  
  deleteItem: any
  deleteItemselected(modal:any) {
    this.accountGuideService.DeleteAccount(this.deleteItem).subscribe(
      (data) => {
        if (data.statusCode == 200) {
          this.toast.success(this.translate.instant(data.reasonPhrase), this.translate.instant('Message'));
          this.GetAccountTree();
          this.GetAllAccounts();
          modal.dismiss()
        }else{
          this.toast.error(this.translate.instant(data.reasonPhrase), this.translate.instant('Message'));
        }
      },
      (error) => {
          this.toast.error(this.translate.instant(error.reasonPhrase), this.translate.instant('Message'));
      }
    );
  }

  exportData() {
    let x = [];

    for (let index = 0; index < this.GetAllaccountGuideList.length; index++) {
      x.push({
        code: this.GetAllaccountGuideList[index].code,
        nameAr: this.GetAllaccountGuideList[index].nameAr,
        nameEn: this.GetAllaccountGuideList[index].nameEn,
        level: this.GetAllaccountGuideList[index].level,
        classificationName: this.GetAllaccountGuideList[index].classificationName,
        typeName: this.GetAllaccountGuideList[index].typeName,
        parentAccountName: this.GetAllaccountGuideList[index].parentAccountName,
      })
    }
    this.accountGuideService.customExportExcel(x, "Accounts guide");

  }

  OrganizationData: any
  environmentPho: any
  dateprint: any
  PrintTrewView(id: any) {
    this.accountGuideService.PrintTrewView().subscribe((data: any) => {
      this.dateprint = data.dateTimeNow
      this.OrganizationData = data.org_VD;
      this.environmentPho = environment.PhotoURL + this.OrganizationData.logoUrl;
      setTimeout(() => {
        this.print.print(id, environment.printConfig);
      }, 500);
    })

  }
  MaintenanceFunc(){
    this.accountGuideService.MaintenanceFunc().subscribe((data: any) => {
      if (data.statusCode == 200) {
        this.toast.success(this.translate.instant(data.reasonPhrase), this.translate.instant('Message'));
      }else{
        this.toast.error(this.translate.instant(data.reasonPhrase), this.translate.instant('Message'));
      }
    },
    (error) => {
        this.toast.error(this.translate.instant(error.reasonPhrase), this.translate.instant('Message'));
    })
  }
  MaintenanceFunc_WithoutMsg(){
    this.accountGuideService.MaintenanceFunc().subscribe((data: any) => {
      if (data.statusCode == 200) {
        // this.toast.success(this.translate.instant(data.reasonPhrase), this.translate.instant('Message'));
      }else{
        // this.toast.error(this.translate.instant(data.reasonPhrase), this.translate.instant('Message'));
      }
    })
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

  addProject() { }

  extend() { }
  skip() { }
  confirm() { }
  endProject() { }
  flagProject() { }
  unSaveProjectInTop() { }

  stopProject() { }
  addNewUserPermissions() { }

  applyFilter(event: any) {
    const val = event.target.value.toLowerCase();
    var tempsource = this.projectsDataSourceTemp;
    if (val) {
      tempsource = this.projectsDataSourceTemp.filter((d: any) => {
        return (d.code != null ? d.code.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
          || (d.nameAr != null ? d.nameAr.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
          || (d.nameEn != null ? d.nameEn.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
          || (d.level != null ? d.level.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
          || (d.classificationName != null ? d.classificationName.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
          || (d.typeName != null ? d.typeName.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
          || (d.parentAccountName != null ? d.parentAccountName.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
      });
    }

    this.projectsDataSource = new MatTableDataSource(tempsource);
    this.projectsDataSource.paginator = this.paginator;
    this.projectsDataSource.sort = this.sort;

  }
  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.userPermissionsDataSource.filter = filterValue.trim().toLowerCase();
  // }
  applyGoalsFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.projectGoalsDataSource.filter = filterValue.trim().toLowerCase();
  }
  applyUsersFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.projectUsersDataSource.filter = filterValue.trim().toLowerCase();
  }
  applyTasksFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.projectTasksDataSource.filter = filterValue.trim().toLowerCase();
  }

  setSelectedUserPermissions(index: any) {
    let data = this.userPermissions[index];
    this.selectedUserPermissions = data;
  }

  setValues(event: any) {
    this.selectedUserPermissions['watch'] = event.target.checked;
    this.selectedUserPermissions['add'] = event.target.checked;
    this.selectedUserPermissions['edit'] = event.target.checked;
    this.selectedUserPermissions['delete'] = event.target.checked;
  }

  changeRequestStatus(event: any) {
    this.Nature = event.target.checked;
  }
  changeRequestStatus2(event: any) {
    this.accounStatus = event.target.checked;
  }

  saveOption(data: any) { }

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
  }

  // Delete row
  delete(row: any, rowIndex: any) {
    this.isEditable[rowIndex] = !this.isEditable[rowIndex];
    this.rows.splice(rowIndex, 1);
    console.log('Row deleted: ' + rowIndex);
  }

  selectGoalForProject(index: any) { }

  addNewMission() { }

  onSort(event: any) {
    console.log(event);
  }
  // ############### send sms

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
    files: [],
    clients: [],
    branches: [],
    cities: [],
    filesTypes: [],
  };
  modal?: BsModalRef;
  sendEMAIL(sms: any) {
    console.log(sms);
    this.control.clear();
    this.modal?.hide();
  }

  public readonly control = new FileUploadControl(
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
  public uploadedFiles: Array<File> = [];

  sendSMS(sms: any) {
    console.log(sms);
    this.modal?.hide();
  }

  // selection in table

  selection = new SelectionModel<any>(true, []);
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.projectsDataSource.data.length;
    return numSelected === numRows;
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.projectsDataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1
      }`;
  }

  existValue: any = false;

  selectedVoucher: any;
  sendToPrint(id?: any) {
    const printContents: any = window.document.getElementById(id)!.innerHTML;
    var originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  }
  // ##################3
}
