import { Component, ElementRef, ViewChild } from '@angular/core';

declare var bootstrap: any;

@Component({
  selector: 'app-slide-menu',
  templateUrl: './slide-menu.component.html',
  styleUrl: './slide-menu.component.scss'
})
export class SlideMenuComponent {
  showMenu: boolean = false;


  @ViewChild('modal', { static: false }) modal!: ElementRef;

  openModal() {
    const modalElement = this.modal.nativeElement;
    const modalBootstrap = new bootstrap.Modal(modalElement);
    modalBootstrap.show();
  }
}
