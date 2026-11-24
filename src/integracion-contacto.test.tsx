// Integración del formulario de contacto con la versión en inglés y el prerender.
//   (a) apagado, / y /en quedan igual que antes de sumar la ranura: el botón de respaldo en su lugar;
//   (b) en /en el formulario no aparece nunca, aunque el aviso esté aprobado y haya variables;
//   (c) activo en español: aparece el formulario, /privacidad renderiza, y lo prerenderizado hidrata;
//   (d) el prerender escribe /privacidad solo con el formulario activo.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { cleanup, render as montar, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
// @ts-expect-error: módulo .mjs sin tipos; se prueba su comportamiento
import { aJsx, conBreakPoint, conCabeceraFija, conIdioma, conMain, construir, leerTemplate, partes } from '../scripts/generar-landing.mjs';
// @ts-expect-error: módulo .mjs sin tipos; se prueba su comportamiento
import { conCabecera, PAGINA_AVISO, PAGINAS, RUTA_AVISO, rutasAEscribir, URL_SITIO } from '../scripts/prerender.mjs';

const RAIZ = join(__dirname, '..');
const ENV = { VITE_SUPABASE_URL: 'https://proj.supabase.co', VITE_SUPABASE_ANON_KEY: 'anon-test' };
const RESPALDO = 'https://www.breakpoint.biz/#empecemos';
const INDEX = readFileSync(join(RAIZ, 'index.html'), 'utf8');

afterEach(() => { cleanup(); vi.resetModules(); vi.doUnmock('./aviso'); vi.restoreAllMocks(); });

// Un aviso aprobado y completo, para probar el lado encendido sin tocar src/aviso.ts.
const aprobar = () => vi.doMock('./aviso', () => ({
  AVISO: { version: 'cordada-v9', aprobado: true, secciones: [['Responsable del tratamiento', 'Break Point S.A.']] },
  avisoListo: () => true,
}));
const cargar = async () => ({ ...(await import('./App')), ...(await import('./entry-server')) });
const cuantos = (html: string, parte: string) => html.split(parte).length - 1;

describe('(a) formulario apagado: la página es la misma que antes de la ranura', () => {
  // Antes de la ranura, el generador escribía el botón dentro del marcado con el destino de
  // respaldo. Acá se rearma ese marcado con las mismas funciones del generador y se compara con el
  // de hoy poniendo BotonContacto en la ranura: si difieren en algo, el HTML apagado ya no es el
  // que estaba publicado.
  it('el marcado con el botón de respaldo en la ranura es, línea por línea, el de antes', () => {
    const lineas = (s: string) => s.split('\n').map((l) => l.trim()).filter(Boolean);
    const cuerpoDe = (fn: string) => fn.slice(fn.indexOf('return (\n') + 'return (\n'.length, fn.lastIndexOf('\n  );'));

    const { cuerpo } = partes(leerTemplate(readFileSync(join(RAIZ, 'design/cordada-landing.html'), 'utf8')));
    const conDestino: string = conIdioma(conBreakPoint(cuerpo)).replace('href="[ENLACE DE CONTACTO]"', `href="${RESPALDO}"`);
    const antes = lineas(aJsx(conCabeceraFija(conMain(conDestino))));

    const { tsx } = construir() as { tsx: string };
    const [landing, boton] = tsx.split('export function BotonContacto');
    const ranura = '{" "}{contacto}{" "}';
    expect(cuantos(landing, ranura)).toBe(1);
    expect(cuantos(landing, 'contacto}')).toBe(1);
    const botonEnLinea = cuerpoDe(boton).replace('href={href}', `href="${RESPALDO}"`);
    expect(botonEnLinea).toContain(`href="${RESPALDO}"`);
    const hoy = lineas(cuerpoDe(landing.slice(landing.indexOf('export function Landing'))).replace(ranura, `{" "}\n${botonEnLinea}\n{" "}`));

    expect(antes.length).toBeGreaterThan(600);
    expect(hoy).toEqual(antes);
  });

  it.each([
    ['/', 'Empezar un proyecto', 'Ver la compuerta'],
    ['/en', 'Start a project', 'See the gate'],
  ])('%s: un solo botón de respaldo, en el lugar del diseño y con su texto, y ningún formulario', async (ruta, texto, siguiente) => {
    const { render } = await cargar();
    // El aviso del repo está aprobado desde el 24-nov-2026: lo que lo mantiene apagado es que
    // falte alguna de las dos variables de la base.
    for (const env of [{}, { VITE_SUPABASE_URL: ENV.VITE_SUPABASE_URL }, { VITE_SUPABASE_ANON_KEY: ENV.VITE_SUPABASE_ANON_KEY }]) {
      const html: string = render(ruta, env);
      expect(cuantos(html, `href="${RESPALDO}"`)).toBe(1);
      const boton = html.slice(html.indexOf(`<a href="${RESPALDO}"`));
      expect(boton.slice(0, boton.indexOf('</a>')).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()).toBe(`${texto} →`);
      // Lo que sigue al botón es el segundo enlace de la sección final, como en el diseño.
      expect(boton.slice(boton.indexOf('</a>')).replace(/<[^>]+>/g, ' ').trim().startsWith(siguiente)).toBe(true);
      // (El hero del diseño ya trae un <form> propio: el de contacto se reconoce por su clase.)
      expect(html).not.toMatch(/cd-contacto|\/privacidad/);
      expect(html).not.toMatch(/\{\{|\}\}|ENLACE DE CONTACTO/);
    }
  });

  it('apagado, la ruta y el idioma dan el mismo HTML que antes daba el idioma solo', async () => {
    const { App, render } = await cargar();
    const { renderToString } = await import('react-dom/server');
    const { StrictMode } = await import('react');
    expect(render('/', {})).toBe(renderToString(<StrictMode><App lang="es" env={{}} /></StrictMode>));
    expect(render('/en', ENV)).toBe(renderToString(<StrictMode><App lang="en" env={{}} /></StrictMode>));
    expect(render('/en/', ENV)).toBe(render('/en', {}));
  });

  it('apagado, /privacidad no muestra el aviso: renderiza la página de inicio', async () => {
    const { render } = await cargar();
    expect(render('/privacidad', {})).toBe(render('/', {}));
  });
});

