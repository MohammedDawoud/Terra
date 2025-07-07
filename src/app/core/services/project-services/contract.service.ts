import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ExportationService } from '../exportation-service/exportation.service';

@Injectable({
  providedIn: 'root',
})
export class ContractService {

  private apiEndPoint: string = '';
  constructor(private http:HttpClient,
    private exportationService: ExportationService,) {
    this.apiEndPoint = environment.apiEndPoint;
  }

  GetAllContracts_Branch(){
    return this.http.get<any>(this.apiEndPoint + 'Contract/GetAllContracts_Branch');
  }
  GetContractById(ContractId:any) {
    var url=`${environment.apiEndPoint}Contract/GetContractById?ContractId=${ContractId}`;
    return this.http.get<any>(url);
  }
  DeleteContract(ContractId:any) {
    return this.http.post<any>(this.apiEndPoint + 'Contract/DeleteContract?ContractId='+ContractId,{});
  }
  ReturnContract(ContractId:any) {
    return this.http.post<any>(this.apiEndPoint + 'Contract/ReturnContract?ContractId='+ContractId,{});
  }
  DeletePayment(PaymentId:any) {
    return this.http.post<any>(this.apiEndPoint + 'Contract/DeletePayment?PaymentId='+PaymentId,{});
  }
  ConvertContract(ContractId:any) {
    return this.http.post<any>(this.apiEndPoint + 'Contract/ConvertContract?ContractId='+ContractId,{});
  }
  SaveContract(model: any) {
    return this.http.post<any>(this.apiEndPoint + 'Contract/SaveContract', model);
  }
  SavePayment(model: any) {
    return this.http.post<any>(this.apiEndPoint + 'Contract/SavePayment', model);
  }
  GetCustMainAccByBranchId(BranchId:any) {
    var url=`${environment.apiEndPoint}Account/GetCustMainAccByBranchId?BranchId=${BranchId}`;
    return this.http.get<any>(url);
  }
  GetEmpMainAccByBranchId(BranchId:any) {
    var url=`${environment.apiEndPoint}Account/GetEmpMainAccByBranchId?BranchId=${BranchId}`;
    return this.http.get<any>(url);
  }
  GetContractsByContractId(ContractId:any) {
    var url=`${environment.apiEndPoint}Contract/GetContractsByContractId?ContractId=${ContractId}`;
    return this.http.get<any>(url);
  }
  GenerateContractNumber() {
    var url=`${environment.apiEndPoint}Contract/GenerateContractNumber`;
    return this.http.get<any>(url);
  }
  GenerateContractNumberByBarcodeNum(OrderBarcode:any ) {
    var url=`${environment.apiEndPoint}Contract/GenerateContractNumberByBarcodeNum?OrderBarcode=${OrderBarcode}`;
    return this.http.get<any>(url);
  }
  GetCategoriesByContractId(ContractId:any ) {
    var url=`${environment.apiEndPoint}Contract/GetCategoriesByContractId?ContractId=${ContractId}`;
    return this.http.get<any>(url);
  }
  GetAllPaymentsByContractId(ContractId:any ) {
    var url=`${environment.apiEndPoint}Contract/GetAllPaymentsByContractId?ContractId=${ContractId}`;
    return this.http.get<any>(url);
  }
  GenerateOrderBarcodeNumber() {
    var url=`${environment.apiEndPoint}Contract/GenerateOrderBarcodeNumber`;
    return this.http.get<any>(url);
  }
  FillCitySelect() {
    return this.http.get<any>(environment.apiEndPoint+'Organizations/FillCitySelect');
  }
  FillJobSelect() {
    return this.http.get<any>(environment.apiEndPoint+'Organizations/FillJobSelect');
  }
  FillContractselect() {
    return this.http.get<any>(environment.apiEndPoint+'Contract/FillContractselect');
  }
  FillContractselectW(ContractId:any) {
    var url=`${environment.apiEndPoint}Contract/FillContractselectW?ContractId=${ContractId}`;
    return this.http.get<any>(url);
  }
  FillPayTypeSelect() {
    return this.http.get<any>(environment.apiEndPoint+'Organizations/FillPayTypeSelect');
  }
  FillSocialMediaSelect() {
    return this.http.get<any>(environment.apiEndPoint+'Organizations/FillSocialMediaSelect');
  }
  FillContractTypesSelect() {
    return this.http.get<any>(environment.apiEndPoint+'Organizations/FillContractTypesSelect');
  }
  FillBranchByUserIdSelect(){
    return this.http.get<any>(this.apiEndPoint + 'Branches/FillBranchByUserIdSelect');
  }
  GetReVoucherAccounts(BranchId:any ) {
    var url=`${environment.apiEndPoint}Voucher/GetReVoucherAccounts?BranchId=${BranchId}`;
    return this.http.get<any>(url);
  }
  GetAllContractsSelectBarcode(){
    return this.http.get<any>(this.apiEndPoint + 'Contract/GetAllContractsSelectBarcode');
  }
  customExportExcel(dataExport: any, nameExport: any) {

    let exportation = JSON.parse(JSON.stringify(dataExport));
    let itemsToExeclude: string[] = []

    let excelData: any[] = [];
    let headers: string[] = [];
    let objectKeys = Object.keys(dataExport[0]);
    objectKeys = objectKeys.filter((item: string) => !itemsToExeclude.includes(item));

    objectKeys.forEach(element => {
      headers.push(element.toUpperCase());
    });

    exportation.forEach((ele: any) => {
      // ele = (ele) => {
      var sorted: any = {},
        key, a = [];

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
      let props = Object.getOwnPropertyNames(ele).filter(prop => exportation.some((ex: any) => ex === prop));
      props.forEach(pp => {
        delete ele[pp];
      })

      excelData.push(ele);

    })

    this.exportationService.exportExcel(excelData, nameExport + new Date().getTime(), headers);
  }


  // SearchFn(_ContractVM: ContractVM): Observable<any> {
  //   const headers = { 'content-type': 'application/json' };
  //   const body = JSON.stringify(_ContractVM);
  //   return this.http.post(this.customerSearchUrl, body, { headers: headers });
  // }

  // getAllContractsByContractTypeId(type: any) {
  //   return this.http.get<any>(
  //     this.getAllContractsByContractTypeIdUrl + '?ContractTypeId=' + type
  //   );
  // }

}
