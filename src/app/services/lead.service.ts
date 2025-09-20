import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeadService {

 private apiUrl = 'http://localhost:8080/api/leads'; // URL del endpoint del backend (ajusta si es diferente)

  constructor(private http: HttpClient) {}

  saveLead(lead: any): Observable<any> {
    return this.http.post(this.apiUrl, lead);
  }
}
