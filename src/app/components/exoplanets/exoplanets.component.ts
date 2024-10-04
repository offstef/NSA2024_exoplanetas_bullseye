import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface ExoplanetData {
  kepler_name: string,
  koi_disposition: string;
  koi_period: number;
  koi_prad: number;
}

@Component({
  selector: 'app-exoplanets',
  templateUrl: './exoplanets.component.html',
  styleUrls: ['./exoplanets.component.scss'],
})
export class ExoplanetsComponent implements OnInit {
  data: ExoplanetData[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.http
      .get<ExoplanetData[]>(
        'https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?table=cumulative&where=koi_disposition%20like%20%27CONFIRMED%27&format=json'
      )
      .subscribe({
        next: (response) => {
          this.data = response;
          console.log(this.data)
          this.loading = false;
        },
        error: () => {
          this.error = 'Error fetching data';
          this.loading = false;
        },
      });
  }
}