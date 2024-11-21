import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ExportationService } from '../exportation-service/exportation.service';

@Injectable({
  providedIn: 'root',
})
export class PreviewService {

  private apiEndPoint: string = '';
  constructor(private http:HttpClient,
    private exportationService: ExportationService,) {
    this.apiEndPoint = environment.apiEndPoint;
  }

  GetAllPreviews_Branch(){
    return this.http.get<any>(this.apiEndPoint + 'Preview/GetAllPreviews_Branch');
  }
  DeletePreview(PreviewId:any) {
    return this.http.post<any>(this.apiEndPoint + 'Preview/DeletePreview?PreviewId='+PreviewId,{});
  }

  SavePreview(model: any) {
    return this.http.post<any>(this.apiEndPoint + 'Preview/SavePreview', model);
  }

  GetCustMainAccByBranchId(BranchId:any) {
    var url=`${environment.apiEndPoint}Account/GetCustMainAccByBranchId?BranchId=${BranchId}`;
    return this.http.get<any>(url);
  }
  GetEmpMainAccByBranchId(BranchId:any) {
    var url=`${environment.apiEndPoint}Account/GetEmpMainAccByBranchId?BranchId=${BranchId}`;
    return this.http.get<any>(url);
  }
  GetPreviewsByPreviewId(PreviewId:any) {
    var url=`${environment.apiEndPoint}Preview/GetPreviewsByPreviewId?PreviewId=${PreviewId}`;
    return this.http.get<any>(url);
  }
  GeneratePreviewNumber() {
    var url=`${environment.apiEndPoint}Preview/GeneratePreviewNumber`;
    return this.http.get<any>(url);
  }
  FillCitySelect() {
    return this.http.get<any>(environment.apiEndPoint+'Organizations/FillCitySelect');
  }
  FillJobSelect() {
    return this.http.get<any>(environment.apiEndPoint+'Organizations/FillJobSelect');
  }
  FillPreviewselect() {
    return this.http.get<any>(environment.apiEndPoint+'Preview/FillPreviewselect');
  }
  FillPreviewselectW(PreviewId:any) {
    var url=`${environment.apiEndPoint}Preview/FillPreviewselectW?PreviewId=${PreviewId}`;
    return this.http.get<any>(url);
  }
  FillPayTypeSelect() {
    return this.http.get<any>(environment.apiEndPoint+'Organizations/FillPayTypeSelect');
  }
  FillSocialMediaSelect() {
    return this.http.get<any>(environment.apiEndPoint+'Organizations/FillSocialMediaSelect');
  }
  FillBranchByUserIdSelect(){
    return this.http.get<any>(this.apiEndPoint + 'Branches/FillBranchByUserIdSelect');
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


  // SearchFn(_PreviewVM: PreviewVM): Observable<any> {
  //   const headers = { 'content-type': 'application/json' };
  //   const body = JSON.stringify(_PreviewVM);
  //   return this.http.post(this.customerSearchUrl, body, { headers: headers });
  // }

  // getAllPreviewsByPreviewTypeId(type: any) {
  //   return this.http.get<any>(
  //     this.getAllPreviewsByPreviewTypeIdUrl + '?PreviewTypeId=' + type
  //   );
  // }

}
