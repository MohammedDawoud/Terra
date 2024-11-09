import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpEvent,
  HttpHeaders,
  HttpParams,
  HttpRequest,
} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { VoucherFilterVM } from 'src/app/core/Classes/ViewModels/voucherFilterVM';
import { Invoices } from '../../Classes/DomainObjects/invoices';
import { ExportationService } from '../exportation-service/exportation.service';

@Injectable({
  providedIn: 'root',
})
export class AccountsreportsService {
  private apiEndPoint: string = '';
  constructor(
    private http: HttpClient,
    private exportationService: ExportationService
  ) {
    this.apiEndPoint = environment.apiEndPoint;
  }

  //--------------------------------متابعة المصروفات-------------------------------------------------
  FillAccountsSelect() {
    return this.http.get<any>(this.apiEndPoint + 'Account/FillAccountsSelect');
  }
  FillAccountsSelectCustomer() {
    return this.http.get<any>(
      this.apiEndPoint + 'Account/FillAccountsSelectCustomer'
    );
  }
  GetDetailedExpensesd(model: any) {
    return this.http.post<any>(
      `${this.apiEndPoint}Account/GetDetailedExpensesd`,
      model
    );
  }

    GetDayilypaymentsandearns(model: any) {
    return this.http.post<any>(
      `${this.apiEndPoint}Account/GetDayilypaymentsandearns`,
      model
    );
  }

    GetMonthlypaymentsandearns(model: any) {
    return this.http.post<any>(
      `${this.apiEndPoint}Account/GetMonthlypaymentsandearns`,
      model
    );
  }

     GetMonthlypaymentsandearns_WithDayes(model: any) {
    return this.http.post<any>(
      `${this.apiEndPoint}Account/GetMonthlypaymentsandearns_WithDayes`,
      model
    );
  }

     GetyearlyInvoicesWithDetails_ByYear(model: any) {
    return this.http.post<any>(
      `${this.apiEndPoint}Account/GetyearlyInvoicesWithDetails_ByYear`,
      model
    );
  }
  DetailedExpensesdReportGrid(model: any) {
    return this.http.post<any>(
      `${this.apiEndPoint}Account/DetailedExpensesdReportGrid`,
      model
    );
  }
  //---------------------------------------End----------------------------------------------------------

  //------------------متابعة ايرادات و مصروفات مراكز التكلفة-----------------------------------------
  FillCostCenterSelect() {
    return this.http.get<any>(
      this.apiEndPoint + 'CostCenter/FillCostCenterSelect'
    );
  }

  GetCostCenterEX_RE(model: any) {
    return this.http.post<any>(
      `${this.apiEndPoint}Account/GetCostCenterEX_RE`,
      model
    );
  }
  CostCenterEX_REReportNew(model: any) {
    return this.http.post<any>(
      `${this.apiEndPoint}Account/CostCenterEX_REReportNew`,
      model
    );
  }
  //---------------------------------------End----------------------------------------------------------

