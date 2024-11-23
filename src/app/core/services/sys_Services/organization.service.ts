import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class OrganizationService {
  private apiEndPoint: string = '';
  constructor(private http: HttpClient) {
    this.apiEndPoint = environment.apiEndPoint;
  }

  GetBranchOrganization() {
    return this.http.get<any>(
      this.apiEndPoint + 'Organizations/GetBranchOrganization'
    );
  }
  SaveOrganizations(modal: any): Observable<any> {
    // const headers = { 'content-type': 'application/json' }
    // const body = JSON.stringify(modal);
    return this.http.post(
      this.apiEndPoint + 'Organizations/SaveOrganizations',
      modal
    );
  }
  FillCitySelect() {
    return this.http.get<any>(environment.apiEndPoint+'Organizations/FillCitySelect');
  }

  GetAllBranches() {
    return this.http.get<any>(this.apiEndPoint + 'Branches/GetAllBranches');
  }


  EncryptPassword(value:any) {
    var url=`${environment.apiEndPoint}Login/EncryptPassword?value=${value}`;
    return this.http.get<any>(url);
  }

  GetAllNews() {
    return this.http.get<any>(this.apiEndPoint + 'ContactUs/GetAllNews');
  }
  SaveNews(modal: any): Observable<any> {
    // const headers = { 'content-type': 'application/json' }
    // const body = JSON.stringify(modal);
    return this.http.post(this.apiEndPoint + 'ContactUs/SaveNews', modal);
  }
  deleteNews(newsId: any) {
    return this.http.post<any>(
      this.apiEndPoint + 'ContactUs/DeleteNews?NewsId=' + newsId,
      null
    );
  }
  MaintenanceFunc(Status: any): Observable<any> {
    return this.http.post<any>(
      this.apiEndPoint + 'Organizations/MaintenanceFunc?Status=' + Status,
      null
    );
  }
}
