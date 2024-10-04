import { Component, OnInit } from '@angular/core';
import { ExoplanetsService, ExoplanetData } from '../../servicios/exoplanets.service';

@Component({
  selector: 'app-exoplanets',
  templateUrl: './exoplanets.component.html',
  styleUrls: ['./exoplanets.component.scss'],
})
export class ExoplanetsComponent implements OnInit {
  data: ExoplanetData[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(private exoplanetsService: ExoplanetsService) { }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.exoplanetsService.fetchData().subscribe({
      next: (response) => {
        this.data = response;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error fetching data';
        this.loading = false;
      },
    });
  }
}
