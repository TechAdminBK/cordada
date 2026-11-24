import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { App, langDeRuta } from './App';
import './generated/base.css';

const raiz = document.getElementById('root')!;
const arbol = (
  <StrictMode>
    <App lang={langDeRuta(window.location.pathname)} />
  </StrictMode>
);

// El build deja el contenido ya escrito en el HTML (scripts/prerender.mjs): ahí se hidrata. En
// desarrollo el root viene vacío y se monta de cero.
if (raiz.hasChildNodes()) hydrateRoot(raiz, arbol);
else createRoot(raiz).render(arbol);
