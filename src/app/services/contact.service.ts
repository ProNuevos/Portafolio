import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ContactPayload {
  nombre: string;
  email?: string;
  whatsapp: string;
  mensaje: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  private readonly apiUrl = `${environment.apiUrl}/contacts`;

  constructor(private http: HttpClient) {}

  saveContact(contact: ContactPayload): Observable<ContactPayload> {
    return this.http.post<ContactPayload>(this.apiUrl, contact);
  }
}
