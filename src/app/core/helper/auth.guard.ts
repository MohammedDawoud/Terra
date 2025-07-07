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
          if(state.url=="/customers/search" && userG?.pagesList.includes(1200))return true;       
          else if(state.url=="/employees/search" && userG?.pagesList.includes(1300))return true;        
          else if(state.url=="/projects/preview" && userG?.pagesList.includes(1400))return true;       
          else if(state.url=="/projects/meeting" && userG?.pagesList.includes(1401))return true; 
          else if(state.url=="/projects/design" && userG?.pagesList.includes(1402))return true;    
          else if(state.url=="/controlpanel/organization" && userG?.pagesList.includes(160001))return true;                                      
          else if(state.url=="/accounts/Accounts_guide" && userG?.pagesList.includes(160002))return true;
          else if(state.url=="/controlpanel/users" && userG?.pagesList.includes(160101))return true;
          else if(state.url=="/accounts/Categories" && userG?.pagesList.includes(1500))return true;
          else if(state.url=="/accounts/contracts" && userG?.pagesList.includes(1502))return true;
          else if(state.url=="/accounts/offers" && userG?.pagesList.includes(1501))return true;
          else if(state.url=="/accounts/revoucher" && userG?.pagesList.includes(1503))return true;
          else if(state.url=="/accounts/payvoucher" && userG?.pagesList.includes(1505))return true;
          else if(state.url=="/accounts/openvoucher" && userG?.pagesList.includes(1506))return true;
          else if(state.url=="/accounts/Account_Statement" && userG?.pagesList.includes(150401))return true;
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
