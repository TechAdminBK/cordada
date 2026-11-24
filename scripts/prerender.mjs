// Prerender de la landing. Corre DESPUÉS de `vite build`: compila src/entry-server.tsx en modo SSR,
// renderiza cada página y escribe el HTML con todo el texto dentro del #root, para que buscadores y
// rastreadores de IA la lean sin ejecutar JavaScript. Sin esto el HTML inicial traía 0 palabras.
//
// Escribe dos páginas: / (español) y /en (inglés), cada una con su título, descripción, canonical,
// imagen y los hreflang que las enlazan entre sí.
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

// fileURLToPath y no import.meta.dirname: este último pide Node 20.11 y el build no fija versión.
const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(RAIZ, 'dist');
const SALIDA_SSR = join(RAIZ, 'dist-ssr');
const ROOT_VACIO = '<div id="root"></div>';

// Origen público del sitio; el mismo que usan index.html, sitemap.xml y robots.txt.
export const URL_SITIO = 'https://cordada.breakpoint.biz';

// Las páginas del sitio. index.html trae la cabecera de la versión en español; la de inglés se
// arma reemplazando sobre esa plantilla. '/' va última porque pisa dist/index.html, la plantilla.
export const PAGINAS = {
  '/en': {
    lang: 'en',
    locale: 'en_US',
    title: 'Cordada — agent-driven development',
    description: 'Cordada does not make the agent smarter: it takes away the option of shipping something nobody checked. Criteria written beforehand, a separate review and a gate that applies the whole batch or applies nothing.',
    imagen: '/og-cordada-en.png',
    alt: 'Cordada — Your agent shipped more code than you can review.',
  },
  '/': {
    lang: 'es',
    locale: 'es_AR',
    title: 'Cordada — desarrollo con agentes',
    description: 'Cordada no hace al agente más inteligente: le saca la opción de entregar algo que nadie controló. Criterios escritos antes, revisión aparte y una compuerta que aplica el lote entero o no aplica nada.',
    imagen: '/og-cordada.png',
    alt: 'Cordada — Tu agente entregó más código del que podés revisar.',
  },
};

export class ErrorPrerender extends Error {}

const escAttr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const urlDe = (ruta) => `${URL_SITIO}${ruta}`;

// Los hreflang van en las dos páginas y son recíprocos; x-default apunta al español.
export function hreflang() {
  return [
    `<link rel="alternate" hreflang="es" href="${urlDe('/')}" />`,
    `<link rel="alternate" hreflang="en" href="${urlDe('/en')}" />`,
    `<link rel="alternate" hreflang="x-default" href="${urlDe('/')}" />`,
  ];
}

// Deja la cabecera de la plantilla con los datos de la página. Reemplaza cada etiqueta (nunca
// agrega una segunda) y falla si la plantilla no la trae: publicar /en con el título, la canonical
// o el idioma de la página en español es justo lo que esto viene a evitar.
export function conCabecera(plantilla, ruta) {
  const p = PAGINAS[ruta];
  if (!p) throw new ErrorPrerender(`no hay datos de cabecera para ${ruta}`);
  const meta = (attr, nombre, valor) => [new RegExp(`<meta ${attr}="${nombre}" content="[^"]*" />`), `<meta ${attr}="${nombre}" content="${escAttr(valor)}" />`];
  const cambios = [
    [/<html lang="[^"]*">/, `<html lang="${p.lang}">`],
    [/<title>[^<]*<\/title>/, `<title>${escAttr(p.title)}</title>`],
    [/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${urlDe(ruta)}" />`],
    meta('name', 'description', p.description),
    meta('property', 'og:locale', p.locale),
    meta('property', 'og:url', urlDe(ruta)),
    meta('property', 'og:title', p.title),
    meta('property', 'og:description', p.description),
    meta('property', 'og:image', urlDe(p.imagen)),
    meta('property', 'og:image:alt', p.alt),
    meta('name', 'twitter:image', urlDe(p.imagen)),
    [/"inLanguage": "[^"]*"/, `"inLanguage": "${p.lang}"`],
  ];
  let out = plantilla;
  for (const [re, nuevo] of cambios) {
    if (out.split(re).length !== 2) throw new ErrorPrerender(`index.html tiene que traer exactamente una vez: ${re.source}`);
    out = out.replace(re, () => nuevo);
  }
  if (/hreflang=/.test(out)) throw new ErrorPrerender('index.html no debe traer hreflang: los pone el prerender');
  return out.replace('</head>', () => `  ${hreflang().join('\n    ')}\n  </head>`);
}

// Reemplaza el root vacío del index.html que construyó Vite; el <head> y los <script> quedan igual.
// La función de reemplazo evita que un "$&" en el HTML se interprete como patrón.
export function inyectar(plantilla, html) {
  if (!plantilla.includes(ROOT_VACIO)) throw new ErrorPrerender(`index.html no tiene ${ROOT_VACIO}`);
  if (!html.trim()) throw new ErrorPrerender('el render salió vacío: no se publica una página sin contenido');
  return plantilla.replace(ROOT_VACIO, () => `<div id="root">${html}</div>`);
}

export function archivoDe(ruta) {
  return join(DIST, ...ruta.split('/').filter(Boolean), 'index.html');
}

async function main() {
  const plantillaPath = join(DIST, 'index.html');
  if (!existsSync(plantillaPath)) throw new ErrorPrerender('no existe dist/index.html: correr vite build antes');
  const plantilla = readFileSync(plantillaPath, 'utf8');
  const { build } = await import('vite');
  await build({
    root: RAIZ,
    logLevel: 'warn',
    build: { ssr: 'src/entry-server.tsx', outDir: SALIDA_SSR, emptyOutDir: true, copyPublicDir: false },
  });
  try {
    const { render } = await import(pathToFileURL(join(SALIDA_SSR, 'entry-server.js')).href);
    for (const [ruta, p] of Object.entries(PAGINAS)) {
      const html = render(p.lang);
      const destino = archivoDe(ruta);
      mkdirSync(dirname(destino), { recursive: true });
      writeFileSync(destino, inyectar(conCabecera(plantilla, ruta), html));
      const palabras = html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
      console.log(`prerender: ${ruta} escrita con ${palabras} palabras en el HTML inicial`);
    }
  } finally {
    rmSync(SALIDA_SSR, { recursive: true, force: true });
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch((e) => {
    console.error(`prerender ABORTADO: ${e instanceof Error ? e.message : String(e)}`);
    process.exit(1);
  });
}
