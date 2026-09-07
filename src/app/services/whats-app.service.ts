import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({ providedIn: 'root' })
export class WhatsAppService {
  private waLinkSource = new BehaviorSubject<string>(this.buildLink());
  readonly waLink$ = this.waLinkSource.asObservable();
  buildLink(message = 'Hola Órbita, me interesan sus servicios.') {
    return 'https://wa.me/' + environment.waPhone.replace(/\D/g, '') + '?text=' + encodeURIComponent(message);
  }
  updateWaLink(link: string) { this.waLinkSource.next(link); }
  open(link: string) { window.open(link, '_blank', 'noopener,noreferrer'); }
}
