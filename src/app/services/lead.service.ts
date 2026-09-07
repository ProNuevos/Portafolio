import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LeadPayload {
  tipo: string;
  alcance: string;
  contacto: string;
  mensaje?: string;
  hits: number;
  estimado: number;
}

@Injectable({
  providedIn: 'root'
})
export class LeadService {

  private readonly apiUrl = `${environment.apiUrl}/leads`;

  constructor(private http: HttpClient) {}

  saveLead(lead: LeadPayload): Observable<LeadPayload> {
    return this.http.post<LeadPayload>(this.apiUrl, lead);
  }
}
