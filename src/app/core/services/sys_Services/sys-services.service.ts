import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ExportationService } from '../exportation-service/exportation.service';
@Injectable({
  providedIn: 'root',
})
export class SysServicesService {
  private apiEndPoint: string = '';
  private labaikendpoint: string = '';
  constructor(private exportationService: ExportationService,private http: HttpClient) {
    this.apiEndPoint = environment.apiEndPoint;
  }
  GetCurrentUser() {
    return this.http.get<any>(this.apiEndPoint + 'Users/GetCurrentUser');
  }
  GetAllUsers() {
    return this.http.get<any>(this.apiEndPoint + 'Users/GetAllUsers');
  }
  GetUserById(UserId: any) {
    var url = `${environment.apiEndPoint}Users/GetUserById?UserId=${UserId}`;
    return this.http.get<any>(url);
  }
  FillBranchSelect() {
    return this.http.get<any>(this.apiEndPoint + 'Branches/FillBranchSelect');
  }
  GetBranchesByUserId(UserId: any) {
    var url = `${environment.apiEndPoint}Users/GetBranchesByUserId?UserId=${UserId}`;
    return this.http.get<any>(url);
  }
  BranchesByUserId(UserId: any) {
    var url = `${environment.apiEndPoint}Users/GetBranchesByUserId?UserId=${UserId}`;
    return this.http.get<any>(url);
  }
  FillUsersSelect() {
    return this.http.get<any>(this.apiEndPoint + 'Users/FillUsersSelect');
  }

  getUsersByPrivilegesIds(PrivilegeId: number, _?: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const params = {
      PrivilegeId: PrivilegeId,
      UserPrivId: 0,
    };
    return this.http.post<any>(
      this.apiEndPoint + 'Privileges/GetUsersByPrivilegesIds',
      params
    );
  }
  deleteUsers(userId: number) {
    const formData = new FormData();
    formData.append('Users', userId.toString());
    const headers = new HttpHeaders();
    return this.http.post<any>(
      `${environment.apiEndPoint}Users/DeleteUsers?userId=` + userId,
      {}
    );
  }
  FillGroupsSelect(): Observable<any> {
    const url = `${this.apiEndPoint}Groups/FillGroupsSelect`;
    return this.http.get(url);
  }
  getDepartments(param: number): Observable<any> {
    return this.http.get(
      `${this.apiEndPoint}Department/FillDepartmentSelectByTypeUser?param=${param}`
    );
  }
  FillAttendanceTimeSelect(): Observable<any> {
    const url = `${this.apiEndPoint}AttendaceTime/FillAttendanceTimeSelect`;
    return this.http.get(url);
  }

  saveUser(userFormData: FormData): Observable<any> {
    return this.http.post(this.apiEndPoint + 'Users/SaveUsers', userFormData);
  }
  saveUsers(usersData: any) {
    return this.http.post(this.apiEndPoint + 'Users/SaveUsers', usersData);
  }
  getPrivilegesByUserId(userId: number): Observable<any> {
    return this.http.get(
      this.apiEndPoint + 'Users/GetPrivilegesIdsByUserId?UserId=' + userId
    );
  }
  getNotificationPrivilegesByUserId(userId: string): Observable<any> {
    return this.http.get(
      this.apiEndPoint +
        'NotificationPrivileges/GetNotifPrivilegesIdsByUserId?UserId=' +
        userId
    );
  }
  saveUserPrivileges(userId: string, privilegeIds: any[]): Observable<any> {
    const payload = {
      UserId: userId,
      PrivIds: privilegeIds,
    };
    return this.http.post(this.apiEndPoint + 'Users/SaveUserPriv', payload);
  }

  saveUserPrivil(userId: string, privilegeIds: any[]): Observable<any> {
    const prames = {
      UserId: userId,
      PrivIds: privilegeIds,
    };

    return this.http.post(this.apiEndPoint + 'Users/SaveUserPriv', prames);
  }

  GetFillPriv(): Observable<any> {
    return this.http.get(this.apiEndPoint + 'Users/FillPriv');
  }
  SaveGroups(modal: any): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(modal);
    return this.http.post(this.apiEndPoint + 'Groups/SaveGroups', body, {
      headers: headers,
    });
  }
  GetAllGroups_S(): Observable<any> {
    const url = `${this.apiEndPoint}Groups/GetAllGroups_S?SearchText= `;
    return this.http.get(url);
  }
  DeleteGroups(GroupsId: number): Observable<any> {
    return this.http.post(
      `${this.apiEndPoint}Groups/DeleteGroups?GroupId=` + GroupsId,
      {}
    );
  }
  GetAllDepartmentbyType(): Observable<any> {
    const url = `${this.apiEndPoint}Department/GetAllDepartmentbyType?Type=1`;
    return this.http.get(url);
  }
  SaveDepartment(modal: any): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(modal);
    return this.http.post(
      this.apiEndPoint + 'Department/SaveDepartment',
      body,
      { headers: headers }
    );
  }
  DeleteDepartment(DepartmentId: number): Observable<any> {
    return this.http.post(
      `${this.apiEndPoint}Department/DeleteDepartment?DepartmentId=` +
        DepartmentId,
      {}
    );
  }
  GetMaxOrderNumber(): Observable<any> {
    const url = `${this.apiEndPoint}Users/GetMaxOrderNumber`;
    return this.http.get(url);
  }
  getPrivilegesTree(): Observable<any[]> {
    return this.http.get<any[]>(
      this.apiEndPoint + 'Users/GetPrivilegesTree'
    );
  }
  CloseUser(modal: any): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(modal);
    return this.http.post(this.apiEndPoint + 'Users/CloseUser', body, {
      headers: headers,
    });
  }
  GetBranchOrganization() {
    return this.http.get<any>(
      this.apiEndPoint + 'Organizations/GetBranchOrganization'
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
