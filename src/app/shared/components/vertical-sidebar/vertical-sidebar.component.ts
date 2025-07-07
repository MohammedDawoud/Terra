import { Router } from '@angular/router';
import { HandelSideBarService } from './../../services/handel-side-bar.service';
import {
  Component,
  Input,
  OnInit,
  ViewChild,
  HostListener,
} from '@angular/core';
import { ToggleBtnAnimation } from '../../animations/toggleBtn.animation';
import { RestApiService } from '../../services/api.service';
import { MatSidenav } from '@angular/material/sidenav';
import {
  trigger,
  state,
  style,
  transition,
  animate,
  AUTO_STYLE,
} from '@angular/animations';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { Title } from '@angular/platform-browser';

const DEFAULT_DURATION = 300;

@Component({
  selector: 'app-vertical-sidebar',
  templateUrl: './vertical-sidebar.component.html',
  styleUrls: ['./vertical-sidebar.component.scss'],
  animations: [
    ToggleBtnAnimation,
    trigger('slide', [
      state('up', style({ height: 0, opacity: '0' })),
      state('down', style({ height: '*', opacity: '1' })),
      transition('up <=> down', animate(200)),
    ]),
    trigger('collapse', [
      state('false', style({ height: AUTO_STYLE, visibility: AUTO_STYLE })),
      state('true', style({ height: '0', visibility: 'hidden' })),
      transition('false => true', animate(DEFAULT_DURATION + 'ms ease-in')),
      transition('true => false', animate(DEFAULT_DURATION + 'ms ease-out')),
    ]),
  ],
})
export class VerticalSidebarComponent implements OnInit {
  @Input() scrolled: any;
  linkName: any;
  isOpen!: boolean;
  sideMenu: any = [
    {
      title: {
        ar: '',
        en: '',
      },
      mainMenu: [
        {
          title: {
            ar: '',
            en: '',
          },
          subMenu: [
            {
              title: {
                ar: '',
                en: '',
              },
              link: '',
            },
          ],
        },
      ],
    },
  ];

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

  lang: any = 'ar';

  isExpanded = true;
  showSubmenu: any;
  activeIndex: any;
  activeChildIndex: any;
  isShowing = false;
  showSubSubMenu: any;
  userG: any = {};
  constructor(
    private router: Router,
    private handelSidebarService: HandelSideBarService,
    private authenticationService: AuthenticationService,
    private api: RestApiService
  ) {
    this.userG = this.authenticationService.userGlobalObj;
    // get Url To Check Activated Link In Sidebar
    this.router.events.subscribe((event) => {
      this.linkName = this.router.url;
    });

    api.lang.subscribe((res) => {
      this.lang = res;
      this.setMenu();
    });

    this.setMenu();
  }

  ngOnInit(): void {
    this.checkSideBarState();
  }

  setSidebarState(): void {
    this.handelSidebarService.sideBarState.next(this.isOpen);
  }

  stopPropagation(event: any): void {
    event.stopPropagation();
  }

  checkSideBarState(): void {
    this.handelSidebarService.sideBarState.subscribe((res) => {
      if (res != null) {
        this.isOpen = res;
      } else {
        this.isOpen = true;
      }
    });
  }

  open(event: any) {
    this.isOpen = true;
    this.setSidebarState();
    this.stopPropagation(event);
  }

  closeSideBar(): void {
    this.isOpen = false;

    this.handelSidebarService.sideBarState.next(this.isOpen);
  }

  closeSideBarSmallDevices(): void {
    if (window.innerWidth < 1200) {
      this.isOpen = false;
      this.handelSidebarService.sideBarState.next(this.isOpen);
    }
  }

