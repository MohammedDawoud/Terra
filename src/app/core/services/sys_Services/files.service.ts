import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class filesservice {
  private apiEndPoint: string = '';
  constructor(private http: HttpClient) {
    this.apiEndPoint = environment.apiEndPoint;
  }

  UploadFiles(file: any,_file?:any): Observable<HttpEvent<any>> {
    debugger
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'multipart/form-data');
    const formData: FormData = new FormData();
    formData.append('uploadesgiles', file);
    formData.append('FileId', String(_file.fileId));
    formData.append('FileName', String(_file.fileName));
    formData.append('TransactionTypeId', String(_file.transactionTypeId));
    debugger
    if(!(_file.employeeId==undefined || _file.employeeId==null))
    {
      formData.append('EmployeeId',String(_file.employeeId));
    }
    if(!(_file.previewId==undefined || _file.previewId==null))
    {
      formData.append('PreviewId',String(_file.previewId));
    }
    if(!(_file.meetingId==undefined || _file.meetingId==null))
    {
      formData.append('MeetingId',String(_file.meetingId));
    }
    if(!(_file.designId==undefined || _file.designId==null))
    {
      formData.append('DesignId',String(_file.designId));
    }
    if(!(_file.contractId==undefined || _file.contractId==null))
    {
      formData.append('ContractId',String(_file.contractId));
    }
    formData.append('Notes',String(_file.notes));

    const req = new HttpRequest('POST', `${this.apiEndPoint}Files/UploadFiles`, formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);
  }
  GetAllPreviewFiles(PreviewId:any) {
    var url=`${environment.apiEndPoint}Files/GetAllPreviewFiles?PreviewId=${PreviewId}`;
    return this.http.get<any>(url);
  }
  GetAllMeetingFiles(MeetingId:any) {
    var url=`${environment.apiEndPoint}Files/GetAllMeetingFiles?MeetingId=${MeetingId}`;
    return this.http.get<any>(url);
  }
  GetAllDesignFiles(DesignId:any) {
    var url=`${environment.apiEndPoint}Files/GetAllDesignFiles?DesignId=${DesignId}`;
    return this.http.get<any>(url);
  }
  GetAllContractFiles(ContractId:any) {
    var url=`${environment.apiEndPoint}Files/GetAllContractFiles?ContractId=${ContractId}`;
    return this.http.get<any>(url);
  }
  GetAllEmployeeFiles(EmployeeId:any) {
    var url=`${environment.apiEndPoint}Files/GetAllEmployeeFiles?EmployeeId=${EmployeeId}`;
    return this.http.get<any>(url);
  }
  DeleteFiles(FileId:any) {
    return this.http.post<any>(this.apiEndPoint + 'Files/DeleteFiles?FileId='+FileId,{});
  }


}
