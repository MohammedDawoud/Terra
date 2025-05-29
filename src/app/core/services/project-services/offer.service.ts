import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ExportationService } from '../exportation-service/exportation.service';

@Injectable({
  providedIn: 'root',
})
export class OfferService {

  private apiEndPoint: string = '';
  constructor(private http:HttpClient,
    private exportationService: ExportationService,) {
    this.apiEndPoint = environment.apiEndPoint;
  }

  GetAllOffers_Branch(){
    return this.http.get<any>(this.apiEndPoint + 'Offer/GetAllOffers_Branch');
  }
  GetOfferById(OfferId:any) {
    var url=`${environment.apiEndPoint}Offer/GetOfferById?OfferId=${OfferId}`;
    return this.http.get<any>(url);
  }
  DeleteOffer(OfferId:any) {
    return this.http.post<any>(this.apiEndPoint + 'Offer/DeleteOffer?OfferId='+OfferId,{});
  }
  DeletePayment(PaymentId:any) {
    return this.http.post<any>(this.apiEndPoint + 'Offer/DeletePayment?PaymentId='+PaymentId,{});
  }
  ConvertOffer(OfferId:any) {
    return this.http.post<any>(this.apiEndPoint + 'Offer/ConvertOffer?OfferId='+OfferId,{});
  }
  SaveOffer(model: any) {
    return this.http.post<any>(this.apiEndPoint + 'Offer/SaveOffer', model);
  }
  SavePayment(model: any) {
    return this.http.post<any>(this.apiEndPoint + 'Offer/SavePayment', model);
  }
  GetCustMainAccByBranchId(BranchId:any) {
    var url=`${environment.apiEndPoint}Account/GetCustMainAccByBranchId?BranchId=${BranchId}`;
    return this.http.get<any>(url);
  }
  GetEmpMainAccByBranchId(BranchId:any) {
    var url=`${environment.apiEndPoint}Account/GetEmpMainAccByBranchId?BranchId=${BranchId}`;
    return this.http.get<any>(url);
  }
  GetOffersByOfferId(OfferId:any) {
    var url=`${environment.apiEndPoint}Offer/GetOffersByOfferId?OfferId=${OfferId}`;
    return this.http.get<any>(url);
  }
  GenerateOfferNumber() {
    var url=`${environment.apiEndPoint}Offer/GenerateOfferNumber`;
    return this.http.get<any>(url);
  }
  OfferNumber_Reservation(BranchId:any) {
    var url=`${environment.apiEndPoint}Offer/OfferNumber_Reservation?BranchId=${BranchId}`;
    return this.http.get<any>(url);
  }
  GenerateOfferNumberByBarcodeNum(OrderBarcode:any ) {
    var url=`${environment.apiEndPoint}Offer/GenerateOfferNumberByBarcodeNum?OrderBarcode=${OrderBarcode}`;
    return this.http.get<any>(url);
  }
  GetCategoriesByOfferId(OfferId:any ) {
    var url=`${environment.apiEndPoint}Offer/GetCategoriesByOfferId?OfferId=${OfferId}`;
    return this.http.get<any>(url);
  }
  GetAllPaymentsByOfferId(OfferId:any ) {
    var url=`${environment.apiEndPoint}Offer/GetAllPaymentsByOfferId?OfferId=${OfferId}`;
    return this.http.get<any>(url);
  }
  GenerateOrderBarcodeNumber() {
    var url=`${environment.apiEndPoint}Offer/GenerateOrderBarcodeNumber`;
    return this.http.get<any>(url);
  }
  FillCitySelect() {
    return this.http.get<any>(environment.apiEndPoint+'Organizations/FillCitySelect');
  }
  FillJobSelect() {
    return this.http.get<any>(environment.apiEndPoint+'Organizations/FillJobSelect');
  }
  FillOfferselect() {
    return this.http.get<any>(environment.apiEndPoint+'Offer/FillOfferselect');
  }
  FillOfferselectW(OfferId:any) {
    var url=`${environment.apiEndPoint}Offer/FillOfferselectW?OfferId=${OfferId}`;
    return this.http.get<any>(url);
  }
  FillPayTypeSelect() {
    return this.http.get<any>(environment.apiEndPoint+'Organizations/FillPayTypeSelect');
  }
  FillSocialMediaSelect() {
    return this.http.get<any>(environment.apiEndPoint+'Organizations/FillSocialMediaSelect');
  }
  FillOfferTypesSelect() {
    return this.http.get<any>(environment.apiEndPoint+'Organizations/FillOfferTypesSelect');
  }
  FillBranchByUserIdSelect(){
    return this.http.get<any>(this.apiEndPoint + 'Branches/FillBranchByUserIdSelect');
  }

  GetAllOffersSelectBarcode(){
    return this.http.get<any>(this.apiEndPoint + 'Offer/GetAllOffersSelectBarcode');
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


  // SearchFn(_OfferVM: OfferVM): Observable<any> {
  //   const headers = { 'content-type': 'application/json' };
  //   const body = JSON.stringify(_OfferVM);
  //   return this.http.post(this.customerSearchUrl, body, { headers: headers });
  // }

  // getAllOffersByOfferTypeId(type: any) {
  //   return this.http.get<any>(
  //     this.getAllOffersByOfferTypeIdUrl + '?OfferTypeId=' + type
  //   );
  // }

}