  //-------------------------------- متابعة الأشعارات الدائنة و المدينة--------------------------------
  GetAllCreditDepitNotiReport(
    _voucherFilterVM: VoucherFilterVM
  ): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(_voucherFilterVM);
    return this.http.post(
      this.apiEndPoint + 'Voucher/GetAllCreditDepitNotiReport',
      body,
      { headers: headers }
    );
  }
  FillAllProjectSelectByAllNoti(param: any) {
    var url = `${environment.apiEndPoint}Project/FillAllProjectSelectByAllNoti?&param=${param}`;
    return this.http.get<any>(url);
  }
  FillSuppliersAllNotiSelect() {
    return this.http.get<any>(
      this.apiEndPoint + 'Suppliers/FillSuppliersAllNotiSelect'
    );
  }
  FillAllCustomerSelectByAllNoti(param: any) {
    var url = `${environment.apiEndPoint}Project/FillAllCustomerSelectByAllNoti?&param=${param}`;
    return this.http.get<any>(url);
  }
  GetAllJournalsByInvIDCreditDepitNoti(invId: any) {
    var url = `${environment.apiEndPoint}DailyJournal/GetAllJournalsByInvIDCreditDepitNoti?&invId=${invId}`;
    return this.http.get<any>(url);
  }

  VouchersCreditDepitNotiReport(model: any) {
    return this.http.post<any>(
      `${this.apiEndPoint}Voucher/VouchersCreditDepitNotiReport`,
      model
    );
  }
  //---------------------------------------End-----------------------------------------------------
  //-------------------------------- مردود المبيعات-------------------------------
  GetAllVouchersRet(_voucherFilterVM: VoucherFilterVM): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(_voucherFilterVM);
    return this.http.post(
      this.apiEndPoint + 'Voucher/GetAllVouchersRet',
      body,
      { headers: headers }
    );
  }
  GetAllJournalsByInvIDRet(invId: any) {
    var url = `${environment.apiEndPoint}DailyJournal/GetAllJournalsByInvIDRet?&invId=${invId}`;
    return this.http.get<any>(url);
  }
  SaveInvoiceForServicesRetNEW(_invoices: Invoices): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(_invoices);
    return this.http.post(
      this.apiEndPoint + 'Voucher/SaveInvoiceForServicesRetNEW',
      body,
      { headers: headers }
    );
  }
  SaveInvoiceForServicesRet_Back(_invoices: Invoices): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(_invoices);
    return this.http.post(
      this.apiEndPoint + 'Voucher/SaveInvoiceForServicesRet_Back',
      body,
      { headers: headers }
    );
  }
  //---------------------------------------End-----------------------------------------------------

  ///////////////////// EPORT DATA/////////////////////////////////////////////

  customExportExcel(dataExport: any, nameExport: any) {
    let exportation = JSON.parse(JSON.stringify(dataExport));
    let itemsToExeclude: string[] = [];

    let excelData: any[] = [];
    let headers: string[] = [];
    let objectKeys = Object.keys(dataExport[0]);
    objectKeys = objectKeys.filter(
      (item: string) => !itemsToExeclude.includes(item)
    );

    objectKeys.forEach((element) => {
      headers.push(element.toUpperCase());
    });

    exportation.forEach((ele: any) => {
      // ele = (ele) => {
      var sorted: any = {},
        key,
        a = [];

      for (key in ele) {
        if (ele.hasOwnProperty(key)) {
          a.push(key);
        }
      }
      a = a.filter((item: string) => !itemsToExeclude.includes(item));

      // a.sort();

      for (key = 0; key < a.length; key++) {
        sorted[a[key]] = ele[a[key]];
      }
      // return sorted;
      ele = sorted;
      // }
      let props = Object.getOwnPropertyNames(ele).filter((prop) =>
        exportation.some((ex: any) => ex === prop)
      );
      props.forEach((pp) => {
        delete ele[pp];
      });

      excelData.push(ele);
    });

    this.exportationService.exportExcel(
      excelData,
      nameExport + new Date().getTime(),
      headers
    );
  }

  //--------------------------------كشف بإيراد العميل -------------------------------------------------
  FillAllCustomer() {
    return this.http.get<any>(this.apiEndPoint + 'Customer/FillCustomerSelect');
  }
  // FillCustomerSelectNew() {
  //   return this.http.get<any>(this.apiEndPoint+'Customer/FillCustomerSelectNew');
  // }

  FillProjectSelectByCustomerId_W(param: any) {
    var url = `${environment.apiEndPoint}Project/FillProjectSelectByCustomerId_W?&param=${param}`;
    return this.http.get<any>(url);
  }
  getCustomerRevenue(_voucherFilterVM: any) {
    _voucherFilterVM.dateTo =
      _voucherFilterVM.dateTo == (undefined || null)
        ? ''
        : _voucherFilterVM.dateTo;
    _voucherFilterVM.dateFrom =
      _voucherFilterVM.dateFrom == (undefined || null)
        ? ''
        : _voucherFilterVM.dateFrom;
    _voucherFilterVM.projectId =
      _voucherFilterVM.projectId == (undefined || null)
        ? ''
        : _voucherFilterVM.projectId;
    _voucherFilterVM.customerId =
      _voucherFilterVM.customerId == (undefined || null)
        ? ''
        : _voucherFilterVM.customerId;
    const formData: FormData = new FormData();
    formData.append('ToDate', _voucherFilterVM.dateTo);
    formData.append('FromDate', _voucherFilterVM.dateFrom);
    formData.append('ProjectId', _voucherFilterVM.projectId);
    formData.append('CustomerId', _voucherFilterVM.customerId);
    return this.http.post(
      this.apiEndPoint + 'Account/GetDetailedRevenuExtra',
      formData
    );
  }
  DetailedRevenuReportExtra(_voucherFilterVM: any) {
    _voucherFilterVM.dateTo =
      _voucherFilterVM.dateTo == (undefined || null)
        ? ''
        : _voucherFilterVM.dateTo;
    _voucherFilterVM.dateFrom =
      _voucherFilterVM.dateFrom == (undefined || null)
        ? ''
        : _voucherFilterVM.dateFrom;
    _voucherFilterVM.projectId =
      _voucherFilterVM.projectId == (undefined || null)
        ? '0'
        : _voucherFilterVM.projectId;
    _voucherFilterVM.customerId =
      _voucherFilterVM.customerId == (undefined || null)
        ? '0'
        : _voucherFilterVM.customerId;
    const formData: FormData = new FormData();
    formData.append('ToDate', _voucherFilterVM.dateTo);
    formData.append('FromDate', _voucherFilterVM.dateFrom);
    formData.append('ProjectId', _voucherFilterVM.projectId);
    formData.append('ProjectNo', _voucherFilterVM.projectNo.toString());
    formData.append('CustomerId', _voucherFilterVM.customerId);
    return this.http.post(
      this.apiEndPoint + 'Account/DetailedRevenuReportExtra',
      formData
    );
  }
  //---------------------------------------End----------------------------------------------------------
  //--------------------------------متابعة إيرادات العملاء-------------------------------------------------

  GetDetailedRevenu(_voucherFilterVM: any) {
    _voucherFilterVM.dateTo =
      _voucherFilterVM.dateTo == (undefined || null)
        ? ''
        : _voucherFilterVM.dateTo;
    _voucherFilterVM.dateFrom =
      _voucherFilterVM.dateFrom == (undefined || null)
        ? ''
        : _voucherFilterVM.dateFrom;
    _voucherFilterVM.customerId =
      _voucherFilterVM.customerId == (undefined || null)
        ? ''
        : _voucherFilterVM.customerId;
    const formData: FormData = new FormData();
    formData.append('ToDate', _voucherFilterVM.dateTo);
    formData.append('FromDate', _voucherFilterVM.dateFrom);
    formData.append('CustomerId', _voucherFilterVM.customerId);

    return this.http.post(
      this.apiEndPoint + 'Account/GetDetailedRevenu',
      formData
    );
  }
  DetailedRevenuReportNew(_voucherFilterVM: any) {
    _voucherFilterVM.dateTo =
      _voucherFilterVM.dateTo == (undefined || null)
        ? ''
        : _voucherFilterVM.dateTo;
    _voucherFilterVM.dateFrom =
      _voucherFilterVM.dateFrom == (undefined || null)
        ? ''
        : _voucherFilterVM.dateFrom;
    _voucherFilterVM.customerId =
      _voucherFilterVM.customerId == (undefined || null)
        ? ''
        : _voucherFilterVM.customerId;

    const formData: FormData = new FormData();
    formData.append('ToDate', _voucherFilterVM.dateTo);
    formData.append('FromDate', _voucherFilterVM.dateFrom);
    formData.append('CustomerId', _voucherFilterVM.customerId);
    formData.append('Sortedlist', _voucherFilterVM.Sortedlist.toString());
    return this.http.post(
      this.apiEndPoint + 'Account/DetailedRevenuReportNew',
      formData
    );
  }

  //---------------------------------------End----------------------------------------------------------

  //--------------------------------ايرادات مدراء المشاريع-------------------------------------------------
  FillAllUsersSelect() {
    return this.http.get<any>(
      this.apiEndPoint + 'ControllingTask/FillAllUsersSelect'
    );
  }

   FillAllUsersSelectAllByBranch() {
    return this.http.get<any>(
      this.apiEndPoint + 'ControllingTask/FillAllUsersSelectAllByBranch'
    );
  }
  GetGeneralManagerRevenueAMRDGV(_voucherFilterVM: any) {
    _voucherFilterVM.dateTo =
      _voucherFilterVM.dateTo == (undefined || null)
        ? ''
        : _voucherFilterVM.dateTo;
    _voucherFilterVM.dateFrom =
      _voucherFilterVM.dateFrom == (undefined || null)
        ? ''
        : _voucherFilterVM.dateFrom;
    _voucherFilterVM.customerId =
      _voucherFilterVM.customerId == (undefined || null)
        ? ''
        : _voucherFilterVM.customerId;

    const formData: FormData = new FormData();
    formData.append('ToDate', _voucherFilterVM.dateTo);
    formData.append('FromDate', _voucherFilterVM.dateFrom);
    formData.append('ManagerId', _voucherFilterVM.customerId);

    return this.http.post(
      this.apiEndPoint + 'Account/GetGeneralManagerRevenueAMRDGV',
      formData
    );
    // return this.http.get(this.apiEndPoint + 'Account/GetGeneralManagerRevenueAMRDGV?ManagerId=' + _voucherFilterVM.customerId +
    // '&FromDate=' + _voucherFilterVM.dateFrom + '&ToDate=' + _voucherFilterVM.dateTo);
  }

  PrintProjectManagerRevenueReport(_voucherFilterVM: any) {
    _voucherFilterVM.dateTo =
      _voucherFilterVM.dateTo == (undefined || null)
        ? ''
        : _voucherFilterVM.dateTo;
    _voucherFilterVM.dateFrom =
      _voucherFilterVM.dateFrom == (undefined || null)
        ? ''
        : _voucherFilterVM.dateFrom;
    _voucherFilterVM.customerId =
      _voucherFilterVM.customerId == (undefined || null)
        ? ''
        : _voucherFilterVM.customerId;

    const formData: FormData = new FormData();
    formData.append('ToDate', _voucherFilterVM.dateTo);
    formData.append('FromDate', _voucherFilterVM.dateFrom);
    formData.append('ManagerId', _voucherFilterVM.customerId);
    formData.append('ManagerName', _voucherFilterVM.ManagerName);
    return this.http.post(
      this.apiEndPoint + 'Account/PrintProjectManagerRevenueReport',
      formData
    );
  }

  //---------------------------------------End----------------------------------------------------------
  //--------------------------------كشف تجميعي للسندات-------------------------------------------------
  GetVoucherRpt() {
    return this.http.get<any>(this.apiEndPoint + 'Voucher/GetVoucherRpt');
  }
  PrintGetVoucherRpt() {
    return this.http.get<any>(this.apiEndPoint + 'Voucher/PrintGetVoucherRpt');
  }

  //---------------------------------------End----------------------------------------------------------
  //--------------------------------حركة مراكز التكلفة-------------------------------------------------
  GetAllCostCenterTrans(_voucherFilterVM: any) {
    const formData: FormData = new FormData();
    _voucherFilterVM.dateTo == (undefined || null)
      ? delete _voucherFilterVM.dateTo
      : formData.append('ToDate', _voucherFilterVM.dateTo);
    _voucherFilterVM.dateFrom == (undefined || null)
      ? delete _voucherFilterVM.dateFrom
      : formData.append('FromDate', _voucherFilterVM.dateFrom);
    _voucherFilterVM.customerId == (undefined || null)
      ? delete _voucherFilterVM.customerId
      : formData.append('CostCenterId', _voucherFilterVM.customerId);
    return this.http.post(
      this.apiEndPoint + 'CostCenter/GetAllCostCenterTrans',
      formData
    );
  }
  CostCenterMovementReport(_voucherFilterVM: any) {
    _voucherFilterVM.dateTo =
      _voucherFilterVM.dateTo == (undefined || null)
        ? ''
        : _voucherFilterVM.dateTo;
    _voucherFilterVM.dateFrom =
      _voucherFilterVM.dateFrom == (undefined || null)
        ? ''
        : _voucherFilterVM.dateFrom;
    _voucherFilterVM.customerId =
      _voucherFilterVM.customerId == (undefined || null)
        ? ''
        : _voucherFilterVM.customerId;

    const formData: FormData = new FormData();
    formData.append('ToDate', _voucherFilterVM.dateTo);
    formData.append('FromDate', _voucherFilterVM.dateFrom);
    formData.append('CostCenterId', _voucherFilterVM.customerId);
    formData.append('CostCenterName', _voucherFilterVM.CostCenterName);
    return this.http.post(
      this.apiEndPoint + 'CostCenter/CostCenterMovementReport',
      formData
    );
  }
  //---------------------------------------End----------------------------------------------------------

  //--------------------------------كشف بالأرصدة الآجلة للعملاء-------------------------------------------------

  GetCustomerFinancialDetails() {
    return this.http.get<any>(
      this.apiEndPoint + 'Account/GetCustomerFinancialDetails'
    );
  }

  GetCustomerFinancialDetailsNew(data: any) {
    const formData: FormData = new FormData();
    data.dateTo == (undefined || null)
      ? ''
      : formData.append('ToDate', data.dateTo);
    data.dateFrom == (undefined || null)
      ? ''
      : formData.append('FromDate', data.dateFrom);
    data.customerId == (undefined || null)
      ? ''
      : formData.append('CustomerId', data.customerId);
    data.zeroCheck == (undefined || null)
      ? ''
      : formData.append('ZeroCheck', data.zeroCheck);
    //  formData.append("ToDate", data.dateTo);
    //  formData.append("FromDate", data.dateFrom);
    //  formData.append("CustomerId", data.customerId);
    //  formData.append("ZeroCheck", data.zeroCheck);
    return this.http.post(
      this.apiEndPoint + 'Account/GetCustomerFinancialDetailsNew',
      formData
    );
  }
  PrintVoucher(data: any) {
    const formData: FormData = new FormData();
    data.dateTo == (undefined || null)
      ? ''
      : formData.append('ToDate', data.dateTo);
    data.dateFrom == (undefined || null)
      ? ''
      : formData.append('FromDate', data.dateFrom);
    data.customerId == (undefined || null)
      ? ''
      : formData.append('CustomerId', data.customerId);
    data.zeroCheck == (undefined || null)
      ? ''
      : formData.append('ZeroCheck', data.zeroCheck);
    return this.http.post(
      this.apiEndPoint + 'Account/PrintCustomerFinancialDetailsNew',
      formData
    );
  }

  //---------------------------------------End----------------------------------------------------------

  //--------------------------------الإقرار الضريبي-------------------------------------------------
  GetValueNeeded(data: any) {
    data.dateTo = data.dateTo == (undefined || null) ? '' : data.dateTo;
    data.dateFrom = data.dateFrom == (undefined || null) ? '' : data.dateFrom;
    const formData: FormData = new FormData();
    formData.append('ToDate', data.dateTo);
    formData.append('FromDate', data.dateFrom);

    return this.http.post(
      this.apiEndPoint + 'Transactions/GetValueNeeded',
      formData
    );
  }

  GetSystemSettingsByBranchId() {
    var url = `${environment.apiEndPoint}SystemSettings/GetSystemSettingsByBranchId`;
    return this.http.get<any>(url);
  }

  PrintAddtionalTaxesPDFFile(data: any) {
    data.dateTo = data.dateTo == (undefined || null) ? '' : data.dateTo;
    data.dateFrom = data.dateFrom == (undefined || null) ? '' : data.dateFrom;
    data.DateId = data.DateId == (undefined || null) ? '' : data.DateId;
    const formData: FormData = new FormData();
    formData.append('ToDate', data.dateTo);
    formData.append('FromDate', data.dateFrom);
    formData.append('DateId', data.DateId);

    return this.http.post(
      this.apiEndPoint + 'Transactions/PrintAddtionalTaxesPDFFile',
      formData
    );
  }

  //---------------------------------------End----------------------------------------------------------

  //--------------------------------قائمة المركز المالي-------------------------------------------------
  GetGeneralBudgetAMRDGV(data: any) {
    data.dateTo = data.dateTo == (undefined || null) ? '' : data.dateTo;
    data.dateFrom = data.dateFrom == (undefined || null) ? '' : data.dateFrom;
    data.ccid = data.ccid == (undefined || null) ? '' : data.ccid;
    data.lvl = data.lvl == (undefined || null) ? '' : data.lvl;
    data.zeroCheck =
      data.zeroCheck == (undefined || null) ? '' : data.zeroCheck;

    const formData: FormData = new FormData();
    formData.append('ToDate', data.dateTo);
    formData.append('FromDate', data.dateFrom);
    formData.append('lvl', data.lvl);
    formData.append('CCID', data.ccid);
    formData.append('ZeroCheck', '0');

    return this.http.post(
      this.apiEndPoint + 'Account/GetGeneralBudgetAMRDGV',
      formData
    );
  }

  GetReportOfGeneralBudget(data: any) {
    data.dateTo = data.dateTo == (undefined || null) ? '' : data.dateTo;
    data.dateFrom = data.dateFrom == (undefined || null) ? '' : data.dateFrom;
    data.ccid = data.ccid == (undefined || null) ? '' : data.ccid;
    data.lvl = data.lvl == (undefined || null) ? '' : data.lvl;
    data.zeroCheck =
      data.zeroCheck == (undefined || null) ? '' : data.zeroCheck;
    const formData: FormData = new FormData();
    formData.append('ToDate', data.dateTo);
    formData.append('FromDate', data.dateFrom);
    formData.append('lvl', data.lvl);
    formData.append('CCID', data.ccid);
    formData.append('ZeroCheck', '0');
    formData.append('TypeOfReport', '1');

    return this.http.post(
      this.apiEndPoint + 'Account/GetReportOfGeneralBudget',
      formData
    );
  }
  //---------------------------------------End----------------------------------------------------------

  //--------------------------------قائمة الدخل-------------------------------------------------
  FillFilteringIncomeStateSelect(id: any) {
    return this.http.get<any>(
      this.apiEndPoint + 'Voucher/FillFilteringIncomeStateSelect?param=' + id
    );
  }
  FillFilteringSelect(id: any) {
    return this.http.get<any>(
      this.apiEndPoint + 'Voucher/FillFilteringSelect?param=' + id
    );
  }
  GetIncomeStatmentDGVLevels(data: any) {
    const formData: FormData = new FormData();
    data.dateTo = data.dateTo == (undefined || null) ? '' : data.dateTo;
    data.dateFrom = data.dateFrom == (undefined || null) ? '' : data.dateFrom;
    data.CostCenter =
      data.CostCenter == (undefined || null) ? '0' : data.CostCenter;
    data.filteringType =
      data.filteringType == (undefined || null) ? '0' : data.filteringType;
    data.filteringTypeAll =
      data.filteringTypeAll == (undefined || null)
        ? '0'
        : data.filteringTypeAll;
    data.periodFillterType =
      data.periodFillterType == (undefined || null)
        ? '0'
        : data.periodFillterType;
    data.periodCounter =
      data.periodCounter == (undefined || null) ? '0' : data.periodCounter;
    // data.FilteringTypeStr = data.FilteringTypeStr == (undefined || null) ? '0' : data.FilteringTypeStr
    // data.FilteringTypeAllStr = data.FilteringTypeAllStr == (undefined || null) ? '0' : data.FilteringTypeAllStr
    data.lvl = data.lvl == (undefined || null) ? '0' : data.lvl;

    if (data.FilteringTypeStr.length > 0) {
      formData.append('FilteringTypeStr', data.FilteringTypeStr.toString());
    } else {
      formData.append('FilteringTypeStr', '0');
    }
    if (data.FilteringTypeAllStr.length > 0) {
      formData.append(
        'FilteringTypeAllStr',
        data.FilteringTypeAllStr.toString()
      );
    } else {
      formData.append('FilteringTypeAllStr', '0');
    }
    data.filtertypeid =
      data.filtertypeid == (undefined || null) ? '0' : data.filtertypeid;

    formData.append('ToDate', data.dateTo);
    formData.append('FromDate', data.dateFrom);
    formData.append('CostCenter', data.CostCenter);
    formData.append('ZeroCheck', data.zeroCheck);
    formData.append('FilteringType', data.filteringType);
    formData.append('FilteringTypeAll', data.filteringTypeAll);
    formData.append('AccountIds', '0');
    formData.append('LVL', data.lvl);
    formData.append('FilteringTypeAllStr', data.FilteringTypeAllStr);
    formData.append('PeriodFillterType', data.periodFillterType);
    formData.append('PeriodCounter', data.periodCounter);
    formData.append('TypeF', data.typeF);

    return this.http.post(
      this.apiEndPoint + 'Account/GetIncomeStatmentDGVLevels',
      formData
    );

    // return this.http.get(this.apiEndPoint + 'Account/GetIncomeStatmentDGVLevels?FromDate=' + data.dateFrom + '&ToDate=' + data.dateTo
    //   + '&CostCenter=' + data.CostCenter + '&ZeroCheck=' + data.zeroCheck + '&FilteringType=' + data.filteringType + '&FilteringTypeAll=' + data.filteringTypeAll +
    //   '&FilteringTypeStr=' + data.FilteringTypeStr +
    //   '&FilteringTypeAllStr=' + data.FilteringTypeAllStr + '&AccountIds=' + 0 + '&LVL=' + data.lvl +
    //   '&PeriodFillterType=' + data.filteringTypeAll + '&PeriodCounter=' + data.filtertypeid + '&TypeF=' + 0);
  }
  GetReportIncomeLevels(data: any) {
    const formData: FormData = new FormData();
    data.dateTo = data.dateTo == (undefined || null) ? '' : data.dateTo;
    data.dateFrom = data.dateFrom == (undefined || null) ? '' : data.dateFrom;
    data.CostCenter =
      data.CostCenter == (undefined || null) ? '0' : data.CostCenter;
    data.filteringType =
      data.filteringType == (undefined || null) ? '0' : data.filteringType;
    data.filteringTypeAll =
      data.filteringTypeAll == (undefined || null)
        ? '0'
        : data.filteringTypeAll;
    // data.FilteringTypeStr = data.FilteringTypeStr == (undefined || null) ? '0' : data.FilteringTypeStr
    // data.FilteringTypeAllStr = data.FilteringTypeAllStr == (undefined || null) ? '0' : data.FilteringTypeAllStr
    data.lvl = data.lvl == (undefined || null) ? '0' : data.lvl;

    if (data.FilteringTypeStr.length > 0) {
      formData.append('FilteringTypeStr', data.FilteringTypeStr.toString());
    } else {
      formData.append('FilteringTypeStr', '0');
    }
    if (data.FilteringTypeAllStr.length > 0) {
      formData.append(
        'FilteringTypeAllStr',
        data.FilteringTypeAllStr.toString()
      );
    } else {
      formData.append('FilteringTypeAllStr', '0');
    }
    // if (data.FilteringTypeStr.length > 1) {
    //   data.FilteringTypeStr.forEach((element:any) => {
    //      formData.append("FilteringTypeStr", element);
    //   });
    // }else{
    //   formData.append("FilteringTypeStr", data.FilteringTypeStr);
    // }
    // if (data.FilteringTypeAllStr.length > 1) {
    //   data.FilteringTypeAllStr.forEach((element:any) => {
    //      formData.append("FilteringTypeAllStr", element);
    //   });
    // }else{
    //   formData.append("FilteringTypeAllStr", data.FilteringTypeAllStr);
    // }
    data.filtertypeid =
      data.filtertypeid == (undefined || null) ? '0' : data.filtertypeid;

    formData.append('ToDate', data.dateTo);
    formData.append('FromDate', data.dateFrom);
    formData.append('CostCenter', data.CostCenter);
    formData.append('ZeroCheck', data.zeroCheck);
    formData.append('FilteringType', data.filteringType);
    formData.append('FilteringTypeAll', data.filteringTypeAll);
    formData.append('AccountIds', '0');
    formData.append('LVL', data.lvl);
    formData.append('FilteringTypeAllStr', data.FilteringTypeAllStr);
    formData.append('PeriodFillterType', data.filteringTypeAll);
    formData.append('PeriodCounter', data.filtertypeid);
    formData.append('TypeF', '0');
    return this.http.post(
      this.apiEndPoint + 'Report/GetReportIncomeLevels',
      formData
    );
  }
  GetIncomeStatmentDGVLevelsdetails(modal: any) {
    debugger;
    modal.AccointId =
      modal.AccointId == (null || undefined) ? '' : modal.AccointId;
    modal.Type = modal.Type == (null || undefined) ? '' : modal.Type;
    modal.Type2 = modal.Type2 == (null || undefined) ? '' : modal.Type2;
    modal.FromDate =
      modal.FromDate == (null || undefined) ? '' : modal.FromDate;
    modal.ToDate = modal.ToDate == (null || undefined) ? '' : modal.ToDate;
    modal.CostCenter =
      modal.CostCenter == (null || undefined) ? '0' : modal.CostCenter;
    modal.ZeroCheck =
      modal.ZeroCheck == (null || undefined) ? '0' : modal.ZeroCheck;
    modal.FilteringType =
      modal.FilteringType == (null || undefined) ? '0' : modal.FilteringType;
    modal.FilteringTypeAll =
      modal.FilteringTypeAll == (null || undefined)
        ? '0'
        : modal.FilteringTypeAll;
    if (modal.FilteringTypeStr.length > 0) {
      modal.FilteringTypeStr = modal.FilteringTypeStr.toString();
    } else {
      modal.FilteringTypeStr = '0';
    }
    if (modal.FilteringTypeAllStr.length > 0) {
      modal.FilteringTypeAllStr = modal.FilteringTypeAllStr.toString();
    } else {
      modal.FilteringTypeAllStr = '0';
    }
    modal.AccountIds =
      modal.AccountIds == (null || undefined) ? '0' : modal.AccountIds;
    modal.LVL = modal.LVL == (null || undefined) ? '0' : modal.LVL;
    modal.PeriodFillterType =
      modal.FilteringTypeAll == (null || undefined)
        ? '0'
        : modal.FilteringTypeAll;
    modal.PeriodCounter =
      modal.filtertypeid == (null || undefined) ? '0' : modal.filtertypeid;
    modal.TypeF = modal.TypeF == (null || undefined) ? '0' : modal.TypeF;

    return this.http.get<any>(
      this.apiEndPoint +
        'Account/GetIncomeStatmentDGVLevelsdetails?AccointId=' +
        modal.AccointId +
        '&Type=' +
        modal.Type +
        '&Type2=' +
        modal.Type2 +
        '&FromDate=' +
        modal.FromDate +
        '&ToDate=' +
        modal.ToDate +
        '&CostCenter=' +
        modal.CostCenter +
        '&ZeroCheck=' +
        modal.ZeroCheck +
        '&FilteringType=' +
        modal.FilteringType +
        '&FilteringTypeAll=' +
        modal.FilteringTypeAll +
        '&FilteringTypeStr=' +
        modal.FilteringTypeStr +
        '&FilteringTypeAllStr=' +
        modal.FilteringTypeAllStr +
        '&AccountIds=' +
        modal.AccountIds +
        '&LVL=' +
        modal.LVL +
        '&PeriodFillterType=' +
        modal.PeriodFillterType +
        '&PeriodCounter=' +
        modal.PeriodCounter +
        '&TypeF=0'
    );
  }
  //---------------------------------------End----------------------------------------------------------

  //--------------------------------كشف حساب-------------------------------------------------

  GetAllTransSearch_New(data: any) {
    data.dateTo = data.dateTo == (undefined || null) ? '' : data.dateTo;
    data.dateFrom = data.dateFrom == (undefined || null) ? '' : data.dateFrom;
    data.accountId =
      data.accountId == (undefined || null) ? '' : data.accountId;
    data.customerId =
      data.customerId == (undefined || null) ? '' : data.customerId;

    const formData: FormData = new FormData();
    formData.append('ToDate', data.dateTo);
    formData.append('FromDate', data.dateFrom);
    formData.append('AccountId', data.accountId);
    formData.append('CostCenterId', data.customerId);

    return this.http.post(
      this.apiEndPoint + 'Transactions/GetAllTransSearch_New',
      formData
    );

    // return this.http.get(this.apiEndPoint + 'Transactions/GetAllTransSearch_New?FromDate=' + data.dateFrom + '&ToDate=' + data.dateTo
    //   + '&AccountId=' + data.accountId + '&CostCenterId=' + data.customerId);
  }
  TransactionsGetReportGrid(data: any) {
    const formData: FormData = new FormData();
    data.dateTo == (undefined || null)
      ? ''
      : formData.append('ToDate', data.dateTo);
    data.dateFrom == (undefined || null)
      ? ''
      : formData.append('FromDate', data.dateFrom);
    data.accountId == (undefined || null)
      ? ''
      : formData.append('AccountId', data.accountId);
    data.customerId == (undefined || null)
      ? ''
      : formData.append('CostCenterId', data.customerId);
    data.rasedBefore == (undefined || null)
      ? ''
      : formData.append('RasedBefore', data.rasedBefore);
      data.isCheckedYear == (undefined || null)
      ? false
      : formData.append('isCheckedYear', data.isCheckedYear??false);

    // formData.append("ToDate", data.dateTo);
    // formData.append("FromDate", data.dateFrom);
    // formData.append("AccountId", data.accountId);
    // formData.append("CostCenterId", data.customerId);
    // formData.append("RasedBefore", data.rasedBefore);
    formData.append('Sortedlist', data.Sortedlist.toString());

    return this.http.post(
      this.apiEndPoint + 'Transactions/GetReportGrid',
      formData
    );
  }
  GetAllTransSearchByAccIDandCostId_New(data: any) {
    data.dateTo = data.dateTo == (undefined || null) ? '' : data.dateTo;
    data.dateFrom = data.dateFrom == (undefined || null) ? '' : data.dateFrom;
    data.accountId =
      data.accountId == (undefined || null) ? '' : data.accountId;
    data.customerId =
      data.customerId == (undefined || null) ? '' : data.customerId;

    return this.http.get(
      this.apiEndPoint +
        'Transactions/GetAllTransSearchByAccIDandCostId_New?FromDate=' +
        data.dateFrom +
        '&ToDate=' +
        data.dateTo +
        '&AccountId=' +
        data.accountId +
        '&CostCenterId=' +
        data.customerId
    );
  }
  //---------------------------------------End----------------------------------------------------------
  //--------------------------------اليومية العامة-------------------------------------------------
  GetAllJournals(data: any) {
    data.dateTo = data.dateTo == (undefined || null) ? '' : data.dateTo;
    data.dateFrom = data.dateFrom == (undefined || null) ? '' : data.dateFrom;
    data.ToJournal =
      data.ToJournal == (undefined || null) ? '' : data.ToJournal;
    data.FromJournal =
      data.FromJournal == (undefined || null) ? '' : data.FromJournal;

    const formData: FormData = new FormData();
    formData.append('ToDate', data.dateTo);
    formData.append('FromDate', data.dateFrom);
    formData.append('FromJournal', data.FromJournal);
    formData.append('ToJournal', data.ToJournal);

    return this.http.post(
      this.apiEndPoint + 'DailyJournal/GetAllJournals',
      formData
    );

    // return this.http.get(this.apiEndPoint + 'DailyJournal/GetAllJournals?FromJournal=' + data.FromJournal + '&ToJournal=' + data.ToJournal
    //   + '&FromDate=' + data.dateFrom + '&ToDate=' + data.dateTo);
  }

  GetReportGrid(data: any) {
    data.dateTo = data.dateTo == (undefined || null) ? '' : data.dateTo;
    data.dateFrom = data.dateFrom == (undefined || null) ? '' : data.dateFrom;
    data.ToJournal =
      data.ToJournal == (undefined || null) ? '' : data.ToJournal;
    data.FromJournal =
      data.FromJournal == (undefined || null) ? '' : data.FromJournal;
    data.SortedlistJournalNo =
      data.SortedlistJournalNo == (undefined || null)
        ? ''
        : data.SortedlistJournalNo;
    data.SortedlistAccountCode =
      data.SortedlistAccountCode == (undefined || null)
        ? ''
        : data.SortedlistAccountCode;

    const formData: FormData = new FormData();
    formData.append('EndDate', data.dateTo);
    formData.append('StartDate', data.dateFrom);
    formData.append('FromJournal', data.FromJournal);
    formData.append('ToJournal', data.ToJournal);
    formData.append('SortedlistJournalNo', data.SortedlistJournalNo);
    formData.append('SortedlistAccountCode', data.SortedlistAccountCode);

    return this.http.post(
      this.apiEndPoint + 'DailyJournal/GetReportGrid',
      formData
    );
  }

  //---------------------------------------End----------------------------------------------------------

  //--------------------------------ميزان المراجعة-------------------------------------------------
  GetTrailBalanceDGV(data: any) {
    const formData: FormData = new FormData();
    data.dateTo = data.dateTo == (undefined || null) ? '' : data.dateTo;
    data.dateFrom = data.dateFrom == (undefined || null) ? '' : data.dateFrom;
    data.CostCenter =
      data.CostCenter == (undefined || null) ? '0' : data.CostCenter;
    data.filteringType =
      data.filteringType == (undefined || null) ? '0' : data.filteringType;
    data.search_accountId =
      data.search_accountId == (undefined || null)
        ? '0'
        : data.search_accountId;
    data.AccountCode =
      data.AccountCode == (undefined || null) ? '0' : data.AccountCode;
    data.lvl = data.lvl == (undefined || null) ? '0' : data.lvl;
    if (data.FilteringTypeStr.length > 0) {
      formData.append('FilteringTypeStr', data.FilteringTypeStr.toString());
    } else {
      formData.append('FilteringTypeStr', '0');
    }
    formData.append('ToDate', data.dateTo);
    formData.append('FromDate', data.dateFrom);
    formData.append('CostCenter', data.CostCenter);
    formData.append('FilteringType', data.filteringType);
    formData.append('AccountCode', data.AccountCode);
    formData.append('LVL', data.lvl);
    formData.append('ZeroCheck', data.zeroCheck);
    formData.append('AccountIds', data.search_accountId);
    return this.http.post(
      this.apiEndPoint + 'Account/GetTrailBalanceDGV',
      formData
    );
    // return this.http.get(this.apiEndPoint + 'Account/GetTrailBalanceDGV?CostCenter=' + data.CostCenter + '&FilteringType=' + data.filteringType
    //   + '&FromDate=' + data.dateFrom + '&ToDate=' + data.dateTo + '&FilteringTypeStr=' + data.FilteringTypeStr + '&AccountIds=' + data.search_accountId
    //   + '&ZeroCheck=' + data.zeroCheck
    //   + '&AccountCode=' + data.AccountCode + '&LVL=' + data.lvl);
  }
  ChangeTrialBalance_PDF(data: any) {
    const formData: FormData = new FormData();
    data.dateTo = data.dateTo == (undefined || null) ? '' : data.dateTo;
    data.dateFrom = data.dateFrom == (undefined || null) ? '' : data.dateFrom;
    data.CostCenter =
      data.CostCenter == (undefined || null) ? '0' : data.CostCenter;
    data.filteringType =
      data.filteringType == (undefined || null) ? '0' : data.filteringType;
    data.search_accountId =
      data.search_accountId == (undefined || null)
        ? '0'
        : data.search_accountId;
    data.AccountCode =
      data.AccountCode == (undefined || null) ? '0' : data.AccountCode;
    data.lvl = data.lvl == (undefined || null) ? '0' : data.lvl;
    if (data.FilteringTypeStr.length > 0) {
      formData.append('FilteringTypeStr', data.FilteringTypeStr.toString());
    } else {
      formData.append('FilteringTypeStr', '0');
    }
    formData.append('ToDate', data.dateTo);
    formData.append('FromDate', data.dateFrom);
    formData.append('CostCenter', data.CostCenter);
    formData.append('FilteringType', data.filteringType);
    formData.append('AccountCode', data.AccountCode);
    formData.append('LVL', data.lvl);
    formData.append('ZeroCheck', data.zeroCheck);
    formData.append('AccountIds', data.search_accountId);

    return this.http.post(
      this.apiEndPoint + 'Account/ChangeTrialBalance_PDF',
      formData
    );
    // return this.http.get(this.apiEndPoint + 'Account/GetTrailBalanceDGV?CostCenter=' + data.CostCenter + '&FilteringType=' + data.filteringType
    //   + '&FromDate=' + data.dateFrom + '&ToDate=' + data.dateTo + '&FilteringTypeStr=' + data.FilteringTypeStr + '&AccountIds=' + data.search_accountId
    //   + '&ZeroCheck=' + data.zeroCheck
    //   + '&AccountCode=' + data.AccountCode + '&LVL=' + data.lvl);
  }
  GetViewDetailsGrid() {
    return this.http.get<any>(
      this.apiEndPoint + 'Voucher/GetViewDetailsGrid?Type=0&Status=4'
    );
  }
  GetDetailsMonitor(modal: any) {
    modal.FromDate =
      modal.FromDate == (null || undefined) ? '' : modal.FromDate;
    modal.ToDate = modal.ToDate == (null || undefined) ? '' : modal.ToDate;
    modal.CostCenter =
      modal.CostCenter == (null || undefined) ? '0' : modal.CostCenter;
    modal.FilteringType =
      modal.FilteringType == (null || undefined) ? '0' : modal.FilteringType;
    modal.AccountId =
      modal.AccountId == (null || undefined) ? '0' : modal.AccountId;
    modal.Type = modal.Type == (null || undefined) ? '0' : modal.Type;
    modal.Type2 = modal.Type2 == (null || undefined) ? '0' : modal.Type2;
    if (modal.FilteringTypeStr.length > 0) {
      modal.FilteringTypeStr = modal.FilteringTypeStr.toString();
    } else {
      modal.FilteringTypeStr = '0';
    }
    return this.http.get<any>(
      this.apiEndPoint +
        'Account/GetDetailsMonitor?FromDate=' +
        modal.FromDate +
        '&ToDate=' +
        modal.ToDate +
        '&CostCenter=' +
        modal.CostCenter +
        '&FilteringType=' +
        modal.FilteringType +
        '&FilteringTypeStr=' +
        modal.FilteringTypeStr +
        '&AccountId=' +
        modal.AccountId +
        '&Type=' +
        modal.Type +
        '&Type2=' +
        modal.Type2
    );
  }
  //---------------------------------------End----------------------------------------------------------
  GetAllServicesPrice() {
    return this.http.get<any>(this.apiEndPoint + 'Voucher/GetAllServicesPrice');
  }
  FillServiceAccount() {
    return this.http.get<any>(this.apiEndPoint + 'Account/FillServiceAccount');
  }
  FillServiceAccountPurchase() {
    return this.http.get<any>(this.apiEndPoint + 'Account/FillServiceAccountPurchase');
  }
  FillSubAccountLoad() {
    return this.http.get<any>(this.apiEndPoint+'Account/FillSubAccountLoad');
  }
  FillPackagesSelect() {
    return this.http.get<any>(this.apiEndPoint + 'Packages/FillPackagesSelect');
  }
  FillProjectTypeSelect() {
    return this.http.get<any>(
      this.apiEndPoint + 'ProjectType/FillProjectTypeSelect'
    );
  }
  FillProjectSubTypesSelect(id: any) {
    return this.http.get<any>(
      this.apiEndPoint + 'ProjectSubTypes/FillProjectSubTypesSelect?param=' + id
    );
  }
  GetServicePriceByProject_Search(modal: any) {
    modal.Project1 =
      modal.Project1 == (undefined || null) ? '' : modal.Project1;
    modal.Project2 =
      modal.Project2 == (undefined || null) ? '' : modal.Project2;
    modal.ServiceName =
      modal.ServiceName == (undefined || null) ? '' : modal.ServiceName;
    return this.http.get<any>(
      this.apiEndPoint +
        'Voucher/GetServicePriceByProject_Search?Project1=' +
        modal.Project1 +
        '&Project2=' +
        modal.Project2 +
        '&ServiceName=' +
        modal.ServiceName
    );
  }
  SaveServicePriceWithDetails(data: any): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(data);
    return this.http.post(
      this.apiEndPoint + 'Voucher/SaveServicePriceWithDetails',
      body,
      { headers: headers }
    );
  }

  GetAllProjectType(search?: any) {
    search = search == (undefined || null) ? '' : search;
    return this.http.get<any>(
      this.apiEndPoint + 'ProjectType/GetAllProjectType?SearchText=' + search
    );
  }
  SaveProjectType(data: any): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(data);
    return this.http.post(
      this.apiEndPoint + 'ProjectType/SaveProjectType',
      body,
      { headers: headers }
    );
  }
  DeleteProjectType(ProjectTypeId: any) {
    // const formData: FormData = new FormData();
    // formData.append("ProjectTypeId", ProjectTypeId);
    return this.http.post<any>(
      this.apiEndPoint +
        'ProjectType/DeleteProjectType?ProjectTypeId=' +
        ProjectTypeId,
      {}
    );
  }

  GetAllProjectSubsByProjectTypeId(search?: any, ProjectTypeId?: any) {
    search = search == (undefined || null) ? '' : search;
    return this.http.get<any>(
      this.apiEndPoint +
        'ProjectSubTypes/GetAllProjectSubsByProjectTypeId?SearchText=' +
        search +
        '&ProjectTypeId=' +
        ProjectTypeId
    );
  }
  SaveProjectSubType(data: any): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(data);
    return this.http.post(
      this.apiEndPoint + 'ProjectSubTypes/SaveProjectSubType',
      body,
      { headers: headers }
    );
  }
  DeleteProjectSubTypes(SubTypeId: any) {
    // const formData: FormData = new FormData();
    // formData.append("SubTypeId", SubTypeId);
    return this.http.post<any>(
      this.apiEndPoint +
        'ProjectSubTypes/DeleteProjectSubTypes?SubTypeId=' +
        SubTypeId,
      {}
    );
  }

  GetAllPackages(search?: any) {
    search = search == (undefined || null) ? '' : search;
    return this.http.get<any>(
      this.apiEndPoint + 'Packages/GetAllPackages?SearchText=' + search
    );
  }
  SavePackage(data: any): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(data);
    return this.http.post(this.apiEndPoint + 'Packages/SavePackage', body, {
      headers: headers,
    });
  }
  DeletePackage(PackagesId: any) {
    // const formData: FormData = new FormData();
    // formData.append("PackagesId", PackagesId);
    return this.http.post<any>(
      this.apiEndPoint + 'Packages/DeletePackage?PackagesId=' + PackagesId,
      {}
    );
  }

  GetServicesPriceByParentId(ParentId?: any) {
    return this.http.get<any>(
      this.apiEndPoint +
        'Voucher/GetServicesPriceByParentId?ParentId=' +
        ParentId
    );
  }
  SaveServicesPrice(data: any): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(data);
    return this.http.post(
      this.apiEndPoint + 'Voucher/SaveServicesPrice',
      body,
      { headers: headers }
    );
  }
  DeleteService(servicesId: any) {
    // const formData: FormData = new FormData();
    // formData.append("servicesId", servicesId);
    return this.http.post<any>(
      this.apiEndPoint + 'Voucher/DeleteService?servicesId=' + servicesId,
      {}
    );
  }

  GetAllTotalSpacesRange(search?: any) {
    search = search == (undefined || null) ? '' : search;
    return this.http.get<any>(
      this.apiEndPoint +
        'TotalSpacesRange/GetAllTotalSpacesRange?SearchText=' +
        search
    );
  }
  SaveTotalSpacesRange(data: any): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(data);
    return this.http.post(
      this.apiEndPoint + 'TotalSpacesRange/SaveTotalSpacesRange',
      body,
      { headers: headers }
    );
  }
  DeleteTotalSpacesRange(TotalSpacesRangeId: any) {
    // const formData: FormData = new FormData();
    // formData.append("TotalSpacesRangeId", TotalSpacesRangeId);
    return this.http.post<any>(
      this.apiEndPoint +
        'TotalSpacesRange/DeleteTotalSpacesRange?TotalSpacesRangeId=' +
        TotalSpacesRangeId,
      {}
    );
  }

  GetAllFloors(search?: any) {
    search = search == (undefined || null) ? '' : search;
    return this.http.get<any>(
      this.apiEndPoint + 'Floors/GetAllFloors?SearchText=' + search
    );
  }
  SaveFloor(data: any): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(data);
    return this.http.post(this.apiEndPoint + 'Floors/SaveFloor', body, {
      headers: headers,
    });
  }
  DeleteFloor(FloorsId: any) {
    // const formData: FormData = new FormData();
    // formData.append("FloorsId", FloorsId);
    return this.http.post<any>(
      this.apiEndPoint + 'Floors/DeleteFloor?FloorsId=' + FloorsId,
      {}
    );
  }

  DeleteServicelist(ServicesId: any) {
    return this.http.post<any>(
      this.apiEndPoint + 'Voucher/DeleteService?servicesId=' + ServicesId,
      {}
    );
  }
  //---------------------------------------End----------------------------------------------------------
  //--------------------------------مردود فاتورة المشتريات
  GetAllVouchersRetPurchase(
    _voucherFilterVM: VoucherFilterVM
  ): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(_voucherFilterVM);
    return this.http.post(
      this.apiEndPoint + 'Voucher/GetAllVouchersRetPurchase',
      body,
      { headers: headers }
    );
  }
  GetAllJournalsByInvIDRetPurchase(invId: any) {
    var url = `${environment.apiEndPoint}DailyJournal/GetAllJournalsByInvIDRetPurchase?&invId=${invId}`;
    return this.http.get<any>(url);
  }
  PrintJournalsVyInvIdRetPurchase(VoucherId: any) {
    var url = `${environment.apiEndPoint}DailyJournal/PrintJournalsByReVoucherId?&InvId=${VoucherId}`;
    return this.http.post<any>(url, {});
  }
  ChangePurchase_PDF(InvoiceId: any, TempCheck: any) {
    var url = `${environment.apiEndPoint}Voucher/ChangePurchase_PDF?InvoiceId=${InvoiceId}&TempCheck=${TempCheck}`;
    return this.http.get<any>(url);
  }
  SavePurchaseForServicesRetNew(_invoices: Invoices): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(_invoices);
    return this.http.post(
      this.apiEndPoint + 'Voucher/SavePurchaseForServicesRetNew',
      body,
      { headers: headers }
    );
  }
  //----------------------------------------------------------------------------------------------
  FillBranchSelectNew() {
    return this.http.get<any>(this.apiEndPoint + 'Branches/FillBranchSelectNew');
  }
  GetAllBranchesByUserIdDrop() {
    return this.http.get<any>(this.apiEndPoint + 'Branches/GetAllBranchesByUserIdDrop');
  }
  GetInvoicedue(data: any) {
    return this.http.post(this.apiEndPoint + 'Account/GetInvoicedue',data);
  }
  //---------------------------------------------------------------------------------------------

      GetDelegates(model: any) {
    return this.http.post<any>(
      `${this.apiEndPoint}Account/GetDelegates`,
      model
    );
  }

    GetInvoiceById(VoucherId: any) {
    var url = `${environment.apiEndPoint}Voucher/GetInvoiceById?&VoucherId=${VoucherId}`;
    return this.http.get<any>(url);
  }
}
