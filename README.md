# Estudio Bastos — sitio web

Sitio del estudio, construido con [Astro](https://astro.build) y publicado en GitHub Pages.

```bash
npm install
npm run dev
```

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo en `localhost:4321` |
| `npm run build` | Genera el sitio estático en `dist/` |
| `npm run preview` | Sirve `dist/` para revisar el build |
| `npm run fonts` | Regenera los WOFF2 desde los TTF de `Plus_Jakarta_Sans/` |

## Estructura

```
src/
├── components/     Header, Footer
├── layouts/        Base.astro — head, meta, favicon, estructura de página
├── pages/          Una ruta por archivo
├── styles/
│   ├── global.css  Punto de entrada: reset, bases, utilidades
│   └── tokens/     Tokens del sistema de diseño (color, tipo, espaciado…)
└── fonts/          Plus Jakarta Sans variable en WOFF2

public/
├── brand/          Logotipos, isotipo, 4 elementos de marca, ola de footer
└── elements/       100 elementos ornamentales + el-loco-tarot
```

## Sistema de diseño

Los tokens vienen del paquete `Bastos _ Sistema de diseño.zip` y son la fuente
de verdad. Las reglas que no se negocian:

- **Dos colores.** Azul `#003ec0` y blanco. Sin gradientes, sin tintes en UI.
- **Una tipografía.** Plus Jakarta Sans para display, titulares, cuerpo e interfaz.
- **Plano.** Cards sin sombra, sin radio y sin borde: se separan con una regla de 1px.
- **Rectangular.** Botones con `border-radius: 0` y borde de 2px.
- **Gutters generosos.** 64–80px en escritorio.
- **Casi sin movimiento.** Solo fundidos de opacidad de 0.15–0.2s.
- **Copy.** Titulares en MAYÚSCULAS, navegación en minúscula, sin emoji, sin
  signos de exclamación, primera persona plural.

Una diferencia deliberada con el paquete original: la tipografía se auto-hospeda
(`src/fonts/`, 59 KB en variable) en vez de cargarse desde Google Fonts. Se evita
la petición a un tercero y el parpadeo de texto.

## Despliegue

`.github/workflows/deploy.yml` construye y publica en cada push a `main`. En el
repositorio hay que activar **Settings → Pages → Source: GitHub Actions**.

Antes del primer despliegue, ajustar `site` y `base` en `astro.config.mjs` según
dónde viva el sitio. Todos los assets se referencian relativos al `base`, así que
esos dos valores bastan.

## Material fuente

`portfolio/` (~475 MB) y `Plus_Jakarta_Sans/` quedan fuera del repositorio a
propósito — ver `.gitignore`. Las imágenes del portafolio son exportaciones
página a página a resolución de imprenta; el sitio nunca las sirve tal cual.
Conservar un respaldo de esa carpeta fuera del proyecto.

## Pendiente

- Estructura definitiva de secciones y navegación.
- Tratamiento del portafolio y pipeline de optimización de imágenes.
- El home actual (`src/pages/index.astro`) es un port del mockup aprobado con
  contenido marcador de posición.
