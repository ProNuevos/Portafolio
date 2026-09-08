import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminContact, AdminDashboard, AdminLead, AdminService, LeadStatus } from '../../services/admin.service';
import { WhatsAppService } from '../../services/whats-app.service';

type LeadRecord = AdminLead & { kind: 'lead' };
type ContactRecord = AdminContact & { kind: 'contact' };
type RecordItem = LeadRecord | ContactRecord;

@Component({ selector: 'app-admin-panel', standalone: true, imports: [CommonModule, FormsModule], templateUrl: './admin-panel.component.html', styleUrl: './admin-panel.component.scss' })
export class AdminPanelComponent {
  @ViewChild('loginDialog', { static: true }) loginDialog!: ElementRef<HTMLDialogElement>;
  @ViewChild('panelDialog', { static: true }) panelDialog!: ElementRef<HTMLDialogElement>;
  username = ''; password = ''; showPassword = false; error = ''; loading = false; tab: 'leads' | 'contacts' = 'leads'; query = ''; status = ''; dashboard: AdminDashboard = { leads: [], contacts: [] }; selected?: RecordItem;
  readonly statuses: LeadStatus[] = ['Nuevo', 'Contactado', 'En conversación', 'Propuesta enviada', 'Ganado', 'Descartado'];
  constructor(private readonly admin: AdminService, private readonly whatsapp: WhatsAppService) {}
  @HostListener('window:keydown', ['$event']) onKeydown(event: KeyboardEvent) {
    const opensAdmin = event.ctrlKey && event.altKey && event.key.toLowerCase() === 'l';
    if (opensAdmin) { event.preventDefault(); this.openLogin(); }
  }
  openLogin() { if (!this.panelDialog.nativeElement.open && !this.loginDialog.nativeElement.open) this.loginDialog.nativeElement.showModal(); }
  closeLogin() { this.loginDialog.nativeElement.close(); this.password = ''; this.showPassword = false; this.error = ''; }
  login() { this.loading = true; this.error = ''; this.admin.login(this.username, this.password).subscribe({ next: () => { this.closeLogin(); this.openPanel(); }, error: () => { this.loading = false; this.error = 'Usuario o contraseña incorrectos.'; } }); }
  openPanel() { this.load(); if (!this.panelDialog.nativeElement.open) this.panelDialog.nativeElement.showModal(); }
  closePanel() { this.panelDialog.nativeElement.close(); this.selected = undefined; }
  load() { this.loading = true; this.admin.dashboard().subscribe({ next: data => { this.dashboard = data; this.loading = false; }, error: () => { this.loading = false; this.closePanel(); this.openLogin(); this.error = 'La sesión expiró. Ingresá nuevamente.'; } }); }
  get records(): RecordItem[] { const base: RecordItem[] = this.tab === 'leads' ? this.dashboard.leads.map(x => ({ ...x, kind: 'lead' })) : this.dashboard.contacts.map(x => ({ ...x, kind: 'contact' })); const text = this.query.toLowerCase().trim(); return base.filter(item => (!this.status || item.estado === this.status) && (!text || JSON.stringify(item).toLowerCase().includes(text))); }
  get newCount() { return [...this.dashboard.leads, ...this.dashboard.contacts].filter(x => x.estado === 'Nuevo').length; }
  get wonCount() { return [...this.dashboard.leads, ...this.dashboard.contacts].filter(x => x.estado === 'Ganado').length; }
  select(item: RecordItem) { this.selected = { ...item }; }
  save() { if (!this.selected) return; const request = this.selected.kind === 'lead' ? this.admin.updateLead(this.selected.id, this.selected.estado, this.selected.notas ?? '') : this.admin.updateContact(this.selected.id, this.selected.estado, this.selected.notas ?? ''); request.subscribe(() => this.load()); }
  remove() { if (!this.selected || !confirm('¿Eliminar este registro definitivamente?')) return; const request = this.selected.kind === 'lead' ? this.admin.deleteLead(this.selected.id) : this.admin.deleteContact(this.selected.id); request.subscribe(() => { this.selected = undefined; this.load(); }); }
  itemTitle(item: RecordItem) { return item.kind === 'lead' ? item.tipo : item.nombre; }
  itemContact(item: RecordItem) { return item.kind === 'lead' ? item.contacto : (item.email || item.whatsapp || 'Sin contacto'); }
  canWhatsApp(item: RecordItem) { return item.kind === 'lead' ? item.contacto.startsWith('+') || /^\d/.test(item.contacto) : Boolean(item.whatsapp); }
  openWhatsApp(item: RecordItem) { if (!this.canWhatsApp(item)) return; const phone = item.kind === 'lead' ? item.contacto : item.whatsapp!; this.whatsapp.openTo(phone, 'Hola, te contactamos desde Órbita Software sobre tu consulta.'); }
  logout() { this.admin.logout().subscribe(() => this.closePanel()); }
}
