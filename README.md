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

Dos páginas, sin menú y sin pie: un único botón en la cabecera alterna entre
ambas.

| Ruta | Contenido |
|---|---|
| `/` | Manifiesto a pantalla completa y enlace de contacto |
| `/proyectos` | Listado de proyectos, uno por fila |

```
src/
├── components/     Header, MarcaInline
├── content/
│   └── proyectos/  Un .md por proyecto (todo en el frontmatter)
├── content.config.ts   Esquema de la colección de proyectos
├── layouts/        Base.astro — head, meta, favicon, estructura de página
├── pages/          index.astro, proyectos.astro
├── styles/
│   ├── global.css  Punto de entrada: reset, bases, utilidades
│   └── tokens/     Tokens del sistema de diseño (color, tipo, espaciado…)
└── fonts/          Plus Jakarta Sans variable en WOFF2

public/
├── brand/          Logotipos, isotipo, 4 elementos de marca, ola de footer
└── elements/       100 elementos ornamentales + el-loco-tarot
```

### Añadir un proyecto

Crear `src/content/proyectos/<slug>.md`. El esquema está en
`src/content.config.ts`; `media` y `enlace` son opcionales y sin `media` se
muestra el marcador blanco de los mockups.

```yaml
---
titulo: Editor gráfico – Huella Local
descripcion: Una idea, sin hipérbole.
tipo: Herramienta interna / editor gráfico
rol: Desarrollo del editor
anio: 2026
enlace: https://www.huellalocal.cl
enlaceTexto: www.huellalocal.cl
orden: 1
---
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

### Dónde el sitio se aparta del sistema de diseño

Los mockups de agosto de 2026 mandan sobre el paquete en dos puntos, y ambos
están marcados con `⚠` en el código:

| Elemento | Sistema de diseño | Mockups |
|---|---|---|
| Botones | Rectangulares, borde 2px | Píldora, borde 1.5px |
| Contenedores de media | Sin redondeo | Radio de 24px |

Conviene reflejar estos cambios en el paquete del sistema de diseño para que no
queden dos fuentes de verdad en desacuerdo.

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

- **Dirección de contacto.** El home enlaza a `hola@estudiobastos.cl`, que es un
  marcador de posición (constante `CORREO` en `src/pages/index.astro`).
- **Contenido de los 9 proyectos restantes.** Solo está cargado Huella Local.
- **Imágenes.** Ninguna fila tiene `media` todavía: todas muestran el marcador
  blanco. Falta decidir qué se ve en cada una y derivar los archivos desde
  `portfolio/`.