describe('(b) en /en el formulario no aparece nunca', () => {
  it('ni con el aviso aprobado y las variables cargadas', async () => {
    aprobar();
    const { App, contactoActivo, render } = await cargar();
    expect(contactoActivo('es', ENV)).toEqual({ url: ENV.VITE_SUPABASE_URL, anonKey: ENV.VITE_SUPABASE_ANON_KEY });
    expect(contactoActivo('en', ENV)).toBeNull();

    for (const props of [{ ruta: '/en' }, { ruta: '/en/' }, { lang: 'en' as const }, { ruta: '/', lang: 'en' as const }]) {
      montar(<App env={ENV} {...props} />);
      expect(document.querySelector('.cd-contacto')).toBeNull();
      expect(screen.queryByLabelText('Email corporativo')).toBeNull();
      const respaldo = document.querySelectorAll(`a[href="${RESPALDO}"]`);
      expect(respaldo).toHaveLength(1);
      expect(respaldo[0].textContent).toContain('Start a project');
      expect(document.querySelector('a[href="/privacidad"]')).toBeNull();
      cleanup();
    }
    // Encendido o apagado, la página en inglés es la misma.
    expect(render('/en', ENV)).toBe(render('/en', {}));
  });

  it('el aviso no tiene página en inglés', async () => {
    aprobar();
    const { App, render } = await cargar();
    expect(render('/en/privacidad', ENV)).toBe(render('/en', ENV));
    montar(<App env={ENV} ruta="/privacidad" lang="en" />);
    expect(screen.queryByText('Aviso de privacidad')).toBeNull();
    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain('Your agent shipped');
  });
});

describe('(c) formulario activo en español', () => {
  it('en / aparece el formulario en el lugar del botón, y el botón de respaldo ya no', async () => {
    aprobar();
    const { render } = await cargar();
    const html: string = render('/', ENV);
    expect(cuantos(html, '<form class="cd-contacto"')).toBe(1);
    expect(html).toContain('Email corporativo');
    expect(html).toContain('href="/privacidad"');
    expect(html).not.toContain(RESPALDO);
    // La ranura está en la sección final: el formulario queda después del ancla #empezar.
    expect(html.indexOf('<form class="cd-contacto"')).toBeGreaterThan(html.indexOf('id="empezar"'));
  });

  it('/privacidad renderiza el aviso, con o sin barra final, y no la página de inicio', async () => {
    aprobar();
    const { render } = await cargar();
    const html: string = render('/privacidad', ENV);
    expect(html).toContain('Aviso de privacidad');
    expect(html).toContain('cordada-v9');
    expect(html).toContain('Break Point S.A.');
    expect(html).not.toContain('Tu agente entregó');
    expect(render('/privacidad/', ENV)).toBe(html);
    expect(render('/privacidad/index.html', ENV)).toBe(html);
  });

  it.each(['/', '/privacidad', '/en'])('lo prerenderizado de %s hidrata sin diferencias', async (ruta) => {
    aprobar();
    const errores = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { App, render } = await cargar();
    const { StrictMode } = await import('react');
    const container = document.createElement('div');
    container.innerHTML = render(ruta, ENV);
    document.body.appendChild(container);
    const antes = container.innerHTML;
    montar(<StrictMode><App ruta={ruta} env={ENV} /></StrictMode>, { container, hydrate: true });
    expect(errores.mock.calls).toEqual([]);
    expect(container.innerHTML).toBe(antes);
    container.remove();
  });

  it('si el servidor y el navegador decidieran distinto, la hidratación lo delata (el test anterior mide algo)', async () => {
    aprobar();
    const errores = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { App, render } = await cargar();
    const container = document.createElement('div');
    container.innerHTML = render('/', {});
    document.body.appendChild(container);
    montar(<App ruta="/" env={ENV} />, { container, hydrate: true });
    expect(errores.mock.calls.length).toBeGreaterThan(0);
    container.remove();
  });
});

