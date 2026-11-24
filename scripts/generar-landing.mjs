// Genera la landing a partir del diseño exportado, sin retipear nada.
//
//   node scripts/generar-landing.mjs
//
// Lee design/cordada-landing.html (el export de la herramienta de diseño), saca el marcado y el CSS
// base, y escribe:
//   src/generated/Landing.tsx   el marcado convertido a JSX, con sus estilos inline tal cual
//   src/generated/base.css      el CSS global del diseño (keyframes, hovers, foco)
//
// Lo que este script agrega al diseño: el enlace de vuelta a Break Point y el de la otra versión de
// idioma (encabezado y pie), el <main>, la clase que deja fija la cabecera, y la ranura de contacto
// en el lugar del botón "Empezar un proyecto" (ver conContacto). Todo texto pasa por
// t(), que en español devuelve lo mismo y en inglés lo busca en src/en.ts.
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

// El diseño deja el botón "Empezar un proyecto" con un destino de relleno. El destino real lo
// decide la app (src/App.tsx): el formulario propio o el enlace de respaldo.
const RELLENO_CONTACTO = 'href="[ENLACE DE CONTACTO]"';

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

const RENOMBRAR = { class: 'className', for: 'htmlFor', hreflang: 'hrefLang' };
const EVENTOS = { 'sc-camel-on-click': 'onClick', 'sc-camel-on-change': 'onChange' };
const DESCARTAR = /^(hint-|data-canvas-)/;
// Atributos con texto que lee una persona: pasan por t() igual que los nodos de texto.
const TRADUCIBLES = new Set(['placeholder', 'aria-label', 'title', 'alt']);

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
    else if (TRADUCIBLES.has(nombre)) out.push(`${nombre}={t(${JSON.stringify(valor)})}`);
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
    // Un espacio suelto al lado de un binding (la ranura de contacto) no es texto para traducir.
    return b ? `{${b[1]}}` : p === ' ' ? '{" "}' : `{t(${JSON.stringify(p)})}`;
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
// El botón "Empezar un proyecto" del diseño trae un destino de relleno. En el marcado pasa a ser
// una ranura ({contacto}): la app pone ahí el formulario de contacto o, si no está activo, este
// mismo botón con un enlace de respaldo. El botón se genera aparte para no retipear su estilo.
// Si el diseño deja de traer el relleno (o trae más de uno), falla: mejor enterarse acá que
// publicar un botón roto.
export function conContacto(cuerpo) {
  const veces = cuerpo.split(RELLENO_CONTACTO).length - 1;
  if (veces !== 1) throw new Error(`esperaba un destino de relleno de contacto en el diseño y hay ${veces}`);
  const donde = cuerpo.indexOf(RELLENO_CONTACTO);
  const cierre = cuerpo.indexOf('</a>', donde);
  // El relleno tiene que estar dentro de la etiqueta que abre un <a ...>: sin '>' entre medio.
  const ini = Math.max(cuerpo.lastIndexOf('<a ', donde), cuerpo.lastIndexOf('<a\n', donde));
  if (ini < 0 || cierre < 0 || cuerpo.slice(ini, donde).includes('>')) {
    throw new Error('el destino de relleno de contacto no está en un enlace <a> bien formado');
  }
  const fin = cierre + '</a>'.length;
  const boton = cuerpo.slice(ini, fin).replace(RELLENO_CONTACTO, 'href="{{href}}"');
  return { cuerpo: cuerpo.slice(0, ini) + '{{contacto}}' + cuerpo.slice(fin), boton };
}

// Enlace a la otra versión de idioma (C5). El diseño es de un solo idioma y no lo trae: va al lado
// de cada "Volver a Break Point", con su mismo estilo.
export function conIdioma(cuerpo) {
  const marca = '">Volver a Break Point</a>';
  const partes = cuerpo.split(marca);
  if (partes.length !== 3) throw new Error(`esperaba dos enlaces a Break Point para sumar el de idioma y hay ${partes.length - 1}`);
  return partes.map((parte, i) => {
    if (i === partes.length - 1) return parte;
    const estilo = parte.slice(parte.lastIndexOf('style="') + 'style="'.length);
    return `${parte}${marca}<a href="{{idioma.href}}" hreflang="{{idioma.codigo}}" lang="{{idioma.codigo}}" style="${estilo}">{{idioma.label}}</a>`;
  }).join('');
}

