import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createHash } from 'node:crypto';
import { AVISO, avisoListo, SECCIONES_OBLIGATORIAS } from './aviso';
import { chipDefs } from './datos';

const ENV = { VITE_SUPABASE_URL: 'https://proj.supabase.co', VITE_SUPABASE_ANON_KEY: 'anon-test' };
const RESPALDO = 'https://www.breakpoint.biz/#empecemos';

afterEach(() => { cleanup(); vi.resetModules(); vi.doUnmock('./aviso'); });

const COMPLETO = SECCIONES_OBLIGATORIAS.map((t) => [t, 'Texto definitivo.'] as const);
const con = (titulo: string, texto: string) => COMPLETO.map(([t, x]) => [t, t === titulo ? texto : x] as const);

describe('candado del aviso de privacidad', () => {
  it('aprobado y con las seis secciones completas: listo', () => {
    expect(avisoListo({ aprobado: true, secciones: COMPLETO })).toBe(true);
  });
  it('sin aprobar no está listo, aunque el texto esté completo', () => {
    expect(avisoListo({ aprobado: false, secciones: COMPLETO })).toBe(false);
  });
  it.each([
    ['PENDIENTE: razón social'],
    ['pendiente de definir'],
    ['Por definir'],
    ['TBD'],
    [''],
    ['   '],
  ])('aprobado pero con una sección sin terminar (%j) no está listo', (texto) => {
    expect(avisoListo({ aprobado: true, secciones: con('Tus derechos', texto) })).toBe(false);
  });
  it('aprobado pero sin alguna de las seis secciones no está listo', () => {
    expect(avisoListo({ aprobado: true, secciones: COMPLETO.slice(1) })).toBe(false);
    expect(avisoListo({ aprobado: true, secciones: [] })).toBe(false);
  });
  it('el aviso real tiene versión y sus seis secciones', () => {
    expect(AVISO.version).toMatch(/^cordada-v\d+$/);
    expect(AVISO.secciones.map(([t]) => t)).toEqual([...SECCIONES_OBLIGATORIAS]);
  });

  // Cada lead guarda la versión del aviso que la persona aceptó. Si el texto cambia y la versión
  // no, ese registro deja de decir qué aceptó. Cada versión publicada queda acá con la huella de
  // su texto: cambiar el texto obliga a subir la versión y sumar su línea, nunca a pisar una.
  // `cordada-v1` se aprobó el 24-nov-2026 con esta huella (antes de esa fecha era un borrador y se
  // ajustó; ninguna fila de la base la tenía). Desde entonces está congelada.
  it('la versión identifica un texto y solo uno', () => {
    const HUELLAS: Record<string, string> = {
      'cordada-v1': 'f8bd3acd9c2684cb',
    };
    const huella = createHash('sha256').update(JSON.stringify(AVISO.secciones)).digest('hex').slice(0, 16);
    expect(HUELLAS[AVISO.version], `falta registrar la huella de ${AVISO.version}`).toBe(huella);
  });
});

describe('formulario apagado: queda el botón de respaldo', () => {
  const sinAprobar = () => vi.doMock('./aviso', async () => {
    const real = await vi.importActual<typeof import('./aviso')>('./aviso');
    const aviso = { version: 'cordada-v9', aprobado: false, secciones: COMPLETO };
    return { ...real, AVISO: aviso, avisoListo: () => real.avisoListo(aviso) };
  });

  it('con el aviso sin aprobar, las variables de la base no alcanzan', async () => {
    sinAprobar();
    const { App } = await import('./App');
    render(<App env={ENV} ruta="/" />);
    expect(document.querySelectorAll(`a[href="${RESPALDO}"]`)).toHaveLength(1);
    expect(screen.queryByLabelText('Email corporativo')).toBeNull();
  });

  it('sin formulario activo, /privacidad no muestra un aviso que nadie aprobó', async () => {
    sinAprobar();
    const { App } = await import('./App');
    render(<App env={ENV} ruta="/privacidad" />);
    expect(screen.queryByText('Aviso de privacidad')).toBeNull();
    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain('Tu agente entregó');
  });

  // Invertido a propósito el 24-nov-2026, cuando Gustavo aprobó el aviso: desde entonces lo único
  // que decide si el formulario se muestra son las dos variables de la base.
  it('el aviso que hoy está en el repo está aprobado: con las variables enciende, sin ellas no', async () => {
    expect(avisoListo()).toBe(true);
    const { App } = await import('./App');
    render(<App env={ENV} ruta="/" />);
    expect(document.querySelector(`a[href="${RESPALDO}"]`)).toBeNull();
    expect(screen.getByLabelText('Email corporativo')).toBeTruthy();
    cleanup();
    render(<App env={{}} ruta="/" />);
    expect(document.querySelectorAll(`a[href="${RESPALDO}"]`)).toHaveLength(1);
    expect(screen.queryByLabelText('Email corporativo')).toBeNull();
  });
});

