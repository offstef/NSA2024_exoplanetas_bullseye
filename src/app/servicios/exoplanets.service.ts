import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ExoplanetData {
  kepler_name: string;
  koi_disposition: string;
  koi_period: number;
  koi_prad: number;
}

@Injectable({
  providedIn: 'root',
})
export class ExoplanetsService {
  private apiUrl = 'https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?table=cumulative&where=koi_disposition%20like%20%27CONFIRMED%27&format=json';

  constructor(private http: HttpClient) { }

  fetchData(): Observable<ExoplanetData[]> {
    return this.http.get<ExoplanetData[]>(this.apiUrl);
  }
}
