import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

@Pipe({ name: 'img' })
export class Imageipe implements PipeTransform {
    constructor() {}
    transform(url:any) {
        if (!url || url.indexOf('assets') > -1) return  '/assets/images/userprofile.png';
        else if (url.indexOf('data:image/') > -1) return url;
        else return environment.PhotoURL + url;
        // else return url;
    }
}
