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
import { OrganizationService } from 'src/app/core/services/sys_Services/organization.service';

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
  
  text = false;

  UserSelectIdFilter: any;
  modal?: BsModalRef;
  userForm: FormGroup;
  privilegesForm: FormGroup;
  lang: any = 'ar';
  logoUrl: any = null;

  environmenturl: any;
  OrganizationData: any;
  ngOnInit(): void {
    this.userformintial();
    this.GetAllUsers();
    //this.getGroups();
    //this.getgroupListTable();
    //this.GetAllDepartmentbyType();
    //this.getDepartments(1);
    this.FillJobSelect_Emp();
    this.FillBranchSelect();
    this.loadPrivilegesTree();
    this.api.GetOrganizationDataLogin().subscribe({next: (res: any) => {
        this.OrganizationData = res.result;
      }});
    this.userG = this.authenticationService.userGlobalObj;
  }
  date: any = new Date();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  displayedColumns: string[] = [
    'UserId',
    'fullName',
    'branchName',
    'jobName',
    'email',
    'mobile',
    'statusName',
    //'lastLoginDate',
    'operations',
  ];
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
    private _organization: OrganizationService,
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
    });
    this.userG = this.authenticationService.userGlobalObj;
    api.lang.subscribe((res) => {this.lang = res;});
    this.environmenturl = environment.PhotoURL;
  }
  userformintial() {
    this.userForm = new FormGroup(
      {
        UserId: new FormControl(0),
        FullName: new FormControl('', [Validators.required,Validators.pattern('^[a-zA-Z ]+$'),]),
        FullNameAr: new FormControl('', [Validators.required,Validators.pattern('^[\u0621-\u064A\u0660-\u0669 ]+$'),]),
        JobId: new FormControl(null, [Validators.required]),
        //DepartmentId: new FormControl(null, [Validators.required]),
        Email: new FormControl('', [Validators.email]),
        confirmEmail: new FormControl('', [Validators.email,]),
        Mobile: new FormControl('', [
          Validators.minLength(11),
          Validators.maxLength(11),
          Validators.pattern('^05[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]'),
        ]),
        GroupId: new FormControl(null, [Validators.required]),
        BranchId: new FormControl(null, [Validators.required]),
        UserName: new FormControl('', [Validators.required]),
        Password: new FormControl(''),
        Session: new FormControl(5),
        Notes: new FormControl(''),
        Status: new FormControl([1]),
        ExpireDate: new FormControl(null),
        CheckExpireDate: new FormControl(),
        BranchesList: new FormControl([]),
      },
      { validators: emailMatchValidator }
    );
    this.userForm.controls['ExpireDate'].disable();
  }

  keyPress(event: any) {
    // var ew = event.which;
    // if (ew == 32) return true;
    // if (ew == 46) return true;
    // if (ew == 64) return true;
    // if (48 <= ew && ew <= 57) return true;
    // if (65 <= ew && ew <= 90) return true;
    // if (97 <= ew && ew <= 122) return true;
    // return false;
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

  PrivList: any;
  NotPrivList: any;
  loadPrivilegesTree() {
    this.selectedTask1 = [];
    this.selectedTask2 = [];
    this._sysServicesService.getPrivilegesTree().subscribe((data) => {
        this.PrivList = JSON.parse(JSON.stringify(data));
        this.AccountngxTreelist = data;
        this.AccountngxTreelist.forEach((element: any) => {
          element.children = [];
          element.name = this.translate.instant(element.text);
          element.item = {phrase: element.text,id: element.id,};
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
      }
    );
  }
  selectedGroup: any;
  selectTask() {
    this.selectedGroup.forEach((item: { id: number }) => {
      this.selectedIds.push(item.id);
    });
    this.privilegesForm.controls['privilegeIds'].setValue(this.selectedIds);
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
      if (control && control instanceof FormControl && control.value) {
        userFormData.append(key, control.value.toString());
      }
    });
    if(this.userForm.controls['Email'].value!=null)
    {
      if(this.userForm.controls['Email'].value!=this.userForm.controls['confirmEmail'].value)
      {
        this.toast.error(this.translate.instant("تأكد من البريد الالكتروني"),this.translate.instant('Message'));
        return;
      }
    }

    if (this.userForm.controls['Status'].value == false) {
      this.userForm.controls['Status'].setValue(0);
    } else {
      this.userForm.controls['Status'].setValue(1);
    }
    if ( this.userForm.controls['ExpireDate'].value!=0 &&
      this.userForm.controls['ExpireDate'].value != null &&
      typeof this.userForm.controls['ExpireDate'].value != 'string'
    ) {
      var date = this._sharedService.date_TO_String(this.userForm.controls['ExpireDate'].value);
    }
    if (typeof this.userForm.controls['BranchId'].value != 'number') {
      this.userForm.controls['BranchId'].setValue(this.userForm.controls['BranchId'].value?.id);
    }

    if (this.userForm.controls['ExpireDate'].value == null) {this.userForm.controls['ExpireDate'].setValue(0);}
    const formData = new FormData();

    formData.append('UserId', this.userForm.controls['UserId'].value);
    formData.append('FullName', this.userForm.controls['FullName'].value);
    formData.append('FullNameAr', this.userForm.controls['FullNameAr'].value);
    formData.append('JobId', this.userForm.controls['JobId'].value);
    //formData.append('DepartmentId',this.userForm.controls['DepartmentId'].value);
    formData.append('Email', this.userForm.controls['Email'].value);
    formData.append('confirmEmail',this.userForm.controls['confirmEmail'].value);
    formData.append('Mobile', this.userForm.controls['Mobile'].value);
    //formData.append('GroupId', this.userForm.controls['GroupId'].value);
    formData.append('BranchId', this.userForm.controls['BranchId'].value);
    formData.append('UserName', this.userForm.controls['UserName'].value);
    formData.append('Password', this.userForm.controls['Password'].value);
    //formData.append('Session', this.userForm.controls['Session'].value);
    formData.append('Notes', this.userForm.controls['Notes'].value);

    formData.append('Status', this.userForm.controls['Status'].value);
    if (this.userForm.controls['CheckExpireDate'].value == true && this.userForm.controls['ExpireDate'].value!=0) {   
      formData.append('ExpireDate',this._sharedService.date_TO_String(this.userForm.controls['ExpireDate'].value)??'0');
    } else {
      formData.append('ExpireDate','0');
    }
    formData.append('CheckExpireDate',this.userForm.controls['CheckExpireDate'].value
    );
    if (this.userForm.controls['BranchesList'].value.length > 0) {
      for (let file of this.userForm.controls['BranchesList'].value) {
        formData.append('BranchesList[]', file);
      }
    }
    this._sysServicesService.saveUser(formData).subscribe((data) => {
        debugger;
        if (data.statusCode == 200) {
          debugger
          if (this.userForm.controls['ExpireDate'].value == 0) {
            this.userForm.controls['ExpireDate'].setValue(null);
          }
          this.saveUserPrivileges(data.returnedParm, this.selectedTask1);
          this.GetAllUsers();
          this.toast.success(this.translate.instant(data.reasonPhrase),this.translate.instant('Message'));
          if (this.userForm.controls['UserId'].value == 0) {
            this._sysServicesService.GetUserById(data.returnedParm).subscribe((response) => {
              debugger
              this.edituser(response.result);
            });
          }
        } else {
          debugger
          if (this.userForm.controls['ExpireDate'].value == 0) {
            this.userForm.controls['ExpireDate'].setValue(null);
          }
          this.toast.error(this.translate.instant(data.reasonPhrase),this.translate.instant('Message'));
        }
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
  notificationPrivileges: any[];
  clickItem(event: any) {
    console.log(event);
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
        });
      },
      (error) => {}
    );
  }

  getPrivilegesGroup() {
    this.groupPrivilegeService
      .getPrivilegesIdsByGroupId(this.userForm.controls['GroupId'].value).subscribe(
        (response) => {
          this.groupPrivilegeService.getPrivilegesTree().subscribe((data) => {
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
          });
        }
      );
  }
  branchOptions: any = [];
  FillBranchSelect() {
    this._sysServicesService.FillBranchSelect().subscribe((data) => {
        this.branchOptions = data; 
        this.nodeItems = data;
      }
    );
  }

  departmentOptions: any[] = [];
  getDepartments(param: number): void {
    this._sysServicesService.getDepartments(param).subscribe((data) => {
        this.departmentOptions = data;      
      }
    );
  }

  selectedBranchId: any;
  onSelectBranch() {
    this.selectedBranchId = this.userForm.get('BranchId')?.value;
    const indexToRemove = this.selectedIds.findIndex(
      (id) => id === this.selectedBranchId
    );
    if (indexToRemove !== -1) {
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
  dataSourceTemp: any;

  GetAllUsers() {
    this._sysServicesService.GetAllUsers().subscribe((data) => {
      // console.log(data);
      this.dataSourceTemp = data.result;
      this.data.users = new MatTableDataSource(data.result);
      this.data.users.paginator = this.paginator;
      this.data.users.sort = this.sort;
      this.FillSerachLists(data.result);    
    });
  }
  options = {
    mode: TreeMode.MultiSelect,
    checkboxes: true,
    alwaysEmitSelected: false,
  };
  selectedTask1: any;
  selectedTask2: any;
  nodeItems: any[] = [];
  applyFilter(event: any) {
    const val = event.target.value.toLowerCase();
    var tempsource = this.dataSourceTemp;
    if (val) {
      tempsource = this.dataSourceTemp.filter((d: any) => {
        return (
          (d.fullName && d.fullName?.trim().toLowerCase().indexOf(val) !== -1) ||
          (d.jobName && d.jobName?.trim().toLowerCase().indexOf(val) !== -1) ||
          // (d.departmentName &&
          //   d.departmentName?.trim().toLowerCase().indexOf(val) !== -1) ||
          // (d.groupName &&
          //   d.groupName?.trim().toLowerCase().indexOf(val) !== -1) ||
          (d.statusName && d.statusName?.trim().toLowerCase().indexOf(val) !== -1) ||
          (d.mobile && d.mobile?.trim().toLowerCase().indexOf(val) !== -1) ||
          //(d.lastLoginDate && d.lastLoginDate?.trim().toLowerCase().indexOf(val) !== -1) ||
          (d.email && d.email?.trim().toLowerCase().indexOf(val) !== -1) ||
          (d.userName && d.userName?.trim().toLowerCase().indexOf(val) !== -1) ||
          (d.fullNameAr && d.fullNameAr?.trim().toLowerCase().indexOf(val) !== -1)
        );
      });
    }
    this.data.users = new MatTableDataSource(tempsource);
    this.data.users.paginator = this.paginator;
    this.data.users.sort = this.sort;
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
  groupOptions: any[] = [];
  groupListTable: any;
  getgroupListTable() {
    this._sysServicesService.GetAllGroups_S().subscribe((data) => {
        this.groupOptions = data;
        this.groupListTable = data.result;
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
    this._sysServicesService.GetAllDepartmentbyType().subscribe((data) => {
        this.branchlist = data.result;
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
    } else {
      this.userForm.controls['ExpireDate'].enable();
    }
  }

  getCopy(val: string) {
    debugger
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
    return branch1 && branch2 ? branch1.id === branch2.id : branch1 === branch2;
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
    this.userformintial();
    this.selectedBranchId = data.branchId;
    // console.log(this.datamod);
    this.userForm.controls['UserId'].setValue(data.userId);
    this.userForm.controls['FullNameAr'].setValue(data.fullNameAr);
    this.userForm.controls['FullName'].setValue(data.fullNameEn);
    this.userForm.controls['JobId'].setValue(data.jobId);
    //this.userForm.controls['DepartmentId'].setValue(data.departmentId);
    this.userForm.controls['Email'].setValue(data.email);
    this.userForm.controls['confirmEmail'].setValue(data.email);
    //this.userForm.controls['GroupId'].setValue(data.groupId);
    this.userForm.controls['BranchId'].setValue(data.branchId);
    this.userForm.controls['Mobile'].setValue(data.mobile);
    this.userForm.controls['UserName'].setValue(data.userName);
    // this.userForm.controls['Password'].setValue(data.password);
    debugger
    this.api.DecryptPassword(data.password.toString()).subscribe((result: any) => {
      debugger
      this.userForm.controls['Password'].setValue(result.reasonPhrase);
    });
    this.userForm.controls['Notes'].setValue(data.notes);
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
    this.fetchPrivilegeIdsForUser(data.userId);
    if (this.userForm.controls['Status'].value == 1) {
      this.CheckStatus({ checked: true });
    } else {
      this.CheckStatus({ checked: false });
    }
  }
  UserSelectRow: any = null;
  SettingIdsList: any = [];

  open(content: any, data: any, size: any, positions?: any, modalType?: any) {
    this.UserSelectRow = null;
    if (modalType == 'adduser') {
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
    if (modalType == 'deleteModalUser') {
      this.deleteUserId = data.userId;
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
          } else if (result === 'Delete error') {
          } else {
          }
        },
        (reason) => {
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

          } else if (result === 'Delete error') {

          } else {
          }
        },
        (reason) => {
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
    this._sysServicesService.deleteUsers(this.deleteUserId).subscribe((data) => {
        if (data.statusCode == 200) {
          this.GetAllUsers();
          this.toast.success(this.translate.instant(data.reasonPhrase),this.translate.instant('Message'));
        } else {
          this.toast.error(this.translate.instant(data.reasonPhrase),this.translate.instant('Message'));
        }
      }
    );
  }
  Job_Emp: any;
  JobTypesPopup_Emp: any;

  FillJobSelect_Emp() {
    this._organization.FillJobSelect().subscribe((data) => {
      console.log(data);
      this.Job_Emp = data;
      this.JobTypesPopup_Emp = data;
    });
  }
  AddDataType: any = {
    Jobdata: {
      id: 0,
      namear: null,
      nameen: null,
    },
  };
//-----------------------------------SaveJob-------------------------------
  //#region 
  selectedJob: any;
  JobRowSelected: any;
  getJobRow(row: any) {
    this.JobRowSelected = row;
  }
  setJobInSelect(data: any, modal: any) {
    this.modalDetails.jobId=data.id;
  }
  confirmJobDelete() {
    this._organization.DeleteJob(this.JobRowSelected.id).subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
          this.FillJobSelect_Emp();
        } else {
          this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
        }
      });
  }

  saveJob() {
    if (
      this.AddDataType.Jobdata.namear == null ||
      this.AddDataType.Jobdata.nameen == null
    ) {
      this.toast.error('من فضلك أكمل البيانات', 'رسالة');
      return;
    }
    var JobObj: any = {};
    JobObj.JobId = this.AddDataType.Jobdata.id;
    JobObj.NameAr = this.AddDataType.Jobdata.namear;
    JobObj.NameEn = this.AddDataType.Jobdata.nameen;

    var obj = JobObj;
    this._organization.SaveJob(obj).subscribe((result: any) => {
      if (result.statusCode == 200) {
        this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
        this.resetJob();
        this.FillJobSelect_Emp();
      } else {
        this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
      }
    });
  }
  resetJob() {
    this.AddDataType.Jobdata.id = 0;
    this.AddDataType.Jobdata.namear = null;
    this.AddDataType.Jobdata.nameen = null;
  }
  //#endregion
  //----------------------------------EndSaveJob-----------------------------

  //------------------------------Search--------------------------------------------------------
  //#region 

  dataSearch: any = {
    filter: {
      enable: false,
      date: null,
      isChecked: false,
      ListName:[],
      ListPhone:[],
      userId:null,
      showFilters:false
    },
  };

    FillSerachLists(dataT:any){
      this.FillUserListName(dataT);
      this.FillUserListPhone(dataT);
    }

    FillUserListName(dataT:any){
      const ListLoad = dataT.map((item: { userId: any; fullName: any; }) => {
        const container:any = {}; container.id = item.userId; container.name = item.fullName; return container;
      })
      const key = 'id';
      const arrayUniqueByKey = [...new Map(ListLoad.map((item: { [x: string]: any; }) => [item[key], item])).values()];
      this.dataSearch.filter.ListName=arrayUniqueByKey;
    }
    FillUserListPhone(dataT:any){
      const ListLoad = dataT.map((item: { userId: any; mobile: any; }) => {
        const container:any = {}; container.id = item.userId; container.name = item.mobile; return container;
      })
      const key = 'id';
      const arrayUniqueByKey = [...new Map(ListLoad.map((item: { [x: string]: any; }) => [item[key], item])).values()];
      this.dataSearch.filter.ListPhone=arrayUniqueByKey;
      this.dataSearch.filter.ListPhone = this.dataSearch.filter.ListPhone.filter((d: { name: any }) => (d.name !=null && d.name!=""));
    }
    RefreshDataCheck(from: any, to: any){
      this.data.users.data=this.dataSourceTemp;
      if(!(from==null || from=="" || to==null || to==""))
      {
        debugger
        this.data.users.data = this.data.users.data.filter((item: any) => {
          var AccDate=new Date(item.addDate);
          var AccFrom=new Date(from);
          var AccTo=new Date(to);
          return AccDate.getTime() >= AccFrom.getTime() &&
          AccDate.getTime() <= AccTo.getTime();
      });
      }
      if(this.dataSearch.filter.userId!=null && this.dataSearch.filter.userId!="")
      {
        this.data.users.data = this.data.users.data.filter((d: { userId: any }) => d.userId == this.dataSearch.filter.userId);
      }
    }

    ClearDate(){
      if(this.dataSearch.filter.enable==false){ 
        this.dataSearch.filter.date=null;   
        this.RefreshDataCheck(null,null);
      }
    }
    CheckDate(event: any) {
      debugger
      if (event != null) {
        var from = this._sharedService.date_TO_String(event[0]);
        var to = this._sharedService.date_TO_String(event[1]);
        this.RefreshDataCheck(from, to);
      } else {    
        this.RefreshDataCheck(null,null);
      }
    }
    RefreshData(){
      debugger
      if( this.dataSearch.filter.date==null)
      {
      this.RefreshDataCheck(null,null);
      }
      else
      {
      this.RefreshDataCheck(this.dataSearch.filter.date[0],this.dataSearch.filter.date[1]);
      }
    }
    //#endregion 
  //------------------------------Search--------------------------------------------------------


  exportData() {
    let x = [];
    var AccDataSource=this.data.users.data;
    for (let index = 0; index < AccDataSource.length; index++) {
      x.push({
        fullName: AccDataSource[index].fullName,
        branchName: AccDataSource[index].branchName,
        jobName: AccDataSource[index].jobName,      
        email: AccDataSource[index].email,
        mobile: AccDataSource[index].mobile,
        statusName: AccDataSource[index].statusName,
      });
    }
    this._sysServicesService.customExportExcel(x, 'Users');
  }

}
