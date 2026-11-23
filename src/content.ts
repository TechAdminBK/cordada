// Copy de la landing de Cordada. Fuente: el diseño exportado (Cordada — Landing, 2).
// Las cifras de cada tarjeta salen del registro de una sesión real (commit 29be33c); no se redondean.

export const colores = {
  lima: '#B4CC3A',
  violeta: '#4A2FBD',
  azul: '#3F7BEA',
  suave: '#EDEAFB',
  tinta: '#0F1020',
  blanco: '#FFFFFF',
  lila: '#9C8CEB',
  cielo: '#7FA6F2',
  rechazo: '#D9D3F7',
} as const;

export const nav = ['Compuerta', 'Cómo funciona', 'Números', 'Reglas'] as const;
export const navIds = ['compuerta', 'piezas', 'numeros', 'reglas'] as const;

export const hero = {
  kicker: 'Desarrollo con agentes · control de entrega',
  h1: 'Tu agente entregó más código del que podés revisar.',
  lede:
    'Cordada no hace al agente más inteligente. Le saca la opción de entregar algo que nadie controló, y convierte «me parece que está bien» en pasa o no pasa.',
  cta: 'Empezar un proyecto',
  tags: ['Cualquier modelo', 'Cualquier orquestador', 'Código', 'Documentos', 'Multi-agente', 'Git & CI', 'Specs', 'Auditorías'],
} as const;

export const compuerta = {
  pregunta: 'Contanos qué cuenta como terminado',
  chips: [
    { label: 'Revisar un PR enorme', texto: 'Un agente abrió un PR de 3.000 líneas. Necesitamos saber qué se puede aprobar y qué no, con criterios escritos antes.' },
    { label: 'Auditar un documento', texto: 'Tenemos un documento ya aprobado con muchas cifras. Queremos cotejar cada número contra su fuente.' },
    { label: 'Refactor en muchos archivos', texto: 'Un cambio que toca decenas de archivos: o se aplica entero o no se aplica.' },
    { label: 'Poner reglas a mis agentes', texto: 'Queremos que nuestros agentes no puedan entregar sin pasar una compuerta con criterios de aceptación.' },
  ],
  cta: 'Armar el contrato →',
  ruta: [
    { nombre: 'Contrato', veredicto: 'firmado', detalle: 'Criterios escritos antes del trabajo.' },
    { nombre: 'Construcción', veredicto: 'agente A', detalle: 'Sesión propia, sin atajos.' },
    { nombre: 'Revisión aparte', veredicto: '21 hallazgos', detalle: 'Agente B, sin el contexto de quien construyó.' },
    { nombre: 'Compuerta', veredicto: '62/62', detalle: 'Entero o nada. Primera corrida: rechazada.' },
    { nombre: 'Entrega', veredicto: 'declarada', detalle: 'Juicios con nombre y fecha. Lo no verificado, dicho.' },
  ],
  ruta_sello: 'commit 29be33c · 30-oct-2026',
  eventos: [
    { n: '01', que: 'Lote de 62 ediciones sobre 29 archivos', veredicto: 'RECHAZADO', por: '8 patrones sin coincidencia única. No se escribió ningún archivo, tampoco los 54 que sí coincidían.' },
    { n: '02', que: 'Mismo lote, patrones corregidos', veredicto: 'APLICADO', por: '62 de 62. La diferencia entre las dos corridas no fue criterio: fue que la segunda coincidía.' },
    { n: '03', que: 'Publicación del documento', veredicto: 'RECHAZADO', por: 'El destino tenía contenido que esta sesión no había leído. Publicar habría descartado trabajo ajeno sin verlo.' },
    { n: '04', que: 'Misma publicación, tras cotejar', veredicto: 'APLICADO', por: '20 hashes publicados comparados contra el commit base: coincidencia byte por byte. Recién ahí.' },
  ],
  log: 'cordada gate --log · 30-oct-2026',
  kicker: '01 — La compuerta',
  titulo: 'Un lote se aplica entero o no se aplica.',
  bajada: 'Cuatro eventos reales. Ninguno es una simulación: dos entregas fueron rechazadas por la propia compuerta antes de tocar un archivo.',
} as const;

