import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AdminProfileService {


  private apiEndPoint: string = '';
  constructor(private http: HttpClient) {
    this.apiEndPoint = environment.apiEndPoint;
  }

  /**
   * Get user data by user ID.
   * @param userId The user ID to fetch data for.
   * @returns An Observable containing user data.
   */
  getUserById(userId: number): Observable<any> {
    // Construct the URL with the userId query parameter
    const url = `${this.apiEndPoint}Users/GetUserById?UserId=${userId}`;

    // Make a GET request to the API
    return this.http.get(url);
  }

  GenerateUserQR(): Observable<any> {
    // Construct the URL with the userId query parameter
    const url = `${this.apiEndPoint}Users/GenerateUserQR`;

    // Make a GET request to the API
    return this.http.get(url);
  }


  /**
   * Update the active status of a user.
   * @param userId The ID of the user to update.
   * @param isActive The new active status (true or false).
   * @returns An Observable with the updated user data.
   */
  updateAppActiveStatus(userId: number, isActive: boolean): Observable<any> {
    // Construct the complete API URL
    const apiUrl = `${this.apiEndPoint}Users/UpdateAppActiveStatus`;

    // Construct the request body
    const requestBody = {
      IsActive: isActive,
      user: userId
    };

    // Make the POST request
    return this.http.post(apiUrl, requestBody);
  }

  saveUserProfile(data: any): Observable<any> {
    // Define the HTTP headers if needed
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json'
    // });

    // Make a POST request to the API
    return this.http.post(this.apiEndPoint + 'Users/SaveUsersProfile', data);
  }
  ChangeUserImage(data: any): Observable<any> {
    return this.http.post(this.apiEndPoint + 'Users/ChangeUserImage', data);
  }
  ChangeStampImage(data: any): Observable<any> {
    return this.http.post(this.apiEndPoint + 'Users/ChangeStampImage', data);
  }
  ChangePassword(data: any): Observable<any> {
    return this.http.post(this.apiEndPoint + 'Users/ChangePassword', data);
  }
}
