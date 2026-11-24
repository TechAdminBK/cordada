// Datos de la landing. Copiados del componente del diseño (renderVals), sin cambios de texto:
// cada cifra sale del registro de una sesión real (commit 29be33c) y no se redondea.
import type { ChangeEvent, ReactNode } from 'react';

const LIME = '#B4CC3A', VIOLET = '#4A2FBD', BLUE = '#3F7BEA', SOFT = '#EDEAFB', INK = '#0F1020', WHITE = '#FFFFFF',
  LILAC = '#9C8CEB', SKY = '#7FA6F2', REJ = '#D9D3F7';
// En el diseño estos tres nombres viejos apuntan a la paleta actual.
const PINK = BLUE, CYAN = SOFT, ORANGE = BLUE;

export const ACENTO = LIME;

export const chipDefs = [
  { label: 'Revisar un PR enorme', text: 'Un agente abrió un PR de 3.000 líneas. Necesitamos saber qué se puede aprobar y qué no, con criterios escritos antes.' },
  { label: 'Auditar un documento', text: 'Tenemos un documento ya aprobado con muchas cifras. Queremos cotejar cada número contra su fuente.' },
  { label: 'Refactor en muchos archivos', text: 'Un cambio que toca decenas de archivos: o se aplica entero o no se aplica.' },
  { label: 'Poner reglas a mis agentes', text: 'Queremos que nuestros agentes no puedan entregar sin pasar una compuerta con criterios de aceptación.' },
];
// En el diseño cada chip declara un color que el marcado no usa: el elegido se pinta siempre con el lila suave.
export const CHIP_ELEGIDO = SOFT;

export const route = [
  { name: 'Contrato', verdict: 'firmado', color: LIME, detail: 'Criterios escritos antes del trabajo.' },
  { name: 'Construcción', verdict: 'agente A', color: LILAC, detail: 'Sesión propia, sin atajos.' },
  { name: 'Revisión aparte', verdict: '21 hallazgos', color: SKY, detail: 'Agente B, sin el contexto de quien construyó.' },
  { name: 'Compuerta', verdict: '62/62', color: LIME, detail: 'Entero o nada. Primera corrida: rechazada.' },
  { name: 'Entrega', verdict: 'declarada', color: LILAC, detail: 'Juicios con nombre y fecha. Lo no verificado, dicho.' },
];

export const gate = [
  { n: '01', what: 'Lote de 62 ediciones sobre 29 archivos', verdict: 'RECHAZADO', color: REJ, why: '8 patrones sin coincidencia única. No se escribió ningún archivo, tampoco los 54 que sí coincidían.' },
  { n: '02', what: 'Mismo lote, patrones corregidos', verdict: 'APLICADO', color: LIME, why: '62 de 62. La diferencia entre las dos corridas no fue criterio: fue que la segunda coincidía.' },
  { n: '03', what: 'Publicación del documento', verdict: 'RECHAZADO', color: REJ, why: 'El destino tenía contenido que esta sesión no había leído. Publicar habría descartado trabajo ajeno sin verlo.' },
  { n: '04', what: 'Misma publicación, tras cotejar', verdict: 'APLICADO', color: LIME, why: '20 hashes publicados comparados contra el commit base: coincidencia byte por byte. Recién ahí.' },
];

export const pieces = [
  { n: '01', bg: VIOLET, fg: WHITE, q: '¿Qué cuenta como terminado?', title: 'Contrato antes del trabajo', body: 'Los criterios de aceptación se escriben antes de empezar. Es lo único que permite que un criterio no se cumpla: en esa sesión uno pedía tres casos, se sostuvo uno y medio, y quedó declarado como incumplido. Un criterio escrito al final nunca falla.' },
  { n: '02', bg: BLUE, fg: WHITE, q: '¿Quién te contradice?', title: 'Roles en sesiones separadas', body: 'Quien revisa no comparte contexto con quien construyó: un revisor que vio cómo se armó algo tiende a confirmarlo. Seis agentes en sesiones limpias encontraron 21 defectos en algo que su autor daba por terminado.' },
  { n: '03', bg: SOFT, fg: INK, q: '¿De dónde sale cada regla?', title: 'Reglas con un cadáver atrás', body: 'Las reglas no son principios: son cicatrices. «La salvedad viaja con la cifra» existe porque 13 de 19 errores fueron exactamente eso. Un reglamento escrito desde fallas se respeta.' },
  { n: '04', bg: INK, fg: WHITE, q: '¿Quién dice que está bien?', title: 'Candado mecánico primero', body: 'Donde existe una máquina que decide, decide la máquina. Lo que no se puede mecanizar queda declarado como juicio, con nombre y fecha, para que se pueda discutir.' },
];

