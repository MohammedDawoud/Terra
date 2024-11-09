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
        show: true,
      },

      {
        name: { ar: 'العملاء', en: 'Customers' },
        link: null,
        type: 'multiple',
        icon: '/assets/sidebar-icons/user-multiple-1.png',
        show: this.userG?.userPrivileges.includes(12),

        children: [
          {
            name: { ar: 'عروض الأسعار', en: 'Quotations' },
            link: '/projects/offers-price',
            type: 'single',
            icon: '/assets/sidebar-icons/offer_broken.png',
            show: this.userG?.userPrivileges.includes(1214),
          },
          {
            name: { ar: 'الإضافة والبحث', en: 'Search and inquire' },
            link: '/customers/search',
            type: 'single',
            icon: '/assets/sidebar-icons/Search Icon-1.png',
            show: this.userG?.userPrivileges.includes(1210),
          },

          {
            name: { ar: 'خدمات العميل', en: 'Customer services' },
            link: '/customers/CustomerOperations',
            type: 'single',
            icon: '/assets/sidebar-icons/settings-solid.png',
            show: this.userG?.userPrivileges.includes(1211),
          },
          {
            name: { ar: 'كشف حساب عميل', en: 'Customer account statement' },
            link: '/customers/AccountStatementCustomer',
            type: 'single',
            icon: '/assets/sidebar-icons/collection.png',
            show: this.userG?.userPrivileges.includes(121306),
          },
          {
            name: { ar: 'متابعة التحصيل', en: 'Follow-up collection' },
            link: '/customers/ContractNCustomer',
            type: 'single',
            icon: '/assets/sidebar-icons/report-data-1.png',
            show: this.userG?.userPrivileges.includes(121307),
          },
          {
            name: { ar: 'تقارير العملاء', en: 'Reports and statistics' },
            link: '/customers/CustomerReports',
            type: 'single',
            icon: '/assets/sidebar-icons/user-avatar.png',
            show: this.userG?.userPrivileges.includes(1213),
          },
        ],
      },

      // {
      //   name: { ar: 'الاتصالات الإدارية', en: 'Administrative Communications' },
      //   link: null,
      //   type: 'multiple',
      //   icon: '/assets/sidebar-icons/bx-support-1.png',
      //   show: this.userG?.userPrivileges.includes(10),

      //   children: [
      //     {
      //       name: { ar: 'الصادر', en: 'Outbox' },
      //       link: null,
      //       type: 'multiple',
      //       icon: '/assets/sidebar-icons/export.png',
      //       show: true,

      //       children: [
      //         {
      //           name: { ar: 'البحث في الصادر', en: 'Search in Outbox' },
      //           link: '/communications/Outbox',
      //           type: 'single',
      //           icon:
      //             this.lang == 'ar'
      //               ? '/assets/sidebar-icons/Group 40278.png'
      //               : '/assets/sidebar-icons/Group 40280.png',
      //           show: this.userG?.userPrivileges.includes(101013),
                
      //         },

      //         {
      //           name: { ar: 'الخطابات الصادرة', en: 'Outbox Letters' },
      //           link: '/communications/OutboxAdd',
      //           type: 'single',
      //           icon:
      //             this.lang == 'ar'
      //               ? '/assets/sidebar-icons/Group 40278.png'
      //               : '/assets/sidebar-icons/Group 40280.png',
      //           show: this.userG?.userPrivileges.includes(101010),
      //         },
      //       ],
      //     },
      //     {
      //       name: { ar: 'الوارد', en: 'Inbox' },
      //       link: null,
      //       type: 'multiple',
      //       icon: '/assets/sidebar-icons/export-1.png',
      //       show: this.userG?.userPrivileges.includes(1012),

      //       children: [
      //         {
      //           name: { ar: 'البحث في الوارد', en: 'Search in Inbox' },
      //           link: '/communications/Inbox',
      //           type: 'single',
      //           icon:
      //             this.lang == 'ar'
      //               ? '/assets/sidebar-icons/Group 40278.png'
      //               : '/assets/sidebar-icons/Group 40280.png',
      //           show: this.userG?.userPrivileges.includes(101201),
      //         },

      //         {
      //           name: { ar: 'الخطابات الواردة', en: 'Inbox Letters' },
      //           link: '/communications/InboxAdd',
      //           type: 'single',
      //           icon:
      //             this.lang == 'ar'
      //               ? '/assets/sidebar-icons/Group 40278.png'
      //               : '/assets/sidebar-icons/Group 40280.png',
      //           show: this.userG?.userPrivileges.includes(101202),
      //         },
      //       ],
      //     },
      //     {
      //       name: { ar: 'بحث', en: 'Search' },
      //       link: null,
      //       type: 'multiple',
      //       icon: '/assets/sidebar-icons/Search Icon.png',
      //       show: this.userG?.userPrivileges.includes(10),

      //       children: [
      //         {
      //           name: {
      //             ar: 'بحث في الصادر و الوارد',
      //             en: 'Search in InOutBox',
      //           },
      //           link: '/communications/OutInboxSearch',
      //           type: 'single',
      //           icon:
      //             this.lang == 'ar'
      //               ? '/assets/sidebar-icons/Group 40278.png'
      //               : '/assets/sidebar-icons/Group 40280.png',
      //           show: this.userG?.userPrivileges.includes(101013),
      //         },

      //         {
      //           name: { ar: 'بحث في الملفات', en: 'Search in Files' },
      //           link: '/communications/OutInboxFiles',
      //           type: 'single',
      //           icon:
      //             this.lang == 'ar'
      //               ? '/assets/sidebar-icons/Group 40278.png'
      //               : '/assets/sidebar-icons/Group 40280.png',
      //           show: this.userG?.userPrivileges.includes(101010),
      //         },
      //       ],
      //     },
      //   ],
      // },


      // {
      //   name: { ar: 'ادارة المشاريع', en: 'project management' },
      //   link: null,
      //   type: 'multiple',
      //   icon: '/assets/sidebar-icons/settings-services.png',
      //   show: this.userG?.userPrivileges.includes(11),

      //   children: [
      //     {
      //       name: { ar: 'عروض الأسعار', en: 'Quotations' },
      //       link: '/projects/offers-price',
      //       type: 'single',
      //       icon: '/assets/sidebar-icons/offer_broken.png',
      //       show: this.userG?.userPrivileges.includes(12131),
      //     },
      //     {
      //       name: { ar: 'حركة المشاريع', en: 'Project movement' },
      //       link: '/projects/track-projects',
      //       type: 'single',
      //       icon: '/assets/sidebar-icons/movement.png',
      //       show: this.userG?.userPrivileges.includes(1110),
      //     },
      //     {
      //       name: { ar: 'حركة المهام', en: 'task movement' },
      //       link: '/projects/track-missions',
      //       type: 'single',
      //       icon: '/assets/sidebar-icons/Group 40676.png',
      //       show: this.userG?.userPrivileges.includes(1113),
      //     },
      //     {
      //       name: { ar: 'المهام الإدارية', en: 'Administrative tasks' },
      //       link: '/projects/work-orders',
      //       type: 'single',
      //       icon: '/assets/sidebar-icons/process-on-vm-line-2.png',
      //       show: this.userG?.userPrivileges.includes(1114),
      //     },
      //     {
      //       name: { ar: 'سير عمل المشروع', en: 'Project workflow' },
      //       link: '/projects/project-setting',
      //       type: 'single',
      //       icon: '/assets/sidebar-icons/arrow-left-right.png',
      //       show: this.userG?.userPrivileges.includes(1110),
      //     },
      //     {
      //       name: { ar: 'متطلبات المشروع', en: 'Project requirements' },
      //       link: '/projects/project-requirements',
      //       type: 'single',
      //       icon: '/assets/sidebar-icons/data-1.png',
      //       show: this.userG?.userPrivileges.includes(1115),
      //     },
      //     {
      //       name: { ar: 'مركز رفع الملفات', en: 'File upload center' },
      //       link: '/projects/file-uploader-center-new',
      //       type: 'single',
      //       icon: '/assets/sidebar-icons/upload-cloud-line.png',
      //       show: this.userG?.userPrivileges.includes(12132),
      //     },
      //     {
      //       name: { ar: 'أرشيف المشاريع', en: 'Projects archive' },
      //       link: '/projects/project-archive',
      //       type: 'single',
      //       icon: '/assets/sidebar-icons/Path 34061.png',
      //       show: this.userG?.userPrivileges.includes(1212),
      //     },
      //     {
      //       name: { ar: 'الإشراف', en: 'Supervision' },
      //       link: '/projects/supervisions',
      //       type: 'single',
      //       icon: '/assets/sidebar-icons/airline-manage-gates.png',
      //       show: this.userG?.userPrivileges.includes(1119),
      //     },
      //     {
      //       name: { ar: 'حالة المشروع', en: 'Project state' },
      //       link: '/projects/project-status',
      //       type: 'single',
      //       icon: '/assets/sidebar-icons/ai-status.png',
      //       show: this.userG?.userPrivileges.includes(1120),
      //     },
      //     {
      //       name: {
      //         ar: 'إيرادات ومصروفات المشاريع',
      //         en: 'Project revenues and expenses',
      //       },
      //       link: '/projects/follow-project',
      //       type: 'single',
      //       icon: '/assets/sidebar-icons/money-1.png',
      //       show: this.userG?.userPrivileges.includes(1121),
      //     },
      //     {
      //       name: { ar: 'تقارير  المشاريع', en: 'Project Reports' },
      //       link: null,
      //       type: 'multiple',
      //       icon: '/assets/sidebar-icons/report-data-4.png',
      //       show: this.userG?.userPrivileges.includes(121321),

      //       children: [
      //         {
      //           name: {
      //             ar: 'تقرير الاداء الشامل',
      //             en: 'Comprehensive Performance Report',
      //           },
      //           link: '/projects/performance-report',
      //           type: 'single',
      //           icon:
      //             this.lang == 'ar'
      //               ? '/assets/sidebar-icons/Group 40278.png'
      //               : '/assets/sidebar-icons/Group 40280.png',
      //           show: this.userG?.userPrivileges.includes(1213211),
      //         },
      //         {
      //           name: { ar: 'مشاريع المستخدم', en: 'User Projects' },
      //           link: '/projects/user-projects',
      //           type: 'single',
      //           icon: '/assets/sidebar-icons/user-data.png',
      //           show: this.userG?.userPrivileges.includes(1213212),
      //         },
      //         {
      //           name: { ar: 'مهام المستخدم', en: 'user tasks' },
      //           link: '/projects/user-tasks',
      //           type: 'single',
      //           icon: '/assets/sidebar-icons/report-data-5.png',
      //           show: this.userG?.userPrivileges.includes(1213213),
      //         },
      //         {
      //           name: { ar: 'مهام حسب المشروع', en: 'tasks by project' },
      //           link: '/projects/project-tasks-report',
      //           type: 'single',
      //           icon: '/assets/sidebar-icons/report-data-5.png',
      //           show: this.userG?.userPrivileges.includes(1213214),
      //         },
      //         {
      //           name: { ar: 'تكلفة المشروع', en: 'project cost' },
      //           link: '/projects/project-cost',
      //           type: 'single',
      //           icon: '/assets/sidebar-icons/moneyalt.png',
      //           show: this.userG?.userPrivileges.includes(1213215),
      //         },
      //       ],
      //     },
      //   ],
      // },

      {
        name: { ar: 'شؤون الموظفين', en: 'Employees Affairs' },
        link: null,
        type: 'multiple',
        icon: '/assets/sidebar-icons/users-line.png',
        show: this.userG?.userPrivileges.includes(14),

        children: [
          {
            name: { ar: ' ادارة التعاميم', en: 'General Alerts' },
            link: '/employees/generalAlert',
            type: 'single',
            icon: '/assets/sidebar-icons/notification-outline-badged.png',
            show: this.userG?.userPrivileges.includes(170103),
          },
          {
            name: { ar: 'بيانات الموظف', en: 'Employee Data' },
            link: '/employees/employeeData',
            type: 'single',
            icon: '/assets/sidebar-icons/info-circle.png',
            show: this.userG?.userPrivileges.includes(1410),
          },
          {
            name: { ar: 'عقود الموظفين', en: 'Staff Contracts' },
            link: '/employees/staffcontracts',
            type: 'single',
            icon: '/assets/sidebar-icons/document.png',
            show: this.userG?.userPrivileges.includes(1419),
          },
          {
            name: { ar: 'إجازات الموظفين', en: 'Staff Holidays' },
            link: '/employees/staffHolidays',
            type: 'single',
            icon: '/assets/sidebar-icons/on-holiday-line.png',
            show: this.userG?.userPrivileges.includes(141101),
          },
          {
            name: { ar: 'سلف الموظف', en: 'Employee Loan' },
            link: '/employees/EmployeeLoan',
            type: 'single',
            icon: '/assets/sidebar-icons/cash_outline.png',
            show: this.userG?.userPrivileges.includes(1412),
          },
          {
            name: { ar: 'مسيرات الرواتب', en: 'Payroll Marches' },
            link: '/employees/PayrollMarches',
            type: 'single',
            icon: '/assets/sidebar-icons/money.png',
            show: this.userG?.userPrivileges.includes(1413),
          },
          {
            name: { ar: 'إعداد المسير الشهري', en: 'Monthly Salary setup' },
            link: '/employees/SalarySetup',
            type: 'single',
            icon: '/assets/sidebar-icons/update-line.png',
            show: this.userG?.userPrivileges.includes(1420),
          },
          {
            name: { ar: 'عُهَد الموظفين', en: 'Advance to employees' },
            link: '/employees/AdvanceToEmployees',
            type: 'single',
            icon: '/assets/sidebar-icons/materialdesignicons.png',
            show: this.userG?.userPrivileges.includes(1414),
          },
          {
            name: { ar: 'حركة السيارات', en: 'Car Movement' },
            link: '/employees/CarMovement',
            type: 'single',
            icon: '/assets/sidebar-icons/Path 34110.png',
            show: this.userG?.userPrivileges.includes(1416),
          },
          {
            name: { ar: 'ارشيف الموظفين', en: 'Staff Archive' },
            link: '/employees/EmployeesArchive',
            type: 'single',
            icon: '/assets/sidebar-icons/meter-alt.png',
            show: this.userG?.userPrivileges.includes(142005),
          },
          {
            name: { ar: 'الحضور والانصراف', en: 'Attendance and Departure' },
            link: null,
            type: 'multiple',
            icon: '/assets/sidebar-icons/employee-line.png',
            show: this.userG?.userPrivileges.includes(1418),

            children: [
              {
                name: {
                  ar: 'الحضور بالبصمة',
                  en: 'Attendance and departure of employees',
                },
                link: '/employees/AttendanceAndDepartureOfEmployees',
                type: 'single',
                icon:
                  this.lang == 'ar'
                    ? '/assets/sidebar-icons/Group 40278.png'
                    : '/assets/sidebar-icons/Group 40280.png',
                show: this.userG?.userPrivileges.includes(14180207),
              },
              {
                name: { ar: 'الحضور اليدوي', en: 'Maniual attendance' },
                link: '/employees/ManualAttendance',
                type: 'single',
                icon:
                  this.lang == 'ar'
                    ? '/assets/sidebar-icons/Group 40278.png'
                    : '/assets/sidebar-icons/Group 40280.png',
                show: this.userG?.userPrivileges.includes(14180303),
              },
              {
                name: { ar: 'الحضور من التطبيق', en: 'Application Attendance' },
                link: '/employees/ApplicationAttendance',
                type: 'single',
                icon:
                  this.lang == 'ar'
                    ? '/assets/sidebar-icons/Group 40278.png'
                    : '/assets/sidebar-icons/Group 40280.png',
                show: this.userG?.userPrivileges.includes(14180208),
              },
            ],
          },
          {
            name: { ar: 'تقارير احصائية', en: 'Statistical reports' },
            link: null,
            type: 'multiple',
            icon: '/assets/sidebar-icons/bx-stats.png',
            show: this.userG?.userPrivileges.includes(141802),

            children: [
              {
                name: { ar: 'الموظفون الغائبون', en: 'Absentee Staff' },
                link: '/employees/AbsenteeStaff',
                type: 'single',
                icon:
                  this.lang == 'ar'
                    ? '/assets/sidebar-icons/Group 40278.png'
                    : '/assets/sidebar-icons/Group 40280.png',
                show: this.userG?.userPrivileges.includes(14180201),
              },
              {
                name: { ar: 'الغائبون اليوم', en: 'Absentees Today' },
                link: '/employees/AbsenteesToday',
                type: 'single',
                icon:
                  this.lang == 'ar'
                    ? '/assets/sidebar-icons/Group 40278.png'
                    : '/assets/sidebar-icons/Group 40280.png',
                show: this.userG?.userPrivileges.includes(14180202),
              },
              {
                name: { ar: 'الموظفون المتأخرون', en: 'Late employees' },
                link: '/employees/LateEmployees',
                type: 'single',
                icon:
                  this.lang == 'ar'
                    ? '/assets/sidebar-icons/Group 40278.png'
                    : '/assets/sidebar-icons/Group 40280.png',
                show: this.userG?.userPrivileges.includes(14180203),
              },
              {
                name: { ar: 'المتأخرون اليوم', en: 'Late today' },
                link: '/employees/LateToday',
                type: 'single',
                icon:
                  this.lang == 'ar'
                    ? '/assets/sidebar-icons/Group 40278.png'
                    : '/assets/sidebar-icons/Group 40280.png',
                show: this.userG?.userPrivileges.includes(14180204),
              },
              {
                name: { ar: 'الخروج المبكر', en: 'Early exit' },
                link: '/employees/EarlyExit',
                type: 'single',
                icon:
                  this.lang == 'ar'
                    ? '/assets/sidebar-icons/Group 40278.png'
                    : '/assets/sidebar-icons/Group 40280.png',
                show: this.userG?.userPrivileges.includes(14180205),
              },
              {
                name: { ar: 'لم يسجلوا الخروج', en: 'Not logged out' },
                link: '/employees/NotLoggedOut',
                type: 'single',
                icon:
                  this.lang == 'ar'
                    ? '/assets/sidebar-icons/Group 40278.png'
                    : '/assets/sidebar-icons/Group 40280.png',
                show: this.userG?.userPrivileges.includes(14180206),
              },
              {
                name: {
                  ar: 'الحضور والانصراف',
                  en: 'Attendance and Departure',
                },
                link: '/employees/AttendanceAndDeparture',
                type: 'single',
                icon:
                  this.lang == 'ar'
                    ? '/assets/sidebar-icons/Group 40278.png'
                    : '/assets/sidebar-icons/Group 40280.png',
                show: this.userG?.userPrivileges.includes(141801),
              },
            ],
          },
        ],
      },

      {
        name: { ar: 'الحسابات', en: 'Accounts' },
        link: null,
        type: 'multiple',
        icon: '/assets/sidebar-icons/accounting-1.png',
        show: this.userG?.userPrivileges.includes(13),
        children: [
          {
            name: { ar: 'المسودات', en: 'Sales bill Draft' },
            link: '/accounts/Sales_bill_drafts',
            type: 'single',
            icon: '/assets/sidebar-icons/md-paper-1.png',
            show: this.userG?.userPrivileges.includes(131006),
          },
          {
            name: { ar: 'فاتورة مبيعات', en: 'Sales bill' },
            link: '/accounts/Sales_bill',
            type: 'single',
            icon: '/assets/sidebar-icons/md-paper-1.png',
            show: this.userG?.userPrivileges.includes(131001),
          },
          {
            name: { ar: 'مردود المبيعات', en: 'Sales return' },
            link: '/accounts/Sales_return',
            type: 'single',
            icon: '/assets/sidebar-icons/backward.png',
            show: this.userG?.userPrivileges.includes(131001),
          },
          {
            name: {
              ar: 'فواتير المبيعات الملغاة',
              en: 'Canceled sales invoices',
            },
            link: '/accounts/Canceled_sales',
            type: 'single',
            icon: '/assets/sidebar-icons/md-paper.png',
            show: this.userG?.userPrivileges.includes(131001),
          },
          {
            name: { ar: 'فاتورة مشتريات', en: 'Purchases bill' },
            link: '/accounts/Purchases_bill',
            type: 'single',
            icon: '/assets/sidebar-icons/process-on-vm-line.png',
            show: this.userG?.userPrivileges.includes(131004),
          },
          {
            name: { ar: 'مردود فاتورة مشتريات', en: 'Purchase invoice return' },
            link: '/accounts/Purchase_invoice_return',
            type: 'single',
            icon: '/assets/sidebar-icons/Group 40676.png',
            show: this.userG?.userPrivileges.includes(131004),
          },
          {
            name: {
              ar: 'فواتير المشتريات الملغاة',
              en: 'Canceled purchase invoices',
            },
            link: '/accounts/Canceled_purchase',
            type: 'single',
            icon: '/assets/sidebar-icons/md-paper.png',
            show: this.userG?.userPrivileges.includes(131004),
          },
          {
            name: { ar: 'سند قبض', en: 'Catch Receipt' },
            link: '/accounts/Catch_Receipt',
            type: 'single',
            icon: '/assets/sidebar-icons/cash_outline.png',
            show: this.userG?.userPrivileges.includes(131002),
          },
          {
            name: { ar: 'سند صرف', en: 'Receipt' },
            link: '/accounts/Receipt',
            type: 'single',
            icon: '/assets/sidebar-icons/cash_outline.png',
            show: this.userG?.userPrivileges.includes(131003),
          },
          {
            name: { ar: 'سند جرد', en: 'Inventory Debenture' },
            link: '/accounts/Debentures',
            type: 'single',
            icon: '/assets/sidebar-icons/cash_outline.png',
            show: this.userG?.userPrivileges.includes(131003),
          },
          {
            name: { ar: 'سند نقل', en: 'Inventory Debenture' },
            link: '/accounts/TransferDebentures',
            type: 'single',
            icon: '/assets/sidebar-icons/cash_outline.png',
            show: this.userG?.userPrivileges.includes(131003),
          },
          {
            name: { ar: 'مردود المصروفات', en: 'Expense return' },
            link: '/accounts/Expense_return',
            type: 'single',
            icon: '/assets/sidebar-icons/backward.png',
            show: this.userG?.userPrivileges.includes(131003),
          },
          {
            name: { ar: 'قيد يومية', en: 'Under daily' },
            link: '/accounts/Under_daily',
            type: 'single',
            icon: '/assets/sidebar-icons/report-data-3.png',
            show: this.userG?.userPrivileges.includes(131102),
          },

          {
            name: {
              ar: 'العهد الماليه للموظفين',
              en: 'Financial covenant for employees',
            },
            link: '/accounts/Financial_covenant',
            type: 'single',
            icon: '/assets/sidebar-icons/money-3.png',
            show: this.userG?.userPrivileges.includes(1312),
          },
          {
            name: { ar: 'عقود العملاء', en: 'Customer Contracts' },
            link: '/accounts/Customer_Contracts',
            type: 'single',
            icon: '/assets/sidebar-icons/user-multiple.png',
            show: this.userG?.userPrivileges.includes(1315),
          },
          {
            name: {
              ar: 'تذكير بالوثائق الرسمية',
              en: 'Reminder of official documents',
            },
            link: '/accounts/official_documents',
            type: 'single',
            icon: '/assets/sidebar-icons/alarm.png',
            show: this.userG?.userPrivileges.includes(1313),
          },
          {
            name: {
              ar: 'تذكير بالفواتير والخدمات',
              en: 'Billing and service reminders',
            },
            link: '/accounts/Billing_service',
            type: 'single',
            icon: '/assets/sidebar-icons/alarm.png',
            show: true,
          },
          {
            name: { ar: 'شيكات صادرة', en: 'Checks issued' },
            link: '/accounts/checks_issued',
            type: 'single',
            icon: '/assets/sidebar-icons/cash-coin.png',
            show: this.userG?.userPrivileges.includes(131401),
          },
          {
            name: { ar: 'الضمانات', en: 'Warranties' },
            link: '/accounts/Warranties',
            type: 'single',
            icon: '/assets/sidebar-icons/money-1.png',
            show: this.userG?.userPrivileges.includes(1317),
          },
          {
            name: { ar: 'اعتماد  المسير', en: 'Adoption of the manager' },
            link: '/accounts/Adoption_of_theManager',
            type: 'single',
            icon: '/assets/sidebar-icons/law.png',
            show: this.userG?.userPrivileges.includes(1320),
          },
          {
            name: { ar: 'قائمة الموردين', en: 'Suppliers' },
            link: '/accounts/Suppliers',
            type: 'single',
            icon: '/assets/sidebar-icons/user-multiple-1.png',
            show: true,
          },
          {
            name: { ar: 'تقارير  الحسابات', en: 'Project Reports' },
            link: null,
            type: 'multiple',
            icon: '/assets/sidebar-icons/report-data-4.png',
            show: this.userG?.userPrivileges.includes(1318),

            children: [
              {
                name: { ar: 'كشف حساب', en: 'Account Statement' },
                link: '/accounts/Account_Statement',
                type: 'single',
                icon:
                  this.lang == 'ar'
                    ? '/assets/sidebar-icons/Group 40278.png'
                    : '/assets/sidebar-icons/Group 40280.png',
                show: this.userG?.userPrivileges.includes(131801),
              },
              {
                name: { ar: 'اليومية العامة', en: 'general journal' },
                link: '/accounts/general_Journal',
                type: 'single',
                icon:
                  this.lang == 'ar'
                    ? '/assets/sidebar-icons/Group 40278.png'
                    : '/assets/sidebar-icons/Group 40280.png',
                show: this.userG?.userPrivileges.includes(131802),
              },
              {
                name: { ar: 'ميزان المراجعة', en: 'Trial Balance' },
                link: '/accounts/Trial_Balance',
                type: 'single',
                icon:
                  this.lang == 'ar'
                    ? '/assets/sidebar-icons/Group 40278.png'
                    : '/assets/sidebar-icons/Group 40280.png',
                show: this.userG?.userPrivileges.includes(131803),
              },
              {
                name: { ar: 'قائمة الدخل', en: 'Income list' },
                link: '/accounts/Incom_List',
                type: 'single',
                icon:
                  this.lang == 'ar'
                    ? '/assets/sidebar-icons/Group 40278.png'
                    : '/assets/sidebar-icons/Group 40280.png',
                show: this.userG?.userPrivileges.includes(131804),
              },
              {
                name: {
                  ar: 'قائمة المركز المالي',
                  en: 'Statement of financial position',
                },
                link: '/accounts/Statement_of_financial_position',
                type: 'single',
                icon:
                  this.lang == 'ar'
                    ? '/assets/sidebar-icons/Group 40278.png'
                    : '/assets/sidebar-icons/Group 40280.png',
                show: this.userG?.userPrivileges.includes(131805),
              },
              {
                name: { ar: 'الإقرار الضريبي', en: 'Tax declaration' },
                link: '/accounts/Tax_declaration',
                type: 'single',
                icon:
                  this.lang == 'ar'
                    ? '/assets/sidebar-icons/Group 40278.png'
                    : '/assets/sidebar-icons/Group 40280.png',
                show: this.userG?.userPrivileges.includes(131807),
              },
              {
                name: {
                  ar: 'كشف بالأرصدة الآجلة',
                  en: 'Statement of deferred balances',
                },
                link: '/accounts/Statement_of_customers_deferred_balances',
                type: 'single',
                icon:
                  this.lang == 'ar'
                    ? '/assets/sidebar-icons/Group 40278.png'
                    : '/assets/sidebar-icons/Group 40280.png',
                show: this.userG?.userPrivileges.includes(13180801),
              },
              {
                name: { ar: 'حركة مراكز التكلفة', en: 'Cost center movement' },
                link: '/accounts/Cost_center_movement',
                type: 'single',
                icon:
                  this.lang == 'ar'
                    ? '/assets/sidebar-icons/Group 40278.png'
                    : '/assets/sidebar-icons/Group 40280.png',
                show: this.userG?.userPrivileges.includes(13180802),
              },
              {
                name: {
                  ar: 'كشف تجميعي للسندات',
                  en: 'Synthesis statement of bonds',
                },
                link: '/accounts/Synthesis_statement_of_bonds',
                type: 'single',
                icon:
                  this.lang == 'ar'
                    ? '/assets/sidebar-icons/Group 40278.png'
                    : '/assets/sidebar-icons/Group 40280.png',
                show: this.userG?.userPrivileges.includes(13180803),
              },
              // {
              //   name: {
              //     ar: 'ايرادات مدراء المشاريع',
              //     en: 'Project managers revenue',
              //   },
              //   link: '/accounts/Project_managers_revenue',
              //   type: 'single',
              //   icon:
              //     this.lang == 'ar'
              //       ? '/assets/sidebar-icons/Group 40278.png'
              //       : '/assets/sidebar-icons/Group 40280.png',
              //   show: this.userG?.userPrivileges.includes(13180804),
              // },
              {
                name: {
                  ar: 'متابعة إيرادات العملاء',
                  en: 'Follow up on customer revenue',
                },
                link: '/accounts/FollowUp_on_Customer_revenue',
                type: 'single',
                icon:
                  this.lang == 'ar'
                    ? '/assets/sidebar-icons/Group 40278.png'
                    : '/assets/sidebar-icons/Group 40280.png',
                show: this.userG?.userPrivileges.includes(13180805),
              },
              {
                name: {
                  ar: 'ايراد العميل (تفصيلي)',
                  en: 'Customer revenue (detailed)',
                },
                link: '/accounts/Customer_revenue',
                type: 'single',
                icon:
                  this.lang == 'ar'
                    ? '/assets/sidebar-icons/Group 40278.png'
                    : '/assets/sidebar-icons/Group 40280.png',
                show: this.userG?.userPrivileges.includes(13180806),
              },
              {
                name: { ar: 'متابعة المصروفات', en: 'Expense follow-up' },
                link: '/accounts/Expense_follow_up',
                type: 'single',
                icon:
                  this.lang == 'ar'
                    ? '/assets/sidebar-icons/Group 40278.png'
                    : '/assets/sidebar-icons/Group 40280.png',
                show: this.userG?.userPrivileges.includes(13180807),
              },
              {
                name: {
                  ar: 'متابعة مراكز التكلفة',
                  en: 'Follow up cost centers',
                },
                link: '/accounts/Follow_up_the_revenues_and_expenses',
                type: 'single',
                icon:
                  this.lang == 'ar'
                    ? '/assets/sidebar-icons/Group 40278.png'
                    : '/assets/sidebar-icons/Group 40280.png',
                show: this.userG?.userPrivileges.includes(13180808),
              },
              {
                name: {
                  ar: 'اشعارات الدائن والمدين',
                  en: 'Credit and debit notices',
                },
                link: '/accounts/Follow_up_on_credit_and_debit_notes',
                type: 'single',
                icon:
                  this.lang == 'ar'
                    ? '/assets/sidebar-icons/Group 40278.png'
                    : '/assets/sidebar-icons/Group 40280.png',
                show: this.userG?.userPrivileges.includes(13180809),
              },
              {
                name: {
                  ar: 'جدول أعمار الديون',
                  en: 'Debt aging schedule',
                },
                link: '/accounts/Invoicedue',
                type: 'single',
                icon:
                  this.lang == 'ar'
                    ? '/assets/sidebar-icons/Group 40278.png'
                    : '/assets/sidebar-icons/Group 40280.png',
                show: this.userG?.userPrivileges.includes(13180810),
              },
              // {
              //   name: {
              //     ar: 'حركة الصنف',
              //     en: 'Item Movement',
              //   },
              //   link: '/accounts/ItemMovement',
              //   type: 'single',
              //   icon:
              //     this.lang == 'ar'
              //       ? '/assets/sidebar-icons/Group 40278.png'
              //       : '/assets/sidebar-icons/Group 40280.png',
              //   show: this.userG?.userPrivileges.includes(13180810),
              // },
              {
                name: {
                  ar: 'الكميات',
                  en: 'Quantities',
                },
                link: '/accounts/Quantities',
                type: 'single',
                icon:
                  this.lang == 'ar'
                    ? '/assets/sidebar-icons/Group 40278.png'
                    : '/assets/sidebar-icons/Group 40280.png',
                show: this.userG?.userPrivileges.includes(13180810),
              },
                    {
                name: {
                  ar: 'المبيعات والارباح اليوميه',
                  en: 'Daily Payments and earns',
                },
                link: '/accounts/daily-invoice-with-details',
                type: 'single',
                icon:
                  this.lang == 'ar'
                    ? '/assets/sidebar-icons/Group 40278.png'
                    : '/assets/sidebar-icons/Group 40280.png',
                show: this.userG?.userPrivileges.includes(13180811),
              },
                           {
                name: {
                  ar: 'المبيعات والارباح الشهريه',
                  en: 'Monthly Payments and earns',
                },
                link: '/accounts/monthly-invoices',
                type: 'single',
                icon:
                  this.lang == 'ar'
                    ? '/assets/sidebar-icons/Group 40278.png'
                    : '/assets/sidebar-icons/Group 40280.png',
                show: this.userG?.userPrivileges.includes(13180812),
              },
                               {
                name: {
                  ar: 'المبيعات والارباح والمردودالشهريه',
                  en: 'Monthly Payments and earns',
                },
                link: '/accounts/monthlyinvoiceswithdayes',
                type: 'single',
                icon:
                  this.lang == 'ar'
                    ? '/assets/sidebar-icons/Group 40278.png'
                    : '/assets/sidebar-icons/Group 40280.png',
                show: this.userG?.userPrivileges.includes(13180813),
              },
                {
                name: {
                  ar: 'ارباح المبيعات والمردود السنوي',
                  en: 'Yearly Payments and earns',
                },
                link: '/accounts/yearlyinvoiceswit-months',
                type: 'single',
                icon:
                  this.lang == 'ar'
                    ? '/assets/sidebar-icons/Group 40278.png'
                    : '/assets/sidebar-icons/Group 40280.png',
                show: this.userG?.userPrivileges.includes(13180814),
              },
                {
                name: {
                  ar: 'المندوبين',
                  en: 'Delegates',
                },
                link: '/accounts/paymentdelegates',
                type: 'single',
                icon:
                  this.lang == 'ar'
                    ? '/assets/sidebar-icons/Group 40278.png'
                    : '/assets/sidebar-icons/Group 40280.png',
                show: this.userG?.userPrivileges.includes(13180815),
              },
            ],
          },
          {
            name: { ar: 'الحسابات الختامية', en: 'Final Accounts' },
            link: null,
            type: 'multiple',
            icon: '/assets/sidebar-icons/accounting-1.png',
            show: this.userG?.userPrivileges.includes(1319),
            children: [
              {
                name: { ar: 'دليل الحسابات', en: '  Accounts guide ' },
                link: '/accounts/Accounts_guide',
                type: 'single',
                icon:
                  this.lang == 'ar'
                    ? '/assets/sidebar-icons/Group 40278.png'
                    : '/assets/sidebar-icons/Group 40280.png',
                show: this.userG?.userPrivileges.includes(131901),
              },
              {
                name: { ar: 'مراكز التكلفة', en: ' Cost centres  ' },
                link: '/accounts/Cost_centres',
                type: 'single',
                icon:
                  this.lang == 'ar'
                    ? '/assets/sidebar-icons/Group 40278.png'
                    : '/assets/sidebar-icons/Group 40280.png',
                show: this.userG?.userPrivileges.includes(131902),
              },
              {
                name: { ar: 'السنوات المالية', en: '  Fiscal years ' },
                link: '/accounts/Fiscal_years',
                type: 'single',
                icon:
                  this.lang == 'ar'
                    ? '/assets/sidebar-icons/Group 40278.png'
                    : '/assets/sidebar-icons/Group 40280.png',
                show: this.userG?.userPrivileges.includes(131904),
              },
              {
                name: { ar: 'القيد الافتتاحي', en: '  Opening entry ' },
                link: '/accounts/Opening_entry',
                type: 'single',
                icon:
                  this.lang == 'ar'
                    ? '/assets/sidebar-icons/Group 40278.png'
                    : '/assets/sidebar-icons/Group 40280.png',
                show: this.userG?.userPrivileges.includes(131101),
              },
              {
                name: { ar: 'اسعار الخدمات', en: '  Service prices ' },
                link: '/accounts/Service_prices',
                type: 'single',
                icon:
                  this.lang == 'ar'
                    ? '/assets/sidebar-icons/Group 40278.png'
                    : '/assets/sidebar-icons/Group 40280.png',
                show: true,
              },
              {
                name: { ar: 'قيد اقفال', en: '  Closed ' },
                link: '/accounts/Closed',
                type: 'single',
                icon:
                  this.lang == 'ar'
                    ? '/assets/sidebar-icons/Group 40278.png'
                    : '/assets/sidebar-icons/Group 40280.png',
                show: this.userG?.userPrivileges.includes(131103),
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
        show: this.userG?.userPrivileges.includes(17),
        children: [
          {
            name: { ar: 'اعدادات النظام', en: 'system settings' },
            link: null,
            type: 'multiple',
            icon: '/assets/sidebar-icons/settings-solid.png',
            show: this.userG?.userPrivileges.includes(1701),

            children: [
              {
                name: { ar: 'تجهيز بيانات المنشأة', en: 'Building Data' },
                link: '/controlpanel/organization',
                type: 'single',
                icon:
                  this.lang == 'ar'
                    ? '/assets/sidebar-icons/Group 40278.png'
                    : '/assets/sidebar-icons/Group 40280.png',
                show: this.userG?.userPrivileges.includes(170101),
              },
              {
                name: { ar: 'سجل احداث النظام', en: 'System event log' },
                link: '/controlpanel/actions',
                type: 'single',
                icon:
                  this.lang == 'ar'
                    ? '/assets/sidebar-icons/Group 40278.png'
                    : '/assets/sidebar-icons/Group 40280.png',
                show: this.userG?.userPrivileges.includes(170104),
              },
              {
                name: { ar: 'النسخ الاحتياطي', en: 'Create a backup' },
                link: '/controlpanel/backup',
                type: 'single',
                icon:
                  this.lang == 'ar'
                    ? '/assets/sidebar-icons/Group 40278.png'
                    : '/assets/sidebar-icons/Group 40280.png',
                show: this.userG?.userPrivileges.includes(170105),
              },
          
          {
            name: { ar: 'إعدادات نطاق العمل', en: 'Location Setup' },
            link: '/employees/attendanceList',
            type: 'single',
            icon:
              this.lang == 'ar'
                ? '/assets/sidebar-icons/Group 40278.png'
                : '/assets/sidebar-icons/Group 40280.png',
            show: this.userG?.userPrivileges.includes(170105),
          },
        ],
      },
          {
            name: { ar: 'صلاحيات النظام', en: 'System Permissions' },
            link: null,
            type: 'multiple',
            icon: '/assets/sidebar-icons/security.png',
            show: this.userG?.userPrivileges.includes(1702),

            children: [
              {
                name: { ar: 'المستخدمين', en: 'Users' },
                link: '/controlpanel/users',
                type: 'single',
                icon:
                  this.lang == 'ar'
                    ? '/assets/sidebar-icons/Group 40278.png'
                    : '/assets/sidebar-icons/Group 40280.png',
                show: this.userG?.userPrivileges.includes(170201),
              },
              {
                name: { ar: 'المجموعات', en: 'Groups' },
                link: '/controlpanel/groups',
                type: 'single',
                icon:
                  this.lang == 'ar'
                    ? '/assets/sidebar-icons/Group 40278.png'
                    : '/assets/sidebar-icons/Group 40280.png',
                show: this.userG?.userPrivileges.includes(170202),
              },
            ],
          },
        ],
      },
    ];
    //this.menu=this.menu.filter((a: { show: boolean; })=>a.show==true);
  }
}
