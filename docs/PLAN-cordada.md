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

## Cables de Gustavo

- **Borrar el repo personal `gustavovivasmarquez-ship-it/cordada`**, que quedó sin uso.

## Bloqueado

- **Encender el formulario de contacto propio** (pedido de Gustavo, 23-nov-2026). Nivel ROJO: escribe datos personales con consentimiento en `landing.contact_requests` de la base de Arcus.
  - Hecho: formulario integrado; aviso `cordada-v1` aprobado por Gustavo el 24-nov-2026 (`src/aviso.ts`, texto congelado; ninguna fila de la base lo tenía antes); la base acepta el origen `cordada` y sus 11 columnas; el panel de Arcus lo muestra. Visto encendido en un build local con variables de prueba: campos, validación y aviso, sin errores de consola.
  - Variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` cargadas en el proyecto `cordada` de Vercel (Production) el 24-nov-2026, a pedido de Gustavo: la URL del proyecto de Arcus y su clave publicable, la misma que usa `arcus-web`. El formulario se enciende con el deploy de este commit.
  - Al encender: probar un envío real de punta a punta (escribe una fila en producción, pide OK) y verlo en `arcus.breakpoint.biz/admin` → Leads; `OR-navegador` contra producción.
  - Límite decidido: en `/en` el formulario no se muestra nunca; queda el botón hacia el formulario de Break Point, porque el aviso existe solo en español. `/privacidad` no está en el sitemap.

## Decisiones abiertas

Ninguna.
