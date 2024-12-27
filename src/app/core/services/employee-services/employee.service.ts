import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ExportationService } from '../exportation-service/exportation.service';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {

  private apiEndPoint: string = '';
  constructor(private http:HttpClient,
    private exportationService: ExportationService,) {
    this.apiEndPoint = environment.apiEndPoint;
  }

  GetAllEmployees_Branch(){
    return this.http.get<any>(this.apiEndPoint + 'Employee/GetAllEmployees_Branch');
  }
  DeleteEmployee(EmployeeId:any) {
    return this.http.post<any>(this.apiEndPoint + 'Employee/DeleteEmployee?EmployeeId='+EmployeeId,{});
  }

  SaveEmployee(model: any) {
    return this.http.post<any>(this.apiEndPoint + 'Employee/SaveEmployee', model);
  }

  GetCustMainAccByBranchId(BranchId:any) {
    var url=`${environment.apiEndPoint}Account/GetCustMainAccByBranchId?BranchId=${BranchId}`;
    return this.http.get<any>(url);
  }
  GetEmpMainAccByBranchId(BranchId:any) {
    var url=`${environment.apiEndPoint}Account/GetEmpMainAccByBranchId?BranchId=${BranchId}`;
    return this.http.get<any>(url);
  }
  GetEmployeesByEmployeeId(EmployeeId:any) {
    var url=`${environment.apiEndPoint}Employee/GetEmployeesByEmployeeId?EmployeeId=${EmployeeId}`;
    return this.http.get<any>(url);
  }
  GenerateEmployeeNumber() {
    var url=`${environment.apiEndPoint}Employee/GenerateEmployeeNumber`;
    return this.http.get<any>(url);
  }
  EmployeeNumber_Reservation(BranchId:any) {
    var url=`${environment.apiEndPoint}Employee/EmployeeNumber_Reservation?BranchId=${BranchId}`;
    return this.http.get<any>(url);
  }
  FillCitySelect() {
    return this.http.get<any>(environment.apiEndPoint+'Organizations/FillCitySelect');
  }
  FillJobSelect() {
    return this.http.get<any>(environment.apiEndPoint+'Organizations/FillJobSelect');
  }
  FillEmployeeselect() {
    return this.http.get<any>(environment.apiEndPoint+'Employee/FillEmployeeselect');
  }
  FillEmployeeselectW(EmployeeId:any) {
    var url=`${environment.apiEndPoint}Employee/FillEmployeeselectW?EmployeeId=${EmployeeId}`;
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


  // SearchFn(_EmployeeVM: EmployeeVM): Observable<any> {
  //   const headers = { 'content-type': 'application/json' };
  //   const body = JSON.stringify(_EmployeeVM);
  //   return this.http.post(this.customerSearchUrl, body, { headers: headers });
  // }

  // getAllEmployeesByEmployeeTypeId(type: any) {
  //   return this.http.get<any>(
  //     this.getAllEmployeesByEmployeeTypeIdUrl + '?EmployeeTypeId=' + type
  //   );
  // }

}
