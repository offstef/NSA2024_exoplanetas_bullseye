import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExoclickService {
  private exoplanetClickedSource = new Subject<any>();

  exoplanetClicked$ = this.exoplanetClickedSource.asObservable();

  notifyExoplanetClicked(exoplanet: any): void {
    this.exoplanetClickedSource.next(exoplanet);
  }
}
