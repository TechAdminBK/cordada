// Genera la landing a partir del diseño exportado, sin retipear nada.
//
//   node scripts/generar-landing.mjs
//
// Lee design/cordada-landing.html (el export de la herramienta de diseño), saca el marcado y el CSS
// base, y escribe:
//   src/generated/Landing.tsx   el marcado convertido a JSX, con sus estilos inline tal cual
//   src/generated/base.css      el CSS global del diseño (keyframes, hovers, foco)
//
// Lo único que este script agrega al diseño es el enlace de vuelta a Break Point (encabezado y pie).
// Los datos de las listas (ruta, compuerta, piezas, cifras, reglas) viven en src/datos.ts.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const ORIGEN = join(RAIZ, 'design', 'cordada-landing.html');
const SALIDA = join(RAIZ, 'src', 'generated');

const BREAKPOINT = 'https://breakpoint.biz';
const VOLVER_NAV = `<a href="${BREAKPOINT}" style="color: #4A4A46; text-decoration: none">Volver a Break Point</a>`;
const VOLVER_PIE = `<a href="${BREAKPOINT}" style="color: #0F1020; font-weight: 600; text-decoration: none">Volver a Break Point</a>`;

// El diseño deja el botón "Empezar un proyecto" con un destino de relleno. Va al formulario de
// contacto de Break Point (decisión de Gustavo, 23-nov-2026).
const RELLENO_CONTACTO = 'href="[ENLACE DE CONTACTO]"';
export const CONTACTO = 'https://www.breakpoint.biz/#empecemos';

// ── 1. Sacar el template del bundle ──────────────────────────────────────────────────────────
export function leerTemplate(html) {
  const abre = '<script type="__bundler/template">';
  const i = html.indexOf(abre);
  if (i < 0) throw new Error('el archivo no trae el template del bundle');
  const desde = i + abre.length;
  return JSON.parse(html.slice(desde, html.indexOf('</script>', desde)));
}

export function partes(template) {
  const ini = template.indexOf('<div style="min-height: 100vh');
  const fin = template.indexOf('<sc-if data-dc-static');
  if (ini < 0 || fin < 0) throw new Error('no encontré el cuerpo de la página en el template');
  const cuerpo = template.slice(ini, fin).trim();
  const k = template.indexOf('@keyframes cd-marquee');
  const sIni = template.lastIndexOf('<style>', k) + '<style>'.length;
  const css = template.slice(sIni, template.indexOf('</style>', k)).trim();
  return { cuerpo, css };
}

// El script del componente del diseño (donde viven las listas que copia src/datos.ts).
export function guionDelDiseno() {
  const t = leerTemplate(readFileSync(ORIGEN, 'utf8'));
  const i = t.indexOf('renderVals()');
  if (i < 0) throw new Error('el diseño no trae renderVals()');
  return t.slice(i, t.indexOf('</script>', i));
}

