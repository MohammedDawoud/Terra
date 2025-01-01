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
    formData.append('TypePageId', String(_file.typePageId));
    formData.append('PreviewId',String(_file.previewId));
    formData.append('Notes',String(_file.notes));

    const req = new HttpRequest('POST', `${this.apiEndPoint}Files/UploadFiles`, formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);
  }


}
