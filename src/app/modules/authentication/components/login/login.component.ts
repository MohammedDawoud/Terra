import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { first } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RestApiService } from 'src/app/shared/services/api.service';
import { SharedService } from 'src/app/core/services/shared.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  text = false;
  qrCodeCheckValue: string;
  logoUrl: any;
  checked = false;
  lang: any = 'ar';
  constructor(
    private toast: ToastrService,
    private router: Router,
    private translate: TranslateService,
    private authenticationService: AuthenticationService,
    private api: RestApiService,
    private sharedservice: SharedService
  ) {
    this.qrCodeCheckValue = Math.floor(1000 + Math.random() * 9000).toString();
    const userG = this.authenticationService.userGlobalObj;
    const userG_Rem = this.authenticationService.userGlobalObj_Rem;

    // if (userG?.token) {
    //   this.router.navigateByUrl('dash');
    // }
    if (userG?.token) {
      this.authenticationService.logout().subscribe((data) => {});
    }
    var Remem = localStorage.getItem('Rem') || 'false';
    if (Remem == 'true') {
      if (userG_Rem?.token) {
        this.datalogin.remember = true;
        this.datalogin.username = userG_Rem?.userName;
        this.datalogin.password = userG_Rem?.password;
        //this.SetValuesRem(userG_Rem?.userName,userG_Rem?.password,)
      }
    } else {
      this.datalogin.remember = false;
    }
    api.lang.subscribe((res) => {
      this.lang = res;
    });
  }
  environmentPho: any=null;
  environmentName: any=null;

  ngOnInit(): void {
    this.environmentPho = null;
    this.environmentName = null;
    debugger
    if (!(localStorage.getItem('environmentName') === null)) {
      this.environmentName=localStorage.getItem('environmentName');
      localStorage.removeItem('environmentName');
    }
    if (!(localStorage.getItem('environmentPho') === null)) {
      this.environmentPho=localStorage.getItem('environmentPho');
      localStorage.removeItem('environmentPho');
    }

    this.authenticationService.allowWithoutToken = 'allowWithoutToken';
    this.api.GetOrganizationDataLogin().subscribe({
      next: (res: any) => {
        debugger
        this.authenticationService.allowWithoutToken = '';
        if(this.lang == 'ar'){ this.environmentName=res.result.nameAr;}
        else{ this.environmentName=res.result.nameEn;}
        localStorage.setItem('environmentName', this.environmentName);
        this.environmentPho = environment.PhotoURL + res.result.logoUrl;
        localStorage.setItem('environmentPho', this.environmentPho);
      },
      error: (error) => {
        this.authenticationService.allowWithoutToken = '';
      },
    });
   // this.getqrcode();
  }

  datalogin: any = {
    username: null,
    password: null,
    remember: false,
  };
  login(data: any) {
    this.authenticationService
      .login(
        data?.user_name,
        data?.password,
        '1',
        data?.remember_me ?? false,
        '0',
        'Login'
      )
      .pipe(first())
      .subscribe({
        next: () => {
          this.sharedservice.setAction('clickButton2');
          this.router.navigateByUrl('dash');
        },
        error: (error) => {},
      });
  }
  keyPress(event: any) {
    var ew = event.which;
    if (ew == 32) return true;
    if (ew == 46) return true;
    if (ew == 64) return true;
    if (48 <= ew && ew <= 57) return true;
    if (65 <= ew && ew <= 90) return true;
    if (97 <= ew && ew <= 122) return true;
    return false;
  }
  refreshQrCode() {
    this.qrCodeCheckValue = Math.floor(1000 + Math.random() * 9000).toString();
  }
  Qrcode: any;
  getqrcode() {
    this.api.GenerateCompanyQR().subscribe({
      next: (res: any) => {
        this.Qrcode =environment.PhotoURL+ res.result;
      }
    });
  }
  
}
