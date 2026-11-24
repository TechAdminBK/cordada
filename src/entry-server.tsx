import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { App, type Lang } from './App';

// Entrada del prerender (scripts/prerender.mjs): el mismo árbol que monta main.tsx, para que el
// navegador lo hidrate sin diferencias.
export function render(lang: Lang = 'es'): string {
  return renderToString(
    <StrictMode>
      <App lang={lang} />
    </StrictMode>,
  );
}
