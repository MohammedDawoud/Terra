import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RestApiService {
  printData: BehaviorSubject<any> = new BehaviorSubject({});
   lang: BehaviorSubject<any> = new BehaviorSubject('');

   private apiEndPoint: string = '';
  constructor(private http: HttpClient) {
    this.apiEndPoint = environment.apiEndPoint;
  }

  get(url: any) {
    return this.http.get(url);
  }

  post(url: any, data: any, token: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    };
    return this.http.post(url, JSON.stringify(data), httpOptions);
  }


  GetOrganizationDataLogin() {
    return this.http.get<any>(this.apiEndPoint + 'Login/GetOrganizationDataLogin');
  }
  GetBranchByBranchId() {
        return this.http.get<any>(this.apiEndPoint + 'Branches/GetBranchByBranchId');

  }
  Customeraccept(_offersPricesId:any){
    return this.http.post(this.apiEndPoint+'Login/Customeraccept', {}, { params:{OffersPricesId:_offersPricesId}});
  }
  SavePricingForm(obj:any): Observable<any> {
    const headers = { 'content-type': 'application/json'}
    const body=JSON.stringify(obj);
    return this.http.post(this.apiEndPoint + 'Login/SavePricingForm', body,{'headers':headers});
  }
  GetOfferByCustomerData(offerid:any,NationalId:any,ActivationCode:any) {
    var url=`${environment.apiEndPoint}Login/GetOfferByCustomerData?offerid=${offerid}&&NationalId=${NationalId}&&ActivationCode=${ActivationCode}`;
    return this.http.get<any>(url);
  }
  GetAllContactBranches() {
    return this.http.get<any>(this.apiEndPoint + 'ContactUs/GetAllContactBranches');
  }
  GetAllNews() {
    return this.http.get<any>(this.apiEndPoint + 'ContactUs/GetAllNews');
  }
  DecryptValue(value:any) {
    var url=`${environment.apiEndPoint}Login/DecryptValue?value=${value}`;
    return this.http.get<any>(url);
  }
  ForgetPasswordError(email: any,Link:any): Observable<any> {
    debugger
    // const headers = { 'content-type': 'application/json' }
    // const body = JSON.stringify(modal);
    return this.http.post(this.apiEndPoint+'Login/ForgetPasswordError', {}, { params:{email:email,Link:Link}});
    //return this.http.post(this.apiEndPoint + 'Login/ForgetPasswordError?email='+email+'&Link='+Link,{},{});
  }
  RetrievePassword(email: any,Forgetusername: any): Observable<any> {
    // const headers = { 'content-type': 'application/json' }
    // const body = JSON.stringify(modal);
    return this.http.post(this.apiEndPoint+'Login/RetrievePassword', {}, { params:{Forgetusername:Forgetusername,email:email}});
    //return this.http.post(this.apiEndPoint + 'Login/RetrievePassword?Forgetusername='+Forgetusername+'&email='+email,{});
  }
  ResetPassword(password: any,Link: any): Observable<any> {
    // const headers = { 'content-type': 'application/json' }
    // const body = JSON.stringify(modal);
    return this.http.post(this.apiEndPoint+'Login/ResetPassword', {}, { params:{password:password,Link:Link}});
    // return this.http.post(this.apiEndPoint + 'Login/RetrievePassword?password='+password+'&Link='+Link,{});
  }

  FillBranchSelect() {
    return this.http.get<any>(this.apiEndPoint + 'Login/FillBranchSelect');
  }
   GenerateCompanyQR(): Observable<any> {
    return this.http.get<any>(this.apiEndPoint + 'Login/GenerateCompanyQR');
  }
  ChangeOnlineStatus(_status:any){
    return this.http.post(this.apiEndPoint+'Login/ChangeOnlineStatus', {}, { params:{status:_status}});
  }
}
