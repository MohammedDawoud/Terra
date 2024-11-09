import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { ToggleBtnAnimation } from '../../animations/toggleBtn.animation';
import { HandelSideBarService } from '../../services/handel-side-bar.service';
import { UserService } from '../../services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RestApiService } from '../../services/api.service';
import Typed from 'typed.js';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { AdminProfileService } from 'src/app/core/services/admin_profile_Services/admin-profile.service';
import { HeaderService } from 'src/app/core/services/sys_Services/header.service';
import { SharedService } from 'src/app/core/services/shared.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [ToggleBtnAnimation],
})
export class HeaderComponent implements OnInit {
  options = {
    strings: [
      'سبحان الله وبحمده.',
      'عدد خلقه.',
      'ورضا نفسه',
      'وزنة عرشه',
      'ومداد كلماته',
    ],
    typeSpeed: 100,
    backSpeed: 50,
    showCursor: true,
    cursorChar: '|',
    loop: true,
  };

  typed: any;

  open!: boolean;

  isChecked: any;

  user: any;

  date: any = new Date();
  time: any = new Date();

  selectedCar!: number;

  selectedYear = '31-12-2022 / 01-01-2022';

  cars = [
    { id: 1, name: 'Volvo' },
    { id: 2, name: 'Saab' },
    { id: 3, name: 'Opel' },
    { id: 4, name: 'Audi' },
  ];

  branches = [
    { id: 1, name: { ar: 'فرع مكة المكرمة', en: 'Makkah Branch' } },
    {
      id: 2,
      name: {
        ar: 'المركز الرئيسي - الدمام',
        en: 'The main center - Dammam',
      },
    },
    { id: 3, name: { ar: 'فرع الرياض', en: 'Riyadh Branch' } },
    { id: 4, name: { ar: 'إسطنبول', en: 'Istanbul' } },
  ];
  selectedBranch: any = this.branches[0];

  years: any = [
    '31-12-2022 / 01-01-2022',
    '31-12-2023 / 01-01-2023',
    '31-12-2024 / 01-01-2024',
    '31-12-2025 / 01-01-2025',
  ];
  closeResult: any;

  notifications: any = [
    { title: 'ada awd awdawd awdawd', createdAt: new Date() },
    { title: 'ada awd awdawd awdawd', createdAt: new Date() },
    { title: 'ada awd awdawd awdawd', createdAt: new Date() },
    { title: 'ada awd awdawd awdawd', createdAt: new Date() },
    { title: 'ada awd awdawd awdawd', createdAt: new Date() },
    { title: 'ada awd awdawd awdawd', createdAt: new Date() },
    { title: 'ada awd awdawd awdawd', createdAt: new Date() },
    { title: 'ada awd awdawd awdawd', createdAt: new Date() },
  ];
  userG: any = {};
  constructor(
    private router: Router,
    private handelSidebarService: HandelSideBarService,
    private toast: ToastrService,
    private userService: UserService,
    private _headerService: HeaderService,
    public translate: TranslateService,
    private spinner: NgxSpinnerService,
    private api: RestApiService,
    private adminProfileService: AdminProfileService,
    private authenticationService: AuthenticationService,
    private sharedService: SharedService,
    private modalService: NgbModal
  ) {
    this.getSidebarState();
    this.checkWindowWidth();
    this.WatchWindowResize();
    this.getWindowWidthInRouting();
    if (localStorage.getItem('lang')) {
      localStorage.getItem('lang') == 'en'
        ? (this.isChecked = false)
        : (this.isChecked = true);
    } else {
      this.isChecked = true;
    }

    this.userG = this.authenticationService.userGlobalObj;
  }
  logoUrl: any = null;
  lastLoginDate: any;
  OrganizationData: any;
  ngOnInit(): void {
    this.sharedService.calling$.subscribe(() => {
      this.GetUnReadUserNotificationcount();
    });

    this.userService.user.subscribe((res) => {
      this.user = res;
    });
    this.setLanguageOnInit();

    this.userG = this.authenticationService.userGlobalObj;
    this.adminProfileService
      .getUserById(this.userG.userId)
      .subscribe((data) => {
        this.logoUrl = data.result.imgUrl;
        this.lastLoginDate = data.result.lastLoginDate;
      });
    this.api.GetOrganizationDataLogin().subscribe({
      next: (res: any) => {
        this.OrganizationData = res.result;
      },
      error: (error) => {},
    });

    this.GetAllBranchesByUserIdDrop();
    this.GetAllYearsDrop();
    this.GetAllOpenSupportResquestsWithReplay();
    this.GetUnReadUserNotificationcount();
  }

  headerObj: any = {
    BranchesDropDown: [],
    YearsDropDown: [],
    selectedYear: null,
    selectedBranch: null,
  };