// La cabecera es sticky en el diseño, pero el contenedor de la página trae overflow-x: hidden, que
// lo vuelve contenedor de scroll y la anula (C6). El recorte horizontal pasa a una clase que usa
// overflow-x: clip donde existe: recorta igual y no crea contenedor de scroll.
export const CLASE_PAGINA = 'cd-pagina';
export const CSS_PAGINA = `.${CLASE_PAGINA}{overflow-x:hidden}@supports (overflow:clip){.${CLASE_PAGINA}{overflow-x:clip}}`;
export function conCabeceraFija(cuerpo) {
  const abre = cuerpo.slice(0, cuerpo.indexOf('>') + 1);
  const recorte = '; overflow-x: hidden';
  if (!abre.startsWith('<div style="min-height: 100vh') || abre.includes('class=')) throw new Error('el contenedor de la página no es el que esperaba');
  if (abre.split(recorte).length !== 2) throw new Error('el contenedor de la página ya no trae "; overflow-x: hidden": revisar conCabeceraFija');
  return abre.replace(recorte, '').replace('<div ', `<div class="${CLASE_PAGINA}" `) + cuerpo.slice(abre.length);
}

// El diseño no trae <main>. Lectores de pantalla y rastreadores lo usan para ubicar el contenido,
// así que todo lo que hay entre la cabecera y el pie queda dentro de uno. El contenedor de la
// página es un bloque común (ni flex ni grid), por eso envolver no cambia el layout.
export function conMain(cuerpo) {
  const finCabecera = cuerpo.indexOf('</header>');
  const pie = cuerpo.indexOf('<footer');
  if (finCabecera < 0 || pie < 0 || pie < finCabecera) throw new Error('no encontré la cabecera y el pie para ubicar <main>');
  if (cuerpo.split('</header>').length !== 2 || cuerpo.split('<footer').length !== 2) throw new Error('esperaba una sola cabecera y un solo pie');
  if (/<main[ >]/.test(cuerpo)) throw new Error('el diseño ya trae <main>: quitar conMain del generador');
  const corte = finCabecera + '</header>'.length;
  return `${cuerpo.slice(0, corte)}<main>${cuerpo.slice(corte, pie)}</main>${cuerpo.slice(pie)}`;
}

// Devuelve el contenido de los dos archivos sin escribirlos: lo usa el test que detecta si el
// generado quedó desactualizado o alguien lo editó a mano.
export function construir() {
  const { cuerpo: original, css } = partes(leerTemplate(readFileSync(ORIGEN, 'utf8')));
  const { cuerpo, boton } = conContacto(conIdioma(conBreakPoint(original)));
  const jsx = aJsx(conCabeceraFija(conMain(cuerpo)));
  // El botón pasa por el mismo conversor que el resto: su texto también sale como t("...").
  const jsxBoton = aJsx(`<span>${boton}</span>`).split('\n').slice(1, -1).join('\n');
  const tsx = `// GENERADO por scripts/generar-landing.mjs desde design/cordada-landing.html. No editar a mano:
// para cambiar el marcado se cambia el diseño (o el script) y se vuelve a generar.
import { Fragment, type CSSProperties } from 'react';
import type { Vista } from '../datos';

// Los estilos son los inline del diseño, tal cual; algunas propiedades (font-stretch, text-wrap)
// no están en los tipos de React, por eso pasan por este molde.
const css = (o: Record<string, string>) => o as CSSProperties;

export function Landing({ t, idioma, accent, brief, onBrief, chips, route, gate, pieces, stats, rules, contacto }: Vista) {
  return (
${jsx}
  );
}

// El botón "Empezar un proyecto" tal como viene en el diseño, con el destino que le pase la app.
// Recibe t igual que Landing: su texto se traduce como el del resto del marcado.
export function BotonContacto({ href, t }: { href: string; t: Vista['t'] }) {
  return (
${jsxBoton}
  );
}
`;
  const baseCss = `/* GENERADO por scripts/generar-landing.mjs: el CSS global del diseño, sin cambios, más el recorte horizontal de la página (ver conCabeceraFija). */\n${css}\n${CSS_PAGINA}\n`;
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
