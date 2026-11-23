import { describe, expect, it } from 'vitest';
import { compuerta, numeros, piezas, reglas } from './content';

// Las cifras son el registro de una sesión real: si alguien las redondea o cambia sin
// tocar su fuente, este test tiene que caer.
describe('copy de la landing', () => {
  it('la compuerta tiene 4 eventos y 5 pasos de ruta', () => {
    expect(compuerta.eventos).toHaveLength(4);
    expect(compuerta.ruta).toHaveLength(5);
  });

  it('cada evento tiene veredicto APLICADO o RECHAZADO', () => {
    for (const e of compuerta.eventos) {
      expect(['APLICADO', 'RECHAZADO']).toContain(e.veredicto);
    }
  });

  it('las cuatro piezas, seis números y ocho reglas están completos', () => {
    expect(piezas.items).toHaveLength(4);
    expect(numeros.items).toHaveLength(6);
    expect(reglas.items).toHaveLength(8);
  });

  it('las cifras del registro no se redondearon', () => {
    const grandes = numeros.items.map((n) => n.grande);
    expect(grandes).toEqual(['62/62', '437/920', '686≠985', '42→0', '19/58', '21']);
    expect(compuerta.ruta.find((s) => s.nombre === 'Compuerta')?.veredicto).toBe('62/62');
  });

  it('los chips de la compuerta traen su texto de ejemplo', () => {
    expect(compuerta.chips).toHaveLength(4);
    for (const c of compuerta.chips) expect(c.texto.length).toBeGreaterThan(20);
  });
});