export const stats = [
  { bg: VIOLET, fg: WHITE, big: '62/62', what: 'o no se escribe nada', src: 'Lote transaccional. La primera corrida falló 8 patrones y no tocó un archivo.' },
  { bg: SOFT, fg: INK, big: '437/920', what: 'el caso de respuesta conocida', src: 'La página de ejemplo del propio formato, medida contra el presupuesto. Sin ella, el medidor no vale.' },
  { bg: BLUE, fg: WHITE, big: '686≠985', what: 'los 299 px que delataron al medidor', src: 'La suma de las partes contra lo que informaba el instrumento. El error era del instrumento.' },
  { bg: WHITE, fg: INK, big: '42→0', what: 'entregas fuera de presupuesto', src: 'Antes y después del pase. El defecto existía desde el principio y nadie lo había medido.' },
  { bg: SOFT, fg: INK, big: '19/58', what: 'cifras que falló el cotejo', src: '13 de las 19 por una sola causa: el número viajó y la salvedad quedó atrás.' },
  { bg: INK, fg: WHITE, big: '21', what: 'hallazgos sobre algo ya aprobado', src: 'Después del visto bueno del revisor y de cinco rondas de corrección.' },
];

export const rules = [
  { tag: 'Contrato', color: LIME, rule: 'Criterios antes de investigar', code: 'El test antes de la implementación, y que pueda fallar.' },
  { tag: 'Compuerta', color: PINK, rule: 'Coincidencia única o no se escribe nada', code: 'Parche transaccional con aserciones, no sed optimista.' },
  { tag: 'Calibración', color: CYAN, rule: 'Calibrar contra un caso de respuesta conocida', code: 'Fixture con valor esperado antes de confiar en el medidor.' },
  { tag: 'Mecánica', color: ORANGE, rule: 'Mover contenido por script, nunca retipeado', code: 'Refactor mecánico, no reescritura a mano.' },
  { tag: 'Revisión', color: LILAC, rule: 'Contradictor en sesión aparte', code: 'Revisor que ve el diff, no tu descripción del diff.' },
  { tag: 'Tipos', color: LIME, rule: 'La salvedad viaja con la cifra', code: 'Unidades, rangos y nulabilidad en la firma, donde el compilador las lee.' },
  { tag: 'Invariantes', color: PINK, rule: 'La aritmética que no cierra delata al instrumento', code: 'Dos caminos al mismo número, y la diferencia como alarma.' },
  { tag: 'Honestidad', color: CYAN, rule: 'Lo no verificado se declara, no se omite', code: 'El reporte dice qué se ejercitó y qué no.' },
];

export type Chip = { label: string; color: string; on: boolean; off: boolean; pick: () => void };

// Lo que el marcado generado recibe: los mismos nombres que usa el diseño en sus {{ }}.
export type Vista = {
  /** Traduce un texto del marcado; en español devuelve el mismo texto. */
  t: (s: string) => string;
  /** Enlace a la otra versión de idioma. */
  idioma: { href: string; codigo: string; label: string };
  accent: string;
  brief: string;
  onBrief: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  chips: Chip[];
  route: typeof route;
  gate: typeof gate;
  pieces: typeof pieces;
  stats: typeof stats;
  rules: typeof rules;
  /** Lo que va en el lugar del botón "Empezar un proyecto": el formulario o el botón de respaldo. */
  contacto: ReactNode;
};
