import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  private apiUrl = 'http://localhost:8080/api/contacts'; // Ajusta el puerto si es diferente

  constructor(private http: HttpClient) {}

  saveContact(contact: any): Observable<any> {
    return this.http.post(this.apiUrl, contact);
  }
}