// ── 2. Convertir el marcado a JSX ────────────────────────────────────────────────────────────
const ENTIDADES = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&nbsp;': ' ', '&#39;': "'" };
const decodificar = (s) => {
  // Una entidad fuera de esta lista saldría como texto literal ("&rarr;"): mejor fallar.
  const rara = (s.match(/&[a-zA-Z#][a-zA-Z0-9]*;/g) ?? []).find((e) => !(e in ENTIDADES));
  if (rara) throw new Error(`entidad HTML sin soporte: ${rara}`);
  return s.replace(/&(amp|lt|gt|quot|nbsp|#39);/g, (m) => ENTIDADES[m]);
};
const camel = (p) => p.trim().replace(/^-(webkit|moz|ms)-/, (_, v) => v[0].toUpperCase() + v.slice(1) + '-').replace(/-([a-z])/g, (_, c) => c.toUpperCase());

// "a {{x}} b" -> expresión JS: una cadena, una variable o un template literal.
function expresion(valor) {
  const solo = valor.match(/^\{\{\s*([^}]+?)\s*\}\}$/);
  if (solo) return solo[1];
  if (!valor.includes('{{')) return JSON.stringify(valor);
  return '`' + valor.replace(/[`\\]/g, '\\$&').replace(/\{\{\s*([^}]+?)\s*\}\}/g, '${$1}') + '`';
}

function estilo(valor) {
  // Un ';' o ':' dentro de url() o data: rompería el corte por declaraciones: mejor fallar que convertir mal.
  if (/url\(|data:/i.test(valor)) throw new Error(`estilo con url() o data: sin soporte: ${valor.slice(0, 60)}`);
  const props = valor.split(';').map((d) => d.trim()).filter(Boolean).map((d) => {
    const c = d.indexOf(':');
    return `${camel(d.slice(0, c))}: ${expresion(d.slice(c + 1).trim())}`;
  });
  return `style={css({ ${props.join(', ')} })}`;
}

const RENOMBRAR = { class: 'className', for: 'htmlFor' };
const EVENTOS = { 'sc-camel-on-click': 'onClick', 'sc-camel-on-change': 'onChange' };
const DESCARTAR = /^(hint-|data-canvas-)/;

function atributos(texto) {
  if (/=\s*'/.test(texto)) throw new Error(`atributo con comilla simple sin soporte: ${texto.slice(0, 60)}`);
  const out = [];
  const re = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:="([^"]*)")?/g;
  for (let m; (m = re.exec(texto)); ) {
    const [, nombre, crudo] = m;
    if (crudo === undefined) throw new Error(`atributo sin valor (booleano) sin soporte: ${nombre}`);
    if (DESCARTAR.test(nombre)) continue;
    const valor = decodificar(crudo);
    if (nombre === 'style') out.push(estilo(valor));
    else if (EVENTOS[nombre]) out.push(`${EVENTOS[nombre]}={${expresion(valor)}}`);
    else if (nombre === 'rows') out.push(`rows={${Number(valor)}}`);
    else if (valor.includes('{{')) out.push(`${RENOMBRAR[nombre] ?? nombre}={${expresion(valor)}}`);
    else out.push(`${RENOMBRAR[nombre] ?? nombre}=${JSON.stringify(valor)}`);
  }
  return out;
}

// En HTML un espacio entre elementos en línea se ve; en JSX, un salto de línea se pierde.
// Por eso cada nodo de texto sale como expresión explícita, con sus espacios colapsados.
function texto(crudo) {
  const t = decodificar(crudo).replace(/\s+/g, ' ');
  if (t === ' ') return '{" "}';
  return t.split(/(\{\{\s*[^}]+?\s*\}\})/).filter(Boolean).map((p) => {
    const b = p.match(/^\{\{\s*([^}]+?)\s*\}\}$/);
    return b ? `{${b[1]}}` : `{${JSON.stringify(p)}}`;
  }).join('');
}

export function aJsx(html) {
  const tokens = html.match(/<!--[\s\S]*?-->|<\/?[a-zA-Z][^>]*>|[^<]+/g) ?? [];
  const out = [];
  let nivel = 0;
  const sangria = () => '  '.repeat(nivel + 3);
  for (const tok of tokens) {
    if (tok.startsWith('<!--')) continue;
    if (!tok.startsWith('<')) {
      if (nivel === 0) continue; // espacio fuera del elemento raíz
      out.push(sangria() + texto(tok));
      continue;
    }
    const cierre = tok.startsWith('</');
    const nombre = tok.match(/^<\/?([a-zA-Z][a-zA-Z0-9-]*)/)[1];
    if (cierre) {
      nivel--;
      if (nombre === 'sc-for') out.push(sangria() + '</Fragment>))}');
      else if (nombre === 'sc-if') out.push(sangria() + '</>)}');
      else out.push(sangria() + `</${nombre}>`);
      continue;
    }
    const resto = tok.slice(nombre.length + 1, -1);
    if (nombre === 'sc-for') {
      const lista = resto.match(/list="\{\{\s*([^}]+?)\s*\}\}"/)[1];
      const como = resto.match(/as="([^"]+)"/)[1];
      out.push(sangria() + `{${lista}.map((${como}, i) => (<Fragment key={i}>`);
    } else if (nombre === 'sc-if') {
      const cond = resto.match(/value="\{\{\s*([^}]+?)\s*\}\}"/)[1];
      out.push(sangria() + `{${cond} && (<>`);
    } else {
      const attrs = atributos(resto);
      out.push(sangria() + `<${nombre}${attrs.length ? ' ' + attrs.join(' ') : ''}>`);
    }
    nivel++;
  }
  if (nivel !== 0) throw new Error(`marcado desbalanceado: quedaron ${nivel} etiquetas abiertas`);
  return out.join('\n');
}

// El enlace a Break Point va como último enlace de texto del menú y como último ítem del pie.
export function conBreakPoint(cuerpo) {
  const reglas = '<a href="#reglas" style="color: #4A4A46; text-decoration: none">Reglas</a>';
  if (!cuerpo.includes(reglas)) throw new Error('no encontré el enlace "Reglas" del menú');
  let out = cuerpo.replace(reglas, reglas + '\n        ' + VOLVER_NAV);
  const pie = out.lastIndexOf('</div>', out.indexOf('</footer>'));
  if (pie < 0) throw new Error('no encontré el cierre del pie');
  out = out.slice(0, pie) + '  ' + VOLVER_PIE + '\n    ' + out.slice(pie);
  return out;
}

// ── 3. Escribir ──────────────────────────────────────────────────────────────────────────────
// Devuelve el contenido de los dos archivos sin escribirlos: lo usa el test que detecta si el
// generado quedó desactualizado o alguien lo editó a mano.
// Reemplaza el destino de relleno del diseño. Si el diseño deja de traerlo (o trae más de uno),
// falla: mejor enterarse acá que publicar un botón roto.
export function conContacto(cuerpo) {
  const veces = cuerpo.split(RELLENO_CONTACTO).length - 1;
  if (veces !== 1) throw new Error(`esperaba un destino de relleno de contacto en el diseño y hay ${veces}`);
  return cuerpo.replace(RELLENO_CONTACTO, `href="${CONTACTO}"`);
}

export function construir() {
  const { cuerpo, css } = partes(leerTemplate(readFileSync(ORIGEN, 'utf8')));
  const jsx = aJsx(conContacto(conBreakPoint(cuerpo)));
  const tsx = `// GENERADO por scripts/generar-landing.mjs desde design/cordada-landing.html. No editar a mano:
// para cambiar el marcado se cambia el diseño (o el script) y se vuelve a generar.
import { Fragment, type CSSProperties } from 'react';
import type { Vista } from '../datos';

// Los estilos son los inline del diseño, tal cual; algunas propiedades (font-stretch, text-wrap)
// no están en los tipos de React, por eso pasan por este molde.
const css = (o: Record<string, string>) => o as CSSProperties;

export function Landing({ accent, brief, onBrief, chips, route, gate, pieces, stats, rules }: Vista) {
  return (
${jsx}
  );
}
`;
  const baseCss = `/* GENERADO por scripts/generar-landing.mjs: es el CSS global del diseño, sin cambios. */\n${css}\n`;
  return { tsx, baseCss, lineas: jsx.split('\n').length };
}

export function generar() {
  const { tsx, baseCss, lineas } = construir();
  mkdirSync(SALIDA, { recursive: true });
  writeFileSync(join(SALIDA, 'Landing.tsx'), tsx);
  writeFileSync(join(SALIDA, 'base.css'), baseCss);
  return { lineas, css: baseCss.length };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const r = generar();
  console.log(`Landing.tsx: ${r.lineas} líneas de JSX · base.css: ${r.css} caracteres`);
}
