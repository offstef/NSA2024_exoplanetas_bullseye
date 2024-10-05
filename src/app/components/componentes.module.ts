import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExoplanetsComponent } from './exoplanets/exoplanets.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import {BarraBusquedaComponent} from "./barraBusqueda/barraBusqueda.component";

@NgModule({
    declarations: [
        ExoplanetsComponent,
      BarraBusquedaComponent

@NgModule({
    declarations: [
        ExoplanetsComponent
    ],
    imports: [
        CommonModule
    ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule
  ],
    exports: [
        ExoplanetsComponent,
      BarraBusquedaComponent
    ]
})
export class ComponentsModule { }
