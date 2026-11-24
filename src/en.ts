// Versión en inglés (C5). El marcado es el mismo del diseño: cada texto pasa por t(), que busca acá
// su traducción. Las claves son los textos en español tal como salen del diseño; un test compara
// esta lista contra el marcado generado, así que un texto nuevo sin traducir rompe la suite.
// Las cifras no se traducen ni se redondean: son el registro de una sesión real.
import { chipDefs, gate, pieces, route, rules, stats } from './datos';

export const EN: Record<string, string> = {
  Principal: 'Main',
  CORDADA: 'CORDADA',
  Compuerta: 'Gate',
  'Cómo funciona': 'How it works',
  Números: 'Numbers',
  Reglas: 'Rules',
  'Volver a Break Point': 'Back to Break Point',
  'Empezar un proyecto': 'Start a project',
  'Desarrollo con agentes · control de entrega': 'Agent-driven development · delivery control',
  'Tu agente entregó más código del que': 'Your agent shipped more code than',
  'podés revisar.': 'you can review.',
  'Cordada no hace al agente más inteligente. Le saca la opción de entregar algo que nadie controló, y convierte «me parece que está bien» en':
    'Cordada does not make the agent smarter. It takes away the option of shipping something nobody checked, and turns “looks fine to me” into',
  'pasa o no pasa': 'pass or fail',
  'Contanos qué cuenta como terminado': 'Tell us what counts as done',
  'Pegá el brief, el PR o la spec. Escribimos los criterios antes de que el agente toque un archivo.':
    'Paste the brief, the PR or the spec. We write the criteria before the agent touches a file.',
  'Armar el contrato': 'Draft the contract',
  'Ruta de una entrega': 'Route of a delivery',
  'Ruta de entrega': 'Delivery route',
  '● corrida real': '● real run',
  'commit 29be33c · 30-oct-2026': 'commit 29be33c · 30-Oct-2026',
  'Funciona con cualquier stack': 'Works with any stack',
  'Cualquier modelo': 'Any model',
  'Cualquier orquestador': 'Any orchestrator',
  Código: 'Code',
  Documentos: 'Documents',
  'Multi-agente': 'Multi-agent',
  'Git & CI': 'Git & CI',
  Specs: 'Specs',
  Auditorías: 'Audits',
  'hallazgos verificados en un documento que ya tenía el visto bueno del revisor y cinco rondas de corrección encima.':
    'verified findings in a document that already had the reviewer’s sign-off and five rounds of corrections behind it.',
  'Dos de esas cifras eran lógicamente imposibles entre sí y habían sobrevivido a una auditoría de 58 números. Una sola sesión.':
    'Two of those figures were logically impossible together and had survived an audit of 58 numbers. A single session.',
  '01 — La compuerta': '01 — The gate',
  'Un lote se aplica entero o no se aplica.': 'A batch is applied whole or not at all.',
  'Cuatro eventos reales. Ninguno es una simulación: dos entregas fueron rechazadas por la propia compuerta antes de tocar un archivo.':
    'Four real events. None is a simulation: two deliveries were rejected by the gate itself before touching a file.',
  'cordada gate --log · 30-oct-2026': 'cordada gate --log · 30-Oct-2026',
  '02 — El producto': '02 — The product',
  'Cuatro piezas. Cada una contesta una pregunta.': 'Four pieces. Each one answers a question.',
  'Vale para código y para agentes. No depende de qué modelo escriba, ni de qué framework orqueste.':
    'It works for code and for agents. It does not depend on which model writes or which framework orchestrates.',
  '03 — El mecanismo, en números': '03 — The mechanism, in numbers',
  'Todo esto salió de una sola sesión.': 'All of this came out of a single session.',
  'Seis agentes, cinco rondas, cuatro commits y un documento de 64 láminas. Cada número con su origen.':
    'Six agents, five rounds, four commits and a 64-slide document. Every number with its source.',
  '04 — Reglas con un cadáver atrás': '04 — Rules with a body behind them',
  'Cada regla nació de una falla. Y cada una tiene su equivalente en código.':
    'Every rule was born from a failure. And each one has its equivalent in code.',
  'El código tiene un oráculo que se ejecuta: compilador, tipos, tests. Cordada aporta poco donde el test ya decide, y mucho donde no hay máquina que conteste.':
    'Code has an oracle that runs: compiler, types, tests. Cordada adds little where the test already decides, and a lot where no machine can answer.',
  'En código': 'In code',
  '«Los tests pasan» y «esto funciona» no son la misma afirmación.': '“The tests pass” and “this works” are not the same claim.',
  'Lo que no se puede mecanizar queda declarado como juicio, con nombre y fecha. Un juicio declarado se puede discutir; uno escondido en un «listo», no.':
    'What cannot be mechanized is declared as a judgment, with a name and a date. A declared judgment can be argued with; one hidden inside a “done” cannot.',
  'Escribí el criterio primero': 'Write the criterion first',
  'Decinos qué es': 'Tell us what counts as',
  'terminado.': 'done.',
  'La compuerta hace el resto.': 'The gate does the rest.',
  'Ver la compuerta': 'See the gate',
  'Cada número de esta página sale del registro de una sesión real · commit 29be33c':
    'Every number on this page comes from the log of a real session · commit 29be33c',
  '© 2026 Cordada': '© 2026 Cordada',
};

const TIENE_LETRAS = /\p{L}/u;

