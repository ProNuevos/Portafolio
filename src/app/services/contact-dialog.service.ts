import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ContactDialogService {
  private readonly requests = new Subject<void>();
  readonly openRequests$ = this.requests.asObservable();

  open() { this.requests.next(); }
}
