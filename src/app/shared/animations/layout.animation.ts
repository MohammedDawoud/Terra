import { animate, style, transition, trigger } from '@angular/animations';

export const LayoutAnimation = trigger('layout-animation', [
  transition('*<=>*', [
    style({ transform: 'translatex(-100%)' }),
    animate('.3s ease'),
    style({ transform: 'translatex(0)' }),
  ]),
]);
