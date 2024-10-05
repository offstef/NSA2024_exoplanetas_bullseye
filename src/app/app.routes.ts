import { Routes } from '@angular/router';
import { ExoplanetsComponent } from './components/exoplanets/exoplanets.component';
import { ExoplanetSphereComponent } from './components/exoplanet-sphere/exoplanet-sphere.component';

export const routes: Routes = [
    {
        path: 'exoplanetas',
        component: ExoplanetsComponent
    },
    {
        path: 'esfera',
        component: ExoplanetSphereComponent
    },
];
