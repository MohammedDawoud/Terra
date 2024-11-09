import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class SysServicesService {
  private apiEndPoint: string = '';
  private labaikendpoint: string = '';
  constructor(private http: HttpClient) {
    this.apiEndPoint = environment.apiEndPoint;
  }

  // Function to fetch all licenses based on a search text
  GetAllLicences() {
    // Send an HTTP GET request to the 'GetAllLicences' endpoint

    return this.http.get<any>(this.apiEndPoint + 'Users/GetAllLicences');
  }
  SaveLicence(Licences: any): Observable<any> {
    return this.http.post(this.apiEndPoint + 'Users/SaveLicence', Licences);
  }

  SaveLabaikLicences(Licences: any): Observable<any> {
    return this.http.post(
      this.apiEndPoint + 'Users/SaveLabaikLicences',
      Licences
    );
  }
  // Function to fetch the current user's information
  GetCurrentUser() {
    // Send an HTTP GET request to the 'GetCurrentUser' endpoint
    return this.http.get<any>(this.apiEndPoint + 'Users/GetCurrentUser');
  }

  // Function to fetch all users with a specific parameter
  GetAllUsers() {
    // Send an HTTP GET request to fetch all users with the provided parameter
    return this.http.get<any>(this.apiEndPoint + 'Users/GetAllUsers');
  }

  // Function to fetch layout data for a specific user based on FiscalId
  GetLayoutReadyVm(FiscalId: any) {
    // Construct the URL using the environment's API endpoint
    var url = `${environment.apiEndPoint}Users/GetLayoutReadyVm?FiscalId=${FiscalId}`;
    // Send an HTTP GET request to fetch layout data for the specified FiscalId
    return this.http.get<any>(url);
  }

  // Function to fetch branch selection options
  FillBranchSelect() {
    // Send an HTTP GET request to the 'FillBranchSelect' endpoint
    return this.http.get<any>(this.apiEndPoint + 'Branches/FillBranchSelect');
  }

  // Function to fetch branches associated with a specific user by UserId
  GetBranchesByUserId(UserId: any) {
    // Construct the URL using the environment's API endpoint
    var url = `${environment.apiEndPoint}Users/GetBranchesByUserId?FiscalId=${UserId}`;
    // Send an HTTP GET request to fetch branches for the specified UserId
    return this.http.get<any>(url);
  }
  BranchesByUserId(UserId: any) {
    // Construct the URL using the environment's API endpoint
    var url = `${environment.apiEndPoint}Users/GetBranchesByUserId?UserId=${UserId}`;
    // Send an HTTP GET request to fetch branches for the specified UserId
    return this.http.get<any>(url);
  }
  DeleteDeviceId(userId: number) {
    return this.http.post<any>(
      `${environment.apiEndPoint}Users/DeleteDeviceId?user=` + userId,
      {}
    );
  }

  // Function to fetch all online users
  GetAllOnlineUsers() {
    // Send an HTTP GET request to the 'GetAllOnlineUsers' endpoint
    return this.http.get<any>(this.apiEndPoint + 'Users/GetAllOnlineUsers');
  }

  // Function to fetch user selection options
  FillUsersSelect() {
    // Send an HTTP GET request to the 'FillUsersSelect' endpoint
    return this.http.get<any>(this.apiEndPoint + 'Users/FillUsersSelect');
  }

  // Function to fetch a user's privilege report based on UserId and parameter
  GetPrivUserReport(UserId: any): Observable<any> {
    // Construct the URL using the environment's API endpoint
    var url = `${environment.apiEndPoint}Users/GetPrivUserReport?UserId=${UserId}`;
    // Send an HTTP GET request to fetch a user's privilege report
    return this.http.get<any>(url);
  }

  // New function to fetch privilege report
  fetchPrivilegeReport(UserId: any): Observable<any> {
    return this.GetPrivUserReport(UserId);
  }

  /**
   * Fetches users based on specified Privilege ID and optional parameter.
   * @param PrivilegeId The ID of the privilege for which to fetch users.
   * @param _ Optional parameter for the API request (e.g., timestamp).
   * @returns An Observable containing the response data.
   */
  getUsersByPrivilegesIds(PrivilegeId: number, _?: any): Observable<any> {
    // Construct the URL for the API endpoint
    // const url = `${environment.apiEndPoint}Privileges/GetUsersByPrivilegesIds?PrivilegeId=${PrivilegeId}`;
    // // Send an HTTP GET request to the constructed URL and return the Observable
    // return this.http.get<any>(url);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const params = {
      PrivilegeId: PrivilegeId,
      UserPrivId: 0,
    };

    return this.http.post<any>(
      this.apiEndPoint + 'Privileges/GetUsersByPrivilegesIds',
      params
    );
  }

  /**
   * Deletes users using a POST request with FormData payload.
   * @param userId The ID of the user to be deleted.
   * @returns An Observable containing the response data.
   */
  deleteUsers(userId: number) {
    // Create FormData and append the userId to it
    const formData = new FormData();
    formData.append('Users', userId.toString());

    // Set headers for FormData
    const headers = new HttpHeaders();

    // Send a POST request with FormData payload
    return this.http.post<any>(
      `${environment.apiEndPoint}Users/DeleteUsers?userId=` + userId,
      {}
    );
  }

  /**
   * Calls the SetNoOfUsers_Rest API to update the number of users for a user.
   * @returns An Observable containing the response data.
   */
  setNoOfUsers() {
    // Send a GET request to the constructed URL
    return this.http.get<any>(this.apiEndPoint + 'Users/SetNoOfUsers_Rest');
  }

  getAllProjectPhasesTasksUPage(userId: number): Observable<any> {
    // You can pass additional headers if needed
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    // Replace 'UserId' with the actual query parameter name used by your API
    const params = {
      UserId: userId,
    };

    return this.http.get<any>(
      `${this.apiEndPoint}ProjectPhasesTasks/GetAllProjectPhasesTasksUPage`,
      {
        headers: headers,
        params: params,
      }
    );
  }

  // Define a function to make the GET request fillJobSelect
  fillJobSelect(): Observable<any> {
    const url = `${this.apiEndPoint}Job/FillJobSelect`;
    return this.http.get(url);
  }
  deleteJob(jobId: number): Observable<any> {
    // Create the payload as FormData
    const formData = new FormData();
    formData.append('JobId', jobId.toString());

    // Define the HTTP headers (if needed)
    const headers = new HttpHeaders({
      // You can set headers here if required
    });

    // Make the DELETE request
    return this.http.delete(`${this.apiEndPoint}Job/DeleteJob`, {
      headers: headers,
      body: formData, // Use the FormData payload
    });
  }
  // Define a function to make the GET request FillGroupsSelect
  FillGroupsSelect(): Observable<any> {
    const url = `${this.apiEndPoint}Groups/FillGroupsSelect`;
    return this.http.get(url);
  }
  getDepartments(param: number): Observable<any> {
    // Make the GET request
    return this.http.get(
      `${this.apiEndPoint}Department/FillDepartmentSelectByTypeUser?param=${param}`
    );
  }
  // Define a function to make the GET request FillAttendanceTimeSelect
  FillAttendanceTimeSelect(): Observable<any> {
    const url = `${this.apiEndPoint}AttendaceTime/FillAttendanceTimeSelect`;
    return this.http.get(url);
  }

  saveUser(userFormData: FormData): Observable<any> {
    // const headers = new HttpHeaders();
    // headers.set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.apiEndPoint + 'Users/SaveUsers', userFormData);
  }
  saveUsers(usersData: any) {
    return this.http.post(this.apiEndPoint + 'Users/SaveUsers', usersData);
  }

  /**
   * Fetch privilege IDs for a given user.
   * @param userId The ID of the user for which to fetch privilege IDs.
   * @returns An Observable that emits the response data.
   */
  getPrivilegesByUserId(userId: number): Observable<any> {
    // Prepare the form data
    // const formData = new FormData();
    // formData.append('UserId', userId.toString());

    // // Define the headers (if needed)
    // const headers = {}; // Add headers here if required

    // Make a POST request to the API
    return this.http.get(
      this.apiEndPoint + 'Users/GetPrivilegesIdsByUserId?UserId=' + userId
    );
  }

  // Method to fetch all users
  getAllUsers(): Observable<any> {
    return this.http.get(this.apiEndPoint + 'Users/GetAllUsers');
  }

  /**
   * Get notification privileges by user ID.
   * @param userId The ID of the user for whom to fetch notification privileges.
   * @returns An Observable containing the notification privileges.
   */
  getNotificationPrivilegesByUserId(userId: string): Observable<any> {
    // Define the payload as an object with the UserId property
    // const payload = { UserId: userId };

    // Make the POST request to the API
    return this.http.get(
      this.apiEndPoint +
        'NotificationPrivileges/GetNotifPrivilegesIdsByUserId?UserId=' +
        userId
    );
  }

  /**
   * Save user privileges.
   * @param userId The ID of the user for whom to save privileges.
   * @param privilegeIds An array of privilege IDs to save.
   * @returns An Observable containing the response data.
   */
  saveUserPrivileges(userId: string, privilegeIds: any[]): Observable<any> {
    // Define the payload as an object with the UserId and PrivIds properties
    const payload = {
      UserId: userId,
      PrivIds: privilegeIds,
    };

    // Make the POST request to the API
    return this.http.post(this.apiEndPoint + 'Users/SaveUserPriv', payload);
  }

  saveUserPrivil(userId: string, privilegeIds: any[]): Observable<any> {
    // Define the payload as an object with the UserId and PrivIds properties

    // Make the POST request to the API
    const prames = {
      UserId: userId,
      PrivIds: privilegeIds,
    };

    return this.http.post(this.apiEndPoint + 'Users/SaveUserPriv', prames);
  }

  SaveUserNotifPriv(userId: string, privilegeIds: any[]): Observable<any> {
    // Define the payload as an object with the UserId and PrivIds properties

    // Make the POST request to the API
    const prames = {
      UserId: userId,
      PrivIds: privilegeIds,
    };
    return this.http.post(
      this.apiEndPoint + 'NotificationPrivileges/SaveUserNotifPriv',
      prames
    );
  }

  ConvertUserTasksSome(_phaseTaskId: any, FromUserId: any, ToUserId: any) {
    return this.http.post(
      this.apiEndPoint + 'ProjectPhasesTasks/ConvertUserTasksSome',
      {},
      {
        params: {
          PhasesTaskId: _phaseTaskId,
          FromUserId: FromUserId,
          ToUserId: ToUserId,
        },
      }
    );
  }
  DeleteProjectPhasesTasks(modal: any): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(modal);
    return this.http.post<any>(
      this.apiEndPoint + 'ProjectPhasesTasks/DeleteProjectPhasesTasks',
      body,
      { headers: headers }
    );
  }
  ConvertMoreUserTasks(from: any, to: any, modal: any): Observable<any> {
    // const headers = { 'content-type': 'application/json' }
    // const body = JSON.stringify(modal);
    return this.http.post<any>(
      this.apiEndPoint +
        'ProjectPhasesTasks/ConvertMoreUserTasks?FromUserId=' +
        from +
        '&ToUserId=' +
        to,
      modal
    );
  }

  ConvertMoreManagerProjects(from: any, to: any, modal: any): Observable<any> {
    // const headers = { 'content-type': 'application/json' }
    // const body = JSON.stringify(modal);
    return this.http.post<any>(
      this.apiEndPoint +
        'Project/ConvertMoreManagerProjects?FromUserId=' +
        from +
        '&ToUserId=' +
        to,
      modal
    );
  }

  ConvertManagerProjectsSome(_projectId: any, FromUserId: any, ToUserId: any) {
    return this.http.post(
      this.apiEndPoint + 'Project/ConvertManagerProjectsSome',
      {},
      {
        params: {
          ProjectId: _projectId,
          FromUserId: FromUserId,
          ToUserId: ToUserId,
        },
      }
    );
  }

  GetSetting_Statment(userId: number): Observable<any> {
    // You can pass additional headers if needed
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    // Replace 'UserId' with the actual query parameter name used by your API
    const params = {
      UserId: userId,
    };

    return this.http.get<any>(
      `${this.apiEndPoint}Settings/GetSetting_Statment`,
      {
        headers: headers,
        params: params,
      }
    );
  }
  ConvertUserSettingsSome(modal: any): Observable<any> {
    // const headers = { 'content-type': 'application/json' }
    // const body = JSON.stringify(modal);
    return this.http.post(
      this.apiEndPoint + 'Settings/ConvertUserSettingsSome',
      modal
    );
  }
  ConvertMoreUserSettings(from: any, to: any, modal: any): Observable<any> {
    return this.http.post<any>(
      this.apiEndPoint +
        'Settings/ConvertMoreUserSettings?FromUserId=' +
        from +
        '&ToUserId=' +
        to,
      modal
    );
  }
  GetFillPriv(): Observable<any> {
    return this.http.get(this.apiEndPoint + 'Users/FillPriv');
  }
  SaveGroups(modal: any): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(modal);
    return this.http.post(this.apiEndPoint + 'Groups/SaveGroups', body, {
      headers: headers,
    });
  }
  GetAllGroups_S(): Observable<any> {
    const url = `${this.apiEndPoint}Groups/GetAllGroups_S?SearchText= `;
    return this.http.get(url);
  }
  DeleteGroups(GroupsId: number): Observable<any> {
    // const formData = new FormData();
    // formData.append('GroupId', GroupsId.toString());
    return this.http.post(
      `${this.apiEndPoint}Groups/DeleteGroups?GroupId=` + GroupsId,
      {}
    );
  }

  GetAllDepartmentbyType(): Observable<any> {
    const url = `${this.apiEndPoint}Department/GetAllDepartmentbyType?Type=1`;
    return this.http.get(url);
  }
  SaveDepartment(modal: any): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(modal);
    return this.http.post(
      this.apiEndPoint + 'Department/SaveDepartment',
      body,
      { headers: headers }
    );
  }
  DeleteDepartment(DepartmentId: number): Observable<any> {
    // const formData = new FormData();
    // formData.append('DepartmentId', DepartmentId.toString());
    return this.http.post(
      `${this.apiEndPoint}Department/DeleteDepartment?DepartmentId=` +
        DepartmentId,
      {}
    );
  }
  GetAllJobs(): Observable<any> {
    const url = `${this.apiEndPoint}Job/GetAllJobs?SearchText= `;
    return this.http.get(url);
  }
  GetAllJobs2(): Observable<any> {
    const url = `${this.apiEndPoint}Job/GetAllJobs2 `;
    return this.http.get(url);
  }
  SaveJob(modal: any): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(modal);
    return this.http.post(this.apiEndPoint + 'Job/SaveJob', body, {
      headers: headers,
    });
  }
  DeleteJob(JobId: number): Observable<any> {
    // const formData = new FormData();
    // formData.append('JobId', JobId.toString());
    return this.http.post(
      `${this.apiEndPoint}Job/DeleteJob?JobId=` + JobId,
      {}
    );
  }
  GetMaxOrderNumber(): Observable<any> {
    const url = `${this.apiEndPoint}Users/GetMaxOrderNumber`;
    return this.http.get(url);
  }
  getPrivilegesTree(): Observable<any[]> {
    return this.http.get<any[]>(
      this.apiEndPoint + 'Privileges/GetPrivilegesTree'
    );
  }
  GetNotifPrivilegesTree(): Observable<any[]> {
    return this.http.get<any[]>(
      this.apiEndPoint + 'NotificationPrivileges/GetNotifPrivilegesTree'
    );
  }

  CloseUser(modal: any): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(modal);
    return this.http.post(this.apiEndPoint + 'Users/CloseUser', body, {
      headers: headers,
    });
  }

  ///////////////////////support
  GetBranchOrganization() {
    return this.http.get<any>(
      this.apiEndPoint + 'Organizations/GetBranchOrganization'
    );
  }
  SaveSupportResquests(modal: any): Observable<any> {
    return this.http.post(
      this.apiEndPoint + 'SupportResquests/SaveSupportResquests',
      modal
    );
  }
  GetAllSupportResquests() {
    return this.http.post<any>(
      this.apiEndPoint + 'SupportResquests/GetAllSupportResquests',
      {}
    );
  }
  GetAllOpenSupportResquests() {
    return this.http.post<any>(
      this.apiEndPoint + 'SupportResquests/GetAllOpenSupportResquests',
      {}
    );
  }

  GetAllReplyByServiceId(RequestId: any) {
    return this.http.get<any>(
      this.apiEndPoint +
        'SupportResquests/GetAllReplyByServiceId?RequestId=' +
        RequestId +
        ''
    );
  }

  SaveRequestReplayFromTameer(data: any) {
    return this.http.post<any>(
      this.apiEndPoint + 'SupportResquests/SaveRequestReplayFromTameer',
      data
    );
  }

  SavenewCOntactwithcustomerFromTameer(modal: any): Observable<any> {
    return this.http.post(
      this.labaikendpoint +
        'ServiceContactWithCustomer/SavenewCOntactwithcustomerFromTameer',
      modal
    );
  }

  GetCurrentUserById() {
    return this.http.post<any>(
      this.apiEndPoint + 'Users/GetCurrentUserById',
      {}
    );
  }

  UpdateSupportResquests(
    RequestId: any,
    Status: any,
    Replay: any,
    SenderName: any,
    UserImg: any
  ) {
    return this.http.post<any>(
      this.apiEndPoint +
        'SupportResquests/UpdateSupportResquests?RequestId=' +
        RequestId +
        '&&Status=' +
        Status +
        '&&Replay=' +
        Replay +
        '&&SenderName=' +
        SenderName +
        '&&UserImg=' +
        UserImg +
        '',
      {}
    );
  }

  UpdateLabaikTicketStatus(TameerServiceRequestId: any, Status: any) {
    return this.http.post<any>(
      this.apiEndPoint +
        'SupportResquests/UpdateLabaikTicketStatus?TameerServiceRequestId=' +
        TameerServiceRequestId +
        '&&Status=' +
        Status +
        '',
      {}
    );
  }

  GetUserDataById(UserId: any) {
    return this.http.get<any>(
      this.apiEndPoint +
        'ProjectPhasesTasks/GetUserDataById?UserId=' +
        UserId +
        ''
    );
  }
}
