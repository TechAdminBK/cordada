# Handoff — cordada (landing de Cordada)

**Cerrado**: 2026-11-24T10:27-03:00 · **Cwd de la sesión**: `C:\dev\arcus-web` (la sesión fue de `arcus-web` y trabajó Cordada por pedido de Gustavo) · **Branch**: `main` · **HEAD**: `e66d381` (antes del handoff) · **Remote**: `git@github-techadminbk:TechAdminBK/cordada.git`

## Contexto activo (última tarea)

El handoff completo de la sesión está en el repo principal: `TechAdminBK/arcus-web`, `docs/HANDOFF.md`. Acá va solo lo de Cordada.

La landing está en producción en `cordada.breakpoint.biz`: generada desde el diseño (`design/cordada-landing.html`) con `scripts/generar-landing.mjs`, con versión en inglés en `/en`, contenido en el HTML inicial, y el formulario de contacto propio ENCENDIDO en español. El formulario guarda en `landing.contact_requests` de la base de Arcus con origen `cordada`, y los contactos se ven en `arcus.breakpoint.biz/admin` → Leads.

Lo último fue dejar la cabecera fija solo en escritorio (desde 1040 px de ancho) y comprobar que el repo está al día con GitHub. No hay nada a medio construir.

- **Working tree**: limpio. Sin commits locales sin push.
- **Ramas locales ya contenidas en `main`, sin borrar**: `feat/posicionamiento`, `feat/main-landmark`, `feat/ingles-y-cabecera`, `feat/contacto`, `feat/contacto-integrado`, `feat/aviso-aprobado`, `feat/cabecera-escritorio`. Gustavo termina la limpieza en la máquina local.
- **Deploy**: Vercel, proyecto `breakpoint1/cordada`, último commit `e66d381`, verde. Variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` cargadas en Production.
- **Aviso de privacidad**: `cordada-v1`, aprobado por Gustavo el 24-nov-2026, texto congelado (`src/aviso.ts`). En `/en` el formulario no se muestra: queda el botón hacia el formulario de Break Point.
- **De Gustavo**: descartar el lead de prueba `prueba-cordada@example.com` en el panel de Arcus; borrar el repo personal `gustavovivasmarquez-ship-it/cordada`.
- **Esperando decisión**: propuesta C8 (camino para borrar un lead) y si se corrige el texto del aviso como `cordada-v2` (ítem 8 del plan).
- **Sin verificar**: un envío válido real posterior a las reglas nuevas de la tabla de contactos (policy y trigger aplicados en la base de Arcus después del envío de prueba).
- **Avisos de `consistencia-docs.mjs`**: no existe `~/.claude/kb/cordada.md`; el chequeo de lanzamientos no escaneó nada (no hubo lanzamientos de `equipo.mjs`: la `gh` de la máquina no ve TechAdminBK y el repo no está registrado en `kb/equipo-repos.json`).

## Referencias vivas

- **Plan**: `docs/PLAN-cordada.md` (8 ítems de backlog, nada bloqueado) y `docs/CERRADO-cordada.md`.
- **Propuestas**: `docs/PROPUESTAS.md`.
- **Evidencia**: `docs/evidencia/pasajes.jsonl`.
