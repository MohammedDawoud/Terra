import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DatabaseBackup } from '../../Classes/DomainObjects/databaseBackup';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BackupService {
  private apiEndPoint: string = '';
  constructor(private http: HttpClient) {
    this.apiEndPoint = environment.apiEndPoint;
  }

  GetAllBackupData() {
    return this.http.get<any>(
      this.apiEndPoint + 'BackupRestoreDb/GetAllBackupData'
    );
  }

  GetAllStatistics() {
    return this.http.get<any>(
      this.apiEndPoint + 'BackupRestoreDb/GetAllStatistics'
    );
  }

  SaveDBackup_ActiveYear(backup: DatabaseBackup): Observable<any> {
    debugger;
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(backup);
    return this.http.post(
      this.apiEndPoint + 'BackupRestoreDb/SaveDBackup_ActiveYear',
      body,
      { headers: headers }
    );
  }

  SaveBackup(backup: DatabaseBackup): Observable<any> {
    debugger;
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(backup);
    return this.http.post(
      this.apiEndPoint + 'BackupRestoreDb/SaveBackup',
      body,
      { headers: headers }
    );
  }

  GetBackupById(BackupId: any) {
    return this.http.get<any>(
      this.apiEndPoint +
        'BackupRestoreDb/GetDBackupByIDWithDetails?BackupId=' +
        BackupId +
        ''
    );
  }

  DownloadBackupFile(BackupId: any) {
    return this.http.post<any>(
      this.apiEndPoint +
        'BackupRestoreDb/DownloadBackupFile?BackupId=' +
        BackupId +
        '',
      null
    );
  }

  DeleteBackup(BackupId: any) {
    return this.http.post<any>(
      this.apiEndPoint +
        'BackupRestoreDb/DeleteBackup?BackupId=' +
        BackupId +
        '',
      null
    );
  }
  FillAllUsersTodropdown() {
    return this.http.get<any>(
      this.apiEndPoint + 'Users/FillAllUsersTodropdown'
    );
  }

  GetUserById(UserId: any) {
    return this.http.get<any>(
      this.apiEndPoint + 'Users/GetUserById?UserId=' + UserId + ''
    );
  }
  GetAllBackupAlert() {
    return this.http.get<any>(
      this.apiEndPoint + 'BackupAlert/GetAllBackupAlert'
    );
  }

  SaveBackupalert(backup: any): Observable<any> {
    debugger;
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(backup);
    return this.http.post(
      this.apiEndPoint + 'BackupAlert/SaveBackupalert',
      body,
      { headers: headers }
    );
  }
  DeleteBackupalert(AlertId: any) {
    return this.http.post<any>(
      this.apiEndPoint +
        'BackupAlert/DeleteBackupalert?AlertId=' +
        AlertId +
        '',
      null
    );
  }
}
