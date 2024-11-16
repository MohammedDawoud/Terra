import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CustomerVM } from '../../Classes/ViewModels/customerVM';
import { ExportationService } from '../exportation-service/exportation.service';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {

  private apiEndPoint: string = '';
  constructor(private http:HttpClient,
    private exportationService: ExportationService,) {
    this.apiEndPoint = environment.apiEndPoint;
  }

  GetAllCustomers_Branch(){
    return this.http.get<any>(this.apiEndPoint + 'Customer/GetAllCustomers_Branch');
  }
  DeleteCustomer(CustomerId:any) {
    return this.http.post<any>(this.apiEndPoint + 'Customer/DeleteCustomer?CustomerId='+CustomerId,{});
  }

  SaveCustomer(model: any) {
    return this.http.post<any>(this.apiEndPoint + 'Customer/SaveCustomer', model);
  }

  GetCustMainAccByBranchId(BranchId:any) {
    var url=`${environment.apiEndPoint}Account/GetCustMainAccByBranchId?BranchId=${BranchId}`;
    return this.http.get<any>(url);
  }

  GetCustomersByCustomerId(CustomerId:any) {
    var url=`${environment.apiEndPoint}Customer/GetCustomersByCustomerId?CustomerId=${CustomerId}`;
    return this.http.get<any>(url);
  }
  GenerateCustomerNumber() {
    var url=`${environment.apiEndPoint}Customer/GenerateCustomerNumber`;
    return this.http.get<any>(url);
  }
  FillCitySelect() {
    return this.http.get<any>(environment.apiEndPoint+'Organizations/FillCitySelect');
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

  // SearchFn(_CustomerVM: CustomerVM): Observable<any> {
  //   const headers = { 'content-type': 'application/json' };
  //   const body = JSON.stringify(_CustomerVM);
  //   return this.http.post(this.customerSearchUrl, body, { headers: headers });
  // }

  // getAllCustomersByCustomerTypeId(type: any) {
  //   return this.http.get<any>(
  //     this.getAllCustomersByCustomerTypeIdUrl + '?CustomerTypeId=' + type
  //   );
  // }

}
