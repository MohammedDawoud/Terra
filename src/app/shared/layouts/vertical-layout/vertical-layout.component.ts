import { HandelSideBarService } from './../../services/handel-side-bar.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { LayoutAnimation } from '../../animations/layout.animation';

@Component({
  selector: 'app-vertical-layout',
  templateUrl: './vertical-layout.component.html',
  styleUrls: ['./vertical-layout.component.scss'],
  animations: [LayoutAnimation],
})
export class VerticalLayoutComponent implements OnInit, AfterViewInit {
  mainSidebarOpen: any;

  isOpen: any;
  scrolled: any;

  // to top component
  show!: boolean;

  constructor(private handelSidebar: HandelSideBarService) {}

  ngOnInit(): void {
    // handel sidebar is opened or closed
    this.checkSideBarState();
  }

  ngAfterViewInit(): void {
    this.checkWindowHight();
  }

  scroll(event: any) {
    var a = event?.target?.scrollTop;
    var b = event?.target?.scrollHeight - event?.target?.clientHeight;

    var c = a / b;

    if (c != 0) {
      this.scrolled = true;
    } else {
      this.scrolled = false;
    }
  }
  // Handel Scroll To Top
  checkWindowHight() {
    let mainContrent: any = document.getElementById('mainContent');

    if (mainContrent?.scrollTop > 500) {
      this.show = true;
    } else {
      this.show = false;
    }

    mainContrent.onscroll = () => {
      if (mainContrent?.scrollTop >= 500) {
        this.show = true;
      } else {
        this.show = false;
      }
    };
  }
  goToTop() {
    let mainContrent: any = document.getElementById('mainContent');
    setTimeout(() => {
      mainContrent.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    }, 250);
  }

  checkSideBarState(): void {
    this.handelSidebar.sideBarState.subscribe((res) => {
      if (res != null) {
        this.isOpen = res;
      } else {
        this.isOpen = true;
      }
    });
  }
}
