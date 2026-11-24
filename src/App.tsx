import { useState } from 'react';
import { BotonContacto, Landing } from './generated/Landing';
import { ACENTO, CHIP_ELEGIDO, chipDefs, gate, pieces, route, rules, stats, type Chip } from './datos';
import { chipDefsEn, gateEn, piecesEn, routeEn, rulesEn, statsEn, traducir } from './en';
import { avisoListo } from './aviso';
import { Contacto } from './Contacto';
import { Privacidad } from './Privacidad';
import { configDeContacto } from './lib/contacto';

export type Lang = 'es' | 'en';

// Cada idioma tiene su URL (/ y /en) y su página prerenderizada. El idioma sale de la URL, no de
// estado: así el HTML que llega coincide con lo que el navegador hidrata.
export function langDeRuta(ruta: string): Lang {
  return ruta === '/en' || ruta.startsWith('/en/') ? 'en' : 'es';
}

const CONTENIDO = {
  es: { t: (s: string) => s, idioma: { href: '/en', codigo: 'en', label: 'English' }, chipDefs, route, gate, pieces, stats, rules },
  en: { t: traducir, idioma: { href: '/', codigo: 'es', label: 'Español' }, chipDefs: chipDefsEn, route: routeEn, gate: gateEn, pieces: piecesEn, stats: statsEn, rules: rulesEn },
};

// Mientras el formulario propio no esté activo, el botón lleva al formulario de Break Point.
export const CONTACTO_RESPALDO = 'https://www.breakpoint.biz/#empecemos';
export const RUTA_AVISO = '/privacidad';

/**
 * El candado del formulario de contacto, en un solo lugar: lo usan la app, el prerender
 * (src/entry-server.tsx) y los tests. Devuelve la configuración de la base si el formulario se
 * muestra, o null si queda el botón de respaldo. Se muestra solo si se cumplen las tres:
 *   1. la página es la versión en español,
 *   2. el aviso de privacidad de Cordada está aprobado y completo (src/aviso.ts), y
 *   3. están las variables de la base (VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY).
 *
 * En /en el formulario NO se muestra nunca (decisión tomada al integrar con la versión en inglés):
 * el aviso existe solo en español y es texto legal, así que no se pide consentimiento sobre un
 * texto que la persona no tiene en su idioma. En /en queda siempre el botón de respaldo, y el
 * formulario y /privacidad son solo de la versión en español.
 */
export function contactoActivo(lang: Lang, env: Record<string, unknown>): { url: string; anonKey: string } | null {
  if (lang !== 'es') return null;
  return avisoListo() ? configDeContacto(env) : null;
}

// /privacidad, /privacidad/ y /privacidad/index.html son la misma página: el host sirve las tres.
const sinBarraFinal = (ruta: string) => ruta.replace(/\/index\.html$/, '').replace(/\/+$/, '');

type Props = {
  /** Ruta de la página. main.tsx pasa la del navegador y el prerender la que está escribiendo. */
  ruta?: string;
  /** Idioma; por defecto sale de la ruta. */
  lang?: Lang;
  /** Variables de entorno; por defecto las del build. Los tests pasan las suyas. */
  env?: Record<string, unknown>;
  fetchImpl?: typeof fetch;
};

// El marcado es el del diseño (src/generated/Landing.tsx). Acá vive lo único con estado: el brief
// y el chip elegido. Elegir un chip carga su texto de ejemplo; escribir a mano lo deselecciona.
//
// En el lugar del botón "Empezar un proyecto" va el formulario de contacto si el candado lo
// habilita (ver contactoActivo) y, si no, el mismo botón del diseño con el enlace de respaldo: la
// página nunca queda sin vía de contacto.
export function App({ ruta, lang, env = import.meta.env, fetchImpl }: Props) {
  const [chip, setChip] = useState(-1);
  const [brief, setBrief] = useState('');
  const rutaActual = ruta ?? (typeof window === 'undefined' ? '/' : window.location.pathname);
  const idioma = lang ?? langDeRuta(rutaActual);
  const c = CONTENIDO[idioma];
  const cfg = contactoActivo(idioma, env);

  // El aviso solo tiene página cuando el formulario que lo enlaza está activo.
  if (cfg && sinBarraFinal(rutaActual) === RUTA_AVISO) return <Privacidad />;

  const chips: Chip[] = c.chipDefs.map((def, i) => ({
    label: def.label,
    color: CHIP_ELEGIDO,
    on: chip === i,
    off: chip !== i,
    pick: () => { setChip(i); setBrief(def.text); },
  }));
  const escribir = (texto: string) => { setBrief(texto); setChip(-1); };

  return (
    <Landing
      t={c.t}
      idioma={c.idioma}
      accent={ACENTO}
      brief={brief}
      onBrief={(e) => escribir(e.target.value)}
      chips={chips}
      route={c.route}
      gate={c.gate}
      pieces={c.pieces}
      stats={c.stats}
      rules={c.rules}
      contacto={cfg
        ? <Contacto cfg={cfg} brief={brief} onBrief={escribir} fetchImpl={fetchImpl} />
        : <BotonContacto href={CONTACTO_RESPALDO} t={c.t} />}
    />
  );
}
