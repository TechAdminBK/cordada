import { AVISO } from './aviso';

// Página del aviso de privacidad de Cordada. Muestra la versión que el formulario registra con
// cada contacto. Solo se enruta cuando el formulario está activo (ver App.tsx).
export function Privacidad() {
  return (
    <div className="cd-aviso">
      <main className="cd-aviso__cuerpo">
        <a href="/" className="cd-aviso__volver">← Volver a Cordada</a>
        <h1>Aviso de privacidad</h1>
        <p className="cd-aviso__version">Versión: {AVISO.version}</p>
        <dl>
          {AVISO.secciones.map(([titulo, texto]) => (
            <div key={titulo}>
              <dt>{titulo}</dt>
              <dd>{texto}</dd>
            </div>
          ))}
        </dl>
      </main>
    </div>
  );
}
