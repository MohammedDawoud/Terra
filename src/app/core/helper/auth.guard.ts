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
        else
        {
          if(state.url=="/customers/search" && userG?.pagesList.includes(1368619))return true;       
          else if(state.url=="/employees/search" && userG?.pagesList.includes(2111613))return true;        
          else if(state.url=="/projects/preview" && userG?.pagesList.includes(3122911))return true;       
          else if(state.url=="/projects/meeting" && userG?.pagesList.includes(3213321))return true; 
          else if(state.url=="/projects/design" && userG?.pagesList.includes(3222111))return true;    
          else if(state.url=="/controlpanel/organization" && userG?.pagesList.includes(4117341))return true;                                      
          else if(state.url=="/accounts/Accounts_guide" && userG?.pagesList.includes(4132216))return true;
          else if(state.url=="/dash/home")return true;     
          else return false;        
        }
        // authorised so return true
        return true;
      }


      this.router.navigate(['auth'], { queryParams: { returnUrl: state.url } });
      return false;
  }

}
