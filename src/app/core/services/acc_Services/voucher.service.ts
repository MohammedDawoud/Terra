import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ExportationService } from '../exportation-service/exportation.service';


@Injectable({
  providedIn: 'root'
})
export class VoucherService {

  private apiEndPoint: string = '';
  constructor(private http:HttpClient,
    private exportationService: ExportationService,) {
    this.apiEndPoint = environment.apiEndPoint;
  }

  //---------------------------------------------------------------------------------
  GetAllVouchers_Branch(Type:any){
    var url=`${environment.apiEndPoint}Voucher/GetAllVouchers_Branch?Type=${Type}`;
    return this.http.get<any>(url);
  }
  DeleteVoucher(VoucherId:any) {
    return this.http.post<any>(this.apiEndPoint + 'Voucher/DeleteVoucher?VoucherId='+VoucherId,{});
  }
  SaveVoucher(model: any) {
    return this.http.post<any>(this.apiEndPoint + 'Voucher/SaveVoucher', model);
  }
  GetAllVoucherTransactions(VoucherId: any) {
    var url = `${environment.apiEndPoint}Voucher/GetAllVoucherTransactions?&VoucherId=${VoucherId}`;
    return this.http.get<any>(url);
  }
  VoucherNumber_Reservation(Type:any,BranchId:any) {
    var url=`${environment.apiEndPoint}Voucher/VoucherNumber_Reservation?Type=${Type}&&BranchId=${BranchId}`;
    return this.http.get<any>(url);
  }
  PostBackVoucher(VoucherId:any){
    return this.http.post(this.apiEndPoint+'Voucher/PostBackVoucher', {}, { params:{VoucherId:VoucherId}});
  }
  FillBranchByUserIdSelect(){
    return this.http.get<any>(this.apiEndPoint + 'Branches/FillBranchByUserIdSelect');
  }
  FillAllAccountsSelect(){
    return this.http.get<any>(this.apiEndPoint + 'Account/FillAllAccountsSelect');
  }
  FillAllAccountsSelectByParentId(ParentId:any) {
    var url=`${environment.apiEndPoint}Account/FillAllAccountsSelectByParentId?ParentId=${ParentId}`;
    return this.http.get<any>(url);
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
