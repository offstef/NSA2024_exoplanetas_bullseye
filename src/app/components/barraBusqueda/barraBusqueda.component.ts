import { Component } from '@angular/core';
import { ExoplanetData, ExoplanetsService } from "../../servicios/exoplanets.service";
import * as THREE from 'three';
import { ExoclickService } from '../../servicios/exoclick.service';

interface Exoplaneta {
  kepid: number;
  kepler_name: string;
  koi_disposition: string;
  koi_period: number;
  koi_prad: number;
  ra: number;
  dec: number;
}

@Component({
  selector: 'app-barraBusqueda',
  templateUrl: './barraBusqueda.component.html',
  styleUrls: ['./barraBusqueda.component.scss'],
})
export class BarraBusquedaComponent {
  data: ExoplanetData[] = [];
  showInput: boolean = false; // Variable para controlar la visibilidad del input
  searchTerm: string = '';
  filteredExoplanetas: Exoplaneta[] = [];

  constructor(private exoplanetsService: ExoplanetsService, private exoclickService: ExoclickService) { }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.exoplanetsService.fetchData().subscribe({
      next: (response) => {
        this.data = response;
        // Inicializa filteredExoplanetas aquí si es necesario
        this.filteredExoplanetas = this.data; // Puedes inicializarlo si lo necesitas
      },
      error: () => {
        console.error('Error fetching data');
      },
    });
  }

  toggleInput() {
    this.showInput = !this.showInput; // Alterna la visibilidad
  }

  onSearch() {
    console.log(this.searchTerm);

    const index = this.data.findIndex(exoplanet =>
      exoplanet.kepler_name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    if (index !== -1) {
      const exoplanet = this.data[index];

      // Llama al servicio para seleccionar el exoplaneta
      this.exoplanetsService.selectExoplanet(exoplanet);
      console.log('Exoplaneta encontrado:', this.data[index]);
      console.log('Índice del exoplaneta:', index);

      const raInRadians = THREE.MathUtils.degToRad(exoplanet.ra);
      const decInRadians = THREE.MathUtils.degToRad(exoplanet.dec);

      const distance = exoplanet.koi_period;

      const x = distance * Math.cos(decInRadians) * Math.cos(raInRadians);
      const y = distance * Math.cos(decInRadians) * Math.sin(raInRadians);
      const z = distance * Math.sin(decInRadians);

      console.log(`Coordenadas cartesianas: x=${x}, y=${y}, z=${z}`);

      this.exoplanetsService.selectExoplanet(exoplanet);

      this.exoclickService.notifyExoplanetClicked(exoplanet);

    } else {
      console.log('Exoplaneta no encontrado');
    }
  }
}
