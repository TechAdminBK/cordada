import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { App, contactoActivo } from './App';

// Entrada del prerender (scripts/prerender.mjs): el mismo árbol que monta main.tsx, para que el
// navegador lo hidrate sin diferencias. Recibe la ruta que se está escribiendo, igual que main.tsx
// recibe la del navegador, y usa las mismas variables VITE_* del build: la decisión de mostrar el
// formulario es la misma función en los dos lados (contactoActivo).
export function render(ruta = '/', env: Record<string, unknown> = import.meta.env): string {
  return renderToString(
    <StrictMode>
      <App ruta={ruta} env={env} />
    </StrictMode>,
  );
}

// Lo que el prerender pregunta para saber si escribe la página del aviso. El formulario es solo de
// la versión en español, por eso se pregunta por 'es'.
export function formularioActivo(env: Record<string, unknown> = import.meta.env): boolean {
  return contactoActivo('es', env) !== null;
}
