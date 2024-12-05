import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ExportationService } from '../exportation-service/exportation.service';

@Injectable({
  providedIn: 'root',
})
export class DesignService {

  private apiEndPoint: string = '';
  constructor(private http:HttpClient,
    private exportationService: ExportationService,) {
    this.apiEndPoint = environment.apiEndPoint;
  }

  GetAllDesigns_Branch(){
    return this.http.get<any>(this.apiEndPoint + 'Design/GetAllDesigns_Branch');
  }
  GetDesignById(DesignId:any) {
    var url=`${environment.apiEndPoint}Design/GetDesignById?DesignId=${DesignId}`;
    return this.http.get<any>(url);
  }
  DeleteDesign(DesignId:any) {
    return this.http.post<any>(this.apiEndPoint + 'Design/DeleteDesign?DesignId='+DesignId,{});
  }
  ConvertDesign(DesignId:any) {
    return this.http.post<any>(this.apiEndPoint + 'Design/ConvertDesign?DesignId='+DesignId,{});
  }
  SaveDesign(model: any) {
    return this.http.post<any>(this.apiEndPoint + 'Design/SaveDesign', model);
  }

  GetCustMainAccByBranchId(BranchId:any) {
    var url=`${environment.apiEndPoint}Account/GetCustMainAccByBranchId?BranchId=${BranchId}`;
    return this.http.get<any>(url);
  }
  GetEmpMainAccByBranchId(BranchId:any) {
    var url=`${environment.apiEndPoint}Account/GetEmpMainAccByBranchId?BranchId=${BranchId}`;
    return this.http.get<any>(url);
  }
  GetDesignsByDesignId(DesignId:any) {
    var url=`${environment.apiEndPoint}Design/GetDesignsByDesignId?DesignId=${DesignId}`;
    return this.http.get<any>(url);
  }
  GenerateDesignNumber() {
    var url=`${environment.apiEndPoint}Design/GenerateDesignNumber`;
    return this.http.get<any>(url);
  }
  GenerateDesignNumberByBarcodeNum(OrderBarcode:any ) {
    var url=`${environment.apiEndPoint}Design/GenerateDesignNumberByBarcodeNum?OrderBarcode=${OrderBarcode}`;
    return this.http.get<any>(url);
  }
  GenerateOrderBarcodeNumber() {
    var url=`${environment.apiEndPoint}Design/GenerateOrderBarcodeNumber`;
    return this.http.get<any>(url);
  }
  FillCitySelect() {
    return this.http.get<any>(environment.apiEndPoint+'Organizations/FillCitySelect');
  }
  FillJobSelect() {
    return this.http.get<any>(environment.apiEndPoint+'Organizations/FillJobSelect');
  }
  FillDesignselect() {
    return this.http.get<any>(environment.apiEndPoint+'Design/FillDesignselect');
  }
  FillDesignselectW(DesignId:any) {
    var url=`${environment.apiEndPoint}Design/FillDesignselectW?DesignId=${DesignId}`;
    return this.http.get<any>(url);
  }
  FillPayTypeSelect() {
    return this.http.get<any>(environment.apiEndPoint+'Organizations/FillPayTypeSelect');
  }
  FillSocialMediaSelect() {
    return this.http.get<any>(environment.apiEndPoint+'Organizations/FillSocialMediaSelect');
  }
  FillDesignTypesSelect() {
    return this.http.get<any>(environment.apiEndPoint+'Organizations/FillDesignTypesSelect');
  }
  FillBranchByUserIdSelect(){
    return this.http.get<any>(this.apiEndPoint + 'Branches/FillBranchByUserIdSelect');
  }

  GetAllDesignsSelectBarcode(){
    return this.http.get<any>(this.apiEndPoint + 'Design/GetAllDesignsSelectBarcode');
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


  // SearchFn(_DesignVM: DesignVM): Observable<any> {
  //   const headers = { 'content-type': 'application/json' };
  //   const body = JSON.stringify(_DesignVM);
  //   return this.http.post(this.customerSearchUrl, body, { headers: headers });
  // }

  // getAllDesignsByDesignTypeId(type: any) {
  //   return this.http.get<any>(
  //     this.getAllDesignsByDesignTypeIdUrl + '?DesignTypeId=' + type
  //   );
  // }

}
