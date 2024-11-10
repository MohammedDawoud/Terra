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
  GetAllNews() {
    return this.http.get<any>(this.apiEndPoint + 'ContactUs/GetAllNews');
  }
  DecryptValue(value:any) {
    var url=`${environment.apiEndPoint}Login/DecryptValue?value=${value}`;
    return this.http.get<any>(url);
  }

  FillBranchSelect() {
    return this.http.get<any>(this.apiEndPoint + 'Login/FillBranchSelect');
  }
  ChangeOnlineStatus(_status:any){
    return this.http.post(this.apiEndPoint+'Login/ChangeOnlineStatus', {}, { params:{status:_status}});
  }
}
