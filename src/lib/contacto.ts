// Formulario de contacto de Cordada: validación en cliente y envío del lead.
//
// Misma función que el formulario de Arcus (arcus-web/src/lib/contact.ts): el lead se guarda en
// landing.contact_requests de la base de Arcus, la tabla que comparten arcus.breakpoint.biz y
// www.breakpoint.biz. `origen` dice de qué sitio vino, para verlo en el panel de leads.
//
// Se escribe con la anon key, que es pública por diseño: el rol anon solo puede INSERTAR en esa
// tabla. Nunca la clave de servicio. El consentimiento se guarda con la versión del aviso aceptada.

export type ContactoInput = {
  nombre: string;
  email: string;
  empresa: string;
  /** Lo que la persona escribió en "qué cuenta como terminado". */
  brief: string;
  habeas: boolean;
  avisoVersion: string;
};

export type ContactoErrores = Partial<Record<'nombre' | 'email' | 'empresa' | 'brief' | 'habeas', string>>;

// Los mismos topes que los CHECK de la tabla (nombre 120, email 254, empresa 160) y el del
// formulario de Break Point para el mensaje (2000).
// Más estricto que el CHECK de la tabla (que solo pide algo@algo.algo): la parte local sin signos
// que no van en una dirección, y el dominio en etiquetas de letras, cifras y guiones separadas por
// un solo punto. Así no queda registrado un consentimiento con una dirección que no existe.
const EMAIL = /^[^@\s;,<>()"']+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)+$/;
export const TOPE = { nombre: 120, email: 254, empresa: 160, brief: 2000 } as const;

export function validarContacto(input: ContactoInput): ContactoErrores {
  const errores: ContactoErrores = {};
  const nombre = input.nombre.trim();
  const email = input.email.trim();
  if (nombre.length < 1 || nombre.length > TOPE.nombre) errores.nombre = 'Requerido.';
  if (email.length < 3 || email.length > TOPE.email || !EMAIL.test(email)) errores.email = 'Ingresá un email válido.';
  if (input.empresa.trim().length > TOPE.empresa) errores.empresa = 'Demasiado largo.';
  if (input.brief.trim().length > TOPE.brief) errores.brief = 'Demasiado largo.';
  if (!input.habeas) errores.habeas = 'Necesario para enviar el formulario.';
  return errores;
}

export type FilaLead = {
  nombre: string;
  email: string;
  empresa: string | null;
  agentes: null;
  lang: 'es';
  servicio: null;
  mensaje: string | null;
  origen: 'cordada';
  habeas_consent: true;
  consentimiento_at: string;
  aviso_version: string;
};

/** Input ya validado -> fila de landing.contact_requests. */
export function filaDesdeContacto(input: ContactoInput, ahora: Date): FilaLead {
  return {
    nombre: input.nombre.trim(),
    email: input.email.trim(),
    empresa: input.empresa.trim() || null,
    agentes: null,
    lang: 'es',
    servicio: null,
    mensaje: input.brief.trim() || null,
    origen: 'cordada',
    habeas_consent: true,
    consentimiento_at: ahora.toISOString(),
    aviso_version: input.avisoVersion,
  };
}

export type ResultadoEnvio = { ok: true } | { ok: false; motivo: 'invalido' | 'red' | 'servidor' };

export async function enviarContacto(
  input: ContactoInput,
  cfg: { url: string; anonKey: string },
  fetchImpl: typeof fetch = fetch,
  ahora: Date = new Date(),
): Promise<ResultadoEnvio> {
  if (Object.keys(validarContacto(input)).length > 0) return { ok: false, motivo: 'invalido' };
  // Sin versión del aviso no hay consentimiento que registrar: no se envía.
  if (!input.avisoVersion) return { ok: false, motivo: 'invalido' };

  let res: Response;
  try {
    res = await fetchImpl(`${cfg.url.replace(/\/+$/, '')}/rest/v1/contact_requests`, {
      method: 'POST',
      headers: {
        apikey: cfg.anonKey,
        Authorization: `Bearer ${cfg.anonKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
        // La tabla vive en el schema `landing`, no en `public`.
        'Content-Profile': 'landing',
      },
      body: JSON.stringify(filaDesdeContacto(input, ahora)),
    });
  } catch {
    return { ok: false, motivo: 'red' };
  }
  return res.ok ? { ok: true } : { ok: false, motivo: 'servidor' };
}

/** El formulario solo se muestra si están las dos variables; si falta una, queda el enlace de respaldo. */
export function configDeContacto(env: Record<string, unknown>): { url: string; anonKey: string } | null {
  const url = typeof env.VITE_SUPABASE_URL === 'string' ? env.VITE_SUPABASE_URL.trim() : '';
  const anonKey = typeof env.VITE_SUPABASE_ANON_KEY === 'string' ? env.VITE_SUPABASE_ANON_KEY.trim() : '';
  return url && anonKey ? { url, anonKey } : null;
}
