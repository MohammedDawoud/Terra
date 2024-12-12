import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { first } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RestApiService } from 'src/app/shared/services/api.service';
import { SharedService } from 'src/app/core/services/shared.service';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.scss'],
})
export class purchaseComponent implements OnInit {
  text = false;
  qrCodeCheckValue: string;
  logoUrl: any;
  checked = false;
  lang: any = 'ar';
  constructor(
    private toast: ToastrService,
    private router: Router,
    private translate: TranslateService,
    private authenticationService: AuthenticationService,
    private api: RestApiService,
    private sharedservice: SharedService
  ) {

  }

  ngOnInit(): void {
  }


}
