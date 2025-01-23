import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ExportationService } from '../exportation-service/exportation.service';


@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiEndPoint: string = '';
  constructor(private http:HttpClient,
    private exportationService: ExportationService,) {
    this.apiEndPoint = environment.apiEndPoint;
  }

  //---------------------------------------------------------------------------------
  GetAllCategories_Branch(){
    return this.http.get<any>(this.apiEndPoint + 'Category/GetAllCategories_Branch');
  }
  DeleteCategory(CategoryId:any) {
    return this.http.post<any>(this.apiEndPoint + 'Category/DeleteCategory?CategoryId='+CategoryId,{});
  }

  SaveCategory(model: any) {
    return this.http.post<any>(this.apiEndPoint + 'Category/SaveCategory', model);
  }


  CategoryNumber_Reservation(BranchId:any) {
    var url=`${environment.apiEndPoint}Category/CategoryNumber_Reservation?BranchId=${BranchId}`;
    return this.http.get<any>(url);
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

  FillCategoryTypeSelect() {
    return this.http.get<any>(this.apiEndPoint+'Category/FillCategoryTypeSelect');
  }
  SaveCategoryType(modal: any): Observable<any> {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(modal);
    return this.http.post(this.apiEndPoint + 'Category/SaveCategoryType', body, { 'headers': headers });
  }
  DeleteCategoryType(CategoryTypeId: number): Observable<any> {
    return this.http.post(`${this.apiEndPoint}Category/DeleteCategoryType?CategoryTypeId=` + CategoryTypeId, {});
  }
  GenerateCategoryTypeNumber() {
    var url=`${environment.apiEndPoint}Category/GenerateCategoryTypeNumber`;
    return this.http.get<any>(url);
  }
  FillUnitSelect() {
    return this.http.get<any>(this.apiEndPoint+'Category/FillUnitSelect');
  }
  SaveUnit(modal: any): Observable<any> {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(modal);
    return this.http.post(this.apiEndPoint + 'Category/SaveUnit', body, { 'headers': headers });
  }
  DeleteUnit(UnitId: number): Observable<any> {
    return this.http.post(`${this.apiEndPoint}Category/DeleteUnit?UnitId=` + UnitId, {});
  }
  GenerateUnitNumber() {
    var url=`${environment.apiEndPoint}Category/GenerateUnitNumber`;
    return this.http.get<any>(url);
  }

}
