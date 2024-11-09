import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from '../services/authentication.service';
import { SharedService } from '../services/shared.service';
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private sharedService: SharedService

    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      const userG = this.authenticationService.userGlobalObj;
      if (userG) {
        if (!(userG?.token)) {
          this.router.navigate(['auth']);
          return false;
        }
        // authorised so return true
        return true;
      }


      this.router.navigate(['auth'], { queryParams: { returnUrl: state.url } });
      return false;
  }

}
