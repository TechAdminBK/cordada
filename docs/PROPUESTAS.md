# Propuestas — Cordada

Funcionalidad que hoy no existe (clase ALCANCE). Una línea por propuesta. Nada de acá se construye sin OK explícito de Gustavo.

## Posicionamiento (informe del 23-nov-2026, https://claude.ai/artifact/CSAnAPC5cRapMhySxw8F2B)

Medido en producción. Orden por impacto.

- **C2. Prerender: que el contenido venga en el HTML inicial.** Hoy el HTML trae 0 palabras y las 966 visibles se dibujan con JavaScript; los rastreadores de IA no lo ejecutan. Mismo enfoque que Arcus. Evidencia media.
- **C3. Archivos y etiquetas básicos del host:** `robots.txt`, `sitemap.xml`, canonical, Open Graph con imagen, JSON-LD e ícono. Hoy no existe ninguno.
- **C4. Landmark `<main>`** alrededor del contenido (cambio en el diseño o en `scripts/generar-landing.mjs`).
- **C5. Versión en inglés** con URL propia y `hreflang` recíproco. Solo si Gustavo la quiere: el diseño es de un idioma.
