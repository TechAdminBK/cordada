# Cerrado — Cordada

Append-only, lo más nuevo arriba. Una línea por ítem. El detalle vive en git.

| fecha | qué era | cómo cerró | SHA / evidencia |
|---|---|---|---|
| 2026-11-23 | Posicionamiento C2 (aprobada por Gustavo el 23-nov): el contenido viene en el HTML inicial. El build corre un prerender y el navegador hidrata | hecho: 967 palabras en el HTML inicial (antes 0); en local hidrata sin errores de consola, con chips y sin desborde en 1280 y 390 px | este commit |
| 2026-11-23 | Posicionamiento C3 (aprobada por Gustavo el 23-nov): `robots.txt`, `sitemap.xml`, canonical, Open Graph con imagen de 1200x630, `twitter:card`, JSON-LD e ícono | hecho, con tests | este commit |
| 2026-11-23 | Destino del botón «Empezar un proyecto →» (el diseño traía el relleno `[ENLACE DE CONTACTO]`) | hecho: va al formulario de contacto de Break Point, `https://www.breakpoint.biz/#empecemos` (decisión de Gustavo); lo pone el generador, con test | este commit |
| 2026-11-23 | Subdominio `cordada.breakpoint.biz` | hecho por Gustavo (dominio en Vercel y CNAME en Namecheap); verificado HTTPS 200 con certificado válido y HTTP 308 | producción |
| 2026-11-23 | Conectar el repo `TechAdminBK/cordada` al proyecto de Vercel | hecho por Gustavo en Settings → Git; cada push a `main` publica solo | este commit |
| 2026-11-23 | Landing como proyecto React generado desde el diseño, al detalle (marcado, estilos y las siete animaciones), con viewport y vuelta a Break Point | hecho (medido contra el original en 1280 y 390 px: 164 de 164 textos y 15 de 15 cajas; revisor APTO en ronda 2) | este commit |
| 2026-11-23 | Publicar el HTML exportado tal cual, con enlace a Break Point | hecho, reemplazado después por el proyecto generado | 768c370, 7946caa |
| 2026-11-23 | Repo `TechAdminBK/cordada` y proyecto de Vercel `breakpoint1/cordada` | hecho | c1aba6a |
