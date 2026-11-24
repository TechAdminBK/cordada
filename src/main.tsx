import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { App } from './App';
import './generated/base.css';
import './contacto.css';

const raiz = document.getElementById('root')!;
// La ruta real del navegador: de ella salen el idioma y, con el formulario activo, la página del
// aviso. El prerender le pasa a App la misma ruta (src/entry-server.tsx).
const arbol = (
  <StrictMode>
    <App ruta={window.location.pathname} />
  </StrictMode>
);

// El build deja el contenido ya escrito en el HTML (scripts/prerender.mjs): ahí se hidrata. En
// desarrollo el root viene vacío y se monta de cero.
if (raiz.hasChildNodes()) hydrateRoot(raiz, arbol);
else createRoot(raiz).render(arbol);
