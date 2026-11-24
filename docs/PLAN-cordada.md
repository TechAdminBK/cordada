# Plan — Cordada (landing)

Pendiente de esta landing. Lo cerrado vive en `docs/CERRADO-cordada.md`; el detalle, en git.

**Regla:** un ítem sale de este plan en el mismo commit en que se cierra: se borra acá y se escribe una línea en el cerrado.

## Backlog vivo

1. **El conversor chequea "atributo sin valor" antes de descartar `hint-*` y `data-canvas-*`.** Ancla: `scripts/generar-landing.mjs:91`. Premisa: un `hint-*` sin valor lanza error aunque el código dice que se descarta (hoy el diseño no trae ninguno). Salida: el descarte va primero y un test lo cubre. Prioridad baja.
2. **Falsos positivos y mensaje engañoso del conversor.** Ancla: `scripts/generar-landing.mjs:86`. Premisa: `title="a = 'b'"` lanza por comilla simple, y `x=a` o `x= "a"` se reportan como "booleano". Falla cerrado; hoy el diseño no trae esos casos. Salida: el chequeo mira solo el delimitador del valor y el mensaje nombra el caso real. Prioridad baja.
3. **El test de literales del diseño solo mira comillas simples.** Ancla: `src/landing.test.tsx:104`. Premisa: un literal con comillas dobles o backtick en el guion del diseño no se compara contra `src/datos.ts` (hoy hay 0). Salida: el test cubre los tres delimitadores. Prioridad baja.
4. **`/favicon.ico` responde 404.** Ancla: `index.html:9`. Premisa: el ícono real es `/favicon.svg` y carga bien, pero los navegadores piden además `/favicon.ico` y eso deja un error de consola en cada visita (visto en producción, 23-nov-2026). Salida: `/favicon.ico` responde 200. Prioridad baja.
5. **El generador deja pasar sin traducir un atributo con texto que no esté en su lista.** Ancla: `scripts/generar-landing.mjs:91`. Premisa: solo `placeholder`, `aria-label`, `title` y `alt` pasan por `t()`; un `value` o `aria-valuetext` con texto saldría en español en `/en` y ningún test lo vería (hoy el diseño no trae ninguno). Salida: el generador falla ante un atributo con letras fuera de la lista. Prioridad baja.
6. **La cabecera fija y el chequeo de idioma se prueban por texto, no por comportamiento.** Ancla: `src/ingles.test.tsx:150`. Premisa: el test de C6 mira la regla CSS como cadena, y el de «sin palabras en español» quita las etiquetas antes de mirar, así que no ve atributos. Salida: un test que mida la cabecera tras hacer scroll, y el chequeo de idioma con atributos incluidos. Prioridad baja.
7. **Envío real de punta a punta del formulario de contacto.** Ancla: `src/lib/contacto.ts:72`. Premisa: el formulario está encendido en producción desde el 24-nov-2026 y se probó todo menos un envío válido (la ruta de guardado se midió con un envío inválido a propósito, que llega hasta el CHECK de la tabla: `23514`). Salida: un envío válido muestra «Recibido», la fila aparece en `arcus.breakpoint.biz/admin` → Leads con origen Cordada y `aviso_version = cordada-v1`. Escribe una fila en producción: pide OK de Gustavo.
8. **Accesibilidad del formulario de contacto.** Ancla: `src/Contacto.tsx:81`. Premisa: el árbol de accesibilidad nombra la casilla de consentimiento como «on» (el label envuelve el texto y el enlace «Leer el aviso»), y los campos obligatorios no llevan `required` ni `aria-required` (navegador en producción, 24-nov-2026). Salida: la casilla tiene un nombre accesible propio y los obligatorios se anuncian antes del error. Prioridad media.
9. **El texto del aviso dice «el formulario de contacto de esta página» en «Qué datos recibimos».** Ancla: `src/aviso.ts:15`. Premisa: la página del aviso no tiene formulario; el texto está aprobado y congelado como `cordada-v1`. Salida: Gustavo decide si se corrige, y en ese caso sale como `cordada-v2`. Prioridad baja.

## Cables de Gustavo

- **Borrar el repo personal `gustavovivasmarquez-ship-it/cordada`**, que quedó sin uso.

## Bloqueado

Nada.

## Decisiones abiertas

Ninguna.
