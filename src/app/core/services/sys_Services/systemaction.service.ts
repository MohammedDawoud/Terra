import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SystemactionService {
  private apiEndPoint: string = '';
  constructor(private http: HttpClient) {
    this.apiEndPoint = environment.apiEndPoint;
  }

  GetSystemActionsAll() {
    return this.http.get<any>(
      this.apiEndPoint + 'SystemSettings/GetSystemActionsAll'
    );
  }
  FillAllUsersSelectAll() {
    return this.http.get<any>(
      this.apiEndPoint + 'ControllingTask/FillAllUsersSelectAll?param=0'
    );
  }
  GetSystemActions(
    Searchtxt: any,
    DateFrom: any,
    DateTo: any,
    BranchId: any,
    UserId: any,
    ActionType: any
  ) {
    return this.http.get<any>(
      this.apiEndPoint +
        'SystemSettings/GetSystemActions?Searchtxt=' +
        Searchtxt +
        '&&DateFrom=' +
        DateFrom +
        '&&DateTo=' +
        DateTo +
        '&&UserId=' +
        UserId +
        '&&ActionType=' +
        ActionType +
        ''
    );
  }
}
