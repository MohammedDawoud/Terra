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
    return this.http.post(this.apiEndPoint + 'Organizations/SaveOrganizations',modal);
  }
  SaveBranchPart(modal: any): Observable<any> {
    return this.http.post(this.apiEndPoint + 'Branches/SaveBranchPart',modal);
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

  FillCitySelect() {
    return this.http.get<any>(this.apiEndPoint+'Organizations/FillCitySelect');
  }
  SaveCity(modal: any): Observable<any> {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(modal);
    return this.http.post(this.apiEndPoint + 'Organizations/SaveCity', body, { 'headers': headers });
  }
  DeleteCity(CityId: number): Observable<any> {
    return this.http.post(`${this.apiEndPoint}Organizations/DeleteCity?CityId=` + CityId, {});
  }

  FillSocialMediaSelect() {
    return this.http.get<any>(this.apiEndPoint+'Organizations/FillSocialMediaSelect');
  }
  SaveSocialMedia(modal: any): Observable<any> {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(modal);
    return this.http.post(this.apiEndPoint + 'Organizations/SaveSocialMedia', body, { 'headers': headers });
  }
  DeleteSocialMedia(SocialMediaId: number): Observable<any> {
    return this.http.post(`${this.apiEndPoint}Organizations/DeleteSocialMedia?SocialMediaId=` + SocialMediaId, {});
  }

  FillJobSelect() {
    return this.http.get<any>(this.apiEndPoint+'Organizations/FillJobSelect');
  }
  SaveJob(modal: any): Observable<any> {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(modal);
    return this.http.post(this.apiEndPoint + 'Organizations/SaveJob', body, { 'headers': headers });
  }
  DeleteJob(JobId: number): Observable<any> {
    return this.http.post(`${this.apiEndPoint}Organizations/DeleteJob?JobId=` + JobId, {});
  }


  FillAllAccountsSelectAll(){
    return this.http.get<any>(this.apiEndPoint + 'Account/FillAllAccountsSelectAll');
  }



  GetAllFiscalyears() {
    return this.http.get<any>(this.apiEndPoint + 'Fiscalyears/GetAllFiscalyears');
  }
  SaveFiscalyears(_Fiscal:any): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(_Fiscal);
    return this.http.post(this.apiEndPoint + 'Fiscalyears/SaveFiscalyears', body,{'headers':headers});
  }
  FillYearSelect(){
    return this.http.get<any>(this.apiEndPoint + 'Fiscalyears/FillYearSelect');
  }
  ActivateFiscalYear(FiscalId:any,SystemSettingId:any){
    return this.http.post<any>(this.apiEndPoint + 'Fiscalyears/ActivateFiscalYear?FiscalId='+FiscalId+'&SystemSettingId='+SystemSettingId+'',null);

  }
  GetActiveYear(){
    return this.http.get<any>(this.apiEndPoint + 'Fiscalyears/GetActiveYear');

  }
  DeleteFiscalyears(FiscalId:any){
    return this.http.post(this.apiEndPoint+'Fiscalyears/DeleteFiscalyears', {}, { params:{FiscalId:FiscalId}});
  }

}
