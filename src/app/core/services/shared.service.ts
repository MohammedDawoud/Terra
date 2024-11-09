import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';
import { Observable, Subject } from 'rxjs';
import { AbstractControl } from '@angular/forms/';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private apiEndPoint: string = '';
  private action: string;

  private callFunction = new Subject<void>();
  calling$ = this.callFunction.asObservable();
  constructor(private http: HttpClient) {
    this.apiEndPoint = environment.apiEndPoint;
  }
  hijridate: any;
  gergedate: any;

  callFunc() {
    this.callFunction.next();
  }

  isJsonString(str: any) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  hijri_TO_String(date_Object: any) {
    var dd = date_Object._date;
    var mm = date_Object._month;
    var yyyy = date_Object._year;
    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }
    var date_String = yyyy + '-' + mm + '-' + dd;
    return date_String;
  }

  date_TO_String(date_Object: any) {
    var dd = date_Object.getDate();
    var mm = date_Object.getMonth() + 1;
    var yyyy = date_Object.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }
    var date_String = yyyy + '-' + mm + '-' + dd;
    return date_String;
  }
  date_TO_String_Des(date_Object: any) {
    var dd = date_Object.getDate();
    var mm = date_Object.getMonth() + 1;
    var yyyy = date_Object.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }
    var date_String = mm + '/' + dd + '/' + yyyy;
    return date_String;
  }

  date_TO_String_WithTime(date_Object: any) {
    var dd = date_Object.getDate();
    var mm = date_Object.getMonth() + 1;
    var yyyy = date_Object.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }
    var date_String =
      yyyy + '-' + mm + '-' + dd + '  ' + this.formatAMPM(date_Object);
    return date_String;
  }
  formatAMPM(date: any) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }
  formatTimeOnly(date: any) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes;
    return strTime;
  }

  formatTimeHourOnly(date: any) {
    var hours = date.getHours();
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    var strTime = hours;
    return strTime;
  }

  formatAMPMOnly(date: any) {
    var hours = date.getHours();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    var strTime = ampm;
    return strTime;
  }
  //format yyyy-mm-dd
  String_TO_date(datestr: string) {
    const date = new Date(datestr);
    return date;
  }
  replaceMonth(monthNumber: number) {
    var Arb_Month = [
      'يناير',
      'فبراير',
      'مارس',
      'إبريل',
      'مايو',
      'يونيو',
      'يوليو',
      'أغسطس',
      'سبتمبر',
      'أكتوبر',
      'نوفمبر',
      'ديسمبر',
    ];
    return Arb_Month[monthNumber];
  }

  encrypt(key: any, value: any) {
    key = CryptoJS.enc.Utf8.parse(key);
    const i = CryptoJS.enc.Utf8.parse('1583288699248111');
    const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(value), key, {
      iv: i,
    }).toString();
    return ciphertext;
  }

  decrypt(key: any, value: any) {
    key = CryptoJS.enc.Utf8.parse(key);
    const i = CryptoJS.enc.Utf8.parse('1583288699248111');
    const decryptedData = CryptoJS.AES.decrypt(value, key, { iv: i });
    return decryptedData.toString(CryptoJS.enc.Utf8);
  }

  setToken(token: string): void {
    return localStorage.setItem('token', token);
  }

  getToken(): string {
    return localStorage.getItem('token') ?? '';
  }

  setStoBranch(BranchId: string): void {
    return localStorage.setItem('StoBranch', BranchId);
  }

  getStoBranch(): string {
    return localStorage.getItem('StoBranch') ?? '0';
  }
  setStoYear(YearId: string): void {
    return localStorage.setItem('StoYear', YearId);
  }

  getStoYear(): string {
    return localStorage.getItem('StoYear') ?? '0';
  }
  setStofiscalId(fiscalId: string): void {
    return localStorage.setItem('StofiscalId', fiscalId);
  }

  getStofiscalId(): string {
    return localStorage.getItem('StofiscalId') ?? '0';
  }

  ConvertNumToString(_num: any) {
    var url = `${environment.apiEndPoint}General/ConvertNumToString?Num=${_num}`;
    return this.http.get<any>(url);
  }

  GetWhatsAppSetting() {
    return this.http.get<any>(this.apiEndPoint + 'Organizations/GetWhatsAppSetting');
  }

  GetHijriDate(date: Date, url: any) {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(date);
    return this.http.post<any>(this.apiEndPoint + url, body, {
      headers: headers,
    });
  }
  GetGreogDate(date: any, url: any) {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(date);
    return this.http.post(this.apiEndPoint + url, body, { headers: headers });
  }

  GetOrganizationData() {
    return this.http.get<any>(
      this.apiEndPoint + 'Organizations/GetOrganizationData'
    );
  }

  setAction(action: string) {
    this.action = action;
  }

  getAction() {
    return this.action;
  }
}



export function isValidSEmailPattern(control: AbstractControl) {
  if (
    control.value == null ||
    control.value === '' ||
    control.value.length === 0
  ) {
    return null;
  }

  const regularExpression =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  //  const regularExpression = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$/;

  const res = regularExpression.test(String(control.value).toLowerCase());
  // console.log("ValidEmailPattern  " + control.value + res);
  if (res) {
    return null;
  } else {
    return { inValidEmailPattern: true };
  }
}
export function isValidSaudiId(control: AbstractControl) {
  if (control.value.length > 10) {
    return { invalidSaudiId: true };
    // "Number Can not be greater than 10";
  } else if (control.value.length < 10) {
    return { invalidSaudiId: true }; // "Number Can not be less than 10";
  }
  let x = 0;
  let total = 0;
  let subtotal = 0;
  const arr = []; // new int[10];
  let strTemp = control.value.substring(0, 1);
  for (let z = 0; z < 10; z++) {
    const c = Number(control.value.charCodeAt(z)); // (int)control.value.toString()[i];
    if (c < 48 || c > 57) {
      return { invalidSaudiId: true }; //"Identity Number can not contain characters";
    }
    arr[z] = c - 48;
  }
  for (let a = 0; a < 5; a++) {
    arr[a + x] = arr[a + x] * 2;
    if (arr[a + x] > 9) {
      arr[a + x] = arr[a + x] - 9;
    }
    x++;
  }
  for (let i = 0; i < 9; i++) {
    total += arr[i];
  }
  strTemp = total.toString();
  // const lastChar = strTemp.substring(strTemp.length - 1, 1);
  const lastChar = strTemp.substring(strTemp.length, 1);
  if (lastChar !== '0') {
    // subtotal = 10 - lastChar.To<int>();
    subtotal = 10 - Number(lastChar);
  } else {
    subtotal = 0;
  }
  if (arr[9] !== subtotal) {
    return { invalidSaudiId: true }; // "Invalid Id Number";
  }
  return null; // "Valid";
}

// Custom validator to check if email and confirmEmail fields match
export function emailMatchValidator(
  control: AbstractControl
): { [key: string]: boolean } | null {
  const email = control.get('Email');
  const confirmEmail = control.get('confirmEmail');

  if (!email || !confirmEmail) {
    return null;
  }

  return email.value === confirmEmail.value ? null : { emailMismatch: true };
}
