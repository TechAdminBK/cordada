import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach } from 'vitest';
import { App } from './App';
import { chipDefs, gate, pieces, route, rules, stats } from './datos';
// @ts-expect-error: módulo .mjs sin tipos; se prueba su comportamiento
import { aJsx, conBreakPoint, construir, guionDelDiseno } from '../scripts/generar-landing.mjs';

afterEach(cleanup);

const RAIZ = join(__dirname, '..');
const sinCR = (s: string) => s.replace(/\r\n/g, '\n');

describe('el marcado sale del diseño, no de la mano', () => {
  it('src/generated está al día con design/cordada-landing.html (si falla: node scripts/generar-landing.mjs)', () => {
    const { tsx, baseCss } = construir();
    expect(sinCR(readFileSync(join(RAIZ, 'src/generated/Landing.tsx'), 'utf8'))).toBe(sinCR(tsx));
    expect(sinCR(readFileSync(join(RAIZ, 'src/generated/base.css'), 'utf8'))).toBe(sinCR(baseCss));
  });

  it('el CSS base trae las siete animaciones del diseño y respeta reduced-motion', () => {
    const { baseCss } = construir();
    for (const k of ['cd-marquee', 'cd-pulse', 'cd-blink', 'cd-rise', 'cd-rope', 'cd-float', 'cd-spin']) {
      expect(baseCss).toContain(`@keyframes ${k}`);
    }
    expect(baseCss).toContain('@media (prefers-reduced-motion:reduce)');
  });
});

describe('conversor de marcado a JSX', () => {
  it('convierte estilos inline a objeto, sin tocar los valores', () => {
    const out = aJsx('<div style="font-stretch: 125%; -webkit-font-smoothing: antialiased; margin: 0 auto"><b>x</b></div>');
    expect(out).toContain('fontStretch: "125%"');
    expect(out).toContain('WebkitFontSmoothing: "antialiased"');
    expect(out).toContain('margin: "0 auto"');
  });

  it('un espacio entre elementos en línea se conserva como en HTML', () => {
    const out = aJsx('<p><span>a</span> <span>b</span></p>');
    expect(out).toContain('{" "}');
  });

  it('las listas y condiciones del diseño pasan a map y a &&', () => {
    const out = aJsx('<ul><sc-for list="{{rules}}" as="r"><sc-if value="{{r.on}}"><li style="color: {{r.color}}">{{r.tag}}</li></sc-if></sc-for></ul>');
    expect(out).toContain('{rules.map((r, i) => (<Fragment key={i}>');
    expect(out).toContain('{r.on && (<>');
    expect(out).toContain('color: r.color');
    expect(out).toContain('{r.tag}');
  });

  it('un valor con binding en medio pasa a template literal', () => {
    expect(aJsx('<i style="border: 2px solid {{c}}">.</i>')).toContain('border: `2px solid ${c}`');
  });

  it('rechaza marcado desbalanceado en vez de generar algo roto', () => {
    expect(() => aJsx('<div><p>x</p></div>')).not.toThrow();
    expect(() => aJsx('<div><p>x</p>')).toThrow(/desbalanceado/);
  });

  it('falla, en vez de convertir mal, ante lo que no soporta', () => {
    expect(() => aJsx('<i style="background: url(a;b.png)">.</i>')).toThrow(/url\(\)/);
    expect(() => aJsx("<i title='x'>.</i>")).toThrow(/comilla simple/);
    expect(() => aJsx('<input disabled>')).toThrow(/booleano/);
    expect(() => aJsx('<p>a &rarr; b</p>')).toThrow(/entidad/);
    expect(aJsx('<p>Git &amp; CI</p>')).toContain('"Git & CI"');
  });

  it('el enlace a Break Point entra una vez en el menú y una en el pie', () => {
    const base = '<nav><a href="#reglas" style="color: #4A4A46; text-decoration: none">Reglas</a></nav><footer><div>x</div></footer>';
    const out = conBreakPoint(base);
    expect(out.match(/https:\/\/breakpoint\.biz/g)).toHaveLength(2);
    expect(() => conBreakPoint('<nav></nav>')).toThrow();
  });
});

