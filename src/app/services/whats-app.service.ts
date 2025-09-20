import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WhatsAppService {

  constructor() { }

  private waLinkSource = new BehaviorSubject<string>('whatsapp://send?phone=5491128634744&text=');
  waLink$ = this.waLinkSource.asObservable();

  updateWaLink(waLink: string) {
    this.waLinkSource.next(waLink);
  }
}
