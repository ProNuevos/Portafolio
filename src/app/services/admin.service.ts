import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export type LeadStatus = 'Nuevo' | 'Contactado' | 'En conversación' | 'Propuesta enviada' | 'Ganado' | 'Descartado';
export interface AdminLead { id: number; fecha: string; tipo: string; alcance: string; contacto: string; mensaje?: string; hits: number; estimado: number; estado: LeadStatus; notas?: string; }
export interface AdminContact { id: number; fecha: string; nombre: string; email?: string; whatsapp?: string; mensaje: string; estado: LeadStatus; notas?: string; }
export interface AdminDashboard { leads: AdminLead[]; contacts: AdminContact[]; }

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly api = `${environment.apiUrl}/admin`;
  private readonly options = { withCredentials: true };
  constructor(private readonly http: HttpClient) {}
  login(username: string, password: string) { return this.http.post(`${this.api}/login`, { username, password }, this.options); }
  logout() { return this.http.post(`${this.api}/logout`, {}, this.options); }
  dashboard(): Observable<AdminDashboard> { return this.http.get<AdminDashboard>(`${this.api}/dashboard`, this.options); }
  updateLead(id: number, estado: LeadStatus, notas: string) { return this.http.put(`${this.api}/leads/${id}`, { estado, notas }, this.options); }
  updateContact(id: number, estado: LeadStatus, notas: string) { return this.http.put(`${this.api}/contacts/${id}`, { estado, notas }, this.options); }
  deleteLead(id: number) { return this.http.delete(`${environment.apiUrl}/leads/${id}`, this.options); }
  deleteContact(id: number) { return this.http.delete(`${environment.apiUrl}/contacts/${id}`, this.options); }
}
