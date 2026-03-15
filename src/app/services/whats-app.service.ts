import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WhatsAppService {

  private readonly defaultLink = `whatsapp://send?phone=${environment.waPhone}&text=`;
  private waLinkSource = new BehaviorSubject<string>(this.defaultLink);
  waLink$ = this.waLinkSource.asObservable();

  updateWaLink(waLink: string) {
    this.waLinkSource.next(waLink);
  }
}
