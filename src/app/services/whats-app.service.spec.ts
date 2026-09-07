import { WhatsAppService } from './whats-app.service';

describe('WhatsAppService', () => {
  it('preserves accents, newlines and special characters in a web link', () => {
    const message = 'Cotización & diseño\n+54 123? #proyecto';
    const link = new URL(new WhatsAppService().buildLink(message));
    expect(link.protocol).toBe('https:');
    expect(link.hostname).toBe('wa.me');
    expect(link.pathname).toMatch(/^\/\d+$/);
    expect(link.searchParams.get('text')).toBe(message);
  });

  it('opens a separate tab without access to the opener', () => {
    const open = spyOn(window, 'open');
    const service = new WhatsAppService();
    const link = service.buildLink();
    service.open(link);
    expect(open).toHaveBeenCalledWith(link, '_blank', 'noopener,noreferrer');
  });
});