/** t() de la versión en inglés. Conserva los espacios de los bordes, que en el marcado importan. */
export function traducir(s: string): string {
  const [, antes, centro, despues] = /^(\s*)(.*?)(\s*)$/s.exec(s)!;
  // Signos y cifras sueltas ("→", "21", ".") son iguales en los dos idiomas.
  if (!TIENE_LETRAS.test(centro)) return s;
  const en = EN[centro];
  // Sin traducción queda el texto original: un test lo detecta antes de publicar.
  return en === undefined ? s : antes + en + despues;
}

// Los datos de las listas: mismas cifras, colores y orden que src/datos.ts; cambia solo el texto.
const conTexto = <T extends object, E extends Partial<T>>(base: readonly T[], en: readonly E[]): T[] => {
  if (base.length !== en.length) throw new Error('la traducción de una lista no tiene la misma cantidad de ítems');
  return base.map((item, i) => ({ ...item, ...en[i] }));
};

export const chipDefsEn = conTexto(chipDefs, [
  { label: 'Review a huge PR', text: 'An agent opened a 3,000-line PR. We need to know what can be approved and what cannot, with criteria written beforehand.' },
  { label: 'Audit a document', text: 'We have an already approved document with many figures. We want to check every number against its source.' },
  { label: 'Refactor across many files', text: 'A change that touches dozens of files: either it is applied whole or it is not applied.' },
  { label: 'Set rules for my agents', text: 'We want our agents to be unable to ship without passing a gate with acceptance criteria.' },
]);

export const routeEn = conTexto(route, [
  { name: 'Contract', verdict: 'signed', detail: 'Criteria written before the work.' },
  { name: 'Build', verdict: 'agent A', detail: 'Its own session, no shortcuts.' },
  { name: 'Separate review', verdict: '21 findings', detail: 'Agent B, without the builder’s context.' },
  { name: 'Gate', verdict: '62/62', detail: 'All or nothing. First run: rejected.' },
  { name: 'Delivery', verdict: 'declared', detail: 'Judgments with a name and a date. What was not verified is stated.' },
]);

export const gateEn = conTexto(gate, [
  { what: 'Batch of 62 edits across 29 files', verdict: 'REJECTED', why: '8 patterns without a unique match. No file was written, not even the 54 that did match.' },
  { what: 'Same batch, patterns fixed', verdict: 'APPLIED', why: '62 out of 62. The difference between the two runs was not judgment: the second one matched.' },
  { what: 'Publishing the document', verdict: 'REJECTED', why: 'The destination had content this session had not read. Publishing would have discarded someone else’s work unseen.' },
  { what: 'Same publication, after checking', verdict: 'APPLIED', why: '20 published hashes compared against the base commit: byte-for-byte match. Only then.' },
]);

export const piecesEn = conTexto(pieces, [
  { q: 'What counts as done?', title: 'Contract before the work', body: 'Acceptance criteria are written before starting. It is the only thing that allows a criterion to be missed: in that session one asked for three cases, one and a half held up, and it was declared as unmet. A criterion written at the end never fails.' },
  { q: 'Who contradicts you?', title: 'Roles in separate sessions', body: 'Whoever reviews does not share context with whoever built: a reviewer who saw how something was put together tends to confirm it. Six agents in clean sessions found 21 defects in something its author considered finished.' },
  { q: 'Where does each rule come from?', title: 'Rules with a body behind them', body: 'Rules are not principles: they are scars. “The caveat travels with the figure” exists because 13 of 19 errors were exactly that. A rulebook written from failures gets respected.' },
  { q: 'Who says it is right?', title: 'Mechanical lock first', body: 'Where a machine exists that can decide, the machine decides. What cannot be mechanized is declared as a judgment, with a name and a date, so it can be argued with.' },
]);

export const statsEn = conTexto(stats, [
  { what: 'or nothing gets written', src: 'Transactional batch. The first run failed 8 patterns and did not touch a file.' },
  { what: 'the known-answer case', src: 'The format’s own sample page, measured against the budget. Without it, the gauge is worthless.' },
  { what: 'the 299 px that gave the gauge away', src: 'The sum of the parts against what the instrument reported. The error was the instrument’s.' },
  { what: 'deliveries over budget', src: 'Before and after the pass. The defect was there from the start and nobody had measured it.' },
  { what: 'figures that failed the check', src: '13 of the 19 for a single cause: the number traveled and the caveat stayed behind.' },
  { what: 'findings on something already approved', src: 'After the reviewer’s sign-off and five rounds of corrections.' },
]);

export const rulesEn = conTexto(rules, [
  { tag: 'Contract', rule: 'Criteria before investigating', code: 'The test before the implementation, and one that can fail.' },
  { tag: 'Gate', rule: 'A unique match or nothing gets written', code: 'Transactional patch with assertions, not optimistic sed.' },
  { tag: 'Calibration', rule: 'Calibrate against a known-answer case', code: 'Fixture with an expected value before trusting the gauge.' },
  { tag: 'Mechanics', rule: 'Move content by script, never retyped', code: 'Mechanical refactor, not a rewrite by hand.' },
  { tag: 'Review', rule: 'A dissenting reviewer in a separate session', code: 'A reviewer who sees the diff, not your description of the diff.' },
  { tag: 'Types', rule: 'The caveat travels with the figure', code: 'Units, ranges and nullability in the signature, where the compiler reads them.' },
  { tag: 'Invariants', rule: 'Arithmetic that does not add up gives the instrument away', code: 'Two paths to the same number, and the difference as the alarm.' },
  { tag: 'Honesty', rule: 'What was not verified is declared, not omitted', code: 'The report says what was exercised and what was not.' },
]);
