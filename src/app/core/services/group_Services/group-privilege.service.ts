import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class GroupPrivilegeService {

  private apiEndPoint: string = '';
  constructor(private http: HttpClient) {
    this.apiEndPoint = environment.apiEndPoint;
  }


  /**
   * Retrieves a tree structure of privileges from the server.
   * @returns An Observable that emits the response containing the privileges tree.
   */
  getPrivilegesTree(): Observable<any[]> {
    // Send an HTTP GET request to the 'GetPrivilegesTree' API endpoint.
    return this.http.get<any[]>(this.apiEndPoint + 'Privileges/GetPrivilegesTree');
  }

  /**
 * Sends an HTTP POST request to save group privileges on the server.
 * @param groupId - The identifier of the group for which privileges will be saved.
 * @param privilegeIds - An array of privilege identifiers to be associated with the group.
 * @returns An Observable that emits the HTTP response from the server.
 */
  saveGroupPrivileges(groupId: number, privilegeIds: number[]): Observable<any> {
    // Create a request body object containing 'GroupId' and 'PrivIds'.
    const body = {
      GroupId: groupId,      // The identifier of the group.
      PrivIds: privilegeIds  // An array of privilege identifiers.
    };

    // Send an HTTP POST request to the specified API endpoint.
    // The response type is 'any', meaning it can represent any data type.
    return this.http.post<any>(this.apiEndPoint + 'Groups/SaveGroupPriv', body);
  }
  /**
    * Saves a group using a POST request.
    * @param groupData The group data to be saved.
    * @returns An observable with the HTTP response.
    */

  saveGroup(groupData: { GroupId: string, NameAr: string, NameEn: string }): Observable<any> {
    return this.http.post(this.apiEndPoint + 'Groups/SaveGroups', groupData);
  }

  // Define a function to make the GET request FillGroupsSelect
  FillGroupsSelect(): Observable<any> {
    const url = `${this.apiEndPoint}Groups/FillGroupsSelect`;
    return this.http.get(url);
  }

  saveGroupUsersPrivileges(groupId: number, privilegeIds: any): Observable<any> {

    const prames = {
      GroupId  : groupId,
      PrivIds :privilegeIds
    }


    return this.http.post(this.apiEndPoint + 'Users/SaveGroupUsersPriv', prames);
  }


  /**
   * Calls the API to get privileges IDs by group ID using a GET request.
   * @param groupId The ID of the group to retrieve privileges for.
   * @returns An Observable with the API response.
   */
  getPrivilegesIdsByGroupId(groupId: number): Observable<any> {
    // Set the query parameters for the GET request
    const params = {
      GroupId: groupId.toString()
    };

    // Set the headers for the request
    const headers = new HttpHeaders({
      'Accept': 'application/json'
    });

    // Make the GET request with the query parameters
    return this.http.get(this.apiEndPoint + 'Groups/GetPrivilegesIdsByGroupId', { headers, params });
  }
}
