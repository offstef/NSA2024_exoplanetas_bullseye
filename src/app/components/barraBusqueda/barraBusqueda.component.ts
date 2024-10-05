import { Component } from '@angular/core';

interface Exoplaneta{
  nombre:string,
  descripcion:string
}

@Component({
  selector: 'app-barraBusqueda',
  templateUrl: './barraBusqueda.component.html',
  styleUrls: ['./barraBusqueda.component.scss'],
})


export class BarraBusquedaComponent {
  exoplaneta={
    nombre:"Nombre",
    coordenadas:"Coordenadas"
  }
  exoplanetas: Exoplaneta[] = [
    {
      nombre: 'Kepler-22b',
      descripcion: 'Un exoplaneta ubicado en la zona habitable de su estrella, a unos 600 años luz de la Tierra. Se cree que podría tener agua líquida en su superficie.'
    },
    {
      nombre: 'Proxima Centauri b',
      descripcion: 'Este es el exoplaneta más cercano a la Tierra, orbitando la estrella Proxima Centauri a solo 4.2 años luz de distancia. Es un candidato potencial para albergar vida.'
    },
    {
      nombre: 'TRAPPIST-1e',
      descripcion: 'Uno de los siete planetas que orbitan la estrella enana TRAPPIST-1. Se encuentra en la zona habitable y podría tener agua en estado líquido.'
    },
    {
      nombre: 'Gliese 581d',
      descripcion: 'Un exoplaneta supertierra que podría tener condiciones favorables para la vida. Se encuentra en la zona habitable de su estrella a unos 20 años luz de distancia.'
    },
    {
      nombre: 'HD 209458 b',
      descripcion: 'Uno de los primeros exoplanetas descubiertos que tiene una atmósfera. Es un gigante gaseoso ubicado a unos 150 años luz de la Tierra.'
    }
  ];
  searchTerm: string = '';
  filteredExoplanetas: Exoplaneta[]=[...this.exoplanetas];

  onSearch() {
    console.log(this.searchTerm);
// Filtrar los exoplanetas por nombre o descripción
    this.filteredExoplanetas = this.exoplanetas.filter(exoplaneta =>
      exoplaneta.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      exoplaneta.descripcion.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

}
