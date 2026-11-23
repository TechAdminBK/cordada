# Plan — Cordada (landing)

Pendiente de esta landing. Lo cerrado vive en `docs/CERRADO-cordada.md`; el detalle, en git.

**Regla:** un ítem sale de este plan en el mismo commit en que se cierra: se borra acá y se escribe una línea en el cerrado.

## Backlog vivo

1. **El conversor chequea "atributo sin valor" antes de descartar `hint-*` y `data-canvas-*`.** Ancla: `scripts/generar-landing.mjs:91`. Premisa: un `hint-*` sin valor lanza error aunque el código dice que se descarta (hoy el diseño no trae ninguno). Salida: el descarte va primero y un test lo cubre. Prioridad baja.
2. **Falsos positivos y mensaje engañoso del conversor.** Ancla: `scripts/generar-landing.mjs:86`. Premisa: `title="a = 'b'"` lanza por comilla simple, y `x=a` o `x= "a"` se reportan como "booleano". Falla cerrado; hoy el diseño no trae esos casos. Salida: el chequeo mira solo el delimitador del valor y el mensaje nombra el caso real. Prioridad baja.
3. **El test de literales del diseño solo mira comillas simples.** Ancla: `src/landing.test.tsx:104`. Premisa: un literal con comillas dobles o backtick en el guion del diseño no se compara contra `src/datos.ts` (hoy hay 0). Salida: el test cubre los tres delimitadores. Prioridad baja.

## Cables de Gustavo

- **Subdominio `cordada.breakpoint.biz`**: agregarlo al proyecto `cordada` en Vercel (Settings → Domains) y crear el CNAME en el DNS de `breakpoint.biz`.
- **Borrar el repo personal `gustavovivasmarquez-ship-it/cordada`**, que quedó sin uso.

## Bloqueado

Nada.

## Decisiones abiertas

Ninguna.
