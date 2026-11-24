# Plan — Cordada (landing)

Pendiente de esta landing. Lo cerrado vive en `docs/CERRADO-cordada.md`; el detalle, en git.

**Regla:** un ítem sale de este plan en el mismo commit en que se cierra: se borra acá y se escribe una línea en el cerrado.

## Backlog vivo

1. **El conversor chequea "atributo sin valor" antes de descartar `hint-*` y `data-canvas-*`.** Ancla: `scripts/generar-landing.mjs:91`. Premisa: un `hint-*` sin valor lanza error aunque el código dice que se descarta (hoy el diseño no trae ninguno). Salida: el descarte va primero y un test lo cubre. Prioridad baja.
2. **Falsos positivos y mensaje engañoso del conversor.** Ancla: `scripts/generar-landing.mjs:86`. Premisa: `title="a = 'b'"` lanza por comilla simple, y `x=a` o `x= "a"` se reportan como "booleano". Falla cerrado; hoy el diseño no trae esos casos. Salida: el chequeo mira solo el delimitador del valor y el mensaje nombra el caso real. Prioridad baja.
3. **El test de literales del diseño solo mira comillas simples.** Ancla: `src/landing.test.tsx:104`. Premisa: un literal con comillas dobles o backtick en el guion del diseño no se compara contra `src/datos.ts` (hoy hay 0). Salida: el test cubre los tres delimitadores. Prioridad baja.

## Cables de Gustavo

- **Borrar el repo personal `gustavovivasmarquez-ship-it/cordada`**, que quedó sin uso.

## Bloqueado

- **Formulario de contacto propio, igual al de Arcus en backend y frontend** (pedido de Gustavo, 23-nov-2026). Nivel ROJO: escribe datos personales con consentimiento en una tabla compartida de producción.
  - Qué es "igual": el envío guarda un lead en `landing.contact_requests` de la base de Arcus (la misma tabla que usan `arcus.breakpoint.biz` y `www.breakpoint.biz`), con validación de campos, consentimiento de habeas data atado a la versión vigente del aviso, estado "enviado" y origen propio para verlo en `arcus.breakpoint.biz/admin` → Leads. Referencias: `arcus-web/src/lib/contact.ts`, `arcus-web/src/components/ContactForm.tsx`, `breakpoint-web/lib/leads.ts`.
  - Bloquea 1: **no se puede ver ni migrar la base de Arcus desde el conector de Supabase** (la sesión ve Elara, Rendwai, Tizaira y Agentes Educativos, no Arcus). La columna `origen` no está en ninguna migración de los repos: se aplicó a mano, así que no se sabe si acepta un valor nuevo. Desbloquea: dar acceso al proyecto de Arcus en el conector, o que Gustavo corra una consulta de solo lectura sobre los CHECK de la tabla.
  - Bloquea 2: **el diseño no tiene campos de nombre ni de email.** Desbloquea: Gustavo define dónde va el formulario (o trae el diseño).
  - Bloquea 3: **Cordada no tiene aviso de privacidad.** El consentimiento de Arcus enlaza a `arcus.breakpoint.biz/privacidad`. Desbloquea: Gustavo define si Cordada usa ese aviso o uno propio.
  - Al activar: `/privacidad` no puede servirse con el HTML prerenderizado de `/` (`scripts/prerender.mjs` siempre escribe la home). El rewrite de `/privacidad` tiene que apuntar a una página propia prerenderizada o a un shell con el root vacío, como hace Arcus con `/admin`; si no, la hidratación no coincide.
  - Además hace falta: variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` en el proyecto de Vercel de Cordada, y sumar el origen "Cordada" al panel de leads de `arcus-web` (`src/admin/SeccionLeads.tsx:25`).

## Decisiones abiertas

Ninguna.
