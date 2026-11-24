// Prerender de la landing. Corre DESPUÉS de `vite build`: compila src/entry-server.tsx en modo SSR,
// renderiza la página y escribe el HTML con todo el texto dentro del #root, para que buscadores y
// rastreadores de IA la lean sin ejecutar JavaScript. Sin esto el HTML inicial traía 0 palabras.
import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

// fileURLToPath y no import.meta.dirname: este último pide Node 20.11 y el build no fija versión.
const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(RAIZ, 'dist');
const SALIDA_SSR = join(RAIZ, 'dist-ssr');
const ROOT_VACIO = '<div id="root"></div>';

// Origen público del sitio; el mismo que usan index.html, sitemap.xml y robots.txt.
export const URL_SITIO = 'https://cordada.breakpoint.biz';

export class ErrorPrerender extends Error {}

// Reemplaza el root vacío del index.html que construyó Vite; el <head> y los <script> quedan igual.
// La función de reemplazo evita que un "$&" en el HTML se interprete como patrón.
export function inyectar(plantilla, html) {
  if (!plantilla.includes(ROOT_VACIO)) throw new ErrorPrerender(`index.html no tiene ${ROOT_VACIO}`);
  if (!html.trim()) throw new ErrorPrerender('el render salió vacío: no se publica una página sin contenido');
  return plantilla.replace(ROOT_VACIO, () => `<div id="root">${html}</div>`);
}

async function main() {
  const plantillaPath = join(DIST, 'index.html');
  if (!existsSync(plantillaPath)) throw new ErrorPrerender('no existe dist/index.html: correr vite build antes');
  const { build } = await import('vite');
  await build({
    root: RAIZ,
    logLevel: 'warn',
    build: { ssr: 'src/entry-server.tsx', outDir: SALIDA_SSR, emptyOutDir: true, copyPublicDir: false },
  });
  try {
    const { render } = await import(pathToFileURL(join(SALIDA_SSR, 'entry-server.js')).href);
    const html = render();
    writeFileSync(plantillaPath, inyectar(readFileSync(plantillaPath, 'utf8'), html));
    const palabras = html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
    console.log(`prerender: / escrita con ${palabras} palabras en el HTML inicial`);
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
