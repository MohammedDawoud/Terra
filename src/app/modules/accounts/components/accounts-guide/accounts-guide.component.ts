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
  selectedTask1: any;

  options = {
    mode: TreeMode.SingleSelect,
    checkboxes: false,
    alwaysEmitSelected: false,
  };
  accountCode: any;


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

  closeResult = '';

  showStats = false;
  showFilters = false;
  showTable = true;

  @ViewChild(DatatableComponent) table: DatatableComponent | any;

  columns: any = [];

  isEditable: any = {};

  openBox: any = false;
  boxId: any;

  accountDisplayedColumns: string[] = [
    'accountCode',
    'accountNameAR',
    'accountNameLat',
    'accountLevel',
    'AccountClas',
    'accountType',
    'MainAccount',
    'operations',
  ];
  // dataSource: MatTableDataSource<any>;
  dataSource: MatTableDataSource<any> = new MatTableDataSource([{}]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  currentDate: any;
  selectedRow: any;

  selectAllValue = false;

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
  accountsDataSource = new MatTableDataSource();
  ngOnInit(): void {

    this.accountsDataSource = new MatTableDataSource();

    this.GetAccountTree();
    this.GetAllAccounts();
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
  accountsDataSourceTemp: any = [];
  GetAllaccountGuideList: any
  GetAllAccounts() {
    this.accountGuideService.GetAllAccounts().subscribe((data: any) => {
      this.GetAllaccountGuideList = data;
      this.accountsDataSource = new MatTableDataSource(data);
      this.accountsDataSource.sort = this.sort;
      this.accountsDataSourceTemp = data;
      this.accountsDataSource.paginator = this.paginator;
    });
  }

  AccountngxTree: any
  AccountngxTreelist: any = []
  selectedTask2: any = []
  GetAccountTree() {
    this.accountGuideService.GetAccountTree().subscribe((response: any) => {
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

    if (this.accountNameEn == null ||this.accountNameEn ==  '' || this.accountNameEn ==  'undefined') {
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
        this.GetAccountTree();
        this.GetAllAccounts();
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
    var tempsource = this.accountsDataSourceTemp;
    if (val) {
      tempsource = this.accountsDataSourceTemp.filter((d: any) => {
        return (d.code != null ? d.code.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
          || (d.nameAr != null ? d.nameAr.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
          || (d.nameEn != null ? d.nameEn.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
          || (d.level != null ? d.level.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
          || (d.classificationName != null ? d.classificationName.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
          || (d.typeName != null ? d.typeName.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
          || (d.parentAccountName != null ? d.parentAccountName.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
      });
    }

    this.accountsDataSource = new MatTableDataSource(tempsource);
    this.accountsDataSource.paginator = this.paginator;
    this.accountsDataSource.sort = this.sort;

  }
  changeRequestStatus(event: any) {
    this.Nature = event.target.checked;
  }
  changeRequestStatus2(event: any) {
    this.accounStatus = event.target.checked;
  }


  // selection in table

  selection = new SelectionModel<any>(true, []);
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.accountsDataSource.data.length;
    return numSelected === numRows;
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.accountsDataSource.data);
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
