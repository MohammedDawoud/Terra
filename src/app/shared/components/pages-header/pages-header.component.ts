import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { RestApiService } from '../../services/api.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-pages-header',
  templateUrl: './pages-header.component.html',
  styleUrls: ['./pages-header.component.scss'],
})
export class PagesHeaderComponent implements OnInit {
  isOpen: boolean;
  isChecked: any;
  lang: any;

  public flags = [
    { name: 'عربي', image: 'assets/images/flags/sa.svg', lang: 'ar' },
    { name: 'English', image: 'assets/images/flags/gb.svg', lang: 'en' },
  ];

  public flag: any = this.flags[0];

  constructor(
    public translate: TranslateService,
    private spinner: NgxSpinnerService,
    private authenticationService: AuthenticationService,
    private api: RestApiService
  ) {
    if (localStorage.getItem('lang')) {
      localStorage.getItem('lang') == 'en'
        ? (this.isChecked = false)
        : (this.isChecked = true);
    } else {
      this.isChecked = true;
    }
    this.isOpen = false;
  }
  orgphone: any
  orgmail: any
  orgname: any
  ngOnInit(): void {
    this.setLanguageOnInit();
    let navbar = document.querySelector('.navbar');
    if (window.innerWidth > 991) {
      this.isOpen = false;
      navbar?.classList.remove('small-devices');
    } else {
      navbar?.classList.add('small-devices');
    }
    this.authenticationService.allowWithoutToken = "allowWithoutToken"
    this.api.GetOrganizationDataLogin().subscribe(
      {
        next: (res: any) => {
          this.authenticationService.allowWithoutToken = ""
          this.orgphone = res.result.mobile;
          this.orgmail = res.result.email;
          this.orgname = res.result.orgName;
        },
        error: (error) => {
          this.authenticationService.allowWithoutToken = ""
        },
      })

    this.getqrcode();
  }

  setLanguageOnInit() {
    if (localStorage.getItem('lang') == 'ar') {
      this.translate.use('ar');
      localStorage.setItem('lang', 'ar');
      document.documentElement.setAttribute('data-lang', 'ar');
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
      this.lang = 'ar';
      document
        .querySelector('.ar-stylesheet')
        ?.setAttribute('href', '/assets/css/ar-style.css');
      this.flag = this.flags[0];

      this.api.lang.next(this.lang);
    } else {
      this.translate.use('en');
      localStorage.setItem('lang', 'en');
      document.documentElement.setAttribute('data-lang', 'en');
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = 'en';
      this.lang = 'en';
      document.querySelector('.ar-stylesheet')?.setAttribute('href', ' ');

      this.flag = this.flags[1];
      this.api.lang.next(this.lang);
    }
  }

  public changeLang(flag: any, lang: any) {
    if (lang == 'en') {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = 'en';
      document.documentElement.setAttribute('data-lang', 'en');
      // this.spinner.show();
      document.querySelector('.ar-stylesheet')?.setAttribute('href', '');
    } else {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
      document.documentElement.setAttribute('data-lang', 'ar');
      document
        .querySelector('.ar-stylesheet')
        ?.setAttribute('href', '/assets/css/ar-style.css');
    }

    this.lang = lang;
    this.flag = flag;
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
    this.api.lang.next(lang);
  }

  onResize($event: any) {
    $event.target.innerWidth > 992 ? (this.isOpen = false) : '';
    let navbar = document.querySelector('.navbar');
    if (window.innerWidth > 991) {
      this.isOpen = false;
      navbar?.classList.remove('small-devices');
    } else {
      navbar?.classList.add('small-devices');
    }
  }
  closeSideBar() {
    setTimeout(() => {
      this.isOpen = false;
    }, 500);
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
