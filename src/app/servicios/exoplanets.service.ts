import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ExoplanetData {
  kepid: number;
  kepler_name: string;
  koi_disposition: string;
  koi_period: number;
  koi_prad: number;
  ra: number;
  dec: number;
}

@Injectable({
  providedIn: 'root',
})
export class ExoplanetsService {
  private apiUrl = 'https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?table=cumulative&where=koi_disposition%20like%20%27CONFIRMED%27&format=json&select=kepid,kepler_name,koi_disposition,koi_period,koi_prad,ra,dec&order=koi_prad&limit=100';

  constructor(private http: HttpClient) { }

  fetchData(): Observable<ExoplanetData[]> {
    return this.http.get<ExoplanetData[]>(this.apiUrl);
  }
}