  menu: any;
  setMenu() {
    // { name: { ar: '', en: '' }, link: '', type: '', icon:'' },
    this.menu = [
      {
        name: { ar: 'الصفحة الرئيسية', en: 'Dashboard' },
        link: '/dash/home',
        type: 'single',
        icon: '/assets/sidebar-icons/noun_Home_-1.png',
        title:"",
        show: true,
        showP: true,
      },

      {
        name: { ar: 'العملاء', en: 'Customers' },
        link: null,
        type: 'multiple',
        icon: '/assets/sidebar-icons/user-multiple-1.png',
        title:"12",
        show: this.userG?.pagesList.includes(12),
        showP: this.userG?.userPrivileges.includes(12),
        children: [
          {
            name: { ar: 'الإضافة والبحث', en: 'Search and inquire' },
            link: '/customers/search',
            type: 'single',
            icon: '/assets/sidebar-icons/Search Icon-1.png',
            title:"1200",
            show: this.userG?.pagesList.includes(1200),
            showP: this.userG?.userPrivileges.includes(1200),
          },
        ],
      },
      
      {
        name: { ar: 'شؤون الموظفين', en: 'Employees Affairs' },
        link: null,
        type: 'multiple',
        icon: '/assets/sidebar-icons/users-line.png',
        title:"13",
        show: this.userG?.pagesList.includes(13),
        showP: this.userG?.userPrivileges.includes(13),
        children: [
          {
            name: { ar: 'الإضافة والبحث', en: 'Search and inquire' },
            link: '/employees/search',
            type: 'single',
            icon: '/assets/sidebar-icons/Search Icon-1.png',
            title:"1300",
            show: this.userG?.pagesList.includes(1300),
            showP: this.userG?.userPrivileges.includes(1300),
          },
        ],
      },
            
      {
        name: { ar: 'إدارة المشاريع', en: 'Projects' },
        link: null,
        type: 'multiple',
        icon: '/assets/sidebar-icons/settings-services.png',
        title:"14",
        show: this.userG?.pagesList.includes(14),
        showP: this.userG?.userPrivileges.includes(14),
        children: [
          {
            name: { ar: 'المعاينات', en: 'Previews' },
            link: '/projects/preview',
            type: 'single',
            icon: '/assets/sidebar-icons/movement.png',
            title:"1400",
            show: this.userG?.pagesList.includes(1400),
            showP: this.userG?.userPrivileges.includes(1400),
          },
          {
            name: { ar: 'الإجتماعات', en: 'Meetings' },
            link: '/projects/meeting',
            type: 'single',
            icon: '/assets/sidebar-icons/Group 40644.png',
            title:"1401",
            show: this.userG?.pagesList.includes(1401),
            showP: this.userG?.userPrivileges.includes(1401),
          },
          {
            name: { ar: 'التصميمات', en: 'Designs' },
            link: '/projects/design',
            type: 'single',
            icon: '/assets/sidebar-icons/Group 40644.png',
            title:"1402",
            show: this.userG?.pagesList.includes(1402),
            showP: this.userG?.userPrivileges.includes(1402),
          },
        ],
      },
      {
        name: { ar: 'الحسابات', en: 'Accounts' },
        link: null,
        type: 'multiple',
        icon: '/assets/sidebar-icons/accounting.png',
        title:"15",
        show: this.userG?.pagesList.includes(15),
        showP: this.userG?.userPrivileges.includes(15),
        children: [
          {
            name: { ar: 'الأصناف', en: 'Category' },
            link: '/accounts/Categories',
            type: 'single',
            icon: '/assets/sidebar-icons/md-paper.png',
            title:"1500",
            show: this.userG?.pagesList.includes(1500),
            showP: this.userG?.userPrivileges.includes(1500),
          },
           {
           name: { ar: 'طلب تسعير', en: 'Offers' },
            link: '/accounts/offers',
            type: 'single',
            icon: '/assets/sidebar-icons/user-multiple.png',
            title:"1501",
            show: this.userG?.pagesList.includes(1501),
            showP: this.userG?.userPrivileges.includes(1501),
          },
          {
            name: { ar: 'عقود العملاء', en: 'Contracts' },
            link: '/accounts/contracts',
            type: 'single',
            icon: '/assets/sidebar-icons/user-multiple.png',
            title:"1502",
            show: this.userG?.pagesList.includes(1502),
            showP: this.userG?.userPrivileges.includes(1502),
          },
          {
            name: { ar: 'استلام نقدية', en: 'Cash receipt' },
            link: '/accounts/revoucher',
            type: 'single',
            icon: '/assets/sidebar-icons/md-paper.png',
            title:"1503",
            show: this.userG?.pagesList.includes(1503),
            showP: this.userG?.userPrivileges.includes(1503),
          },
          {
            name: { ar: 'صرف نقدية', en: 'Cash receipt' },
            link: '/accounts/payvoucher',
            type: 'single',
            icon: '/assets/sidebar-icons/md-paper.png',
            title:"1505",
            show: this.userG?.pagesList.includes(1505),
            showP: this.userG?.userPrivileges.includes(1505),
          },
          {
            name: { ar: 'قيد افتتاحي', en: 'Opening Voucher' },
            link: '/accounts/openvoucher',
            type: 'single',
            icon: '/assets/sidebar-icons/md-paper.png',
            title:"1506",
            show: this.userG?.pagesList.includes(1506),
            showP: this.userG?.userPrivileges.includes(1506),
          },
          {
            name: { ar: 'تقارير  الحسابات', en: 'Project Reports' },
            link: null,
            type: 'multiple',
            icon: '/assets/sidebar-icons/report-data-4.png',
            title:"1504",
            show: this.userG?.pagesList.includes(1504),
            showP: this.userG?.userPrivileges.includes(1504),
            children: [
              {
                name: { ar: 'كشف حساب', en: 'Account Statement' },
                link: '/accounts/Account_Statement',
                type: 'single',
                title:"150401",
                icon:'/assets/sidebar-icons/Group 40278.png',
                show: this.userG?.pagesList.includes(150401),
                showP: this.userG?.userPrivileges.includes(150401),
              },
            ],
          },
        ],
      },
      {
        name: { ar: 'لوحة التحكم', en: 'Control Panel' },
        link: null,
        type: 'multiple',
        icon: '/assets/sidebar-icons/bxs-dashboard.png',
        title:"16",
        show: this.userG?.pagesList.includes(16),
        showP: this.userG?.userPrivileges.includes(16),
        children: [
          {
            name: { ar: 'اعدادات النظام', en: 'system settings' },
            link: null,
            type: 'multiple',
            icon: '/assets/sidebar-icons/settings-solid.png',
            title:"1600",
            show: this.userG?.pagesList.includes(1600),
            showP: this.userG?.userPrivileges.includes(1600),
            children: [
              {
                name: { ar: 'تجهيز بيانات المنشأة', en: 'Building Data' },
                link: '/controlpanel/organization',
                type: 'single',
                icon:'/assets/sidebar-icons/Group 40278.png',
                title:"160001",
                show: this.userG?.pagesList.includes(160001),
                showP: this.userG?.userPrivileges.includes(160001),
              },  
              {
                name: { ar: 'دليل الحسابات', en: 'Accounts guide' },
                link: '/accounts/Accounts_guide',
                type: 'single',
                icon:'/assets/sidebar-icons/Group 40278.png',
                title:"160002",
                show: this.userG?.pagesList.includes(160002),
                showP: this.userG?.userPrivileges.includes(160002),
              },       
        ],
      },
      {
        name: { ar: 'صلاحيات النظام', en: 'System Permissions' },
        link: null,
        type: 'multiple',
        icon: '/assets/sidebar-icons/security.png',
        title:"1601",
        show: this.userG?.pagesList.includes(1601) ,
        showP: this.userG?.userPrivileges.includes(1601),
        children: [
          {
            name: { ar: 'المستخدمين', en: 'Users' },
            link: '/controlpanel/users',
            type: 'single',
            title:"160101",
            icon:'/assets/sidebar-icons/Group 40278.png',
            show: this.userG?.pagesList.includes(160101),
            showP: this.userG?.userPrivileges.includes(160101),
          },
        ],
      },
        ],
      },
    ];
    //this.menu=this.menu.filter((a: { show: boolean; })=>a.show==true);
  }
}