  GetAllBranchesByUserIdDrop() {
    this._headerService.GetAllBranchesByUserIdDrop().subscribe((data) => {
      this.headerObj.BranchesDropDown = data.result;
      this.headerObj.selectedBranch = data.result.filter(
        (s: { branchId: any }) =>
          s.branchId == this.sharedService.getStoBranch()
      )[0].branchName;
    });
  }
  GetAllYearsDrop() {
    this._headerService.GetAllYearsDrop().subscribe((data) => {
      this.headerObj.YearsDropDown = data.result;
      var resobj = data.result.filter(
        (s: { id: any }) => s.id == this.sharedService.getStofiscalId()
      );
      if (resobj.length > 0) {
        var Obj = data.result.filter(
          (s: { id: any }) => s.id == this.sharedService.getStofiscalId()
        )[0];
        this.headerObj.selectedYear = Obj.name;
        this.sharedService.setStoYear(Obj.yearId);
        this.sharedService.setStofiscalId(Obj.id);
      } else {
        var Obj = this.headerObj.YearsDropDown[0];
        this.headerObj.selectedYear = Obj.name;
        this.sharedService.setStoYear(Obj.yearId);
        this.sharedService.setStofiscalId(Obj.id);
      }
    });
  }

  ChangeBranch(branchid: any) {
    this.sharedService.setStoBranch(branchid);
    location.reload();
  }
  ChangeYear(year: any) {
    this.sharedService.setStoYear(year.yearId);
    this.sharedService.setStofiscalId(year.id);
    location.reload();
  }

  // ngAfterViewInit(): void {
  //   this.activeTyped();
  // }

  // activeTyped() {
  //   new Typed('.typed-element', this.options);
  // }

  lang: any;
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

  checkWindowWidth(): void {
    if (window.innerWidth >= 992) {
      // this.open = true;
      this.handelSidebarService.sideBarState.next(this.open);
    } else {
      this.open = false;
      this.handelSidebarService.sideBarState.next(this.open);
    }
  }

  WatchWindowResize(): void {
    window.onresize = () => {
      if (window.innerWidth >= 992) {
        // this.open = true;
        this.handelSidebarService.sideBarState.next(this.open);
      } else {
        this.open = false;
        this.handelSidebarService.sideBarState.next(this.open);
      }
    };
  }

  getWindowWidthInRouting(): void {
    this.router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        this.getSidebarState();
        // this.activeTyped();

        if (window.innerWidth >= 992) {
          // this.open = true;
          this.handelSidebarService.sideBarState.next(this.open);
        } else {
          // this.open = false;
          this.handelSidebarService.sideBarState.next(this.open);
        }
      }
    });
  }

  stopPropagation(event: any): void {
    event.stopPropagation();
  }

  setSidebarState(): void {
    this.handelSidebarService.sideBarState.next(this.open);
  }

  getSidebarState(): void {
    this.handelSidebarService.sideBarState.subscribe((res) => {
      if (res != null) {
        this.open = res;
      } else {
        this.open = true;
      }
    });
  }

  logout(): void {
    this.authenticationService.logout().subscribe((data) => {});
  }

  public flags = [
    { name: 'العربية', image: 'assets/images/flags/sa.svg', lang: 'ar' },
    { name: 'English', image: 'assets/images/flags/gb.svg', lang: 'en' },
  ];

  public flag: any = this.flags[0];

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

  openModal(content: any, type?: any, size?: any, position?: any) {
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        size: size ? size : 'md',
        centered: !position ? true : false,
      })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any, type?: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  Supportrequests: any;
  Supportrequestscount: any;
  GetAllOpenSupportResquestsWithReplay() {
    this._headerService
      .GetAllOpenSupportResquestsWithReplay()
      .subscribe((data) => {
        this.Supportrequests = data;
        this.Supportrequestscount = data.length;
      });
  }
  RadReplay(servicereplayid: any) {
    this._headerService.ReadReplay(servicereplayid).subscribe((data) => {});
  }
  ///////////////////////////Notifications ///////////////////////////////
  UserNotifications: any;
  UserNotificationscount: any;
  GetUnReadUserNotification() {
    this._headerService.GetUnReadUserNotification().subscribe((data) => {
      console.log(data);

      this.UserNotifications = data.result;
      this.UserNotificationscount = data.result.length;
    });
  }
  GetUnReadUserNotificationcount() {
    this._headerService.GetUnReadUserNotificationcount().subscribe((data) => {
      console.log(data);

      this.UserNotificationscount = data.result;
    });
  }

  redirect() {
    this.sharedService.setAction('clickButton');
    this.router.navigate(['/dash']);
  }
}
