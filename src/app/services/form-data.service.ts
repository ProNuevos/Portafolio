import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormDataService {

  public heroDataSource = new BehaviorSubject<any>(null);
  heroData$ = this.heroDataSource.asObservable();

  private resetHeroFormSource = new BehaviorSubject<boolean>(false);
  resetHeroForm$ = this.resetHeroFormSource.asObservable();

  updateHeroData(data: any) {
    this.heroDataSource.next(data);
  }

  clearHeroData() {
    this.heroDataSource.next(null);
  }

    triggerHeroFormReset() {
    this.resetHeroFormSource.next(true);
  }
}
