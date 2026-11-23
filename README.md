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

Lo único que el script agrega al diseño es el enlace **Volver a Break Point** en el menú y en el pie.

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

Proyecto de Vercel `breakpoint1/cordada`. Hoy se publica con `vercel --prod` desde esta carpeta;
el repo todavía no está conectado a Vercel para deploy automático.
