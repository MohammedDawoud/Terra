import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ExportationService } from '../exportation-service/exportation.service';

@Injectable({
  providedIn: 'root',
})
export class MeetingService {

  private apiEndPoint: string = '';
  constructor(private http:HttpClient,
    private exportationService: ExportationService,) {
    this.apiEndPoint = environment.apiEndPoint;
  }

  GetAllMeetings_Branch(){
    return this.http.get<any>(this.apiEndPoint + 'Meeting/GetAllMeetings_Branch');
  }
  GetMeetingById(MeetingId:any) {
    var url=`${environment.apiEndPoint}Meeting/GetMeetingById?MeetingId=${MeetingId}`;
    return this.http.get<any>(url);
  }
  DeleteMeeting(MeetingId:any) {
    return this.http.post<any>(this.apiEndPoint + 'Meeting/DeleteMeeting?MeetingId='+MeetingId,{});
  }
  ConvertMeeting(MeetingId:any) {
    return this.http.post<any>(this.apiEndPoint + 'Meeting/ConvertMeeting?MeetingId='+MeetingId,{});
  }
  SaveMeeting(model: any) {
    return this.http.post<any>(this.apiEndPoint + 'Meeting/SaveMeeting', model);
  }

  GetCustMainAccByBranchId(BranchId:any) {
    var url=`${environment.apiEndPoint}Account/GetCustMainAccByBranchId?BranchId=${BranchId}`;
    return this.http.get<any>(url);
  }
  GetEmpMainAccByBranchId(BranchId:any) {
    var url=`${environment.apiEndPoint}Account/GetEmpMainAccByBranchId?BranchId=${BranchId}`;
    return this.http.get<any>(url);
  }
  GetMeetingsByMeetingId(MeetingId:any) {
    var url=`${environment.apiEndPoint}Meeting/GetMeetingsByMeetingId?MeetingId=${MeetingId}`;
    return this.http.get<any>(url);
  }
  GenerateMeetingNumber() {
    var url=`${environment.apiEndPoint}Meeting/GenerateMeetingNumber`;
    return this.http.get<any>(url);
  }
  GenerateMeetingNumberByBarcodeNum(OrderBarcode:any ) {
    var url=`${environment.apiEndPoint}Meeting/GenerateMeetingNumberByBarcodeNum?OrderBarcode=${OrderBarcode}`;
    return this.http.get<any>(url);
  }
  GenerateOrderBarcodeNumber() {
    var url=`${environment.apiEndPoint}Meeting/GenerateOrderBarcodeNumber`;
    return this.http.get<any>(url);
  }
  FillCitySelect() {
    return this.http.get<any>(environment.apiEndPoint+'Organizations/FillCitySelect');
  }
  FillJobSelect() {
    return this.http.get<any>(environment.apiEndPoint+'Organizations/FillJobSelect');
  }
  FillMeetingselect() {
    return this.http.get<any>(environment.apiEndPoint+'Meeting/FillMeetingselect');
  }
  FillMeetingselectW(MeetingId:any) {
    var url=`${environment.apiEndPoint}Meeting/FillMeetingselectW?MeetingId=${MeetingId}`;
    return this.http.get<any>(url);
  }
  FillPayTypeSelect() {
    return this.http.get<any>(environment.apiEndPoint+'Organizations/FillPayTypeSelect');
  }
  FillSocialMediaSelect() {
    return this.http.get<any>(environment.apiEndPoint+'Organizations/FillSocialMediaSelect');
  }
  FillMeetingTypesSelect() {
    return this.http.get<any>(environment.apiEndPoint+'Organizations/FillMeetingTypesSelect');
  }
  FillBranchByUserIdSelect(){
    return this.http.get<any>(this.apiEndPoint + 'Branches/FillBranchByUserIdSelect');
  }

  GetAllMeetingsSelectBarcode(){
    return this.http.get<any>(this.apiEndPoint + 'Meeting/GetAllMeetingsSelectBarcode');
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


  // SearchFn(_MeetingVM: MeetingVM): Observable<any> {
  //   const headers = { 'content-type': 'application/json' };
  //   const body = JSON.stringify(_MeetingVM);
  //   return this.http.post(this.customerSearchUrl, body, { headers: headers });
  // }

  // getAllMeetingsByMeetingTypeId(type: any) {
  //   return this.http.get<any>(
  //     this.getAllMeetingsByMeetingTypeIdUrl + '?MeetingTypeId=' + type
  //   );
  // }

}