describe('formulario activo (aviso aprobado y variables cargadas)', () => {
  const montar = async (props: { env?: Record<string, unknown>; ruta?: string; fetchImpl?: typeof fetch } = {}) => {
    const { App } = await import('./App');
    return render(<App env={ENV} ruta="/" {...props} />);
  };

  beforeEach(() => {
    vi.doMock('./aviso', () => ({
      AVISO: { version: 'cordada-v9', aprobado: true, secciones: [['Responsable del tratamiento', 'Break Point S.A.']] },
      avisoListo: () => true,
    }));
  });

  it('aprobado pero sin las variables: sigue el respaldo y /privacidad no se muestra', async () => {
    await montar({ env: {} });
    expect(document.querySelectorAll(`a[href="${RESPALDO}"]`)).toHaveLength(1);
    cleanup();
    await montar({ env: {}, ruta: '/privacidad' });
    expect(screen.queryByText('Aviso de privacidad')).toBeNull();
  });

  it('el enlace al aviso abre aparte, para no perder lo escrito', async () => {
    await montar();
    const enlace = screen.getByRole('link', { name: 'Leer el aviso' });
    expect(enlace.getAttribute('target')).toBe('_blank');
    expect(enlace.getAttribute('rel')).toContain('noopener');
  });

  it('muestra los campos, el consentimiento con su enlace, y ya no el enlace de respaldo', async () => {
    await montar();
    for (const campo of ['Nombre', 'Email corporativo', 'Empresa', 'Qué cuenta como terminado']) expect(screen.getByLabelText(campo)).toBeTruthy();
    expect(screen.getByRole('checkbox')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Leer el aviso' }).getAttribute('href')).toBe('/privacidad');
    expect(document.querySelector(`a[href="${RESPALDO}"]`)).toBeNull();
  });

  it('el brief del hero y el del formulario son el mismo texto', async () => {
    await montar();
    fireEvent.click(screen.getByRole('button', { name: chipDefs[0].label }));
    expect((screen.getByLabelText('Qué cuenta como terminado') as HTMLTextAreaElement).value).toBe(chipDefs[0].text);
    fireEvent.change(screen.getByLabelText('Qué cuenta como terminado'), { target: { value: 'otro texto' } });
    expect((document.querySelector('#cd-brief') as HTMLTextAreaElement).value).toBe('otro texto');
  });

  it('sin consentimiento no envía nada y lo dice', async () => {
    const fetchMock = vi.fn();
    await montar({ fetchImpl: fetchMock });
    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Ana' } });
    fireEvent.change(screen.getByLabelText('Email corporativo'), { target: { value: 'ana@empresa.com' } });
    fireEvent.click(screen.getByRole('button', { name: /Empezar un proyecto/ }));
    expect(await screen.findByText('Necesario para enviar el formulario.')).toBeTruthy();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('con todo en regla guarda el lead con origen cordada, el brief y la versión del aviso, y confirma', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 201 }));
    await montar({ fetchImpl: fetchMock });
    fireEvent.click(screen.getByRole('button', { name: chipDefs[2].label }));
    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Ana' } });
    fireEvent.change(screen.getByLabelText('Email corporativo'), { target: { value: 'ana@empresa.com' } });
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button', { name: /Empezar un proyecto/ }));
    expect(await screen.findByText('Recibido')).toBeTruthy();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('https://proj.supabase.co/rest/v1/contact_requests');
    const fila = JSON.parse(init.body as string);
    expect(fila).toMatchObject({ nombre: 'Ana', email: 'ana@empresa.com', empresa: null, origen: 'cordada', mensaje: chipDefs[2].text, habeas_consent: true, aviso_version: 'cordada-v9', lang: 'es' });
    // El formulario desaparece: no se puede mandar dos veces el mismo contacto.
    expect(screen.queryByLabelText('Nombre')).toBeNull();
  });

  it('si la base rechaza el envío, avisa y deja reintentar con lo escrito', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 400 }));
    await montar({ fetchImpl: fetchMock });
    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Ana' } });
    fireEvent.change(screen.getByLabelText('Email corporativo'), { target: { value: 'ana@empresa.com' } });
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button', { name: /Empezar un proyecto/ }));
    expect(await screen.findByText(/No pudimos enviarlo/)).toBeTruthy();
    await waitFor(() => expect((screen.getByRole('button', { name: /Empezar un proyecto/ }) as HTMLButtonElement).disabled).toBe(false));
    expect((screen.getByLabelText('Nombre') as HTMLInputElement).value).toBe('Ana');
  });

  it('/privacidad muestra el aviso con su versión', async () => {
    await montar({ ruta: '/privacidad' });
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Aviso de privacidad');
    expect(screen.getByText('Versión: cordada-v9')).toBeTruthy();
    expect(screen.getByText('Break Point S.A.')).toBeTruthy();
  });
});
