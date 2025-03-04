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
      },

      {
        name: { ar: 'العملاء', en: 'Customers' },
        link: null,
        type: 'multiple',
        icon: '/assets/sidebar-icons/user-multiple-1.png',
        title:"134851",
        //show: true,
        show: this.userG?.pagesList.includes(134851),
        children: [
          {
            name: { ar: 'الإضافة والبحث', en: 'Search and inquire' },
            link: '/customers/search',
            type: 'single',
            icon: '/assets/sidebar-icons/Search Icon-1.png',
            title:"1368619",
            //show: true,
            show: this.userG?.pagesList.includes(1368619),
          },
        ],
      },
      
      {
        name: { ar: 'شؤون الموظفين', en: 'Employees Affairs' },
        link: null,
        type: 'multiple',
        icon: '/assets/sidebar-icons/users-line.png',
        title:"231921",
        show: this.userG?.pagesList.includes(231921),
        children: [
          {
            name: { ar: 'الإضافة والبحث', en: 'Search and inquire' },
            link: '/employees/search',
            type: 'single',
            icon: '/assets/sidebar-icons/Search Icon-1.png',
            title:"2111613",
            show: this.userG?.pagesList.includes(2111613),
            // show: this.userG?.userPrivileges.includes(1210),
          },
        ],
      },
            
      {
        name: { ar: 'إدارة المشاريع', en: 'Projects' },
        link: null,
        type: 'multiple',
        icon: '/assets/sidebar-icons/settings-services.png',
        title:"331823",
        show: this.userG?.pagesList.includes(331823),
        // show: this.userG?.userPrivileges.includes(12),
        children: [
          {
            name: { ar: 'المعاينات', en: 'Previews' },
            link: '/projects/preview',
            type: 'single',
            icon: '/assets/sidebar-icons/movement.png',
            title:"3122911",
            show: this.userG?.pagesList.includes(3122911),
            // show: this.userG?.userPrivileges.includes(1210),
          },
          {
            name: { ar: 'الإجتماعات', en: 'Meetings' },
            link: '/projects/meeting',
            type: 'single',
            icon: '/assets/sidebar-icons/Group 40644.png',
            title:"3213321",
            show: this.userG?.pagesList.includes(3213321),
            // show: this.userG?.userPrivileges.includes(1210),
          },
          {
            name: { ar: 'التصميمات', en: 'Designs' },
            link: '/projects/design',
            type: 'single',
            icon: '/assets/sidebar-icons/Group 40644.png',
            title:"3222111",
            show: this.userG?.pagesList.includes(3222111),
            // show: this.userG?.userPrivileges.includes(1210),
          },
        ],
      },
      {
        name: { ar: 'الحسابات', en: 'Accounts' },
        link: null,
        type: 'multiple',
        icon: '/assets/sidebar-icons/accounting.png',
        title:"552723",
        show: this.userG?.pagesList.includes(552723),
        // show: this.userG?.userPrivileges.includes(12),
        children: [
          {
            name: { ar: 'الأصناف', en: 'Category' },
            link: '/accounts/Categories',
            type: 'single',
            icon: '/assets/sidebar-icons/md-paper.png',
            title:"5611341",
            show: this.userG?.pagesList.includes(5611341),
            // show: this.userG?.userPrivileges.includes(1210),
          },
          {
            name: { ar: 'عقود العملاء', en: 'Contracts' },
            link: '/accounts/contracts',
            type: 'single',
            icon: '/assets/sidebar-icons/user-multiple.png',
            title:"5622321",
            show: this.userG?.pagesList.includes(5622321),
          },
          {
            name: { ar: 'استلام نقدية', en: 'Cash receipt' },
            link: '/accounts/revoucher',
            type: 'single',
            icon: '/assets/sidebar-icons/md-paper.png',
            title:"5711221",
            show: this.userG?.pagesList.includes(5711221),
          },
        ],
      },
      {
        name: { ar: 'لوحة التحكم', en: 'Control Panel' },
        link: null,
        type: 'multiple',
        icon: '/assets/sidebar-icons/bxs-dashboard.png',
        title:"411133",
        show: this.userG?.pagesList.includes(411133),

        // show: this.userG?.userPrivileges.includes(17),
        children: [
          {
            name: { ar: 'اعدادات النظام', en: 'system settings' },
            link: null,
            type: 'multiple',
            icon: '/assets/sidebar-icons/settings-solid.png',
            title:"4112737",
            show: this.userG?.pagesList.includes(4112737),
            // show: this.userG?.userPrivileges.includes(1701),

            children: [
              {
                name: { ar: 'تجهيز بيانات المنشأة', en: 'Building Data' },
                link: '/controlpanel/organization',
                type: 'single',
                icon:
                  this.lang == 'ar'
                    ? '/assets/sidebar-icons/Group 40278.png'
                    : '/assets/sidebar-icons/Group 40280.png',
                    title:"4117341",
                    show: this.userG?.pagesList.includes(4117341),
                    // show: this.userG?.userPrivileges.includes(170101),
              },  
              {
                name: { ar: 'دليل الحسابات', en: 'Accounts guide' },
                link: '/accounts/Accounts_guide',
                type: 'single',
                icon:
                  this.lang == 'ar'
                    ? '/assets/sidebar-icons/Group 40278.png'
                    : '/assets/sidebar-icons/Group 40280.png',
                    title:"4132216",
                    show: this.userG?.pagesList.includes(4132216),
                // show: this.userG?.userPrivileges.includes(170101),
              },       
        ],
      },
          // {
          //   name: { ar: 'صلاحيات النظام', en: 'System Permissions' },
          //   link: null,
          //   type: 'multiple',
          //   icon: '/assets/sidebar-icons/security.png',
          //   show: true,
          //   // show: this.userG?.userPrivileges.includes(1702),

          //   children: [
          //     {
          //       name: { ar: 'المستخدمين', en: 'Users' },
          //       link: '/controlpanel/users',
          //       type: 'single',
          //       icon:
          //         this.lang == 'ar'
          //           ? '/assets/sidebar-icons/Group 40278.png'
          //           : '/assets/sidebar-icons/Group 40280.png',
          //           show: true,
          //       // show: this.userG?.userPrivileges.includes(170201),
          //     },
          //   ],
          // },
        ],
      },
    ];
    //this.menu=this.menu.filter((a: { show: boolean; })=>a.show==true);
  }
}
