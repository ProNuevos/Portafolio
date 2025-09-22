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

    private estimateFormValidSource = new BehaviorSubject<boolean>(false);
  estimateFormValid$ = this.estimateFormValidSource.asObservable();

   private formFieldsSource = new BehaviorSubject<{ tipo: string; contacto: string }>({ tipo: '', contacto: '' });
  formFields$ = this.formFieldsSource.asObservable();

  updateHeroData(data: any) {
    this.heroDataSource.next(data);
  }

  clearHeroData() {
    this.heroDataSource.next(null);
  }

    triggerHeroFormReset() {
    this.resetHeroFormSource.next(true);
  }

   updateEstimateFormValid(isValid: boolean) {
    this.estimateFormValidSource.next(isValid);
  }

  updateFormFields(tipo: string, contacto: string) {
    this.formFieldsSource.next({ tipo, contacto });
  }
}
