import { useState } from 'react';
import { Landing } from './generated/Landing';
import { ACENTO, CHIP_ELEGIDO, chipDefs, gate, pieces, route, rules, stats, type Chip } from './datos';
import { chipDefsEn, gateEn, piecesEn, routeEn, rulesEn, statsEn, traducir } from './en';

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

// El marcado es el del diseño (src/generated/Landing.tsx). Acá vive lo único con estado: el brief
// y el chip elegido. Elegir un chip carga su texto de ejemplo; escribir a mano lo deselecciona.
export function App({ lang = 'es' }: { lang?: Lang }) {
  const [chip, setChip] = useState(-1);
  const [brief, setBrief] = useState('');
  const c = CONTENIDO[lang];

  const chips: Chip[] = c.chipDefs.map((def, i) => ({
    label: def.label,
    color: CHIP_ELEGIDO,
    on: chip === i,
    off: chip !== i,
    pick: () => { setChip(i); setBrief(def.text); },
  }));

  return (
    <Landing
      t={c.t}
      idioma={c.idioma}
      accent={ACENTO}
      brief={brief}
      onBrief={(e) => { setBrief(e.target.value); setChip(-1); }}
      chips={chips}
      route={c.route}
      gate={c.gate}
      pieces={c.pieces}
      stats={c.stats}
      rules={c.rules}
    />
  );
}
