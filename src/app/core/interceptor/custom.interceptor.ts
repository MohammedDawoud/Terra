import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { SharedService } from 'src/app/core/services/shared.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';


@Injectable()
export class CustomInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthenticationService,
    private sharedService: SharedService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    var Checkreset=document.location.hash.includes("#/auth/reset-password");
    if(document.location.hash=="#/accept-offer-price")
    {

    }
    else if(Checkreset)
    {

    }
    else if (request.url != 'https://jsonplaceholder.typicode.com/users') {
      const userG = this.authenticationService.userGlobalObj;
      if (userG?.token) {
        const token = 'bearer ' + userG?.token;
        request = request.clone({ headers: request.headers.set('Authorization', token) });
        request = request.clone({ headers: request.headers.set('KEY', "adsdasd") });
        request = request.clone({ headers: request.headers.set('Access-Control-Allow-Headers', "Content-Type") });
        request = request.clone({ headers: request.headers.set('Access-Control-Allow-Origin', "https://almansoroffice.net") });
        request = request.clone({ headers: request.headers.set('Access-Control-Allow-Method', "OPTIONS,POST,GET") });
        request = request.clone({ headers: request.headers.set('Accept-Language',"en,ar;q=0.9,en-US;q=0.8,ar-SA")});


        request = request.clone({ headers: request.headers.set('BranchId', this.sharedService.getStoBranch()) });
        request = request.clone({ headers: request.headers.set('Lang', "rtl") });
        request = request.clone({ headers: request.headers.set('YearId', this.sharedService.getStoYear()) });


      }
      else if (this.authenticationService.allowWithoutToken == "allowWithoutToken") {

        const token = 'bearer ' + userG?.token;
        request = request.clone({ headers: request.headers.set('Authorization', token) });
        request = request.clone({ headers: request.headers.set('KEY', "adsdasd") });
        request = request.clone({ headers: request.headers.set('Access-Control-Allow-Headers', "Content-Type") });
        request = request.clone({ headers: request.headers.set('Access-Control-Allow-Origin', "https://almansoroffice.net") });
        request = request.clone({ headers: request.headers.set('Access-Control-Allow-Method', "OPTIONS,POST,GET") });
        // request = request.clone({ headers: request.headers.set('Accept-Language',this.config.Language)});
        request = request.clone({ headers: request.headers.set('Accept-Language',"en,ar;q=0.9,en-US;q=0.8,ar-SA")});

        request = request.clone({ headers: request.headers.set('BranchId', this.sharedService.getStoBranch()) });
        request = request.clone({ headers: request.headers.set('Lang', "rtl") });
        request = request.clone({ headers: request.headers.set('YearId', this.sharedService.getStoYear()) });
      }
      else {

        this.authenticationService.logout();
      }

    }
    return next.handle(request).pipe(catchError(err => {
      debugger
      if ([401, 403].indexOf(err.status) !== -1) {
        // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
        this.authenticationService.logout();
      }

      const error = err?.error?.reasonPhrase || err?.error?.text;
      console.log(error);
      return throwError(error);
    }));


  }
}
