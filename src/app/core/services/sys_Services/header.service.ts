import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  private apiEndPoint: string = '';
  constructor(private http: HttpClient) {
    this.apiEndPoint = environment.apiEndPoint;
  }
  GetAllBranchesByUserIdDrop() {
    return this.http.get<any>(
      this.apiEndPoint + 'Branches/GetAllBranchesByUserIdDrop'
    );
  }
  GetAllYearsDrop() {
    return this.http.get<any>(this.apiEndPoint + 'Account/GetAllYearsDrop');
  }

  GetAllOpenSupportResquestsWithReplay() {
    return this.http.get<any>(
      this.apiEndPoint +
        'SupportResquests/GetAllOpenSupportResquestsreplayesDashboard'
    );
  }
  GetUnReadUserNotification() {
    return this.http.get<any>(
      this.apiEndPoint + 'Notification/GetUnReadUserNotification'
    );
  }
  GetUnReadUserNotificationcount() {
    return this.http.get<any>(
      this.apiEndPoint + 'Notification/GetUnReadUserNotificationcount'
    );
  }
  ReadReplay(SupportReplayId: any) {
    return this.http.post<any>(
      this.apiEndPoint +
        'SupportResquests/ReadReplay?SupportReplayId=' +
        SupportReplayId +
        '',
      null
    );
  }
}
