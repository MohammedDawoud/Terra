import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { AccountReportsService } from 'src/app/core/services/acc_Services/accountreports.service';
import { VoucherService } from 'src/app/core/services/acc_Services/voucher.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { RestApiService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-accountstatement',
  templateUrl: './accountstatement.component.html',
  styleUrls: ['./accountstatement.component.scss']
})
export class AccountstatementComponent {
  title: any = {
    main: {
      name: {
        ar: 'تقارير الحسابات',
        en: 'Account Reports',
      },
      link: '/accounts',
    },
    sub: {
      ar: 'كشف حساب',
      en: 'Account Statement',
    },
  };
  userG: any = {};
  projectDisplayedColumns: string[] = [
    'addDate',
    'notes',
    'transactionDate',
    "voucherNo",
    "subAccountIdtxt",
    'depit',
    'credit',
    'balance',
    'typeName',
  ];
  displayedColumns2: string[] = ["addDate2",
    "notes2",
    "transactionDate2",
    "voucherNo2",
    "subAccountIdtxt2",
    "depit2",
    "credit2",
    "balance2",
    "typeName2",
  ]
  data: any = {
    filter: {
      enable: false,
      date: null,
      search_accountId: null,
      DateFrom_P: null,
      DateTo_P: null,
      isChecked: false,
      isCheckedYear: false,
      isCheckedBranch: false,
    }
  };
  projectsDataSourceTemp: any = [];
  DataSource: any = [];
  sumcredit: any = 0;
  sumdepit: any = 0;
  sumbalance: any = 0;
  afterDatebalance: any = 0;
  afterDate: boolean = false;
  projectsDataSource = new MatTableDataSource();
  DataSourceTemp = new MatTableDataSource();
  DataSourceSortedlist=[];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private _accountReports: AccountReportsService,private _voucher: VoucherService,
    private modalService: BsModalService,
    private api: RestApiService,private toast: ToastrService,private ngbModalService: NgbModal,
    private _sharedService: SharedService, private authenticationService: AuthenticationService,
    private translate: TranslateService,
  ) {
    this.userG = this.authenticationService.userGlobalObj;
  }
  SearchAccountList:any=[];

  ngOnInit(): void {
    this.FillAccountsSelect()
    this.projectsDataSource = new MatTableDataSource();
  }
  changeAccount() {
    this.RefreshData_ByDate(this.data.filter.DateFrom_P ?? '', this.data.filter.DateTo_P ?? '');
  }
  ResetSearchTime() {
    if (!this.data.filter.enable) {
      this.RefreshData_ByDate("", "");
      this.BalanceBeforeObj.Show = false;
    }
    else {
      if (this.data.filter.DateFrom_P == "" || this.data.filter.DateTo_P == "") this.BalanceBeforeObj.Show = false;
      else this.BalanceBeforeObj.Show = true;
      this.RefreshData_ByDate(this.data.filter.DateFrom_P ?? "", this.data.filter.DateTo_P ?? "");
    }
  }
  BalanceBeforeObj: any = {
    BalanceBefore: 0,
    Show: false,
  }
  ChangeClassVis() {
    if (this.BalanceBeforeObj.Show == false) {
      return "HideBalanceBefore"
    }
    else {
      return "ShowBalanceBefore";
    }
  }

  GetNetBalance(data: any) {
    this.BalanceBeforeObj.BalanceBefore = 0;
    data.forEach((element: any) => {
      this.BalanceBeforeObj.BalanceBefore += (element.depit - element.credit);
    });
    this.BalanceBeforeObj.BalanceBefore = parseFloat(this.BalanceBeforeObj.BalanceBefore).toFixed(2);
  }

  load_accountIds: any;
  FillAccountsSelect() {
    this._voucher.FillAllAccountsSelectAll().subscribe(data => {
      this.load_accountIds = data;
    });
  }

  RefreshData_ByDate(FromDate: any, ToDate: any) {
    //debugger

    // if(this.data.filter.search_accountId==null)
    // {
    //   return;
    // }
    if(this.SearchAccountList.length == 0)
    {
      return;
    }
    
    this.BalanceBeforeObj.BalanceBefore = 0
    if (FromDate == "" || ToDate == "") {
      this.BalanceBeforeObj.Show = false;
    } else {
      this.BalanceBeforeObj.Show = true;
    }
    var _voucherFilterVM : any = {};
    _voucherFilterVM.isCheckedYear = this.data.filter.isCheckedYear;
    _voucherFilterVM.isCheckedBranch = this.data.filter.isCheckedBranch;
    _voucherFilterVM.accountId = this.data.filter.search_accountId;
    _voucherFilterVM.customerId = this.data.filter.search_costCenterId;
    _voucherFilterVM.accountList = this.SearchAccountList;
    _voucherFilterVM.dateFrom = '';
    _voucherFilterVM.dateTo = '';
    var objdata = _voucherFilterVM;
    this._accountReports.GetAllTransSearch(objdata).subscribe((data: any) => {
      if (FromDate != null && ToDate != null) {
        _voucherFilterVM.dateFrom = FromDate.toString();_voucherFilterVM.dateTo = ToDate.toString(); }
      var Obj = null;
      if (!(FromDate == "" || ToDate == "")) {
        var ObjBefore = data.filter((a: { transactionDate: any; }) => new Date(a.transactionDate) < new Date(FromDate));
        this.GetNetBalance(ObjBefore);
        Obj = data.filter((a: { transactionDate: any; }) => new Date(a.transactionDate) >= new Date(FromDate) && new Date(a.transactionDate) <= new Date(ToDate));
      }
      else {
        Obj = data;
      }
      this.projectsDataSource = new MatTableDataSource(Obj);
      this.DataSourceTemp = new MatTableDataSource(Obj);
      this.DataSource = Obj;
      this.DataSourceSortedlist = data;
      this.projectsDataSourceTemp = Obj;
      this.projectsDataSource.paginator = this.paginator;
      this.projectsDataSource.sort = this.sort;
      this.allbalance()
    }
    );
  }
  CheckDate(event: any) {
    if (event != null) {
      this.data.filter.DateFrom_P = this._sharedService.date_TO_String(event[0]);
      this.data.filter.DateTo_P = this._sharedService.date_TO_String(event[1]);
      this.RefreshData_ByDate(this.data.filter.DateFrom_P, this.data.filter.DateTo_P);
      this.BalanceBeforeObj.Show = true;
    }
  }
  totalbalance: any;
  CurrentDataAfterSort: any;
  CurrentBalanceNew(index: any) {
    this.projectsDataSource.connect().subscribe(d => this.CurrentDataAfterSort = d);
    var sum = 0;
    if( this.BalanceBeforeObj.Show == true){sum = Number(this.BalanceBeforeObj.BalanceBefore)}
    for (var i = 0; i <= index; i++) {
      sum += +parseFloat((this.CurrentDataAfterSort[i]?.depit ?? 0).toString()).toFixed(2) - +parseFloat((this.CurrentDataAfterSort[i]?.credit ?? 0).toString()).toFixed(2);
    }
    return parseFloat(sum.toString()).toFixed(2);
  }
  CurrentBalance: any;
  CurrentData: any;
  allbalance() {
    this.DataSourceTemp.connect().subscribe((d: any) => this.CurrentData = d);
    var sum = 0;
    for (var i = 0; i <= this.projectsDataSourceTemp.length; i++) {
      sum += +parseFloat((this.CurrentData[i]?.depit ?? 0).toString()).toFixed(2) - +parseFloat((this.CurrentData[i]?.credit ?? 0).toString()).toFixed(2);
    }
    this.CurrentBalance = Number(sum)
    return parseFloat(sum.toString()).toFixed(2);
  }

  get totalexDepit() {
    var sum = 0;
    this.projectsDataSource?.data?.forEach((element: any) => {
      sum = +parseFloat(sum.toString()).toFixed(2) + +parseFloat((element?.depit ?? 0).toString()).toFixed(2);
    });
    return parseFloat(sum.toString()).toFixed(2);
  }
  get totalexCredit() {
    var sum = 0;
    this.projectsDataSource?.data?.forEach((element: any) => {
      sum = +parseFloat(sum.toString()).toFixed(2) + +parseFloat((element?.credit ?? 0).toString()).toFixed(2);
    });
    return parseFloat(sum.toString()).toFixed(2);
  }
  get AllBalance() {
    var sum =Number(this.CurrentBalance??0) + Number(this.BalanceBeforeObj.BalanceBefore??0)
    return   sum
  }

  get totaltxt() {
    var dep = this.totalexDepit ?? 0;
    var cre = this.totalexCredit ?? 0;
    if (+(+parseFloat(dep.toString()).toFixed(2) - +parseFloat(cre.toString()).toFixed(2)) > 0) {
      return 'مدين';
    }
    else {
      return 'دائن';
    }
  }

  CurrentBalanceNewExport(index: any,CurrentData:any) {
    var sum = 0;
    if( this.BalanceBeforeObj.Show == true){sum = Number(this.BalanceBeforeObj.BalanceBefore)}
    for (var i = 0; i <= index; i++) {
      sum += +parseFloat((this.CurrentData[i]?.depit ?? 0).toString()).toFixed(2) - +parseFloat((this.CurrentData[i]?.credit ?? 0).toString()).toFixed(2);
    }
    return parseFloat(sum.toString()).toFixed(2);
  }

  valapplyFilter: any
  applyFilter(event: any) {
    const val = event.target.value.toLowerCase();
    this.valapplyFilter = val

    var tempsource = this.projectsDataSourceTemp;
    if (val) {
      tempsource = this.projectsDataSourceTemp.filter((d: any) => {
        return (d.addDate != null ? d.addDate.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
          || (d.notes != null ? d.notes.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
          || (d.voucherNo != null ? d.voucherNo.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
          || (d.subAccountIdtxt != null ? d.subAccountIdtxt.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
          || (d.transactionDate != null ? d.transactionDate.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
          || (d.depit != null ? d.depit.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
          || (d.credit != null ? d.credit.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
          || (d.balance != null ? d.balance.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
          || (d.typeName != null ? d.typeName.toString()?.trim().toLowerCase().indexOf(val) !== -1 || !val:"")
      });
    }

    this.projectsDataSource = new MatTableDataSource(tempsource);
    this.DataSourceTemp = new MatTableDataSource(tempsource);
    this.projectsDataSource.paginator = this.paginator;
    this.DataSource = tempsource
    this.projectsDataSource.sort = this.sort;
    this.allbalance()
  }
  ExcelprojectsDataSource: any = [];

  exportData() {
    this.ExcelprojectsDataSource=[];
    let x = [];
    if(this.BalanceBeforeObj.Show == true){

      x.push({
        'النوع': null,
        'الرصيد': parseFloat(this.BalanceBeforeObj.BalanceBefore),
        'دائن': null,
        'مدين': null,
        'رقم السند': null,
        'أسم الحساب': null,
        'تاريخ السند': null,
        'البيان': "الرصيد ما قبل الفترة",
        'تاريخ العملية': null,
      })}
    if(this.projectsDataSource.sort)
    {
      this.ExcelprojectsDataSource=this.projectsDataSource.sortData(this.projectsDataSource.filteredData,this.projectsDataSource.sort);
    }
    else
    {
      this.ExcelprojectsDataSource=this.projectsDataSource.data;
    }
    for (let index = 0; index < this.ExcelprojectsDataSource.length; index++) {
      x.push({
        'النوع': this.ExcelprojectsDataSource[index].typeName,
        'الرصيد': parseFloat(this.CurrentBalanceNewExport(index,this.ExcelprojectsDataSource)),
        'دائن': parseFloat(this.ExcelprojectsDataSource[index].credit),
        'مدين': parseFloat(this.ExcelprojectsDataSource[index].depit),
        'رقم السند': this.ExcelprojectsDataSource[index].voucherNo,
        'أسم الحساب': this.ExcelprojectsDataSource[index].subAccountIdtxt,
        'تاريخ السند': this.ExcelprojectsDataSource[index].transactionDate,
        'البيان':this.ExcelprojectsDataSource[index].notes,
        'تاريخ العملية': this._sharedService.date_TO_String(new Date(this.ExcelprojectsDataSource[index].addDate)),
      })
    }
    x.push({
      'النوع': null,
      'الرصيد': parseFloat(this.totaltxt),
      'دائن': parseFloat(this.totalexCredit),
      'مدين': parseFloat(this.totalexDepit),
      'رقم السند': null,
      'أسم الحساب': null,
      'تاريخ السند': null,
      'البيان': "الاجمالي",
      'تاريخ العملية': null,
    })
    this._accountReports.customExportExcel(x, "كشف حساب")
  }


}
