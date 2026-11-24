// C5 (versión en inglés con URL propia y hreflang recíproco) y C6 (cabecera fija).
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { renderToString } from 'react-dom/server';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { App, langDeRuta } from './App';
import { chipDefs, gate, pieces, route, rules, stats } from './datos';
import { chipDefsEn, EN, gateEn, piecesEn, routeEn, rulesEn, statsEn, traducir } from './en';
// @ts-expect-error: módulo .mjs sin tipos; se prueba su comportamiento
import { conCabecera, hreflang, PAGINAS, URL_SITIO } from '../scripts/prerender.mjs';
// @ts-expect-error: módulo .mjs sin tipos; se prueba su comportamiento
import { CLASE_PAGINA, conCabeceraFija, conIdioma, construir } from '../scripts/generar-landing.mjs';

afterEach(cleanup);

const RAIZ = join(__dirname, '..');
const leer = (ruta: string) => readFileSync(join(RAIZ, ruta), 'utf8');
const INDEX = leer('index.html');
const LANDING = leer('src/generated/Landing.tsx');
const TIENE_LETRAS = /\p{L}/u;

// Los textos que el marcado generado pasa por t(), tal como los recibe la función.
const literales = [...LANDING.matchAll(/\bt\(("(?:[^"\\]|\\.)*")\)/g)].map((m) => (JSON.parse(m[1]) as string).trim());

describe('traducción: todo texto del marcado tiene su versión en inglés', () => {
  it('el marcado pasa sus textos por t()', () => {
    expect(literales.length).toBeGreaterThan(60);
    // Ningún texto literal quedó fuera de t(): solo se admiten espacios sueltos.
    const sueltos = [...LANDING.matchAll(/\{("(?:[^"\\]|\\.)*")\}/g)].map((m) => JSON.parse(m[1]) as string).filter((s) => s.trim() !== '');
    expect(sueltos).toEqual([]);
  });

  it('cada texto con letras está en el diccionario, y el diccionario no tiene entradas de más', () => {
    const conLetras = [...new Set(literales.filter((s) => TIENE_LETRAS.test(s)))];
    expect(conLetras.filter((s) => !(s in EN))).toEqual([]);
    expect(Object.keys(EN).filter((k) => !conLetras.includes(k))).toEqual([]);
  });

  it('traducir conserva los espacios de los bordes y deja igual los signos y las cifras', () => {
    expect(traducir(' Reglas ')).toBe(' Rules ');
    expect(traducir('→')).toBe('→');
    expect(traducir(' 21 ')).toBe(' 21 ');
    expect(traducir('texto que no existe')).toBe('texto que no existe');
  });

  it('las listas en inglés conservan cantidades, cifras y colores; cambia solo el texto', () => {
    const pares: [readonly object[], readonly object[]][] = [[chipDefs, chipDefsEn], [route, routeEn], [gate, gateEn], [pieces, piecesEn], [stats, statsEn], [rules, rulesEn]];
    for (const [es, en] of pares) {
      expect(en).toHaveLength(es.length);
      es.forEach((item, i) => {
        const a = item as Record<string, string>, b = en[i] as Record<string, string>;
        expect(Object.keys(b).sort()).toEqual(Object.keys(a).sort());
        for (const k of ['color', 'bg', 'fg', 'n', 'big']) if (k in a) expect(b[k]).toBe(a[k]);
      });
    }
    expect(statsEn.map((s) => s.big)).toEqual(['62/62', '437/920', '686≠985', '42→0', '19/58', '21']);
    expect(gateEn.map((g) => g.verdict)).toEqual(['REJECTED', 'APPLIED', 'REJECTED', 'APPLIED']);
  });

  it('ningún texto de las listas quedó en español en la versión en inglés', () => {
    const textos = (l: readonly object[]) => l.flatMap((o) => Object.entries(o).filter(([k, v]) => typeof v === 'string' && !['color', 'bg', 'fg', 'n', 'big'].includes(k)).map(([, v]) => v as string));
    const es = new Set([chipDefs, route, gate, pieces, stats, rules].flatMap(textos));
    const en = [chipDefsEn, routeEn, gateEn, piecesEn, statsEn, rulesEn].flatMap(textos);
    // '62/62' es una cifra: es igual en los dos idiomas.
    expect(en.filter((v) => es.has(v) && TIENE_LETRAS.test(v))).toEqual([]);
  });
});

describe('render de cada idioma', () => {
  const es = renderToString(<App />);
  const en = renderToString(<App lang="en" />);

  it('el español no cambió: mismo titular y sin texto en inglés salvo el enlace de idioma', () => {
    expect(es).toContain('Tu agente entregó más código del que');
    expect(es.match(/href="\/en"/g)).toHaveLength(2);
    expect(es).toContain('>English</a>');
    expect(es).not.toContain('Your agent');
  });

  it('el inglés trae el titular, las mismas secciones y vuelve al español', () => {
    expect(en).toContain('Your agent shipped more code than');
    for (const id of ['inicio', 'compuerta', 'piezas', 'numeros', 'reglas', 'empezar']) expect(en).toContain(`id="${id}"`);
    expect(en.match(/href="\/" hrefLang="es" lang="es"/g) ?? en.match(/href="\/" hreflang="es" lang="es"/g)).toHaveLength(2);
    expect(en).toContain('>Español</a>');
    expect(en).toContain('Back to Break Point');
  });

  it('en la versión en inglés no queda ninguna palabra con tilde o eñe fuera del enlace "Español"', () => {
    const visible = en.replace(/<[^>]+>/g, ' ').replace(/Español/g, ' ');
    expect(visible.match(/[áéíóúñ¿¡]\S*|\S*[áéíóúñ]/gi) ?? []).toEqual([]);
  });

  it('las dos versiones tienen la misma estructura de etiquetas', () => {
    const forma = (h: string) => (h.match(/<[a-z0-9]+/g) ?? []).join(',');
    expect(forma(en)).toBe(forma(es));
  });

  it('en inglés los chips cargan su texto en inglés', () => {
    render(<App lang="en" />);
    fireEvent.click(screen.getByRole('button', { name: chipDefsEn[0].label }));
    expect((screen.getByRole('textbox') as HTMLTextAreaElement).value).toBe(chipDefsEn[0].text);
  });

  it('el idioma sale de la URL', () => {
    expect([langDeRuta('/'), langDeRuta('/en'), langDeRuta('/en/'), langDeRuta('/english'), langDeRuta('/x')]).toEqual(['es', 'en', 'en', 'es', 'es']);
  });
});

describe('cabecera de cada página (prerender)', () => {
  const de = (h: string, re: RegExp) => (re.exec(h) ?? [])[1];
  const en = conCabecera(INDEX, '/en');
  const es = conCabecera(INDEX, '/');

  it('/en lleva su idioma, título, descripción, canonical e imagen', () => {
    expect(de(en, /<html lang="([^"]*)"/)).toBe('en');
    expect(de(en, /<title>([^<]*)<\/title>/)).toBe(PAGINAS['/en'].title);
    expect(de(en, /rel="canonical" href="([^"]*)"/)).toBe(`${URL_SITIO}/en`);
    expect(de(en, /property="og:url" content="([^"]*)"/)).toBe(`${URL_SITIO}/en`);
    expect(de(en, /property="og:locale" content="([^"]*)"/)).toBe('en_US');
    expect(de(en, /property="og:image" content="([^"]*)"/)).toBe(`${URL_SITIO}/og-cordada-en.png`);
    expect(de(en, /name="description" content="([^"]*)"/)).toMatch(/^Cordada does not make the agent smarter/);
    expect(de(en, /"inLanguage": "([^"]*)"/)).toBe('en');
    expect(en.match(/<title>/g)).toHaveLength(1);
    expect(en.match(/rel="canonical"/g)).toHaveLength(1);
  });

  it('la página en español queda con la cabecera de index.html más los hreflang', () => {
    expect(es.replace(`  ${hreflang().join('\n    ')}\n  `, '')).toBe(INDEX);
  });

  it('los hreflang son recíprocos: las dos páginas llevan los mismos tres', () => {
    for (const h of [es, en]) {
      expect(h).toContain(`hreflang="es" href="${URL_SITIO}/"`);
      expect(h).toContain(`hreflang="en" href="${URL_SITIO}/en"`);
      expect(h).toContain(`hreflang="x-default" href="${URL_SITIO}/"`);
      expect(h.match(/hreflang=/g)).toHaveLength(3);
    }
  });

  it('falla antes que publicar /en con la cabecera de otra página', () => {
    expect(() => conCabecera(INDEX.replace('<link rel="canonical" href="https://cordada.breakpoint.biz/" />', ''), '/en')).toThrow(/exactamente una vez/);
    expect(() => conCabecera(INDEX, '/fr')).toThrow(/no hay datos/);
  });

  it('el sitemap lista las dos páginas con sus alternas, y las dos imágenes son PNG de 1200x630', () => {
    const sitemap = leer('public/sitemap.xml');
    for (const ruta of Object.keys(PAGINAS)) expect(sitemap).toContain(`<loc>${URL_SITIO}${ruta}</loc>`);
    expect(sitemap.match(/hreflang="en" href="https:\/\/cordada\.breakpoint\.biz\/en"/g)).toHaveLength(2);
    for (const p of Object.values(PAGINAS) as { imagen: string }[]) {
      const png = readFileSync(join(RAIZ, 'public', p.imagen));
      expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([1200, 630]);
    }
  });
});

describe('cabecera fija (C6)', () => {
  it('el contenedor de la página ya no trae overflow-x en línea: lo recorta una clase que no anula sticky', () => {
    const { tsx, baseCss } = construir();
    expect(tsx).toContain(`<div className="${CLASE_PAGINA}" style={css({ minHeight: "100vh"`);
    expect(tsx).not.toMatch(/overflowX/);
    expect(baseCss).toContain(`.${CLASE_PAGINA}{overflow-x:hidden}@supports (overflow:clip){.${CLASE_PAGINA}{overflow-x:clip}}`);
    expect(tsx).toMatch(/<header style=\{css\(\{ position: "sticky", top: "0"/);
  });

  it('conCabeceraFija y conIdioma fallan si el diseño cambia de forma', () => {
    expect(() => conCabeceraFija('<div style="min-height: 100vh; color: red"><p>x</p></div>')).toThrow(/overflow-x/);
    expect(() => conCabeceraFija('<section style="x"></section>')).toThrow(/no es el que esperaba/);
    expect(conCabeceraFija('<div style="min-height: 100vh; color: red; overflow-x: hidden"><p>x</p></div>'))
      .toBe(`<div class="${CLASE_PAGINA}" style="min-height: 100vh; color: red"><p>x</p></div>`);
    expect(() => conIdioma('<a href="https://breakpoint.biz" style="a">Volver a Break Point</a>')).toThrow(/dos enlaces/);
  });
});
