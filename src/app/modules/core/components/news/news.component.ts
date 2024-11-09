import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { RestApiService } from 'src/app/shared/services/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
})
export class NewsComponent implements OnInit {
  news: any;
  environmenturl: any;

  constructor(private api: RestApiService, private authenticationService: AuthenticationService,) {
    this.environmenturl = environment.PhotoURL;
  }
  ngOnInit(): void {
    this.news = []
    //  [
    //   {
    //     id: 1,
    //     image: '/assets/images/logo_image.png',
    //     category: { ar: 'مثال', en: 'Lorem' },
    //     title: {
    //       ar: 'هذا النص هو مثال',
    //       en: 'Lorem ipsum dolor',
    //     },
    //     date: new Date(),
    //     desc: {
    //       ar: 'هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربى، حيث يمكنك أن تولد مثل هذا النص',
    //       en: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis repudiandae ipsam illum id nemo quia.',
    //     },
    //   },
    //   {
    //     id: 2,
    //     image: '/assets/images/logo_image.png',
    //     category: { ar: 'مثال', en: 'Lorem' },
    //     title: {
    //       ar: 'هذا النص هو مثال',
    //       en: 'Lorem ipsum dolor',
    //     },
    //     date: new Date(),
    //     desc: {
    //       ar: 'هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربى، حيث يمكنك أن تولد مثل هذا النص',
    //       en: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis repudiandae ipsam illum id nemo quia.',
    //     },
    //   },
    //   {
    //     id: 3,
    //     image: '/assets/images/logo_image.png',
    //     category: { ar: 'مثال', en: 'Lorem' },
    //     title: {
    //       ar: 'هذا النص هو مثال',
    //       en: 'Lorem ipsum dolor',
    //     },
    //     date: new Date(),
    //     desc: {
    //       ar: 'هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربى، حيث يمكنك أن تولد مثل هذا النص',
    //       en: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis repudiandae ipsam illum id nemo quia.',
    //     },
    //   },
    // ];
    this.GetAllNews()
  }
  GetAllNews() {
    this.authenticationService.allowWithoutToken = "allowWithoutToken"
    this.api.GetAllNews().subscribe(
      {
        next: (res: any) => {
          this.authenticationService.allowWithoutToken = ""
          this.news = res.result
        },
        error: (error) => {
          this.authenticationService.allowWithoutToken = ""
        },
      });
  }

}
