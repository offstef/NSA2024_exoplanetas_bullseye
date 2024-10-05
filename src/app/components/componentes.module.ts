import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExoplanetsComponent } from './exoplanets/exoplanets.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BarraBusquedaComponent } from "./barraBusqueda/barraBusqueda.component";
import { SlideMenuComponent } from './slide-menu/slide-menu.component';

import { ExoplanetSphereComponent } from './exoplanet-sphere/exoplanet-sphere.component';

@NgModule({
    declarations: [
        ExoplanetsComponent,
        ExoplanetSphereComponent,
        BarraBusquedaComponent,
        SlideMenuComponent
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule
    ],
  exports: [
    ExoplanetsComponent,
    BarraBusquedaComponent,
    ExoplanetSphereComponent,
    SlideMenuComponent
  ]
})
export class ComponentsModule { }