describe('(d) el prerender escribe /privacidad solo con el formulario activo', () => {
  it('rutasAEscribir: apagado, las dos páginas de siempre; activo, además el aviso', () => {
    const base = Object.keys(PAGINAS);
    expect(base).toEqual(['/en', '/']);
    expect(rutasAEscribir(false)).toEqual(base);
    expect(rutasAEscribir(true)).toEqual([RUTA_AVISO, ...base]);
    // Solo un true explícito suma el aviso: una respuesta rara del build no publica texto legal.
    for (const raro of [undefined, null, 'true', 1, {}]) expect(rutasAEscribir(raro)).toEqual(base);
  });

  // Invertido a propósito el 24-nov-2026, cuando Gustavo aprobó el aviso.
  it('con el aviso que hoy está en el repo se escribe si están las dos variables, y si falta una no', async () => {
    const { formularioActivo } = await cargar();
    expect(formularioActivo(ENV)).toBe(true);
    expect(rutasAEscribir(formularioActivo(ENV))).toContain(RUTA_AVISO);
    expect(rutasAEscribir(formularioActivo({}))).not.toContain(RUTA_AVISO);
    expect(rutasAEscribir(formularioActivo({ VITE_SUPABASE_URL: ENV.VITE_SUPABASE_URL }))).not.toContain(RUTA_AVISO);
  });

  it('formularioActivo responde lo mismo que el candado de la app', async () => {
    aprobar();
    const { formularioActivo, RUTA_AVISO: rutaDeLaApp } = await cargar();
    expect(formularioActivo(ENV)).toBe(true);
    expect(formularioActivo({})).toBe(false);
    expect(formularioActivo({ VITE_SUPABASE_URL: ENV.VITE_SUPABASE_URL })).toBe(false);
    expect(rutasAEscribir(formularioActivo(ENV))).toContain(RUTA_AVISO);
    // La app y el prerender nombran la misma ruta.
    expect(rutaDeLaApp).toBe(RUTA_AVISO);
  });

  it('la página del aviso lleva su cabecera: título y canonical propios, en español y sin hreflang', () => {
    const de = (h: string, re: RegExp) => (re.exec(h) ?? [])[1];
    const h: string = conCabecera(INDEX, RUTA_AVISO);
    expect(de(h, /<html lang="([^"]*)"/)).toBe('es');
    expect(de(h, /<title>([^<]*)<\/title>/)).toBe(PAGINA_AVISO.title);
    expect(PAGINA_AVISO.title).not.toBe(PAGINAS['/'].title);
    expect(de(h, /rel="canonical" href="([^"]*)"/)).toBe(`${URL_SITIO}/privacidad`);
    expect(de(h, /property="og:url" content="([^"]*)"/)).toBe(`${URL_SITIO}/privacidad`);
    expect(h.match(/<title>/g)).toHaveLength(1);
    expect(h.match(/rel="canonical"/g)).toHaveLength(1);
    expect(h).not.toMatch(/hreflang=/);
    expect(h).not.toContain(`${URL_SITIO}/en`);
  });
});

// Ancla del estado que está publicado. La comparación de arriba rearma «el antes» con el generador
// de hoy, así que un cambio en una función compartida movería las dos mitades a la vez. Estas
// huellas son las del HTML que producía `main` (6b1fc95) con el formulario apagado, medidas el
// 24-nov-2026: si cambian, el HTML apagado cambió. Se actualizan solo cuando el cambio es a
// propósito (por ejemplo, un texto nuevo del diseño), nunca para hacer pasar el test.
describe('el HTML con el formulario apagado es el que está publicado', () => {
  it.each([
    ['/', '4edd049b891de338'],
    ['/en', 'b29b5ef04a8e8ce2'],
  ])('%s conserva su huella', async (ruta, huella) => {
    const { createHash } = await import('node:crypto');
    const { render } = await import('./entry-server');
    expect(createHash('sha256').update(render(ruta, {})).digest('hex').slice(0, 16)).toBe(huella);
    // Con el aviso aprobado, las variables encienden el formulario solo en español: / cambia y
    // /en conserva su huella.
    const conVariables = createHash('sha256').update(render(ruta, { VITE_SUPABASE_URL: 'https://x.supabase.co', VITE_SUPABASE_ANON_KEY: 'k' })).digest('hex').slice(0, 16);
    if (ruta === '/en') expect(conVariables).toBe(huella);
    else expect(conVariables).not.toBe(huella);
  });
});
