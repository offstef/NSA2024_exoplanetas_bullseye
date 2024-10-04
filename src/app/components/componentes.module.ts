import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExoplanetsComponent } from './exoplanets/exoplanets.component';
@NgModule({
    declarations: [
        ExoplanetsComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [
        ExoplanetsComponent
    ]
})
export class ComponentsModule { }
