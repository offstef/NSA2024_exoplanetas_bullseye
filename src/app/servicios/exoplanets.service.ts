import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';

export interface ExoplanetData {
  kepid: number;
  kepler_name: string;
  koi_disposition: string;
  koi_period: number;
  koi_smass: number,
  koi_prad: number;
  koi_time0: number;
  koi_eccen:number;
  koi_longp:number;
  koi_impact:number;
  koi_duration:number;
  koi_depth:number;
  ra: number;
  dec: number;
}

@Injectable({
  providedIn: 'root',
})
export class ExoplanetsService {
  private apiUrl = 'https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?table=cumulative&where=koi_disposition%20like%20%27CONFIRMED%27&format=json&select=kepid,kepler_name,koi_disposition,koi_smass,koi_eccen,koi_depth,koi_duration,koi_impact,koi_longp,koi_period,koi_prad,ra,dec&order=koi_prad&limit=100';

  private selectedExoplanetSource = new BehaviorSubject<ExoplanetData | null>(null);
  selectedExoplanet$ = this.selectedExoplanetSource.asObservable();

  constructor(private http: HttpClient) { }

  fetchData(): Observable<ExoplanetData[]> {
    return this.http.get<ExoplanetData[]>(this.apiUrl);
  }
  selectExoplanet(exoplanet: ExoplanetData) {
    this.selectedExoplanetSource.next(exoplanet);
  }
}
