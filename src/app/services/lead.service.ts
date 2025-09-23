import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeadService {

 //private apiUrl = 'http://localhost:8080/api/leads'; // URL del endpoint del backend (ajusta si es diferente)

 private apiUrl = 'https://orbitaback-production.up.railway.app/api/leads';
  constructor(private http: HttpClient) {}

  saveLead(lead: any): Observable<any> {
    return this.http.post(this.apiUrl, lead);
  }
}
