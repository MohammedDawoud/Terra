import { animate, style, transition, trigger } from '@angular/animations';

export const ToggleBtnAnimation = trigger('toggle-btn-animation', [
  transition('*<=>*', [
    style({ transform: 'scale(0)', opacity: 0 }),
    animate('0.5s ease'),
    style({ transform: 'scale(1)', opacity: 1 }),
  ]),
]);
export const fade = trigger('fade', [
  transition('*<=>*', [
    style({ opacity: 0 }),
    animate('0.5s ease'),
    style({ opacity: 1 }),
  ]),
]);
