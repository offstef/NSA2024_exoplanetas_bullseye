import { Component, ElementRef, ViewChild } from '@angular/core';
import { ExoclickService } from '../../servicios/exoclick.service';

declare var bootstrap: any;

@Component({
  selector: 'app-slide-menu',
  templateUrl: './slide-menu.component.html',
  styleUrl: './slide-menu.component.scss'
})
export class SlideMenuComponent {
  exoplanetName: any;
  exoplanetID: any;
  exosmass: any;
  exosplanetSmass: any;

  constructor(private exoclickService: ExoclickService) { }
  
  ngOnInit(): void {
    this.exoclickService.exoplanetClicked$.subscribe((exoplanet) => {
      this.openModal(exoplanet);
    });
  }
  
  showMenu: boolean = false;
  @ViewChild('modal', { static: false }) modal!: ElementRef;

  openModal(exoplanet: any) {
    const modalElement = this.modal.nativeElement;
    const modalBootstrap = new bootstrap.Modal(modalElement);
    modalBootstrap.show();
    this.exoplanetID = exoplanet.kepid;
    this.exoplanetName = exoplanet.kepler_name;
    this.exosplanetSmass = exoplanet.koi_smass;
  }
}
