import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ExportationService } from '../exportation-service/exportation.service';


@Injectable({
  providedIn: 'root'
})
export class AccountGuideService {

  private apiEndPoint: string = '';
  constructor(private http:HttpClient,
    private exportationService: ExportationService,) {
    this.apiEndPoint = environment.apiEndPoint;
  }

  //---------------------------------------------------------------------------------

  GetAccountTree(){
    return this.http.get<any>(this.apiEndPoint + 'Account/GetAccountTree');
  }
  GetAllAccounts(){
    return this.http.get<any>(this.apiEndPoint + 'Account/GetAllAccounts?SearchText=');
  }
  FillAccountIdAhlakSelect(){
    return this.http.get<any>(this.apiEndPoint + 'Account/FillAccountIdAhlakSelect');
  }
  FillCurrencySelect(){
    return this.http.get<any>(this.apiEndPoint + 'Currency/FillCurrencySelect');
  }
  GetAccCredit_Depit(AccountId:any) {
    return this.http.get<any>(this.apiEndPoint + 'Transactions/GetAccCredit_Depit?AccountId='+AccountId);
  }
  GetAccountById(AccountId:any) {
    return this.http.get<any>(this.apiEndPoint + 'Account/GetAccountById?AccountId='+AccountId);
  }
  SaveAccount(modal:any) {
    return this.http.post<any>(this.apiEndPoint + 'Account/SaveAccount',modal);
  }
  GetAccountByCode(Code:any) {
    return this.http.get<any>(this.apiEndPoint + 'Account/GetAccountByCode?Code='+Code);
  }
  GetNewCodeByParentId(ParentId:any) {
    return this.http.get<any>(this.apiEndPoint + 'Account/GetNewCodeByParentId?ParentId='+ParentId);
  }
  PrintTrewView(){
    return this.http.get<any>(this.apiEndPoint + 'Account/PrintTrewView');
  }
  DeleteAccount(DeletedAccountId:any) {
    return this.http.post<any>(this.apiEndPoint + 'Account/DeleteAccount?AccountId='+DeletedAccountId,{});
  }
  MaintenanceFunc() {
    return this.http.post<any>(this.apiEndPoint + 'Account/MaintenanceFunc?Status=0',{});
  }
  TestAcc() {
    return this.http.get<any>(
      this.apiEndPoint + 'Account/TestAcc?param=1'
    );
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

}
