import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }


saveLead(lead: any) {
    const leads = JSON.parse(localStorage.getItem('orb_leads') || '[]');
    leads.push(lead);
    localStorage.setItem('orb_leads', JSON.stringify(leads));
  }

  saveInbox(inbox: any) {
    const inboxList = JSON.parse(localStorage.getItem('orb_inbox') || '[]');
    inboxList.push(inbox);
    localStorage.setItem('orb_inbox', JSON.stringify(inboxList));
  }

}
