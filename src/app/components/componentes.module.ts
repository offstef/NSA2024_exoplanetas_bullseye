import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExoplanetsComponent } from './exoplanets/exoplanets.component';
import { HttpClientModule } from '@angular/common/http';
@NgModule({
    declarations: [
        ExoplanetsComponent
    ],
    imports: [
        CommonModule,
        HttpClientModule
    ],
    exports: [
        ExoplanetsComponent
    ]
})
export class ComponentsModule { }