describe('datos: las cifras son un registro, no se redondean', () => {
  it('cantidades de cada lista', () => {
    expect([chipDefs.length, route.length, gate.length, pieces.length, stats.length, rules.length]).toEqual([4, 5, 4, 4, 6, 8]);
  });

  it('las seis cifras grandes, tal cual', () => {
    expect(stats.map((s) => s.big)).toEqual(['62/62', '437/920', '686≠985', '42→0', '19/58', '21']);
    expect(route.find((s) => s.name === 'Compuerta')?.verdict).toBe('62/62');
    expect(gate.map((g) => g.verdict)).toEqual(['RECHAZADO', 'APLICADO', 'RECHAZADO', 'APLICADO']);
  });
});

// src/datos.ts copia las listas del componente del diseño. Si el diseño cambia una cifra o un texto
// y se regenera, el marcado no cambia (lee de datos.ts): estos dos tests son los que lo delatan.
describe('datos.ts coincide con las listas del diseño', () => {
  const guion: string = guionDelDiseno();
  const textos = (o: object): string[] => Object.values(o).filter((v): v is string => typeof v === 'string');
  const propios = [...chipDefs, ...route, ...gate, ...pieces, ...stats, ...rules].flatMap(textos);

  it('cada texto, color y cifra de datos.ts está en el diseño', () => {
    const faltan = propios.filter((v) => !guion.includes(`'${v}'`));
    expect(faltan).toEqual([]);
  });

  it('cada literal del diseño está en datos.ts (nada quedó afuera ni cambió)', () => {
    const delDiseno = [...guion.matchAll(/'([^'\n]+)'/g)].map((m) => m[1]);
    expect(delDiseno.length).toBeGreaterThan(100);
    const set = new Set(propios);
    const faltan = delDiseno.filter((v) => !set.has(v));
    expect(faltan).toEqual([]);
  });
});

describe('estado: brief y chips', () => {
  it('elegir un chip carga su texto y lo marca; escribir a mano lo desmarca', () => {
    render(<App />);
    const brief = screen.getByRole('textbox') as HTMLTextAreaElement;
    expect(brief.value).toBe('');

    fireEvent.click(screen.getByRole('button', { name: chipDefs[1].label }));
    expect(brief.value).toBe(chipDefs[1].text);
    expect(screen.getByRole('button', { name: chipDefs[1].label }).getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByRole('button', { name: chipDefs[0].label }).getAttribute('aria-pressed')).toBe('false');

    fireEvent.change(brief, { target: { value: 'texto propio' } });
    expect(brief.value).toBe('texto propio');
    expect(screen.getAllByRole('button').every((b) => b.getAttribute('aria-pressed') === 'false')).toBe(true);
  });
});

describe('render', () => {
  const html = renderToString(<App />);

  it('trae las secciones del diseño con sus anclas', () => {
    for (const id of ['inicio', 'compuerta', 'piezas', 'numeros', 'reglas', 'empezar']) expect(html).toContain(`id="${id}"`);
  });

  it('muestra el titular y los cuatro chips sin elegir', () => {
    expect(html).toContain('Tu agente entregó más código del que');
    expect(html.match(/aria-pressed="false"/g)).toHaveLength(4);
    expect(html).not.toContain('aria-pressed="true"');
  });

  it('tiene la vuelta a Break Point en el menú y en el pie', () => {
    expect(html.match(/href="https:\/\/breakpoint\.biz"/g)).toHaveLength(2);
    expect(html.match(/Volver a Break Point/g)).toHaveLength(2);
  });

  it('no deja ningún {{ }} del diseño sin resolver', () => {
    expect(html).not.toMatch(/\{\{|\}\}/);
  });
});
