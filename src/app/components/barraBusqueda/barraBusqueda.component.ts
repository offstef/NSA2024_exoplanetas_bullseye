import { Component } from '@angular/core';
import { ExoplanetData, ExoplanetsService } from "../../servicios/exoplanets.service";

interface Exoplaneta {
  kepid: number;
  kepler_name: string;
  koi_disposition: string;
  koi_period: number;
  koi_prad: number;
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

  constructor(private exoplanetsService: ExoplanetsService) {}

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
    // Filtrar los exoplanetas por nombre o descripción
    this.filteredExoplanetas = this.data.filter(exoplaneta =>
      exoplaneta.kepler_name.toLowerCase().includes(this.searchTerm.toLowerCase()) // Asegúrate de que 'kepler_name' sea el campo correcto
    );
  }
}
