import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hijriDate',
})
export class HijriDatePipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    let date = value || new Date(),
      lang = 'ar';
    var options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    let res: Date = date.toLocaleString(lang  , options);

    let day = date.getDay();

    var days = [
      'اﻷحد',
      'اﻷثنين',
      'الثلاثاء',
      'اﻷربعاء',
      'الخميس',
      'الجمعة',
      'السبت',
    ];

    return days[day] + ' ' + res;
  }
}
