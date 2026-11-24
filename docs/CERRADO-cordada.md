# Cerrado — Cordada

Append-only, lo más nuevo arriba. Una línea por ítem. El detalle vive en git.

| fecha | qué era | cómo cerró | SHA / evidencia |
|---|---|---|---|
| 2026-11-24 | Encender el formulario de contacto propio (pedido de Gustavo, 23-nov-2026) | hecho: aviso `cordada-v1` aprobado por Gustavo; variables de la base cargadas en Vercel a su pedido; formulario activo en `/` y aviso en `/privacidad`. Navegador en producción: CUMPLE en 1280 y 390 (campos, validación, teclado, brief compartido, aviso; `/en` sin formulario). El envío válido quedó sin probar: ítem 7 del plan | c6084e4, 9cd50f0 |
| 2026-11-24 | Formulario de contacto propio: integrarlo sobre el `main` actual (inglés, cabecera fija, `<main>`, prerender) | hecho y publicado APAGADO: el contenido de `/` y `/en` en producción conserva la huella de antes del cambio; `/privacidad` responde 404. Encenderlo sigue en Bloqueado del plan | 2dc2be0 |
| 2026-11-23 | C5 (aprobada por Gustavo el 23-nov): versión en inglés en `/en`, con su título, descripción, canonical, imagen para compartir y `hreflang` recíproco; un enlace de idioma en el menú y en el pie | hecho: el mismo marcado del diseño con los textos pasados por un diccionario; un test rompe si queda un texto sin traducir. Medido en local: sin errores de hidratación ni desborde en 1280 y 390 px | este commit |
| 2026-11-23 | C6 (aprobada por Gustavo el 23-nov): la cabecera queda fija al hacer scroll | hecho: el recorte horizontal de la página pasó de `overflow-x: hidden` a `clip`. Medido: a 2000 px de scroll la cabecera queda en 0 (antes -2000) y las 97 cajas medidas coinciden con producción | este commit |
| 2026-11-23 | Posicionamiento C4 (aprobada por Gustavo el 23-nov): landmark `<main>` alrededor del contenido, puesto por el generador | hecho: geometría idéntica a producción en 1280 y 390 px (108 cajas, 0 diferencias), sin errores de consola | este commit |
| 2026-11-23 | Posicionamiento C2 (aprobada por Gustavo el 23-nov): el contenido viene en el HTML inicial. El build corre un prerender y el navegador hidrata | hecho: 967 palabras en el HTML inicial (antes 0); en local hidrata sin errores de consola, con chips y sin desborde en 1280 y 390 px | este commit |
| 2026-11-23 | Posicionamiento C3 (aprobada por Gustavo el 23-nov): `robots.txt`, `sitemap.xml`, canonical, Open Graph con imagen de 1200x630, `twitter:card`, JSON-LD e ícono | hecho, con tests | este commit |
| 2026-11-23 | Destino del botón «Empezar un proyecto →» (el diseño traía el relleno `[ENLACE DE CONTACTO]`) | hecho: va al formulario de contacto de Break Point, `https://www.breakpoint.biz/#empecemos` (decisión de Gustavo); lo pone el generador, con test | este commit |
| 2026-11-23 | Subdominio `cordada.breakpoint.biz` | hecho por Gustavo (dominio en Vercel y CNAME en Namecheap); verificado HTTPS 200 con certificado válido y HTTP 308 | producción |
| 2026-11-23 | Conectar el repo `TechAdminBK/cordada` al proyecto de Vercel | hecho por Gustavo en Settings → Git; cada push a `main` publica solo | este commit |
| 2026-11-23 | Landing como proyecto React generado desde el diseño, al detalle (marcado, estilos y las siete animaciones), con viewport y vuelta a Break Point | hecho (medido contra el original en 1280 y 390 px: 164 de 164 textos y 15 de 15 cajas; revisor APTO en ronda 2) | este commit |
| 2026-11-23 | Publicar el HTML exportado tal cual, con enlace a Break Point | hecho, reemplazado después por el proyecto generado | 768c370, 7946caa |
| 2026-11-23 | Repo `TechAdminBK/cordada` y proyecto de Vercel `breakpoint1/cordada` | hecho | c1aba6a |
