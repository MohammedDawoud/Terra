import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CustomerVM } from '../../Classes/ViewModels/customerVM';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  getAllCustomersUrl = environment.apiEndPoint + 'customer/GetAllCustomers';
GetAllCustomers_Branch_Url=environment.apiEndPoint + 'customer/GetAllCustomers_Branch';
  customerSearchUrl = environment.apiEndPoint + 'customer/SearchCustomers';

  getAllCustomerNameUrl =
    environment.apiEndPoint + 'customer/FillCustomerSelect';

  getCustomerMailUrl =
    environment.apiEndPoint + 'customer/FillCustomerSelect2Mails';

  getCustomerMobileUrl =
    environment.apiEndPoint + 'customer/FillCustomerSelect2';

  SaveCustomerUrl = environment.apiEndPoint + 'customer/SaveCustomer';

  deleteCustomerUrl = environment.apiEndPoint + 'Customer/DeleteCustomer';

  fillBranchByUserIdUrl =
    environment.apiEndPoint + 'Branches/FillBranchByUserIdSelect';


  FillCustAccountsSelectUrl =
    environment.apiEndPoint + ' Account/FillCustAccountsSelect';

  getCustMainAccByBranchUrl =
    environment.apiEndPoint + 'Account/GetCustMainAccByBranchId';

  getAllCustomersByCustomerTypeUrl =
    environment.apiEndPoint + 'customer/GetAllCustomersByCustomerType';

  getCustomersByCustomerIdUrl =
    environment.apiEndPoint + 'Customer/GetCustomersByCustomerId';

  //getSMSByCustomerIdUrl = environment.apiEndPoint + 'Customer/GetSMSByCustomerId';

  getAllCustomerFilesUploadedUrl =
    environment.apiEndPoint + 'CustomerFiles/GetAllCustomerFilesUploaded';
  getAllGetAllCustomerFiles =
    environment.apiEndPoint + 'CustomerFiles/GetAllCustomerFiles';

  /******************************************************** */

  getMailsByCustomerIdUrl =
    environment.apiEndPoint + 'Customer/GetMailsByCustomerId/';

  getProjectsByCustomerUrl =
    environment.apiEndPoint + 'Project/GetProjectsByCustomerId/';

  getAllCustomerFilesUrl =
    environment.apiEndPoint + 'CustomerFiles/GetAllCustomerFiles/';

  fillCustomerSelect2Url =
    environment.apiEndPoint + 'Customer/FillCustomerSelect2';

  SaveCustomerMailUrl = environment.apiEndPoint + 'Customer/SaveCustomerMail';

  SaveCustomerSMSUrl = environment.apiEndPoint + 'Customer/SaveCustomerSMS';

  getAllCustomersByCustomerTypeIdUrl =
    environment.apiEndPoint + 'Customer/GetAllCustomersByCustomerTypeId';

  fillAccountsSelectCustomerUrl =
    environment.apiEndPoint + 'Account/FillAccountsSelectCustomer';

  getAllTransSearchUrl =
    environment.apiEndPoint + 'Transactions/GetAllTransSearch_New';

  getAllContractsBySearchCustomerUrl =
    environment.apiEndPoint + 'Contract/GetAllContractsBySearchCustomer';

  getSMSByCustomerIdUrl =
    environment.apiEndPoint + 'Customer/GetSMSByCustomerId/';

  deleteCustomerMailUrl =
    environment.apiEndPoint + 'Customer/DeleteCustomerMail';

  deleteCustomerSMSUrl = environment.apiEndPoint + 'Customer/DeleteCustomerSMS';

  deleteCustomerFileUrl =
    environment.apiEndPoint + 'CustomerFiles/DeleteCustomerFiles';

  saveCustomerFilesUrl =
    environment.apiEndPoint + 'CustomerFiles/SaveCustomerFiles/';

  saveFilesTypeURL = environment.apiEndPoint + 'FileType/SaveFileType';

  fillAllCustomerSelectWithBranchUrl =
    environment.apiEndPoint + 'Customer/FillAllCustomerSelectWithBranch';

  getAllContractsNotPaidCustomerUrl =
    environment.apiEndPoint + 'Contract/GetAllContractsNotPaidCustomer';

  fillFileTypeSelectUrl =
    environment.apiEndPoint + 'FileType/FillFileTypeSelect';

  getAllFileTypesSearchUrl =
    environment.apiEndPoint + 'FileType/GetAllFileTypes';

  deleteFileTypeUrl = environment.apiEndPoint + 'FileType/DeleteFileType';

  uploadCustomerFilesUrl =
    environment.apiEndPoint + 'CustomerFiles/UploadCustomerFiles/';
  uploadCustomerF =
    environment.apiEndPoint + 'CustomerFiles/SaveCustomerFiles/';

  saveCityUrl = environment.apiEndPoint + 'City/SaveCity';

  fillCustomerSelect2MailsUrl =
    environment.apiEndPoint + 'Customer/FillCustomerSelect2Mails';

  getEmailOrganizationUrl =
    environment.apiEndPoint + 'Organizations/GetEmailOrganization';

  GetReportGrid_Customer =
    environment.apiEndPoint + 'Contract/GetReportGridCustomer';

  GetReportGrid_AccountCustomer =
    environment.apiEndPoint + 'Transactions/GetReportGrid_Customer';
  constructor(private http: HttpClient) {}

  getAllCustomers() {
    return this.http.get<any>(this.getAllCustomersUrl);
  }
  GetAllCustomers_Branch() {
    return this.http.get<any>(this.GetAllCustomers_Branch_Url);
  }
  FillCustomerNameSelect() {
    return this.http.get<any>(this.getAllCustomerNameUrl);
  }
  FillCustomerMailSelect() {
    return this.http.get<any>(this.getCustomerMailUrl);
  }
  FillCustomerMobileSelect() {
    return this.http.get<any>(this.getCustomerMobileUrl);
  }

  deleteCustomer(val: any) {
    return this.http.post<any>(
      this.deleteCustomerUrl,
      {},
      { params: { CustomerId: val } }
    );
  }

  SaveCustomer(model: any) {
    return this.http.post<any>(this.SaveCustomerUrl, model);
  }

  SaveCustomerMail(model: any) {
    return this.http.post<any>(this.SaveCustomerMailUrl, model);
  }

  SaveCustomerSMS(model: any) {
    return this.http.post<any>(this.SaveCustomerSMSUrl, model);
  }

  fillBranchByUserId() {
    return this.http.get<any>(this.fillBranchByUserIdUrl);
  }

  FillCustAccountsSelect() {
    return this.http.get<any>(this.FillCustAccountsSelectUrl);
  }

  getCustMainAccByBranch(BranchId: number) {
    return this.http.get<any>(
      this.getCustMainAccByBranchUrl + '?BranchId=' + BranchId
    );
  }

  GetCustomersByCustomerId(CustomerId:any) {
    var url=`${environment.apiEndPoint}Customer/GetCustomersByCustomerId?CustomerId=${CustomerId}`;
    return this.http.get<any>(url);
  }

  FillCitySelect() {
    return this.http.get<any>(environment.apiEndPoint+'City/FillCitySelect');
  }
  SearchFn(_CustomerVM: CustomerVM): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(_CustomerVM);
    return this.http.post(this.customerSearchUrl, body, { headers: headers });
  }

  getAllCustomersByCustomerTypeId(type: any) {
    return this.http.get<any>(
      this.getAllCustomersByCustomerTypeIdUrl + '?CustomerTypeId=' + type
    );
  }

  // getAllCustomersByCustomerType(FromDate?:string,ToDate?:string,CustomerType?:number): Observable<any> {
  //   return this.http.get(this.getAllCustomersByCustomerTypeUrl+"?FromDate="+FromDate+"&ToDate="+ToDate+"&CustomerType="+CustomerType);
  // }

  getAllCustomersByCustomerType(
    FromDate?: string,
    ToDate?: string,
    CustomerType?: any
  ) {
    if (CustomerType && FromDate && ToDate) {
      return this.http.get(
        this.getAllCustomersByCustomerTypeUrl +
          '?FromDate=' +
          FromDate +
          '&ToDate=' +
          ToDate +
          '&CustomerType=' +
          CustomerType
      );
    } else if (FromDate && ToDate) {
      return this.http.get(
        this.getAllCustomersByCustomerTypeUrl +
          '?FromDate=' +
          FromDate +
          '&ToDate=' +
          ToDate
      );
    } else {
      return this.http.get(
        this.getAllCustomersByCustomerTypeUrl + '?CustomerType=' + CustomerType
      );
    }
  }

  fillAccountsSelectCustomer() {
    return this.http.get<any>(this.fillAccountsSelectCustomerUrl);
  }

  getAllTransSearch(formData: any) {
    return this.http.post<any>(this.getAllTransSearchUrl, formData);
  }

  fillAllCustomerSelectWithBranch() {
    return this.http.get<any>(this.fillAllCustomerSelectWithBranchUrl);
  }

  getAllContractsNotPaidCustomer(FirstLoad: boolean) {
    return this.http.get<any>(
      this.getAllContractsNotPaidCustomerUrl + '?FirstLoad=' + FirstLoad
    );
  }

  getAllCustomerFilesUploaded(CustomerId: number) {
    return this.http.get<any>(
      this.getAllCustomerFilesUploadedUrl + '?CustomerId=' + CustomerId
    );
  }
  GetAllCustomerFiles(CustomerId: number) {
    return this.http.get<any>(
      this.getAllGetAllCustomerFiles + '?CustomerId=' + CustomerId
    );
  }

  /********************************Services*************************** */

  getMailsByCustomerId(CustomerId?: number) {
    if (CustomerId) {
      return this.http.get<any>(
        this.getMailsByCustomerIdUrl + '?CustomerId=' + CustomerId
      );
    } else {
      return this.http.get<any>(this.getMailsByCustomerIdUrl);
    }
  }

  getCurrentProjectsByCustomer(CustomerId?: number, Status?: number) {
    return this.http.get<any>(
      this.getProjectsByCustomerUrl +
        '?CustomerId=' +
        CustomerId +
        '&Status=' +
        Status
    );
  }

  getProjectsArchiveByCustomer(CustomerId?: number, Status: number = 1) {
    return this.http.get<any>(
      this.getProjectsByCustomerUrl +
        '?CustomerId=' +
        CustomerId +
        '&Status=' +
        Status
    );
  }

  getAllCustomerFiles(CustomerId?: number) {
    if (CustomerId) {
      return this.http.get<any>(
        this.getAllCustomerFilesUrl + '?CustomerId=' + CustomerId
      );
    } else {
      return this.http.get<any>(this.getAllCustomerFilesUrl);
    }
  }

  fillCustomerSelect2() {
    return this.http.get<any>(this.fillCustomerSelect2Url);
  }

  getSMSByCustomerId(CustomerId?: number) {
    if (CustomerId) {
      return this.http.get<any>(
        this.getSMSByCustomerIdUrl + '?CustomerId=' + CustomerId
      );
    } else {
      return this.http.get<any>(this.getSMSByCustomerIdUrl);
    }
  }

  deleteCustomerMail(val: any) {
    return this.http.post<any>(
      this.deleteCustomerMailUrl,
      {},
      { params: { MailId: val } }
    );
  }

  deleteCustomerSMS(val: any) {
    return this.http.post<any>(
      this.deleteCustomerSMSUrl,
      {},
      { params: { SMSId: val } }
    );
  }

  deleteCustomerFile(val: any) {
    return this.http.post<any>(
      this.deleteCustomerFileUrl,
      {},
      { params: { FileId: val } }
    );
  }


  fillFileTypeSelect() {
    return this.http.get<any>(this.fillFileTypeSelectUrl);
  }

  getAllFileTypesSearch() {
    return this.http.get<any>(this.getAllFileTypesSearchUrl);
  }

  deleteFileType(val: any) {
    return this.http.post<any>(
      this.deleteFileTypeUrl,
      {},
      { params: { FileTypeId: val } }
    );
  }

  uploadCustomerFiles(uploadFileObj: any) {
    return this.http.post<any>(this.uploadCustomerFilesUrl, uploadFileObj);
  }
  SaveCustomerFiles(uploadFileObj: any) {
    return this.http.post<any>(this.uploadCustomerF, uploadFileObj);
  }



  fillCustomerSelect2Mails() {
    return this.http.get<any>(this.fillCustomerSelect2MailsUrl);
  }

  getEmailOrganization() {
    return this.http.get<any>(this.getEmailOrganizationUrl);
  }

  getCustomersByCustomerId(CustomerId?: number) {
    if (CustomerId) {
      return this.http.get<any>(
        this.getCustomersByCustomerIdUrl + '?CustomerId=' + CustomerId
      );
    } else {
      return this.http.get<any>(this.getCustomersByCustomerIdUrl);
    }
  }

  GetReportGrid_Customers(reportParameter: any) {
    debugger;
    const headers = { 'content-type': 'application/json' };
    const reportParameters = JSON.stringify(reportParameter);
    return this.http.post(this.GetReportGrid_Customer, reportParameters, {
      headers: headers,
    });
  }

  GetReportGrid_AcountCustomer(reportParameter: any) {
    debugger;
    const headers = { 'content-type': 'application/json' };
    const reportParameters = JSON.stringify(reportParameter);
    return this.http.post(
      this.GetReportGrid_AccountCustomer,
      reportParameters,
      {
        headers: headers,
      }
    );
  }
}
