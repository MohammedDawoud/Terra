import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RestApiService } from 'src/app/shared/services/api.service';
import { SelectionModel } from '@angular/cdk/collections';
import { SysServicesService } from 'src/app/core/services/sys_Services/sys-services.service';
import {
  SharedService,
  isValidSEmailPattern,
  isValidSaudiId,
  emailMatchValidator,
} from 'src/app/core/services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CustomValidators } from 'src/app/shared/directives/custome-validators';
import { TreeMode } from 'tree-ngx';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { MatTabGroup } from '@angular/material/tabs';
import { GroupPrivilegeService } from 'src/app/core/services/group_Services/group-privilege.service';
import { Children, Groups } from 'src/app/shared/models/groups';
import { environment } from 'src/environments/environment';
import { AdminProfileService } from 'src/app/core/services/admin_profile_Services/admin-profile.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  title: any = {
    main: {
      name: {
        ar: 'لوحة التحكم',
        en: 'Control Panel',
      },
      link: '/controlpanel',
    },
    sub: {
      ar: 'المستخدمين',
      en: 'Users',
    },
  };

  users: any;

  modalDetails: any;

  UserSelectIdFilter: any;
  modal?: BsModalRef;
  userForm: FormGroup;
  privilegesForm: FormGroup;
  licenceForm: FormGroup;
  lang: any = 'ar';
  logoUrl: any = null;

  environmenturl: any;
  OrganizationData: any;
  ngOnInit(): void {
    this.userformintial();
    this.licenceformintial();
    // this.GetCurrentUser();
    this.GetAllOnlineUsers();
    this.GetAllUsers();
    this.GetAllLicences();
    // this.fetchUsersByPrivilege();
    this.updateNumberOfUsers();
    this.fillUsersSelect();
    this.getAllProjectPhasesTasksUPage();
    this.getJobs();
    this.getGroups();
    this.getgroupListTable();
    this.GetAllDepartmentbyType();
    this.FillBranchSelect();
    this.getDepartments(1);
    this.GetAllJobs();
    this.getattendanceTime();
    this.loadPrivilegesTree();
    this.api.GetOrganizationDataLogin().subscribe({
      next: (res: any) => {
        this.OrganizationData = res.result;
      },
      error: (error) => {},
    });
    this.userForm.controls['ExpireDate'].disable();

    this.userG = this.authenticationService.userGlobalObj;
    // this.adminProfileService.getUserById(this.userG.userId).subscribe((data) => {
    // });
  }
  treeItems: any = [
    {
      id: '0',
      name: 'Select All',
      children: [
        {
          id: '1',
          name: 'Batman',
        },
        {
          id: '2',
          name: 'Superman',
        },
        {
          id: '3',
          name: 'awdawn',
        },
        {
          id: '4',
          name: 'fawfdawfn',
        },
        {
          id: '5',
          name: 'awfawfawf',
        },
        {
          id: '6',
          name: 'fdbdfbdf',
        },
      ],
    },
  ];

  date: any = new Date();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild('onlinedatapaginator') onlinedatapaginator!: MatPaginator;
  @ViewChild('onlinedata') onlinedata!: MatSort;

  @ViewChild('userPermissionstable') userPermissionstable!: MatSort;
  @ViewChild('userPermissionstablepaginator')
  userPermissionspag!: MatPaginator;

  @ViewChild('Permissionstable') Permissionstable!: MatSort;
  @ViewChild('Permissionstablepaginator')
  Permissionspag!: MatPaginator;

  @ViewChild('taskstable') taskstable!: MatSort;
  @ViewChild('taskstablepaginator')
  taskstablepaginator!: MatPaginator;

  @ViewChild('statementsTable') statementsTable!: MatSort;
  @ViewChild('statementsTablepag')
  statementsTablepag!: MatPaginator;

  @ViewChild('projectsTable') projectsTable!: MatSort;
  @ViewChild('projectsTablepag')
  projectsTablepag!: MatPaginator;

  displayedColumns: string[] = [
    'UserId',
    'UserName',
    'FullName',
    'JobName',
    'DepartmentName',
    'GroupName',
    'BranchName',
    'Status',
    'LastLoginDate',
    'appStatus',
    'DeviceId',
    'DeviceType',
    'operations',
  ];
  modals: any = {
    rows: {
      usersPermissions: new MatTableDataSource([]),
      permissions: new MatTableDataSource([]),
      tasks: new MatTableDataSource([]),
      projects: new MatTableDataSource([]),
      statments: new MatTableDataSource([]),
      online: new MatTableDataSource([]),
    },
    columns: {
      online: [
        'UserName',
        'JobName',
        'DepartmentName',
        // 'LastLoginDate',
        'GroupName',
        'BranchName',
        'operations',
      ],
      tasks: [
        'select',
        'descriptionAr',
        'statusName',
        'projectNumber',
        'settingId',
        'operations',
      ],
      projects: [
        'select',
        'projectNumber',
        'clientName',
        'projectTypeName',
        'operations',
      ],
      payments: [
        'select',
        'taskName',
        'settingNo',
        'settingNote',
        'operations',
      ],
      permissions: ['fullName', 'select', 'insert', 'update', 'delete'],
      usersPermissions: [
        'PriviLedgeName',
        'Status',
        'Insert',
        'Update',
        'Delete',
      ],
    },
  };
  data: any = {
    users: new MatTableDataSource([{}]),
    filter: {
      enable: false,
      date: null,
    },
  };

  userG: any = {};
  selectedCategory: any = 0;
  constructor(
    private api: RestApiService,
    private modalService: NgbModal,
    private _sysServicesService: SysServicesService,
    private _sharedService: SharedService,
    private toast: ToastrService,
    private translate: TranslateService,
    private adminProfileService: AdminProfileService,
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private groupPrivilegeService: GroupPrivilegeService
  ) {
    this.privilegesForm = new FormGroup({
      groupId: new FormControl(7),
      privilegeIds: new FormControl([[]]),
    }); // this.getData();
    this.userG = this.authenticationService.userGlobalObj;
    console.log(this.userG);

    api.lang.subscribe((res) => {
      this.lang = res;
    });

    this.environmenturl = environment.PhotoURL;
  }
  userformintial() {
    this.userForm = new FormGroup(
      {
        UserId: new FormControl(0),
        FullName: new FormControl('', [
          Validators.required,
          Validators.pattern('^[a-zA-Z ]+$'),
        ]),
        FullNameAr: new FormControl('', [
          Validators.required,
          Validators.pattern('^[\u0621-\u064A\u0660-\u0669 ]+$'),
        ]),
        JobId: new FormControl(null, [Validators.required]),
        TimeId: new FormControl(null, [Validators.required]),
        DepartmentId: new FormControl(null, [Validators.required]),
        Email: new FormControl('', [Validators.required, Validators.email]),
        confirmEmail: new FormControl('', [
          Validators.required,
          Validators.email,
        ]),
        Mobile: new FormControl('', [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
          Validators.pattern('^05[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]'),
        ]),
        GroupId: new FormControl(null, [Validators.required]),
        BranchId: new FormControl(null, [Validators.required]),
        EmpId: new FormControl(0),
        UserName: new FormControl('', [Validators.required]),
        Password: new FormControl(''),
        Session: new FormControl(5),
        Notes: new FormControl(''),
        SupEngineerName: new FormControl(''),
        SupEngineerCert: new FormControl(''),
        SupEngineerNationalId: new FormControl(''),
        AccStatusConfirm: new FormControl(['']),
        Status: new FormControl([1]),
        ExpireDate: new FormControl(null),
        CheckExpireDate: new FormControl(),
        BranchesList: new FormControl([]),
      },
      { validators: emailMatchValidator }
    ); // Use the custom validator at the form group level
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
  // updateUserBranches(event: any) {
  //   // Assuming 'event' is your event object
  //   const target = event.target;

  //   // Check if the target is an input element with the class 'node-checkbox'
  //   if (target && target.classList.contains('node-checkbox')) {
  //     // Get the value of the input element
  //     const value = target.value;

  //     // Now 'value' contains the value of the input element that triggered the event
  //     console.log(value);
  //   }

  //   this.userForm.get('userBranches')?.setValue(event);
  // }
  // onSave() {
  //   console.log(this.userForm.value)
  // }
  privilegesTree: any[] = [];
  transformedArray: any[] = [];
  PrivilegesTree: Groups[] = [];
  NotifPrivilegesTree: Groups[] = [];

  AccountngxTree: any;
  AccountngxTreelist: any;
  NotifAccountngxTree: any;
  NotifAccountngxTreeList: any;

  PrivList: any;
  NotPrivList: any;
  loadPrivilegesTree() {
    this.selectedTask1 = [];
    this.selectedTask2 = [];
    this._sysServicesService.getPrivilegesTree().subscribe(
      (data) => {
        // // Handle the response data here
        // this.privilegesTree = data;

        // // Create Groups and Children arrays
        // this.PrivilegesTree = [];
        // const childrenMap: { [id: string]: Children } = {};

        // // Iterate through the API data to build the groups and children
        // this.privilegesTree.forEach(item => {
        //   if (item.parent === "#") {
        //     // Create a new Group
        //     const group: Groups = {
        //       id: item.id,
        //       name: item.text, // Set the name to the "text" value
        //       parent: item.parent,
        //       children: []
        //     };

        //     this.PrivilegesTree.push(group);

        //     // Check if there are any children for this group
        //     if (childrenMap[item.id]) {
        //       group.children.push(childrenMap[item.id]);
        //     }
        //   } else {
        //     // Create a new Child
        //     const child: Children = {
        //       id: item.id,
        //       name: item.text, // Set the name to the "text" value
        //       item: {
        //         phrase: item.text, // Set the phrase to the "text" value
        //         id: item.id // Set the phrase to the "text" value
        //       }
        //     };

        //     // Store the child in the childrenMap for later association with a parent group
        //     childrenMap[item.parent] = child;

        //     // Check if the parent group already exists
        //     if (this.PrivilegesTree.some(group => group.id === item.parent)) {
        //       // If it exists, add the child to the parent's children
        //       this.PrivilegesTree.find(group => group.id === item.parent)?.children.push(child);
        //     }
        //   }
        // });

        // // console.log(this.group);
        this.PrivList = JSON.parse(JSON.stringify(data));

        this.AccountngxTreelist = data;
        this.AccountngxTreelist.forEach((element: any) => {
          element.children = [];
          element.name = this.translate.instant(element.text);
          element.item = {
            phrase: element.text,
            id: element.id,
          };
          element.selected = false;

          this.AccountngxTreelist.forEach((ele: any) => {
            if (element.id == ele.parent) {
              element.isparent = true;
              element.children.push(ele);
            }
          });
        });

        const filteraccountTree = [];
        this.AccountngxTreelist.forEach((element: any) => {
          if (element.isparent == true) {
            filteraccountTree.push(element);
          }
        });
        this.AccountngxTree = [];
        this.AccountngxTreelist.forEach((element: any) => {
          if (element.parent == '#') {
            this.AccountngxTree.push(element);
          }
        });
        if (this.AccountngxTree[6].id == '17') {
          this.AccountngxTree.splice(7, 0, this.AccountngxTree.splice(6, 1)[0]);
        }
      },
      (error) => {
        // Handle any errors here
        // console.error('Error fetching privileges tree:', error);
      }
    );
    this._sysServicesService.GetNotifPrivilegesTree().subscribe(
      (data) => {
        // // Handle the response data here
        // this.privilegesTree = data;

        // // Create Groups and Children arrays
        // this.NotifPrivilegesTree = [];
        // const childrenMap: { [id: string]: Children } = {};

        // // Iterate through the API data to build the groups and children
        // this.privilegesTree.forEach(item => {
        //   if (item.parent === "#") {
        //     // Create a new Group
        //     const group: Groups = {
        //       id: item.id,
        //       name: item.text, // Set the name to the "text" value
        //       parent: item.parent,
        //       children: []
        //     };

        //     this.NotifPrivilegesTree.push(group);

        //     // Check if there are any children for this group
        //     if (childrenMap[item.id]) {
        //       group.children.push(childrenMap[item.id]);
        //     }
        //   } else {
        //     // Create a new Child
        //     const child: Children = {
        //       id: item.id,
        //       name: item.text, // Set the name to the "text" value
        //       item: {
        //         phrase: item.text, // Set the phrase to the "text" value
        //         id: item.id // Set the phrase to the "text" value
        //       }
        //     };

        //     // Store the child in the childrenMap for later association with a parent group
        //     childrenMap[item.parent] = child;

        //     // Check if the parent group already exists
        //     if (this.NotifPrivilegesTree.some(group => group.id === item.parent)) {
        //       // If it exists, add the child to the parent's children
        //       this.NotifPrivilegesTree.find(group => group.id === item.parent)?.children.push(child);
        //     }
        //   }
        // });

        // console.log(this.group);

        this.NotPrivList = JSON.parse(JSON.stringify(data));

        this.NotifAccountngxTreeList = data;
        this.NotifAccountngxTreeList.forEach((element: any) => {
          element.children = [];
          element.name = this.translate.instant(element.text);
          element.item = {
            phrase: element.text,
            id: element.id,
          };
          element.selected = false;

          this.NotifAccountngxTreeList.forEach((ele: any) => {
            if (element.id == ele.parent) {
              element.isparent = true;
              element.children.push(ele);
            }
          });
        });

        const filteraccountTree = [];
        this.NotifAccountngxTreeList.forEach((element: any) => {
          if (element.isparent == true) {
            filteraccountTree.push(element);
          }
        });
        this.NotifAccountngxTree = [];
        this.NotifAccountngxTreeList.forEach((element: any) => {
          if (element.parent == '#') {
            this.NotifAccountngxTree.push(element);
          }
        });
      },
      (error) => {
        // Handle any errors here
        // console.error('Error fetching privileges tree:', error);
      }
    );
  }
  selectedGroup: any;
  selectTask() {
    // console.log("this.selectedGroup");
    // console.log(this.selectedGroup);

    this.selectedGroup.forEach((item: { id: number }) => {
      this.selectedIds.push(item.id);
    });
    this.privilegesForm.controls['privilegeIds'].setValue(this.selectedIds);
    // console.log(this.selectedIds);
  }
  selectedIds: number[] = [];

  onCheckboxChange(branch: any) {
    if (branch.id) {
      const foundBranch = this.selectedIds.find((id) => id === branch.id);
      if (!foundBranch) {
        this.selectedIds.push(branch.id);
      } else {
        const indexToRemove = this.selectedIds.findIndex(
          (id) => id === branch.id
        );

        if (indexToRemove !== -1) {
          // Use splice to remove the item at the found index
          this.selectedIds.splice(indexToRemove, 1);
        }
      }
    }
    this.userForm.controls['BranchesList'].setValue(this.selectedIds);

    this.selectedIds.forEach((element) => {
      this.branchOptions.forEach((branchO: any) => {
        if (branchO.id == element) {
          branchO.checked = true;
        }
      });
    });
    // console.log('Updated Branch Options:', this.selectedIds);
  }

  selectedBranchIds: number[] = [];

  logSelectedBranches(event: any, branch: any) {
    // console.log(event);
    // console.log(branch);

    this.selectedBranchIds = this.branchOptions
      .filter((branch: { selected: any }) => branch.selected)
      .map((branch: { id: any }) => branch.id);

    // console.log(this.selectedBranchIds);
  }

  @ViewChild('tabGroup') tabGroup!: MatTabGroup;

  navigateToTab(tabIndex: number): void {
    this.tabGroup.selectedIndex = tabIndex;
  }
  onSave(modal: any): void {
    debugger;
    const userFormData = new FormData();
    Object.keys(this.userForm.controls).forEach((key) => {
      const control = this.userForm.get(key);

      // Check if control exists and if it's an instance of FormControl
      if (control && control instanceof FormControl && control.value) {
        userFormData.append(key, control.value.toString());
      }
    });

    if (this.userForm.controls['Status'].value == false) {
      this.userForm.controls['Status'].setValue(0);
    } else {
      this.userForm.controls['Status'].setValue(1);
    }
    // this.userForm.controls['UserId'].setValue(this.userG.userId);
    this.userForm.controls['AccStatusConfirm'].setValue(this.userG.userName);
    this.userForm.controls['AccStatusConfirm'].setValue(this.userG.userName);

    if ( this.userForm.controls['ExpireDate'].value!=0 &&
      this.userForm.controls['ExpireDate'].value != null &&
      typeof this.userForm.controls['ExpireDate'].value != 'string'
    ) {
      var date = this._sharedService.date_TO_String(
        this.userForm.controls['ExpireDate'].value
      );
      // this.userForm.controls['ExpireDate'].setValue(date);
    }
    if (typeof this.userForm.controls['BranchId'].value != 'number') {
      this.userForm.controls['BranchId'].setValue(
        this.userForm.controls['BranchId'].value?.id
      );
    }

    if (this.userForm.controls['ExpireDate'].value == null) {
      this.userForm.controls['ExpireDate'].setValue(0);
    }
    const formData = new FormData();

    formData.append('UserId', this.userForm.controls['UserId'].value);
    formData.append('FullName', this.userForm.controls['FullName'].value);
    formData.append('FullNameAr', this.userForm.controls['FullNameAr'].value);
    formData.append('JobId', this.userForm.controls['JobId'].value);
    formData.append('TimeId', this.userForm.controls['TimeId'].value);
    formData.append(
      'DepartmentId',
      this.userForm.controls['DepartmentId'].value
    );
    formData.append('Email', this.userForm.controls['Email'].value);
    formData.append(
      'confirmEmail',
      this.userForm.controls['confirmEmail'].value
    );
    formData.append('Mobile', this.userForm.controls['Mobile'].value);
    formData.append('GroupId', this.userForm.controls['GroupId'].value);
    formData.append('BranchId', this.userForm.controls['BranchId'].value);
    formData.append('EmpId', this.userForm.controls['EmpId'].value ?? 0);
    formData.append('UserName', this.userForm.controls['UserName'].value);
    formData.append('Password', this.userForm.controls['Password'].value);
    formData.append('Session', this.userForm.controls['Session'].value);
    formData.append('Notes', this.userForm.controls['Notes'].value);
    formData.append(
      'SupEngineerName',
      this.userForm.controls['SupEngineerName'].value
    );
    formData.append(
      'SupEngineerCert',
      this.userForm.controls['SupEngineerCert'].value
    );
    formData.append(
      'SupEngineerNationalId',
      this.userForm.controls['SupEngineerNationalId'].value
    );
    formData.append(
      'AccStatusConfirm',
      this.userForm.controls['AccStatusConfirm'].value
    );
    formData.append('Status', this.userForm.controls['Status'].value);
    if (this.userForm.controls['CheckExpireDate'].value == true && this.userForm.controls['ExpireDate'].value!=0) {
      
      
      formData.append(
        'ExpireDate',this._sharedService.date_TO_String(this.userForm.controls['ExpireDate'].value)??'0');
    } else {
      formData.append('ExpireDate','0');
    }
    formData.append(
      'CheckExpireDate',
      this.userForm.controls['CheckExpireDate'].value
    );
    if (this.userForm.controls['BranchesList'].value.length > 0) {
      // formData.append('BranchesList',JSON.stringify(this.userForm.controls['BranchesList'].value) );
      for (let file of this.userForm.controls['BranchesList'].value) {
        formData.append('BranchesList[]', file);
      }
    }

    let url = document.location.href;
    var link = url.replace('controlpanel/users', 'auth/reset-password');
    formData.append('Link', link);

    this._sysServicesService.saveUser(formData).subscribe(
      (data) => {
        debugger;
        if (data.statusCode == 200) {
          debugger
          if (this.userForm.controls['ExpireDate'].value == 0) {
            this.userForm.controls['ExpireDate'].setValue(null);
          }

          this.saveUserPrivileges(data.returnedParm, this.selectedTask1);
          this.SaveUserNotifPriv(data.returnedParm, this.selectedTask2);
          this.GetAllUsers();
          this.updateNumberOfUsers();
          // this.fetchPrivilegeIdsForUser(data.returnedParm);
          // this.getNotificationPrivilegesByUserId(data.returnedParm);
          this.toast.success(
            this.translate.instant(data.reasonPhrase),
            this.translate.instant('Message')
          );
          if (this.userForm.controls['UserId'].value == 0) {
            this._sysServicesService.GetAllUsers().subscribe((response) => {
              response.result.forEach((element: any) => {
                if (data.returnedParm == element.userId) {
                  this.edituser(element);
                }
              });
            });
          }
        } else {
          debugger
          if (this.userForm.controls['ExpireDate'].value == 0) {
            this.userForm.controls['ExpireDate'].setValue(null);
          }
          this.toast.error(
            this.translate.instant(data.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      },
      (error) => {
        // console.error('Error saving user', error);
        // Handle errors, e.g., show an error message
        debugger;
        if (this.userForm.controls['ExpireDate'].value == 0) {
          this.userForm.controls['ExpireDate'].setValue(null);
        }
        this.toast.error(
          this.translate.instant(error.reasonPhrase),
          this.translate.instant('Message')
        );
      }
    );
  }
  getpriv(privilegeIds: any) {
    privilegeIds.forEach((element: any) => {
      this.PrivList.forEach((ngxTree: any) => {
        if (ngxTree.id == element.id) {
          if (ngxTree.parent != '#') {
            var found = [];
            found = privilegeIds.filter((x: any) => x.id == ngxTree.parent);
            if (found.length == 0) {
              privilegeIds.push({ id: ngxTree.parent });
              this.getpriv(privilegeIds);
            }
          }
        }
      });
    });
  }
  async saveUserPrivileges(userId: any, privilegeIds: any) {
    // Call the service method to save user privileges

    await this.getpriv(privilegeIds);

    const AccountTree: any = [];
    privilegeIds.forEach((element: any) => {
      AccountTree.push(Number(element.id));
    });

    this._sysServicesService.saveUserPrivil(userId, AccountTree).subscribe(
      (response) => {
        // Handle the successful response here
        // console.log('User privileges saved:', response);
      },
      (error) => {
        // Handle any errors here
        // console.error('Error saving user privileges:', error);
      }
    );
  }
  getnot(privilegeIds: any) {
    privilegeIds.forEach((element: any) => {
      this.NotPrivList.forEach((ngxTree: any) => {
        if (ngxTree.id == element.id) {
          if (ngxTree.parent != '#') {
            var found = [];
            found = privilegeIds.filter((x: any) => x.id == ngxTree.parent);
            if (found.length == 0) {
              privilegeIds.push({ id: ngxTree.parent });
              this.getnot(privilegeIds);
            }
          }
        }
      });
    });
  }
  async SaveUserNotifPriv(userId: any, privilegeIds: any) {
    // Call the service method to save user privileges
    await this.getnot(privilegeIds);
    const AccountTree: any = [];
    privilegeIds.forEach((element: any) => {
      AccountTree.push(Number(element.id));
    });
    this._sysServicesService.SaveUserNotifPriv(userId, AccountTree).subscribe(
      (response) => {
        // Handle the successful response here
        // console.log('User privileges saved:', response);
      },
      (error) => {
        // Handle any errors here
        // console.error('Error saving user privileges:', error);
      }
    );
  }
  notificationPrivileges: any[];
  clickItem(event: any) {
    console.log(event);
  }
  getNotificationPrivilegesByUserId(userId: any) {
    // Call the service method to fetch notification privileges by user ID
    this._sysServicesService
      .getNotificationPrivilegesByUserId(userId)
      .subscribe(
        (response) => {
          // this._sysServicesService.GetNotifPrivilegesTree().subscribe(
          //   (data) => {
          // this.NotPrivList = data
          //     this.NotifAccountngxTreeList = [];
          //     this.NotifAccountngxTreeList = data;
          //     this.NotifAccountngxTreeList.forEach((element: any) => {
          //       this.selectedTask2.forEach((Task1: any, index: any) => {
          //         if (element.id == Task1.id) {
          //           delete this.selectedTask2[index]
          //         }
          //       });
          //     });
          this.NotifAccountngxTreeList.forEach((element: any) => {
            element.children = [];
            element.name = this.translate.instant(element.text);
            element.item = {
              phrase: element.text,
              id: element.id,
            };
            element.selected = false;
            this.NotifAccountngxTreeList.forEach((ele: any) => {
              if (element.id == ele.parent) {
                element.isparent = true;
                element.children.push(ele);
              }
            });
            response.result.forEach((TreeEA: any) => {
              if (element.id == TreeEA) {
                element.expanded = true;
                element.selected = true;
                this.selectedTask2.push(element.item);
              }
            });
          });

          const filteraccountTree = [];
          this.NotifAccountngxTreeList.forEach((element: any) => {
            if (element.isparent == true) {
              filteraccountTree.push(element);
            }
          });
          this.NotifAccountngxTree = [];
          this.NotifAccountngxTreeList.forEach((element: any) => {
            if (element.parent == '#') {
              this.NotifAccountngxTree.push(element);
            }
          });
          // })
        },
        (error) => {
          // Handle any errors here
          // console.error('Error fetching notification privileges:', error);
        }
      );
  }
  // Method to fetch privilege IDs for a user
  fetchPrivilegeIdsForUser(userId: number): void {
    this._sysServicesService.getPrivilegesByUserId(userId).subscribe(
      (response) => {
        this._sysServicesService.getPrivilegesTree().subscribe((data) => {
          this.PrivList = JSON.parse(JSON.stringify(data));
          this.AccountngxTreelist = [];
          this.AccountngxTreelist = data;
          this.AccountngxTreelist.forEach((element: any) => {
            this.selectedTask1.forEach((Task1: any, index: any) => {
              if (element.id == Task1.id) {
                delete this.selectedTask1[index];
              }
            });
          });
          this.AccountngxTreelist.forEach((element: any) => {
            // this.selectedTask1.forEach((Task1: any, index: any) => {
            //   if (element.id == Task1.id) {
            //     delete this.selectedTask1[index]
            //   }
            // });
            element.children = [];
            element.name = this.translate.instant(element.text);
            element.item = {
              phrase: element.text,
              id: element.id,
            };
            element.selected = false;
            this.AccountngxTreelist.forEach((ele: any) => {
              if (element.id == ele.parent) {
                element.isparent = true;
                element.children.push(ele);
              }
            });
            response.forEach((TreeEA: any) => {
              if (element.id == TreeEA) {
                element.expanded = true;
                element.selected = true;
                // this.selectedTask1.forEach((Task1: any) => {
                //   if (element.id == Task1.id) {
                //   } else {
                this.selectedTask1.push(element.item);
                //   }
                // });
              }
            });
          });

          const filteraccountTree = [];
          this.AccountngxTreelist.forEach((element: any) => {
            if (element.isparent == true) {
              filteraccountTree.push(element);
            }
          });
          this.AccountngxTree = [];
          this.AccountngxTreelist.forEach((element: any) => {
            if (element.parent == '#') {
              this.AccountngxTree.push(element);
            }
          });
          if (this.AccountngxTree[6].id == '17') {
            this.AccountngxTree.splice(
              7,
              0,
              this.AccountngxTree.splice(6, 1)[0]
            );
          }
        });
      },
      (error) => {}
    );
  }

  getPrivilegesGroup() {
    this.groupPrivilegeService
      .getPrivilegesIdsByGroupId(this.userForm.controls['GroupId'].value)
      .subscribe(
        (response) => {
          // this.group.forEach((TreeEA: any) => {
          //   if (response == TreeEA.id) {
          //     TreeEA.expanded = true
          //     TreeEA.selected = true
          //     this.selectedTask1.push(TreeEA.item)
          //   }
          // });
          this.groupPrivilegeService.getPrivilegesTree().subscribe((data) => {
            // data.push(
            //   {id: "150103333553333",parent: "15",text: "المتابعة المشاريع"},
            //   {id: "1501033333333",parent: "15",text: "المتابعة المالية"},
            //   {id: "1501055555555",parent: "15",text: "المتابعة الادارية"},
            //   {id: "1501088888888",parent: "15",text: "المتابعةالاداء"},
            //   )
            this.AccountngxTreelist = [];
            this.AccountngxTreelist = data;
            this.AccountngxTreelist.forEach((element: any) => {
              this.selectedTask1.forEach((Task1: any, index: any) => {
                if (element.id == Task1.id) {
                  delete this.selectedTask1[index];
                }
              });
            });
            this.AccountngxTreelist.forEach((element: any) => {
              element.children = [];
              // if(element.id == 15011){
              //   element.text = " "
              // }
              if (element.text != null) {
                element.name = this.translate.instant(element.text);
              }
              element.item = {
                phrase: element.text,
                id: element.id,
              };
              element.selected = false;
              this.AccountngxTreelist.forEach((ele: any) => {
                if (element.id == ele.parent) {
                  element.isparent = true;
                  element.children.push(ele);
                }
              });
              response.forEach((TreeEA: any) => {
                if (element.id == TreeEA) {
                  element.expanded = true;
                  element.selected = true;
                  this.selectedTask1.push(element.item);
                }
              });
            });

            const filteraccountTree = [];
            this.AccountngxTreelist.forEach((element: any) => {
              if (element.isparent == true) {
                filteraccountTree.push(element);
              }
            });
            this.AccountngxTree = [];
            this.AccountngxTreelist.forEach((element: any) => {
              if (element.parent == '#') {
                this.AccountngxTree.push(element);
              }
            });
            if (this.AccountngxTree[6].id == '17') {
              this.AccountngxTree.splice(
                7,
                0,
                this.AccountngxTree.splice(6, 1)[0]
              );
            }
          });
        },
        (error) => {
          // Handle API error here
          console.error('API error:', error);
        }
      );
  }
  getAllUsers() {
    this._sysServicesService.getAllUsers().subscribe(
      (response) => {
        // Handle the successful response here
        this.users = response;
      },
      (error) => {
        // Handle any errors here
        // console.error('Error fetching users:', error);
      }
    );
  }

  allLicences: any = [];
  GetAllLicences() {
    this._sysServicesService.GetAllLicences().subscribe((data) => {
      // console.log(data.result);
      this.allLicences = data.result;
      this.getlicencetype();
    });
  }
  Categorylicence = [
    { id: 1, name: 'A' },
    { id: 2, name: 'B' },
    { id: 3, name: 'C' },
    { id: 4, name: 'D' },
  ];

  licenceformintial() {
    this.licenceForm = new FormGroup({
      Email: new FormControl(''),
      Email2: new FormControl(''),
      Email3: new FormControl(''),
      Hosting_Expiry_Date: new FormControl(''),
      LicenceContractNo: new FormControl(''),
      LicenceId: new FormControl(''),
      Mobile: new FormControl(''),
      NoOfUsers: new FormControl(''),
      Support_Start_Date: new FormControl(''),
      Support_Expiry_Date: new FormControl(''),
      Type: new FormControl(''),

      DBName: new FormControl(''),
      CustomerName: new FormControl(''),
      DomaniName: new FormControl(''),
      IPAddress: new FormControl(''),
      Subscrip_Domain: new FormControl(false),
      Subscrip_Hosting: new FormControl(false),
    });
  }
  isconnected: any = false;
  editeLicence(licence: any) {
    debugger;
    this.licenceForm.controls['Email'].setValue(licence.email);
    this.licenceForm.controls['Email2'].setValue(licence.email2);
    this.licenceForm.controls['Email3'].setValue(licence.email3);
    this.licenceForm.controls['Hosting_Expiry_Date'].setValue(
      new Date(licence.hosting_Expiry_Date)
    );
    this.licenceForm.controls['LicenceContractNo'].setValue(
      licence.licenceContractNo
    );
    this.licenceForm.controls['LicenceId'].setValue(licence.licenceId);
    this.licenceForm.controls['Mobile'].setValue(licence.mobile);
    this.licenceForm.controls['NoOfUsers'].setValue(licence.noOfUsers);
    this.licenceForm.controls['Support_Start_Date'].setValue(
      new Date(licence.support_Start_Date)
    );
    this.licenceForm.controls['Support_Expiry_Date'].setValue(
      new Date(licence.support_Expiry_Date)
    );
    this.licenceForm.controls['Type'].setValue(licence.type);

    this.licenceForm.controls['DBName'].setValue(licence.dbName);
    this.licenceForm.controls['CustomerName'].setValue(licence.customerName);
    this.licenceForm.controls['DomaniName'].setValue(licence.domaniName);
    this.licenceForm.controls['IPAddress'].setValue(licence.ipAddress);

    this.licenceForm.controls['Subscrip_Domain'].setValue(
      licence.subscrip_Domain
    );
    this.licenceForm.controls['Subscrip_Hosting'].setValue(
      licence.subscrip_Hosting
    );

    if (licence.g_UID != null && licence.g_UID != '') {
      this.isconnected = true;
    } else {
      this.isconnected = false;
    }
  }
  SaveLicence(modal: any) {
    const prames = {
      Email: this.licenceForm.controls['Email'].value,
      Email2: this.licenceForm.controls['Email2'].value,
      Email3: this.licenceForm.controls['Email3'].value,
      Hosting_Expiry_Date: this._sharedService.date_TO_String(
        this.licenceForm.controls['Hosting_Expiry_Date'].value
      ),
      LicenceContractNo: this.licenceForm.controls['LicenceContractNo'].value,
      LicenceId: this.licenceForm.controls['LicenceId'].value,
      Mobile: this.licenceForm.controls['Mobile'].value,
      NoOfUsers: this.licenceForm.controls['NoOfUsers'].value,
      Support_Start_Date: this._sharedService.date_TO_String(
        this.licenceForm.controls['Support_Start_Date'].value
      ),
      Support_Expiry_Date: this._sharedService.date_TO_String(
        this.licenceForm.controls['Support_Expiry_Date'].value
      ),
      Type: this.licenceForm.controls['Type'].value,
      Subscrip_Domain: this.licenceForm.controls['Subscrip_Domain'].value,
      Subscrip_Hosting: this.licenceForm.controls['Subscrip_Hosting'].value,
    };
    this._sysServicesService.SaveLicence(prames).subscribe(
      (data) => {
        this.GetAllLicences();
        this.updateNumberOfUsers();
        modal.dismiss();
        if (this.isconnected == true) {
          this.SaveLabaikLicences(modal);
        }
        this.toast.success(
          this.translate.instant(data.reasonPhrase),
          this.translate.instant('Message')
        );
      },
      (error) => {
        this.toast.error(
          this.translate.instant(error.reasonPhrase),
          this.translate.instant('Message')
        );
      }
    );
  }

  SaveLabaikLicences(modal: any) {
    debugger;
    const prames = {
      Email: this.licenceForm.controls['Email'].value,
      Email2: this.licenceForm.controls['Email2'].value,
      Email3: this.licenceForm.controls['Email3'].value,
      Hosting_Expiry_Date: this._sharedService.date_TO_String(
        this.licenceForm.controls['Hosting_Expiry_Date'].value
      ),
      LicenceContractNo: this.licenceForm.controls['LicenceContractNo'].value,
      LicenceId: this.licenceForm.controls['LicenceId'].value,
      Mobile: this.licenceForm.controls['Mobile'].value,
      NoOfUsers: this.licenceForm.controls['NoOfUsers'].value,
      Support_Start_Date: this._sharedService.date_TO_String(
        this.licenceForm.controls['Support_Start_Date'].value
      ),
      Support_Expiry_Date: this._sharedService.date_TO_String(
        this.licenceForm.controls['Support_Expiry_Date'].value
      ),
      Type: this.licenceForm.controls['Type'].value,
      Subscrip_Domain: this.licenceForm.controls['Subscrip_Domain'].value,
      Subscrip_Hosting: this.licenceForm.controls['Subscrip_Hosting'].value,
    };
    this._sysServicesService.SaveLabaikLicences(prames).subscribe(
      (data) => {
        this.GetAllLicences();
        this.updateNumberOfUsers();
        modal.dismiss();
        this.toast.success(
          this.translate.instant(data.reasonPhrase),
          this.translate.instant('Message')
        );
      },
      (error) => {
        this.toast.error(
          this.translate.instant(error.reasonPhrase),
          this.translate.instant('Message')
        );
      }
    );
  }

  checkdate() {
    if (new Date() > new Date(this.allLicences[0]?.support_Expiry_Date)) {
      return true;
    } else {
      return false;
    }
  }
  licencetype: any;
  getlicencetype() {
    this.Categorylicence.forEach((element: any) => {
      if (element.id == this.allLicences[0]?.type) {
        this.licencetype = element.name;
      }
    });
  }
  ProjectPhasesTasks: any;
  getAllProjectPhasesTasksUPage() {
    const userId = 0;

    this._sysServicesService.getAllProjectPhasesTasksUPage(userId).subscribe(
      (data) => {
        this.TasksUserIdPrivilege = data;
        console.log(data);
        this.modals.rows.tasks = new MatTableDataSource(data);
        this.modals.rows.tasks.paginator = this.taskstablepaginator;
        this.modals.rows.tasks.sort = this.taskstable;
        // Handle the API response data here
        // console.log(data);
      },
      (error) => {
        // Handle any API errors here
        // console.error(error);
      }
    );
  }
  forwardProjectselectedTasksUserId: any = null;
  PhasesTaskId: any = null;
  saveforwardProjectselected(modal: any) {
    debugger;
    if (this.listforwardProjectTasksUserId == true) {
      this._sysServicesService
        .ConvertMoreUserTasks(
          this.selectedTasksUserId,
          this.forwardProjectselectedTasksUserId,
          this.PhasesTaskId
        )
        .subscribe((result: any) => {
          if (result.statusCode == 200) {
            this.toast.success(
              this.translate.instant(result.reasonPhrase),
              this.translate.instant('Message')
            );
            this.selection.tasks.clear();
            this.PhasesTaskId = null;
            this.forwardProjectselectedTasksUserId = null;
            this.listforwardProjectTasksUserId = false;
            this.onSelectTasksUserId();
            modal.dismiss();
          } else {
            this.toast.error(
              this.translate.instant(result.reasonPhrase),
              this.translate.instant('Message')
            );
          }
        });
    } else {
      this._sysServicesService
        .ConvertUserTasksSome(
          this.PhasesTaskId,
          this.selectedTasksUserId,
          this.forwardProjectselectedTasksUserId
        )
        .subscribe((result: any) => {
          if (result.statusCode == 200) {
            this.toast.success(
              this.translate.instant(result.reasonPhrase),
              this.translate.instant('Message')
            );
            this.selection.tasks.clear();
            this.PhasesTaskId = null;
            this.forwardProjectselectedTasksUserId = null;
            this.listforwardProjectTasksUserId = false;
            this.onSelectTasksUserId();
            modal.dismiss();
          } else {
            this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
          }
        });
    }
  }
  forwardSettingsSomeId: any = null;
  settingId: any = null;
  ConvertUserSettingsSome(modal: any) {
    if (this.listforwardstatment == true) {
      this._sysServicesService
        .ConvertMoreUserSettings(
          this.selectedstatementsTable,
          this.forwardSettingsSomeId,
          this.SettingIdsList
        )
        .subscribe((result: any) => {
          if (result.statusCode == 200) {
            this.toast.success(
              this.translate.instant(result.reasonPhrase),
              this.translate.instant('Message')
            );
            this.selection.settingIds.clear();
            this.SettingIdsList = [];
            this.settingId = null;
            this.forwardSettingsSomeId = null;
            this.listforwardstatment = false;
            this.onSelectstatementsTable();
            modal.dismiss();
          } else {
            this.toast.error(
              this.translate.instant(result.reasonPhrase),
              this.translate.instant('Message')
            );
          }
        });
    } else {
      const formData = new FormData();
      formData.append('SettingId', this.settingId.toString());
      formData.append('FromUserId', this.UserSelectRow.toString());
      formData.append('ToUserId', this.forwardSettingsSomeId.toString());

      this._sysServicesService
        .ConvertUserSettingsSome(formData)
        .subscribe((result: any) => {
          if (result.statusCode == 200) {
            this.toast.success(
              this.translate.instant(result.reasonPhrase),
              this.translate.instant('Message')
            );
            this.selection.settingIds.clear();
            this.SettingIdsList = [];
            this.settingId = null;
            this.forwardSettingsSomeId = null;
            this.listforwardstatment = false;
            this.onSelectstatementsTable();
            modal.dismiss();
          } else {
            this.toast.error(
              this.translate.instant(result.reasonPhrase),
              this.translate.instant('Message')
            );
          }
        });
    }
  }

  DeleteProjectPhasesTasks() {
    const formData = new FormData();
    formData.append('PhasesTaskId', this.PhasesTaskId.toString());

    this._sysServicesService.DeleteProjectPhasesTasks(formData).subscribe(
      (data) => {
        this.PhasesTaskId = null;
        this.toast.success(data.reasonPhrase, 'رسالة');
      },
      (error) => {
        this.toast.error(error.reasonPhrase, 'رسالة');
      }
    );
  }

  branchOptions: any = [];
  FillBranchSelect() {
    this._sysServicesService.FillBranchSelect().subscribe(
      (data) => {
        // Assign the API response to the branchOptions property
        // console.log(data);

        this.branchOptions = data; // Replace with the actual property name
        this.nodeItems = data;
      },
      (error) => {
        // Handle any errors here
        // console.error(error);
      }
    );
  }

  departmentOptions: any[] = [];

  getDepartments(param: number): void {
    this._sysServicesService.getDepartments(param).subscribe(
      (data) => {
        this.departmentOptions = data;
        // console.log('Departments:', this.departmentOptions);
        // Handle the data or perform operations as needed
      },
      (error) => {
        // console.error('Error fetching departments', error);
        // Handle errors
      }
    );
  }
  fillUsersSelectShow: any[] = [];
  searchValue: string = '';
  filteredOptions: any[] = [];
  selectedUserId: any;
  fillUsersSelect() {
    this._sysServicesService.FillUsersSelect().subscribe((data) => {
      this.fillUsersSelectShow = data;
      this.filteredOptions = data;
    });
  }
  onSearchChange() {
    this.filteredOptions = this.fillUsersSelectShow.filter((item) =>
      item.name.toLowerCase().includes(this.searchValue.toLowerCase())
    );
  }

  uersByPrivilege: any;

  fetchUsersByPrivilege() {
    const privilegeId = 1; // Replace with the actual privilege ID
    const _ = 1; // Replace with any parameter needed

    this._sysServicesService.fetchPrivilegeReport(privilegeId).subscribe(
      (reportData: any) => {
        // Process the privilege report data here
        this.uersByPrivilege = reportData;

        this.modals.rows.usersPermissions = new MatTableDataSource(reportData);
        this.modals.rows.usersPermissions.paginator = this.paginator;
        this.modals.rows.usersPermissions.sort = this.sort;

        this.selectAllForDropdownItems(reportData);
      },
      (error) => {
        // Handle error if needed
        // console.error(error);
      }
    );
  }
  selectedTasksUserId: any;
  TasksUserIdPrivilege: any;
  onSelectTasksUserId() {
    this.selection.tasks.clear();

    if (this.selectedTasksUserId) {
      this._sysServicesService
        .getAllProjectPhasesTasksUPage(this.selectedTasksUserId)
        .subscribe(
          (reportData: any) => {
            // Process the privilege report data here
            this.TasksUserIdPrivilege = reportData;
            console.log(reportData);

            this.modals.rows.tasks = new MatTableDataSource(reportData);
            this.modals.rows.tasks.paginator = this.taskstablepaginator;
            this.modals.rows.tasks.sort = this.taskstable;

            this.selectAllForDropdownItems(reportData);
          },
          (error) => {
            // Handle error if needed
            // console.error(error);
          }
        );
    }
  }


  selectedstatementsTable: any;
  statementsTableList: any;
  onSelectstatementsTable() {
    this.selection.settingIds.clear();
    if (this.selectedstatementsTable) {
      this._sysServicesService
        .GetSetting_Statment(this.selectedstatementsTable)
        .subscribe(
          (reportData: any) => {
            // Process the privilege report data here
            this.statementsTableList = reportData;
            console.log(reportData);
            this.modals.rows.statments = new MatTableDataSource(reportData);
            this.modals.rows.statments.paginator = this.projectsTablepag;
            this.modals.rows.statments.sort = this.projectsTable;

            this.selectAllForDropdownItems(reportData);
          },
          (error) => {
            // Handle error if needed
            // console.error(error);
          }
        );
    }
  }

  jobOptions: any[] = [];
  getJobs(): void {
    this._sysServicesService.fillJobSelect().subscribe(
      (data) => {
        // Assign the API response to the jobOptions property
        this.jobOptions = data; // Replace with the actual property name
      },
      (error) => {
        // Handle any errors here
        // console.error(error);
      }
    );
  }
  groupOptions: any[] = [];
  getGroups(): void {
    this._sysServicesService.FillGroupsSelect().subscribe(
      (data) => {
        // Assign the API response to the jobOptions property
        this.groupOptions = data; // Replace with the actual property name
      },
      (error) => {
        // Handle any errors here
        // console.error(error);
      }
    );
  }
  deleteJob(jobId: number): void {
    this._sysServicesService.deleteJob(jobId).subscribe(
      (response) => {
        // console.log('Job deleted successfully', response);
        // Handle any success logic here
      },
      (error) => {
        // console.error('Error deleting job', error);
        // Handle any error logic here
      }
    );
  }

  attendanceTimeOptions: any[] = [];
  getattendanceTime(): void {
    this._sysServicesService.FillAttendanceTimeSelect().subscribe(
      (data) => {
        // Assign the API response to the jobOptions property
        this.attendanceTimeOptions = data; // Replace with the actual property name
      },
      (error) => {
        // Handle any errors here
        // console.error(error);
      }
    );
  }
  onSelectOption() {
    if (this.selectedUserId) {
      this._sysServicesService
        .fetchPrivilegeReport(this.selectedUserId)
        .subscribe(
          (reportData: any) => {
            // Process the privilege report data here
            this.uersByPrivilege = reportData;

            this.modals.rows.usersPermissions = new MatTableDataSource(
              reportData
            );
            this.modals.rows.usersPermissions.paginator = this.Permissionspag;
            this.modals.rows.usersPermissions.sort = this.Permissionstable;

            this.selectAllForDropdownItems(reportData);
          },
          (error) => {
            // Handle error if needed
            // console.error(error);
          }
        );
    }
  }
  selectedBranchId: any;
  onSelectBranch() {
    // console.log(this.userForm.get('BranchId')?.value);
    // console.log(this.userForm.value);
    this.selectedBranchId = this.userForm.get('BranchId')?.value;
    // console.log(this.selectedBranchId);

    const indexToRemove = this.selectedIds.findIndex(
      (id) => id === this.selectedBranchId
    );

    if (indexToRemove !== -1) {
      // Use splice to remove the item at the found index
      this.selectedIds.splice(indexToRemove, 1);
    }

    this.branchOptions.forEach((branchO: any) => {
      if (this.selectedBranchId == branchO.id) {
        branchO.checked = false;
      }
    });
  }

  getBranchAccount(BranchId: any) {
    debugger;
    this.selectedBranchId = BranchId;
  }
  allUsers: any;

  GetAllUsers() {
    this._sysServicesService.GetAllUsers().subscribe((data) => {
      // console.log(data);
      this.allUsers = data.result;
      this.data.users = new MatTableDataSource(data.result);
      this.data.users.paginator = this.paginator;
      this.data.users.sort = this.sort;

      this.selectAllForDropdownItems(data.result);
    });
  }
  deleteUsers(userId: number) {
    this._sysServicesService.deleteUsers(userId).subscribe(
      (data) => {
        // console.log('Users deleted successfully', data);
        // Perform any additional actions on successful deletion
      },
      (error) => {
        // console.error('Error deleting users', error);
        // Handle the error appropriately
      }
    );
  }

  options = {
    mode: TreeMode.MultiSelect,
    checkboxes: true,
    alwaysEmitSelected: false,
  };
  selectedTask1: any;
  selectedTask2: any;
  nodeItems: any[] = [];
  getData() {
    this.api.get('../../../../../../assets/cpanel.json').subscribe({
      next: (data: any) => {
        // assign data to table
        // this.data.users = new MatTableDataSource(data.users);
        // this.data.users.paginator = this.paginator;
        // this.data.users.sort = this.sort;

        this.selectAllForDropdownItems(data.users);

        // assign tasks data to table

        // this.modals.rows.tasks = new MatTableDataSource(data.tasks);
        // this.modals.rows.tasks.paginator = this.taskstablepaginator;
        // this.modals.rows.tasks.sort = this.taskstable;
        // // assign projects data to table
        // this.modals.rows.projects = new MatTableDataSource(data.projects);
        // this.modals.rows.projects.paginator = this.paginator;
        // this.modals.rows.projects.sort = this.sort;
        // // assign statements data to table
        // this.modals.rows.statments = new MatTableDataSource(data.statments);
        // this.modals.rows.statments.paginator = this.statementsTablepag;
        // this.modals.rows.statments.sort = this.statementsTable;
        // assign online data to table
        // this.modals.rows.online = new MatTableDataSource(data.users);
        // this.modals.rows.online.paginator = this.onlinedatapaginator;
        // this.modals.rows.online.sort = this.onlinedata;

        // assign permissions data to table
        // this.modals.rows.permissions = new MatTableDataSource(data.permissions);
        // this.modals.rows.permissions.paginator = this.Permissionspag;
        // this.modals.rows.permissions.sort = this.Permissionstable;
        // assign usersPermissions data to table
        // this.modals.rows.usersPermissions = new MatTableDataSource(
        //   data.usersPermissions
        // );
        // this.modals.rows.usersPermissions.paginator = this.userPermissionspag;
        // this.modals.rows.usersPermissions.sort = this.userPermissionstable;

        // this.nodeItems = data.tree;
      },
      error: (error) => {
        // console.log(error);
      },
    });
  }
  GetAllOnlineUsers() {
    this._sysServicesService.GetAllOnlineUsers().subscribe((data) => {
      this.modals.rows.online = new MatTableDataSource(data.result);
      this.modals.rows.online.paginator = this.onlinedatapaginator;
      this.modals.rows.online.sort = this.onlinedata;

      // console.log(currentUser);
      this.UserSelectIdFilter = data.result;
    });
  }

  applyusersPermissionsFilter(event: any) {
    const val = event.target.value.toLowerCase();
    var tempsource = this.uersByPrivilege;
    if (val) {
      tempsource = this.uersByPrivilege.filter((d: any) => {
        return (
          d.priviLedgeName &&
          d.priviLedgeName?.trim().toLowerCase().indexOf(val) !== -1
        );
      });
    }

    this.modals.rows.usersPermissions = new MatTableDataSource(tempsource);
    this.modals.rows.usersPermissions.paginator = this.paginator;
    this.modals.rows.usersPermissions.sort = this.sort;
  }
  applyFilter(event: any) {
    const val = event.target.value.toLowerCase();
    var tempsource = this.allUsers;
    if (val) {
      tempsource = this.allUsers.filter((d: any) => {
        return (
          (d.fullName &&
            d.fullName?.trim().toLowerCase().indexOf(val) !== -1) ||
          (d.jobName && d.jobName?.trim().toLowerCase().indexOf(val) !== -1) ||
          (d.departmentName &&
            d.departmentName?.trim().toLowerCase().indexOf(val) !== -1) ||
          (d.groupName &&
            d.groupName?.trim().toLowerCase().indexOf(val) !== -1) ||
          (d.branchName &&
            d.branchName?.trim().toLowerCase().indexOf(val) !== -1) ||
          // || (d.status && d.status?.trim().toLowerCase().indexOf(val) !== -1)
          (d.lastLoginDate &&
            d.lastLoginDate?.trim().toLowerCase().indexOf(val) !== -1) ||
          (d.email && d.email?.trim().toLowerCase().indexOf(val) !== -1) ||
          (d.userName &&
            d.userName?.trim().toLowerCase().indexOf(val) !== -1) ||
          (d.fullNameEn &&
            d.fullNameEn?.trim().toLowerCase().indexOf(val) !== -1) ||
          (d.fullNameAr &&
            d.fullNameAr?.trim().toLowerCase().indexOf(val) !== -1)
        );
      });
    }
    // console.log(this.data.users);

    this.data.users = new MatTableDataSource(tempsource);
    this.data.users.paginator = this.paginator;
    this.data.users.sort = this.sort;
  }
  applyFilterTasksUserId(event: any) {
    const val = event.target.value.toLowerCase();
    const tempsource = this.TasksUserIdPrivilege.filter(function (d: any) {
      return (
        d.descriptionAr.toString()?.trim().toLowerCase().indexOf(val) !== -1 ||
        !val ||
        d.projectNumber.toString()?.trim().toLowerCase().indexOf(val) !== -1 ||
        !val
      );
    });

    this.modals.rows.tasks = new MatTableDataSource(tempsource);
    this.modals.rows.tasks.paginator = this.paginator;
    this.modals.rows.tasks.sort = this.sort;
  }

  applyFilterstatementsTableList(event: any) {
    const val = event.target.value.toLowerCase();
    this.statementsTableList.forEach((element: any) => {
      if (element.settingNote == null) {
        element.settingNote = '';
      }
    });
    const tempsource = this.statementsTableList.filter(function (d: any) {
      return (
        d.taskName.toString()?.trim().toLowerCase().indexOf(val) !== -1 ||
        !val ||
        d.settingNo.toString()?.trim().toLowerCase().indexOf(val) !== -1 ||
        !val ||
        d.settingNote.toString()?.trim().toLowerCase().indexOf(val) !== -1 ||
        !val
      );
    });
    this.modals.rows.statments = new MatTableDataSource(tempsource);
    this.modals.rows.statments.paginator = this.paginator;
    this.modals.rows.statments.sort = this.sort;
  }

  selectedFillPrivId: any;
  filteredFillPrivList: any;
  GetFillPriv() {
    this._sysServicesService.GetFillPriv().subscribe((data) => {
      data.forEach((element: any) => {
        if (element.name != null) {
          element.name = this.translate.instant(element.name);
        }
      });
      this.filteredFillPrivList = data;
    });
  }

  groupListTable: any;
  getgroupListTable() {
    this._sysServicesService.GetAllGroups_S().subscribe(
      (data) => {
        this.groupListTable = data.result;
      },
      (error) => {
        // Handle any errors here
        // console.error(error);
      }
    );
  }
  GroupId: any = '0';
  GroupsnameAr: any;
  GroupsnameEn: any;
  SaveGroups() {
    if (this.GroupsnameAr != null && this.GroupsnameEn != null) {
      const prames = {
        GroupId: this.GroupId.toString(),
        NameAr: this.GroupsnameAr,
        NameEn: this.GroupsnameEn,
      };
      this._sysServicesService.SaveGroups(prames).subscribe(
        (data) => {
          this.GroupsnameAr = null;
          this.GroupsnameEn = null;
          this.GroupId = '0';
          this.getGroups();
          this.getgroupListTable();
          this.toast.success(data.reasonPhrase, 'رسالة');
        },
        (error) => {
          this.toast.error(error.reasonPhrase, 'رسالة');
        }
      );
    }
  }
  updateGroups(group: any) {
    this.GroupId = group.groupId;
    this.GroupsnameAr = group.nameAr;
    this.GroupsnameEn = group.nameEn;
  }

  DeleteGroups(groupId: any) {
    this._sysServicesService.DeleteGroups(groupId).subscribe(
      (data) => {
        if (data.statusCode == 200) {
          this.toast.success(data.reasonPhrase, 'رسالة');
          this.getGroups();
          this.getgroupListTable();
        }
      },
      (error) => {
        this.toast.error(error.reasonPhrase, 'رسالة');
      }
    );
  }

  branchlist: any;
  GetAllDepartmentbyType() {
    this._sysServicesService.GetAllDepartmentbyType().subscribe(
      (data) => {
        this.branchlist = data.result;
      },
      (error) => {
        // Handle any errors here
        // console.error(error);
      }
    );
  }
  DepartmentId: any = '0';
  departmentNameAr: any;
  departmentNameEn: any;
  Savebranch() {
    if (this.departmentNameAr != null && this.departmentNameEn != null) {
      const prames = {
        DepartmentId: this.DepartmentId.toString(),
        DepartmentNameAr: this.departmentNameAr,
        DepartmentNameEn: this.departmentNameEn,
        Type: 1,
      };
      this._sysServicesService.SaveDepartment(prames).subscribe(
        (data) => {
          this.departmentNameAr = null;
          this.departmentNameEn = null;
          this.DepartmentId = '0';
          this.getDepartments(1);
          this.GetAllDepartmentbyType();
          this.toast.success(data.reasonPhrase, 'رسالة');
        },
        (error) => {
          this.toast.error(error.reasonPhrase, 'رسالة');
        }
      );
    }
  }
  updatebranch(group: any) {
    this.DepartmentId = group.departmentId;
    this.departmentNameAr = group.nameAr;
    this.departmentNameEn = group.nameEn;
  }

  Deletebranch(DepartmentId: any) {
    this._sysServicesService.DeleteDepartment(DepartmentId).subscribe(
      (data) => {
        if (data.statusCode == 200) {
          this.toast.success(data.reasonPhrase, 'رسالة');
          this.getDepartments(1);
          this.GetAllDepartmentbyType();
        }
      },
      (error) => {
        this.toast.error(error.reasonPhrase, 'رسالة');
      }
    );
  }

  jobOptionsList: any;
  GetAllJobs() {
    this._sysServicesService.GetAllJobs2().subscribe(
      (data) => {
        this.jobOptionsList = data.result;
      },
      (error) => {
        // Handle any errors here
        // console.error(error);
      }
    );
  }
  jobId: any = '0';
  JobNameAr: any;
  JobNameEn: any;
  Savejob() {
    if (this.JobNameAr != null && this.JobNameEn != null) {
      this._sysServicesService.GetMaxOrderNumber().subscribe(
        (data) => {
          const prames = {
            JobId: this.jobId.toString(),
            JobNameAr: this.JobNameAr,
            JobNameEn: this.JobNameEn,
            JobCode: data.result.toString(),
          };
          this._sysServicesService.SaveJob(prames).subscribe(
            (data) => {
              this.JobNameAr = null;
              this.JobNameEn = null;
              this.jobId = '0';
              this.getJobs();
              this.GetAllJobs();
              this.toast.success(
                this.translate.instant(data.reasonPhrase),
                this.translate.instant('Message')
              );
            },
            (error) => {
              this.toast.error(
                this.translate.instant(error.reasonPhrase),
                this.translate.instant('Message')
              );
            }
          );
        },
        (error) => {
          // Handle any errors here
          // console.error(error);
        }
      );
    }
  }
  updatejob(job: any) {
    this.jobId = job.jobId;
    this.JobNameAr = job.jobNameAr;
    this.JobNameEn = job.jobNameEn;
  }

  Deletejobs(jobId: any) {
    this._sysServicesService.DeleteJob(jobId).subscribe(
      (data) => {
        if (data.statusCode == 200) {
          this.toast.success(data.reasonPhrase, 'رسالة');
          this.getJobs();
          this.GetAllJobs();
        }
      },
      (error) => {
        this.toast.error(error.reasonPhrase, 'رسالة');
      }
    );
  }
  CheckStatus(event: any) {
    if (event.checked == false) {
      //this.userForm.controls['CheckExpireDate'].setValue(true);
      //this.userForm.controls['ExpireDate'].enable();
    } else {
      //this.userForm.controls['ExpireDate'].disable();
      //this.userForm.controls['CheckExpireDate'].setValue(false);
    }
  }
  CheckExpireD(event: any) {
    if (event.checked == false) {
      this.userForm.controls['ExpireDate'].disable();
            this.userForm.controls['ExpireDate'].setValue('');

      //this.userForm.controls['Status'].setValue(true);
    } else {
      this.userForm.controls['ExpireDate'].enable();
      //this.userForm.controls['Status'].setValue(false);
    }
  }

  getCopy(val: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.userForm.controls['FullName'].setValue(
      this.userForm.controls['FullNameAr'].value
    );
  }
  datamod: any = {};
  compareBranches(branch1: any, branch2: any): boolean {
    // Implement your comparison logic here
    return branch1 && branch2 ? branch1.id === branch2.id : branch1 === branch2;
  }
  listforwardstatment: boolean = false;
  listforwardProjectTasksUserId: boolean = false;
  listforwardProjectprojectNo: boolean = false;
  DeviceId: any = 0;
  DeviceType: any;
  DeleteDeviceId() {
    this._sysServicesService
      .DeleteDeviceId(this.userForm.controls['UserId'].value)
      .subscribe((data) => {
        if (data.statusCode == 200) {
          this.DeviceId = 0;
          this.toast.success(
            this.translate.instant(data.reasonPhrase),
            this.translate.instant('Message')
          );
        } else {
          this.toast.error(
            this.translate.instant(data.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }
  fullNameuser: any;
  adduser: boolean = true;
  edituser(data: any) {
    this.branchOptions.forEach((branchO: any) => {
      branchO.checked = false;
    });
    this.selectedBranchId = null;
    this.selectedIds = [];
    this.adduser = false;
    this.GetBranchesByUserId(data.userId);
    if (data.userId != null && data.addUsers != null) {
      this.adminProfileService.getUserById(data.addUsers).subscribe((data) => {
        this.logoUrl = data.result.imgUrl;
        this.fullNameuser = data.result.fullName;
      });
    }
    this.datamod = data;
    if (data.deviceType == 1) {
      this.DeviceType = 'اندرويد';
    } else if (data.deviceType == 2) {
      this.DeviceType = 'ايفون';
    }
    this.DeviceId = data.deviceId;
    this.userformintial();
    this.selectedBranchId = data.branchId;
    // console.log(this.datamod);
    this.userForm.controls['UserId'].setValue(data.userId);
    this.userForm.controls['FullNameAr'].setValue(data.fullNameAr);
    this.userForm.controls['FullName'].setValue(data.fullNameEn);
    this.userForm.controls['JobId'].setValue(data.jobId);
    // this.userForm.get('JobId')?.setValue(1);

    this.userForm.controls['TimeId'].setValue(data.timeId);
    this.userForm.controls['DepartmentId'].setValue(data.departmentId);
    this.userForm.controls['Email'].setValue(data.email);
    this.userForm.controls['confirmEmail'].setValue(data.email);
    this.userForm.controls['GroupId'].setValue(data.groupId);
    this.userForm.controls['BranchId'].setValue(data.branchId);
    // this.userForm.controls['BranchId'].setValue({ id: data.branchId, name: data.branchName });

    this.userForm.controls['EmpId'].setValue(data.empId);
    this.userForm.controls['Mobile'].setValue(data.mobile);
    this.userForm.controls['UserName'].setValue(data.userName);
    this.userForm.controls['Password'].setValue(data.password);
    this.userForm.get('Session')?.setValue(5);
    this.userForm.controls['Notes'].setValue(data.notes);
    this.userForm.controls['SupEngineerName'].setValue(
      data.supEngineerName == 'null' ? '' : data.supEngineerName
    );
    this.userForm.controls['SupEngineerCert'].setValue(
      data.supEngineerCert == 'null' ? '' : data.supEngineerCert
    );
    this.userForm.controls['SupEngineerNationalId'].setValue(
      data.supEngineerNationalId == 'null' ? '' : data.supEngineerNationalId
    );
    this.userForm.controls['AccStatusConfirm'].setValue(data.accStatusConfirm);
    this.userForm.controls['Status'].setValue(data.status);

    this.userForm.controls['UserName'].disable();
    if (data.expireDate == 0) {
      this.userForm.controls['ExpireDate'].setValue(null);
    } else {
      this.userForm.controls['ExpireDate'].setValue(new Date(data.expireDate));
      if (!(this.userForm.controls['ExpireDate'].value == ""|| this.userForm.controls['ExpireDate'].value == null)) {
        this.userForm.controls['CheckExpireDate'].setValue(true);

        this.userForm.controls['ExpireDate'].enable();
      }
    }
    this.getNotificationPrivilegesByUserId(data.userId);
    this.fetchPrivilegeIdsForUser(data.userId);
    if (this.userForm.controls['Status'].value == 1) {
      this.CheckStatus({ checked: true });
    } else {
      this.CheckStatus({ checked: false });
    }
    // this.userForm.controls['BranchesList'].setValue(data.mobile);
  }
  UserSelectRow: any = null;
  SettingIdsList: any = [];

  open(content: any, data: any, size: any, positions?: any, modalType?: any) {
    this.UserSelectRow = null;
    if (modalType == 'adduser') {
      if (this.numberOfUsers?.theRestOfUsers == 0) {
        this.toast.error(
          this.translate.instant('لقد استنفزت جميع المستخدمين'),
          this.translate.instant('Message')
        );
        return;
      }
      this.selectedTask1 = [];
      this.selectedTask2 = [];
      this.loadPrivilegesTree();
      this.userformintial();
      this.adduser = true;
      this.userForm.controls['UserName'].enable();
      this.selectedIds = [];
      this.branchOptions.forEach((branchO: any) => {
        branchO.checked = false;
      });
      this.selectedBranchId = null;
    }
    if (modalType == 'edit') {
      this.edituser(data);
    }
    if (modalType == 'forwardProjectTasksUserId') {
      this.PhasesTaskId = null;
      this.PhasesTaskId = data;
      this.listforwardProjectTasksUserId = false;
    }
    if (modalType == 'listforwardProjectTasksUserId') {
      this.PhasesTaskId = [];
      this.selection.tasks.selected.forEach((item) => {
        this.PhasesTaskId.push(item.phaseTaskId);
      });
      this.listforwardProjectTasksUserId = true;
    }

    if (modalType == 'deleteModalUser') {
      this.deleteUserId = data.userId;
    }
    if (modalType == 'licenceModal') {
      this.licenceformintial();
      this.editeLicence(data);
    }else if (modalType == 'forwardstatment') {
      debugger;
      this.settingId = null;
      this.SettingIdsList = [];
      this.UserSelectRow = data.userId;
      this.settingId = data.settingId;
      this.listforwardstatment = false;
    } else if (modalType == 'listforwardstatment') {
      debugger;
      this.settingId = null;
      this.SettingIdsList = [];
      this.selection.settingIds.selected.forEach((item) => {
        this.SettingIdsList.push(item.settingId);
      });
      this.listforwardstatment = true;
    } else if (modalType == 'deleteModalDeleteProjectPhasesTasks') {
      this.PhasesTaskId = data;
    } else if (modalType == 'openPermissions') {
      this.GetFillPriv();
    } else if (modalType == 'onlineCloseUser') {
      this.CloseUserId = data.userId;
    }

    if (data) {
      this.modalDetails = data;
    }
    if (modalType) {
      this.modalDetails = modalType;
    }

    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        size: size,
        centered: !positions ? true : false,
      })
      .result.then(
        (result) => {
          if (result === 'Delete success') {
            // console.log('User was successfully deleted');
            // You can perform additional actions here if needed
          } else if (result === 'Delete error') {
            // console.error('Error occurred while deleting user');
            // You can handle the error case here
          } else {
            // Handle other modal close results if needed
          }
        },
        (reason) => {
          // Handle modal dismissal reason if needed
        }
      );
  }

  opened(content: any, data: any, size: any, positions?: any) {
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        size: size,
        centered: !positions ? true : false,
      })
      .result.then(
        (result) => {
          if (result === 'Delete success') {
            // console.log('User was successfully deleted');
            // You can perform additional actions here if needed
          } else if (result === 'Delete error') {
            // console.error('Error occurred while deleting user');
            // You can handle the error case here
          } else {
            // Handle other modal close results if needed
          }
        },
        (reason) => {
          // Handle modal dismissal reason if needed
        }
      );
  }
  GetBranchesByUserId(id: any) {
    this._sysServicesService.BranchesByUserId(id).subscribe((data) => {
      data.forEach((element: any) => {
        var branch = { id: element };
        this.onCheckboxChange(branch);
      });
    });
  }
  resetModal() {
    // this.control.clear();
    this.modalDetails = {
      type: null,
    };
  }
  deleteUserId: any;
  deleteUser() {
    this._sysServicesService.deleteUsers(this.deleteUserId).subscribe(
      (data) => {
        if (data.statusCode == 200) {
          this.GetAllUsers();
          this.toast.success(
            this.translate.instant(data.reasonPhrase),
            this.translate.instant('Message')
          );
          this.modalService.dismissAll('Delete success');
        } else {
          this.toast.error(
            this.translate.instant(data.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      },
      (error) => {
        // console.error('Error deleting user', error);
        // Handle the error appropriately
        this.toast.error(
          this.translate.instant(error.reasonPhrase),
          this.translate.instant('Message')
        );
        // Close the modal in case of error
        this.modalService.dismissAll('Delete error');
      }
    );
    this.resetModal();
    this.modal?.hide();
  }
  CloseUserId = null;
  CloseUser(modal: any) {
    const prames = { UserId: this.CloseUserId };
    this._sysServicesService.CloseUser(prames).subscribe(
      (data) => {
        if (data.statusCode == 200) {
          this.modalService.dismissAll('Success');
          this.CloseUserId = null;
          this.GetAllOnlineUsers();
          this.toast.success(
            this.translate.instant(data.reasonPhrase),
            this.translate.instant('Message')
          );
          modal.dismiss();
        } else {
          this.toast.error(
            this.translate.instant(data.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      },
      (error) => {
        this.toast.error(error.reasonPhrase, 'رسالة');
      }
    );
  }
  numberOfUsers: any;
  updateNumberOfUsers() {
    this._sysServicesService.setNoOfUsers().subscribe(
      (data) => {
        this.numberOfUsers = data;
        // console.log('Number of users updated successfully', data);
        // Perform any additional actions on successful update
      },
      (error) => {
        // console.error('Error updating number of users', error);
        // Handle the error appropriately
      }
    );
  }

  selection = {
    tasks: new SelectionModel<any>(true, []),
    projects: new SelectionModel<any>(true, []),
    settingIds: new SelectionModel<any>(true, []),
  };
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.tasks.selected.length;
    const numRows = this.modals.rows.tasks.length;
    return numSelected === numRows;
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows(event: any) {
    if (event.checked == false) {
      this.selection.tasks.clear();
      return;
    }

    this.selection.tasks.select(...this.modals.rows.tasks.data);
  }
  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${
      this.selection.tasks.isSelected(row) ? 'deselect' : 'select'
    } row ${row.position + 1}`;
  }

  //
  //
  //

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelectedPro() {
    const numSelected = this.selection.projects.selected.length;
    const numRows = this.modals.rows.projects.length;
    return numSelected === numRows;
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRowsPro(event: any) {
    if (event.checked == false) {
      this.selection.projects.clear();
      return;
    }

    this.selection.projects.select(...this.modals.rows.projects.data);
  }
  /** The label for the checkbox on the passed row */
  checkboxLabelPro(row?: any): string {
    if (!row) {
      return `${this.isAllSelectedPro() ? 'deselect' : 'select'} all`;
    }
    return `${
      this.selection.projects.isSelected(row) ? 'deselect' : 'select'
    } row ${row.position + 1}`;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelectedSett() {
    const numSelected = this.selection.settingIds.selected.length;
    const numRows = this.modals.rows.statments.length;
    return numSelected === numRows;
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRowsSett(event: any) {
    if (event.checked == false) {
      this.selection.settingIds.clear();
      return;
    }

    this.selection.settingIds.select(...this.modals.rows.statments.data);
  }
  /** The label for the checkbox on the passed row */
  checkboxLabelSett(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${
      this.selection.settingIds.isSelected(row) ? 'deselect' : 'select'
    } row ${row.position + 1}`;
  }

  selectAllForDropdownItems(items: any) {
    let allSelect = (items: any) => {
      items.forEach((element: any) => {
        element['selectedAllGroup'] = 'selectedAllGroup';
      });
    };

    allSelect(items);
  }

  projectCounts: any = 0;
  taskCount: any = 0;
  setting: any = 0;
  username: any;
  GetUserDataById(id: any, username: any) {
    debugger;
    this.projectCounts = 0;
    this.taskCount = 0;
    this.setting = 0;
    this.username = username;
    this.selectedstatementsTable = id;
    this.selectedTasksUserId = id;
    this._sysServicesService.GetUserDataById(id).subscribe((data) => {
      this.projectCounts = data.projectCounts;
      this.taskCount = data.taskCount;
      this.setting = data.setting;
    });
  }
}