export const piezas = {
  kicker: '02 — El producto',
  titulo: 'Cuatro piezas. Cada una contesta una pregunta.',
  bajada: 'Vale para código y para agentes. No depende de qué modelo escriba, ni de qué framework orqueste.',
  items: [
    { n: '01', q: '¿Qué cuenta como terminado?', titulo: 'Contrato antes del trabajo', cuerpo: 'Los criterios de aceptación se escriben antes de empezar. Es lo único que permite que un criterio no se cumpla: en esa sesión uno pedía tres casos, se sostuvo uno y medio, y quedó declarado como incumplido. Un criterio escrito al final nunca falla.', fondo: 'violeta', texto: 'blanco' },
    { n: '02', q: '¿Quién te contradice?', titulo: 'Roles en sesiones separadas', cuerpo: 'Quien revisa no comparte contexto con quien construyó: un revisor que vio cómo se armó algo tiende a confirmarlo. Seis agentes en sesiones limpias encontraron 21 defectos en algo que su autor daba por terminado.', fondo: 'azul', texto: 'blanco' },
    { n: '03', q: '¿De dónde sale cada regla?', titulo: 'Reglas con un cadáver atrás', cuerpo: 'Las reglas no son principios: son cicatrices. «La salvedad viaja con la cifra» existe porque 13 de 19 errores fueron exactamente eso. Un reglamento escrito desde fallas se respeta.', fondo: 'suave', texto: 'tinta' },
    { n: '04', q: '¿Quién dice que está bien?', titulo: 'Candado mecánico primero', cuerpo: 'Donde existe una máquina que decide, decide la máquina. Lo que no se puede mecanizar queda declarado como juicio, con nombre y fecha, para que se pueda discutir.', fondo: 'tinta', texto: 'blanco' },
  ],
} as const;

export const numeros = {
  kicker: '03 — El mecanismo, en números',
  titulo: 'Todo esto salió de una sola sesión.',
  bajada: 'Seis agentes, cinco rondas, cuatro commits y un documento de 64 láminas. Cada número con su origen.',
  items: [
    { grande: '62/62', que: 'o no se escribe nada', fuente: 'Lote transaccional. La primera corrida falló 8 patrones y no tocó un archivo.', fondo: 'violeta', texto: 'blanco' },
    { grande: '437/920', que: 'el caso de respuesta conocida', fuente: 'La página de ejemplo del propio formato, medida contra el presupuesto. Sin ella, el medidor no vale.', fondo: 'suave', texto: 'tinta' },
    { grande: '686≠985', que: 'los 299 px que delataron al medidor', fuente: 'La suma de las partes contra lo que informaba el instrumento. El error era del instrumento.', fondo: 'azul', texto: 'blanco' },
    { grande: '42→0', que: 'entregas fuera de presupuesto', fuente: 'Antes y después del pase. El defecto existía desde el principio y nadie lo había medido.', fondo: 'blanco', texto: 'tinta' },
    { grande: '19/58', que: 'cifras que falló el cotejo', fuente: '13 de las 19 por una sola causa: el número viajó y la salvedad quedó atrás.', fondo: 'suave', texto: 'tinta' },
    { grande: '21', que: 'hallazgos sobre algo ya aprobado', fuente: 'Después del visto bueno del revisor y de cinco rondas de corrección.', fondo: 'tinta', texto: 'blanco' },
  ],
} as const;

export const reglas = {
  kicker: '04 — Reglas con un cadáver atrás',
  titulo: 'Cada regla nació de una falla. Y cada una tiene su equivalente en código.',
  bajada: 'El código tiene un oráculo que se ejecuta: compilador, tipos, tests. Cordada aporta poco donde el test ya decide, y mucho donde no hay máquina que conteste.',
  items: [
    { tag: 'Contrato', regla: 'Criterios antes de investigar', codigo: 'El test antes de la implementación, y que pueda fallar.', color: 'lima' },
    { tag: 'Compuerta', regla: 'Coincidencia única o no se escribe nada', codigo: 'Parche transaccional con aserciones, no sed optimista.', color: 'azul' },
    { tag: 'Calibración', regla: 'Calibrar contra un caso de respuesta conocida', codigo: 'Fixture con valor esperado antes de confiar en el medidor.', color: 'cielo' },
    { tag: 'Mecánica', regla: 'Mover contenido por script, nunca retipeado', codigo: 'Refactor mecánico, no reescritura a mano.', color: 'azul' },
    { tag: 'Revisión', regla: 'Contradictor en sesión aparte', codigo: 'Revisor que ve el diff, no tu descripción del diff.', color: 'lila' },
    { tag: 'Tipos', regla: 'La salvedad viaja con la cifra', codigo: 'Unidades, rangos y nulabilidad en la firma, donde el compilador las lee.', color: 'lima' },
    { tag: 'Invariantes', regla: 'La aritmética que no cierra delata al instrumento', codigo: 'Dos caminos al mismo número, y la diferencia como alarma.', color: 'azul' },
    { tag: 'Honestidad', regla: 'Lo no verificado se declara, no se omite', codigo: 'El reporte dice qué se ejercitó y qué no.', color: 'cielo' },
  ],
  nota: '«Los tests pasan» y «esto funciona» no son la misma afirmación.',
  nota2: 'Lo que no se puede mecanizar queda declarado como juicio, con nombre y fecha. Un juicio declarado se puede discutir; uno escondido en un «listo», no.',
} as const;

export const cierre = {
  kicker: 'Escribí el criterio primero',
  titulo: 'Decinos qué es terminado.',
  bajada: 'La compuerta hace el resto.',
  cta: 'Empezar un proyecto →',
  ver: 'Ver la compuerta',
  pie: 'Cada número de esta página sale del registro de una sesión real · commit 29be33c',
  copyright: '© 2026 Cordada',
} as const;
