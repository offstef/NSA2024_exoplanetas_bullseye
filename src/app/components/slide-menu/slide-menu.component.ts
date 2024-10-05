import { Component, ElementRef, ViewChild } from '@angular/core';
import { ExoclickService } from '../../servicios/exoclick.service';

@Component({
  selector: 'app-slide-menu',
  templateUrl: './slide-menu.component.html',
  styleUrl: './slide-menu.component.scss'
})
export class SlideMenuComponent {
  exoplanetName: any;
  exoplanetID: any;
  exosplanetSmass: any;
  exosplanetTime0: any;
  exosplanetEccen:any;
  exosplanetLongp:any;
  exosplanetImpact:any;
  exosplanetDuration:any;
  exosplanetDepth:any;

  constructor(private exoclickService: ExoclickService) { }
  
  ngOnInit(): void {
    this.exoclickService.exoplanetClicked$.subscribe((exoplanet) => {
      this.openModal(exoplanet);
    });
  }
  
  showMenu: boolean = false;
  @ViewChild('modal', { static: true }) modal!: ElementRef;
  
  closeModal(){
    this.showMenu = false;
  }

  openModal(exoplanet: any) {
    this.exoplanetID = exoplanet.kepid;
    this.exoplanetName = exoplanet.kepler_name;
    this.exosplanetSmass = exoplanet.koi_smass;
    this.exosplanetTime0 = exoplanet.koi_time0;
    this.exosplanetEccen = exoplanet.koi_eccen;
    this.exosplanetLongp = exoplanet.koi_longp;
    this.exosplanetImpact = exoplanet.koi_impact;
    this.exosplanetDuration = exoplanet.koi_duration;
    this.exosplanetDepth = exoplanet.koi_depth;
    this.showMenu = !this.showMenu;
  }
}
