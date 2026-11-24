// Aviso de privacidad de Cordada. Es propio de Cordada (decisión de Gustavo, 23-nov-2026): no usa
// el de Arcus. La versión viaja con cada lead (columna aviso_version), así queda registrado qué
// texto aceptó cada persona.
//
// ESTADO: BORRADOR COMPLETO. Redactado tomando como base el aviso de Arcus; el responsable y la vía
// para ejercer derechos son los mismos que en Arcus (dato de Gustavo, 24-nov-2026). No se publica
// ni se usa para recibir contactos hasta que Gustavo apruebe el texto; al aprobarlo, APROBADO pasa a true en el mismo
// commit. Si el texto cambia después, cambia también VERSION.

export const AVISO = {
  version: 'cordada-v1',
  aprobado: false as boolean,
  secciones: [
    ['Responsable del tratamiento', 'Claudio Klinzuck.'],
    ['Qué datos recibimos', 'Nombre, email corporativo, empresa y el texto que escribís en el formulario de contacto de esta página.'],
    ['Para qué', 'Para responder tu consulta sobre Cordada. No usamos esos datos para publicidad ni los vendemos.'],
    ['Dónde se guardan', 'En la base de datos de contactos de Break Point, alojada en Supabase. Solo accede el equipo autorizado.'],
    ['Por cuánto tiempo', 'Mientras dure la consulta y después de cerrarla, salvo que pidas que los borremos.'],
    ['Tus derechos', 'Podés pedir acceso, corrección o borrado de tus datos escribiéndonos desde el formulario de contacto de la página de inicio de Cordada.'],
  ],
} as const;

// Las secciones que un aviso tiene que traer para poder recibir contactos.
export const SECCIONES_OBLIGATORIAS = ['Responsable del tratamiento', 'Qué datos recibimos', 'Para qué', 'Dónde se guardan', 'Por cuánto tiempo', 'Tus derechos'] as const;

/**
 * El formulario solo recibe contactos con un aviso aprobado y completo: están las seis secciones,
 * ninguna está vacía y ninguna trae un dato marcado como pendiente (en cualquier capitalización).
 */
export function avisoListo(aviso: { aprobado: boolean; secciones: readonly (readonly [string, string])[] } = AVISO): boolean {
  if (!aviso.aprobado) return false;
  const textos = new Map(aviso.secciones.map(([titulo, texto]) => [titulo, texto.trim()]));
  return SECCIONES_OBLIGATORIAS.every((titulo) => {
    const texto = textos.get(titulo);
    return !!texto && !/pendiente|por definir|tbd|todo:/i.test(texto);
  });
}
