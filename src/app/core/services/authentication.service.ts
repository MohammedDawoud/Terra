import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import { environment } from 'src/environments/environment';
import { SharedService } from 'src/app/core/services/shared.service';

//import { User } from 'src/app/_models';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  allowWithoutToken: any;
  Public_Key = '01234567890123456789012345678901';
  private userSubject: BehaviorSubject<any>;
  private userPub: any;
  public user: Observable<any>;
  private userSubject_Rem: BehaviorSubject<any>;
  private userPub_Rem: any;
  public user_Rem: Observable<any>;
  constructor(
    private toast: ToastrService,
    private router: Router,
    private http: HttpClient,
    private sharedService: SharedService
  ) {
    var userenc = localStorage.getItem('user') || '{}';
    var user_dec;
    try {
      user_dec = this.sharedService.decrypt(this.Public_Key, userenc);
    } catch (error) {
      user_dec = {};
      this.logout().subscribe((data) => {});
    }

    this.userPub = user_dec;
    this.userSubject = new BehaviorSubject<any>(user_dec || '{}');
    this.user = this.userSubject.asObservable();
    var userenc_Rem = localStorage.getItem('userRem') || '{}';
    var user_dec_Rem;
    try {
      user_dec_Rem = this.sharedService.decrypt(this.Public_Key, userenc_Rem);
    } catch (error) {
      user_dec_Rem = {};
    }

    this.userPub_Rem = user_dec_Rem;
    this.userSubject_Rem = new BehaviorSubject<any>(user_dec_Rem || '{}');
    this.user_Rem = this.userSubject_Rem.asObservable();
  }

  public get userValue(): any {
    return this.userSubject.value;
  }
  public get userValue_Rem(): any {
    return this.userSubject_Rem.value;
  }
  public get userGlobalObj(): any {
    const user = this.userValue;
    if (this.sharedService.isJsonString(user)) {
      const parsed = JSON.parse(user);
      if (parsed) {
        return parsed;
      } else {
        return null;
      }
    } else {
      const parsed = JSON.parse(JSON.stringify(user));
      if (parsed) {
        return parsed;
      } else {
        return null;
      }
    }
  }
  public get userGlobalObj_Rem(): any {
    var userenc_Rem = localStorage.getItem('userRem') || '{}';
    var user_dec_Rem;
    try {
      user_dec_Rem = this.sharedService.decrypt(this.Public_Key, userenc_Rem);
    } catch (error) {
      user_dec_Rem = {};
    }

    this.userPub_Rem = user_dec_Rem;
    this.userSubject_Rem = new BehaviorSubject<any>(user_dec_Rem || '{}');
    this.user_Rem = this.userSubject_Rem.asObservable();

    const user_Rem = this.userValue_Rem;
    if (this.sharedService.isJsonString(user_Rem)) {
      const parsed = JSON.parse(user_Rem);
      if (parsed) {
        return parsed;
      } else {
        return null;
      }
    } else {
      const parsed = JSON.parse(JSON.stringify(user_Rem));
      if (parsed) {
        return parsed;
      } else {
        return null;
      }
    }
  }

  login(
    Username: string,
    Password: string,
    ActivationCode: string,
    Remember: boolean,
    Branch: string,
    ReturnUrl: string
  ) {
    var url = `${environment.apiEndPoint}Login/Login?username=${Username}&password=${Password}&activationCode=${ActivationCode}&remember=${Remember}&branch=${Branch}&returnUrl=${ReturnUrl}`;
    return this.http.get<any>(url).pipe(
      map((user) => {
        this.sharedService.setStoBranch(user.branchId);
        this.sharedService.setStoYear(user.yearId_G);
        this.sharedService.setStofiscalId(user.fiscalId_G);

        var user_enc = this.sharedService
          .encrypt(this.Public_Key, user)
          .toString();
        localStorage.setItem('user', user_enc);
        localStorage.removeItem('userRem');
        debugger;
        if (!(localStorage.getItem('IsLoadedBefore') === null)) {
          localStorage.removeItem('IsLoadedBefore');
        }
        localStorage.setItem('IsLoadedBefore', 'false');

        if (!(localStorage.getItem('IsLoadedBefore1') === null)) {
          localStorage.removeItem('IsLoadedBefore1');
        }
        localStorage.setItem('IsLoadedBefore1', 'false');

        if (Remember) {
          localStorage.setItem('userRem', user_enc);
          localStorage.setItem('Rem', Remember.toString());
        } else {
          localStorage.setItem('Rem', Remember.toString());
        }
        this.userSubject.next(user);
        return user;
      }),
      catchError((err, caught) => {
        debugger;
        console.log('err' + err);
        console.log('caught' + caught);
        this.toast.error(err, 'رسالة');
        return '';
      })
    );
  }

  logout() {
    var userid = 0;
    if (this.userGlobalObj != null) {
      userid = this.userGlobalObj.userId;
    } else {
      userid = 0;
    }
    var url = `${environment.apiEndPoint}Login/LogOut?userid=${userid}`;
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['auth']);
    return this.http.get<any>(url);
  }
}
