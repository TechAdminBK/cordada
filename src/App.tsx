import { useState } from 'react';
import { Landing } from './generated/Landing';
import { ACENTO, CHIP_ELEGIDO, chipDefs, gate, pieces, route, rules, stats, type Chip } from './datos';

// El marcado es el del diseño (src/generated/Landing.tsx). Acá vive lo único con estado: el brief
// y el chip elegido. Elegir un chip carga su texto de ejemplo; escribir a mano lo deselecciona.
export function App() {
  const [chip, setChip] = useState(-1);
  const [brief, setBrief] = useState('');

  const chips: Chip[] = chipDefs.map((c, i) => ({
    label: c.label,
    color: CHIP_ELEGIDO,
    on: chip === i,
    off: chip !== i,
    pick: () => { setChip(i); setBrief(c.text); },
  }));

  return (
    <Landing
      accent={ACENTO}
      brief={brief}
      onBrief={(e) => { setBrief(e.target.value); setChip(-1); }}
      chips={chips}
      route={route}
      gate={gate}
      pieces={pieces}
      stats={stats}
      rules={rules}
    />
  );
}
