// Posicionamiento (C2 y C3): el contenido viene en el HTML inicial y el host trae sus básicos
// (canonical, tarjeta para compartir, JSON-LD, ícono, robots y sitemap), todos sobre un mismo origen.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { render } from './entry-server';
// @ts-expect-error: módulo .mjs sin tipos; se prueba su comportamiento
import { inyectar, URL_SITIO } from '../scripts/prerender.mjs';

const RAIZ = join(__dirname, '..');
const leer = (ruta: string) => readFileSync(join(RAIZ, ruta), 'utf8');
const INDEX = leer('index.html');
const attr = (re: RegExp) => (re.exec(INDEX) ?? [])[1];
const meta = (nombre: string) => attr(new RegExp(`<meta (?:name|property)="${nombre}" content="([^"]*)"`));

describe('contenido en el HTML inicial', () => {
  const html = render();
  const palabras = html.replace(/<[^>]+>/g, ' ').split(/[ \n\t]+/).filter(Boolean).length;

  it('el render trae el titular, las secciones y el grueso del texto', () => {
    expect(html).toContain('Tu agente entregó más código del que');
    for (const id of ['inicio', 'compuerta', 'piezas', 'numeros', 'reglas', 'empezar']) expect(html).toContain(`id="${id}"`);
    expect(palabras).toBeGreaterThan(800);
  });

  it('inyectar pone el render dentro del root y deja el resto igual', () => {
    const out = inyectar(INDEX, '<p>hola $& mundo</p>');
    expect(out).toContain('<div id="root"><p>hola $& mundo</p></div>');
    expect(out.replace('<p>hola $& mundo</p>', '')).toBe(INDEX);
  });

  it('no publica una página vacía ni una plantilla sin root', () => {
    expect(() => inyectar(INDEX, '   ')).toThrow(/vacío/);
    expect(() => inyectar('<html><body></body></html>', '<p>x</p>')).toThrow(/no tiene/);
  });

  it('el build corre el prerender después de vite', () => {
    expect(JSON.parse(leer('package.json')).scripts.build).toMatch(/vite build && node scripts\/prerender\.mjs$/);
  });
});

describe('básicos del host', () => {
  it('el origen es cordada.breakpoint.biz en todos lados', () => {
    expect(URL_SITIO).toBe('https://cordada.breakpoint.biz');
    expect(attr(/<link rel="canonical" href="([^"]*)"/)).toBe(`${URL_SITIO}/`);
    expect(meta('og:url')).toBe(`${URL_SITIO}/`);
    expect(leer('public/robots.txt')).toContain(`Sitemap: ${URL_SITIO}/sitemap.xml`);
    expect(leer('public/sitemap.xml')).toContain(`<loc>${URL_SITIO}/</loc>`);
  });

  it('hay una sola canonical y un solo título', () => {
    expect(INDEX.match(/rel="canonical"/g)).toHaveLength(1);
    expect(INDEX.match(/<title>/g)).toHaveLength(1);
  });

  it('la tarjeta para compartir repite título y descripción, y apunta a una imagen PNG de 1200x630', () => {
    expect(meta('og:title')).toBe(attr(/<title>([^<]*)<\/title>/));
    expect(meta('og:description')).toBe(meta('description'));
    expect(meta('twitter:card')).toBe('summary_large_image');
    expect(meta('og:image')).toBe(`${URL_SITIO}/og-cordada.png`);
    expect(meta('twitter:image')).toBe(`${URL_SITIO}/og-cordada.png`);
    const png = readFileSync(join(RAIZ, 'public/og-cordada.png'));
    expect(png.subarray(1, 4).toString('latin1')).toBe('PNG');
    expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([1200, 630]);
    expect([meta('og:image:width'), meta('og:image:height')]).toEqual(['1200', '630']);
  });

  it('el JSON-LD es válido y nombra el sitio y a Break Point', () => {
    const bloque = attr(/<script type="application\/ld\+json">([^]*?)<\/script>/);
    const grafo = JSON.parse(bloque)['@graph'];
    expect(grafo.map((n: { '@type': string }) => n['@type'])).toEqual(['Organization', 'WebSite']);
    expect(grafo[1].url).toBe(`${URL_SITIO}/`);
    expect(grafo[1].publisher['@id']).toBe(grafo[0]['@id']);
  });

  it('el ícono existe y está enlazado', () => {
    expect(attr(/<link rel="icon"[^>]*href="([^"]*)"/)).toBe('/favicon.svg');
    expect(leer('public/favicon.svg')).toContain('<svg');
  });

  it('robots no bloquea nada', () => {
    expect(leer('public/robots.txt')).not.toMatch(/Disallow: \//);
  });
});
