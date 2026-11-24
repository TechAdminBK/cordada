import { describe, expect, it, vi } from 'vitest';
import { configDeContacto, enviarContacto, filaDesdeContacto, validarContacto, type ContactoInput } from './contacto';

const ok: ContactoInput = {
  nombre: 'Ana',
  email: 'ana@empresa.com',
  empresa: 'Acme',
  brief: 'Un agente abrió un PR de 3.000 líneas.',
  habeas: true,
  avisoVersion: 'cordada-v1',
};
const cfg = { url: 'https://proj.supabase.co/', anonKey: 'anon-test' };
const AHORA = new Date('2026-11-23T12:00:00Z');

describe('validarContacto', () => {
  it('acepta un contacto válido', () => {
    expect(validarContacto(ok)).toEqual({});
  });
  it('rechaza nombre vacío o solo espacios', () => {
    expect(validarContacto({ ...ok, nombre: '   ' }).nombre).toBeTruthy();
  });
  it('rechaza email sin dominio', () => {
    expect(validarContacto({ ...ok, email: 'ana@empresa' }).email).toBeTruthy();
  });
  it('respeta los topes de la tabla: nombre 120, empresa 160, brief 2000', () => {
    expect(validarContacto({ ...ok, nombre: 'x'.repeat(120) }).nombre).toBeUndefined();
    expect(validarContacto({ ...ok, nombre: 'x'.repeat(121) }).nombre).toBeTruthy();
    expect(validarContacto({ ...ok, empresa: 'x'.repeat(161) }).empresa).toBeTruthy();
    expect(validarContacto({ ...ok, brief: 'x'.repeat(2000) }).brief).toBeUndefined();
    expect(validarContacto({ ...ok, brief: 'x'.repeat(2001) }).brief).toBeTruthy();
  });
  it('empresa y brief son opcionales', () => {
    expect(validarContacto({ ...ok, empresa: '', brief: '' })).toEqual({});
  });
  it('exige el consentimiento', () => {
    expect(validarContacto({ ...ok, habeas: false }).habeas).toBeTruthy();
  });
});

describe('filaDesdeContacto', () => {
  it('arma la fila con origen cordada, el brief como mensaje y el consentimiento fechado', () => {
    expect(filaDesdeContacto({ ...ok, nombre: '  Ana ', email: ' ana@empresa.com ' }, AHORA)).toEqual({
      nombre: 'Ana',
      email: 'ana@empresa.com',
      empresa: 'Acme',
      agentes: null,
      lang: 'es',
      servicio: null,
      mensaje: 'Un agente abrió un PR de 3.000 líneas.',
      origen: 'cordada',
      habeas_consent: true,
      consentimiento_at: '2026-11-23T12:00:00.000Z',
      aviso_version: 'cordada-v1',
    });
  });
  it('los opcionales vacíos viajan como null, no como cadena vacía', () => {
    const fila = filaDesdeContacto({ ...ok, empresa: '  ', brief: '' }, AHORA);
    expect(fila.empresa).toBeNull();
    expect(fila.mensaje).toBeNull();
  });
});

describe('enviarContacto', () => {
  it('inserta por PostgREST en el schema landing, con la anon key y sin pedir la fila de vuelta', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 201 }));
    expect(await enviarContacto(ok, cfg, fetchMock, AHORA)).toEqual({ ok: true });
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('https://proj.supabase.co/rest/v1/contact_requests');
    expect(init.method).toBe('POST');
    const h = init.headers as Record<string, string>;
    expect(h.apikey).toBe('anon-test');
    expect(h.Authorization).toBe('Bearer anon-test');
    expect(h['Content-Profile']).toBe('landing');
    expect(h.Prefer).toBe('return=minimal');
    expect(JSON.parse(init.body as string).origen).toBe('cordada');
  });
  it('no llama a la red si el contacto es inválido', async () => {
    const fetchMock = vi.fn();
    expect(await enviarContacto({ ...ok, habeas: false }, cfg, fetchMock, AHORA)).toEqual({ ok: false, motivo: 'invalido' });
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it('no envía sin versión del aviso: sin ella no hay consentimiento que registrar', async () => {
    const fetchMock = vi.fn();
    expect(await enviarContacto({ ...ok, avisoVersion: '' }, cfg, fetchMock, AHORA)).toEqual({ ok: false, motivo: 'invalido' });
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it('distingue falla de red de rechazo del servidor', async () => {
    expect(await enviarContacto(ok, cfg, vi.fn().mockRejectedValue(new Error('offline')), AHORA)).toEqual({ ok: false, motivo: 'red' });
    expect(await enviarContacto(ok, cfg, vi.fn().mockResolvedValue(new Response(null, { status: 400 })), AHORA)).toEqual({ ok: false, motivo: 'servidor' });
  });
});

describe('configDeContacto', () => {
  it('pide las dos variables; con una sola no hay formulario', () => {
    expect(configDeContacto({ VITE_SUPABASE_URL: 'https://p.supabase.co', VITE_SUPABASE_ANON_KEY: 'k' })).toEqual({ url: 'https://p.supabase.co', anonKey: 'k' });
    expect(configDeContacto({ VITE_SUPABASE_URL: 'https://p.supabase.co' })).toBeNull();
    expect(configDeContacto({ VITE_SUPABASE_ANON_KEY: 'k' })).toBeNull();
    expect(configDeContacto({ VITE_SUPABASE_URL: '  ', VITE_SUPABASE_ANON_KEY: 'k' })).toBeNull();
    expect(configDeContacto({})).toBeNull();
  });
});

describe('email: no se registra un consentimiento con una dirección que no existe', () => {
  const base = { nombre: 'Ana', email: '', empresa: '', brief: '', habeas: true, avisoVersion: 'cordada-v1' };
  it.each(['ana@empresa.com', 'ana.perez+x@sub.empresa.com.ar', 'a_b-c@e-mpresa.io'])('acepta %s', (email) => {
    expect(validarContacto({ ...base, email }).email).toBeUndefined();
  });
  it.each(['ana@empresa..com', 'ana@empresa.com;DROP', '<b>x</b>@y.com', 'ana@.com', 'ana@empresa.', 'ana@@empresa.com', 'ana empresa@x.com', 'ana@empresa', "ana'@x.com"])('rechaza %s', (email) => {
    expect(validarContacto({ ...base, email }).email).toBeTruthy();
  });
});
