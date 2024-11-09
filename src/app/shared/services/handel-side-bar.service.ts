import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HandelSideBarService {
  sideBarState: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor() {}
}
