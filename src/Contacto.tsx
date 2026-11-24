import { useId, useState, type FormEvent } from 'react';
import { AVISO } from './aviso';
import { enviarContacto, validarContacto, type ContactoErrores, type ContactoInput } from './lib/contacto';

// Formulario de contacto de la sección final. No existe en el diseño (que solo traía un botón con
// destino de relleno): toma su forma del recuadro del hero (borde tinta, sombra dura, etiquetas en
// mono) para leerse como parte de la misma página. El brief es el mismo estado que el del hero.

type Estado = 'quieto' | 'enviando' | 'enviado' | 'error';

type Props = {
  cfg: { url: string; anonKey: string };
  brief: string;
  onBrief: (texto: string) => void;
  /** Para tests: reemplaza fetch. */
  fetchImpl?: typeof fetch;
};

export function Contacto({ cfg, brief, onBrief, fetchImpl }: Props) {
  const id = useId();
  const [campos, setCampos] = useState({ nombre: '', email: '', empresa: '' });
  const [habeas, setHabeas] = useState(false);
  const [errores, setErrores] = useState<ContactoErrores>({});
  const [estado, setEstado] = useState<Estado>('quieto');

  const entrada = (): ContactoInput => ({ ...campos, brief, habeas, avisoVersion: AVISO.version });

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (estado === 'enviando') return;
    const errs = validarContacto(entrada());
    setErrores(errs);
    if (Object.keys(errs).length > 0) return;
    setEstado('enviando');
    const r = await enviarContacto(entrada(), cfg, fetchImpl);
    setEstado(r.ok ? 'enviado' : 'error');
  }

  if (estado === 'enviado') {
    return (
      <div className="cd-contacto cd-contacto--enviado" role="status">
        <p className="cd-contacto__sello">Recibido</p>
        <p className="cd-contacto__gracias">Gracias. Te vamos a escribir al email que nos dejaste.</p>
      </div>
    );
  }

  const campo = (clave: 'nombre' | 'email' | 'empresa', etiqueta: string, extra: Record<string, string>) => (
    <div className="cd-contacto__campo">
      <label htmlFor={`${id}-${clave}`}>{etiqueta}</label>
      <input
        id={`${id}-${clave}`}
        value={campos[clave]}
        onChange={(e) => setCampos((c) => ({ ...c, [clave]: e.target.value }))}
        aria-invalid={errores[clave] ? true : undefined}
        aria-describedby={errores[clave] ? `${id}-${clave}-err` : undefined}
        {...extra}
      />
      {errores[clave] && <p id={`${id}-${clave}-err`} className="cd-contacto__error" role="alert">{errores[clave]}</p>}
    </div>
  );

  return (
    <form className="cd-contacto" onSubmit={enviar} noValidate>
      {campo('nombre', 'Nombre', { autoComplete: 'name', placeholder: 'Tu nombre' })}
      {campo('email', 'Email corporativo', { type: 'email', autoComplete: 'email', placeholder: 'nombre@empresa.com' })}
      {campo('empresa', 'Empresa', { autoComplete: 'organization', placeholder: 'Nombre de la empresa' })}
      <div className="cd-contacto__campo">
        <label htmlFor={`${id}-brief`}>Qué cuenta como terminado</label>
        <textarea
          id={`${id}-brief`}
          rows={4}
          value={brief}
          onChange={(e) => onBrief(e.target.value)}
          placeholder="Pegá el brief, el PR o la spec."
          aria-invalid={errores.brief ? true : undefined}
          aria-describedby={errores.brief ? `${id}-brief-err` : undefined}
        />
        {errores.brief && <p id={`${id}-brief-err`} className="cd-contacto__error" role="alert">{errores.brief}</p>}
      </div>
      <label className="cd-contacto__habeas">
        <input
          type="checkbox"
          checked={habeas}
          onChange={(e) => setHabeas(e.target.checked)}
          aria-invalid={errores.habeas ? true : undefined}
          aria-describedby={errores.habeas ? `${id}-habeas-err` : undefined}
        />
        <span>
          Autorizo el tratamiento de mis datos según el aviso de privacidad vigente. <a href="/privacidad" target="_blank" rel="noopener">Leer el aviso</a>
        </span>
      </label>
      {errores.habeas && <p id={`${id}-habeas-err`} className="cd-contacto__error" role="alert">{errores.habeas}</p>}
      {estado === 'error' && <p className="cd-contacto__error" role="alert">No pudimos enviarlo. Probá de nuevo en un momento.</p>}
      <button type="submit" className="cd-btn cd-contacto__enviar" disabled={estado === 'enviando'}>
        {estado === 'enviando' ? 'Enviando…' : 'Empezar un proyecto'} <span aria-hidden="true">→</span>
      </button>
    </form>
  );
}
