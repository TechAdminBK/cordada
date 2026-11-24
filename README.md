# Cordada

Landing de Cordada (desarrollo con agentes · control de entrega). React + Vite + TypeScript.

## Cómo está armada

El marcado no se escribe a mano: **sale del diseño**.

- `design/cordada-landing.html` es el export de la herramienta de diseño, sin tocar. Es la fuente.
- `scripts/generar-landing.mjs` lo lee y genera:
  - `src/generated/Landing.tsx`: el marcado convertido a JSX, con los estilos inline del diseño tal cual.
  - `src/generated/base.css`: el CSS global del diseño (animaciones, hovers, foco).
- `src/datos.ts` tiene las listas (ruta, compuerta, piezas, cifras, reglas), copiadas del componente del diseño.
- `src/App.tsx` tiene lo único con estado: el brief y el chip elegido.

El script agrega dos cosas al diseño: el enlace **Volver a Break Point** en el menú y en el pie, y una ranura en
el lugar del botón **Empezar un proyecto** (que en el diseño trae un destino de relleno).

## Contacto

En esa ranura va el formulario propio (`src/Contacto.tsx`), que guarda el contacto como lead en la base de
Arcus, igual que el formulario de Arcus, con origen `cordada` y el consentimiento atado a la versión del aviso
(`src/aviso.ts`). El formulario **solo se enciende** si están las variables `VITE_SUPABASE_URL` y
`VITE_SUPABASE_ANON_KEY` y el aviso de privacidad está aprobado y completo. Si falta algo, queda el botón
del diseño apuntando al formulario de Break Point: la página nunca se queda sin vía de contacto.

El formulario y `/privacidad` son **solo de la versión en español**: el aviso existe solo en español, así que
en `/en` queda siempre el botón de respaldo. El candado es una sola función (`contactoActivo`, en `src/App.tsx`)
que usan la app y el prerender. Con el formulario activo, el build escribe además `dist/privacidad/index.html`;
apagado no la escribe y `/privacidad` responde 404.

## Cambiar la landing

1. Reemplazar `design/cordada-landing.html` por el export nuevo.
2. `npm run generar`
3. `npm test` (un test falla si `src/generated/` no coincide con el diseño, o si alguien lo editó a mano).

No se edita `src/generated/`. Si cambia un dato de las listas, se cambia en `src/datos.ts`.

## Comandos

```bash
npm run dev       # servidor local
npm run generar   # regenera src/generated desde el diseño
npm test          # tests
npm run build     # tipos + build de producción
```

## Publicación

Proyecto de Vercel `breakpoint1/cordada`, conectado al repo `TechAdminBK/cordada`: cada push a `main`
publica en producción.
