# Propuestas — Cordada

Funcionalidad que hoy no existe (clase ALCANCE). Una línea por propuesta. Nada de acá se construye sin OK explícito de Gustavo.

## Posicionamiento (informe del 23-nov-2026, https://claude.ai/artifact/CSAnAPC5cRapMhySxw8F2B)

Medido en producción. Orden por impacto.

- **C5. Versión en inglés** con URL propia y `hreflang` recíproco. Solo si Gustavo la quiere: el diseño es de un idioma.
- **C6. La cabecera no queda fija al hacer scroll.** El diseño la declara `position: sticky`, pero el contenedor de la página tiene `overflow-x: hidden` y la anula (medido en producción el 23-nov-2026: a 2000 px de scroll la cabecera queda fuera de pantalla). Es así desde el diseño original; corregirlo cambia el diseño.
