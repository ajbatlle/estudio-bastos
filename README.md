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
| `npm run media` | Deriva las piezas de `public/media/` desde `portfolio/` |

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

### Media de los proyectos

Las piezas se derivan del material fuente con `npm run media`, que lee la lista
de conversiones al principio de `scripts/media.mjs` y escribe en `public/media/`.
El original nunca se sirve.

Los GIF de grabación de pantalla se convierten a WebP animado, que comprime
entre fotogramas y aprovecha que una grabación de pantalla es casi toda
superficie estática: el editor de Huella Local pasó de 12,3 MB a 1,7 MB sin
perder ninguno de sus 1002 fotogramas ni sus 89 segundos.

`segundos` recorta la pieza a una ventana desde el inicio; con `null` va entera.
Convertir los 1002 fotogramas a resolución original pide unos 6 GB de memoria,
de ahí el `--max-old-space-size` del script.

Los retratos del equipo se recortan a cuadrado buscando la cara (`attention`) y
salen a 480×480 WebP, de 2 MB a unos 30 KB. La máscara circular la aplica el
CSS: guardarlos ya recortados en círculo exigiría transparencia y pesaría más.

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

### Decisiones que reemplazan al paquete original

El paquete describe el punto de partida. Sobre él se fueron tomando decisiones
que ya son las vigentes: **cuando algo del sitio contradice al paquete, manda el
sitio.** Está pendiente rehacer el paquete a partir de esto.

| Elemento | Paquete original | Vigente |
|---|---|---|
| Fondo | Azul plano | Mesh de azul y negro con grano encima |
| Botones | Rectangulares, borde 2px | Píldora, borde 1px |
| Contenedores de media | Sin redondeo | Radio de 8px, gris claro, bisel hundido |
| Sombras | Ninguna, estética plana | Sombra en capas bajo la pantalla |
| Movimiento | Ninguno salvo fundidos | Elementos de marca en rotación continua |

Lo que sigue vigente del paquete: una sola tipografía, el azul `#003ec0` como
color de marca, titulares sin caja alta forzada, sin emoji y sin hipérbole.

## Despliegue

El sitio vive en `estudiobastos.com`. `.github/workflows/deploy.yml` construye y
publica en cada push a `main`.

Para el primer despliegue, en el repositorio de GitHub:

1. **Settings → Pages → Source: GitHub Actions**.
2. **Settings → Pages → Custom domain**: `estudiobastos.com`.
3. En el DNS del dominio, apuntar a GitHub Pages: un `CNAME` de `www` a
   `<usuario>.github.io`, y registros `A` del dominio raíz a las IP de GitHub
   (`185.199.108.153`, `.109.153`, `.110.153`, `.111.153`).
4. Marcar **Enforce HTTPS** una vez que el certificado se emita.

`public/CNAME` viaja en cada build para que GitHub no pierda el dominio al
republicar. `site` en `astro.config.mjs` alimenta las URL canónicas y las de
compartir en redes: si el dominio cambiara, hay que cambiarlo ahí también.

## Material fuente

`portfolio/` (~475 MB) y `Plus_Jakarta_Sans/` quedan fuera del repositorio a
propósito — ver `.gitignore`. Las imágenes del portafolio son exportaciones
página a página a resolución de imprenta; el sitio nunca las sirve tal cual.
Conservar un respaldo de esa carpeta fuera del proyecto.

La excepción es `public/media/flip-coin.mp3`, la pista del mando de
sonido: sí se versiona, 6,2 MB, porque el sitio la sirve tal cual y no hay
pipeline que la derive. Solo se descarga si alguien pulsa la marca de rombos.

## Las marcas del manifiesto como mandos

Las cuatro marcas no llevan a ninguna parte: **manejan la experiencia**. Cada
una dice una sola palabra al pasar el puntero, y esa palabra es el canal que
abre. El estado no se escribe: se oye, se ve o se juega.

| Marca | Canal | Qué hace |
|---|---|---|
| Rombos | sonido | Enciende y apaga la pista del estudio |
| Asterisco | luz | Automática (reloj de Chile) · de día · de noche |
| Círculos | textura | Grano medio · alto · sin grano |
| Flor | juego | Vacía la pantalla y monta un snake |

Las dos del medio son perillas de ambiente y comparten mecanismo en
`MarcaInline.astro`: la marca pasa de `<span>` a `<button>`, el nivel se guarda
en `localStorage` y se marca en `<html>` —no en `<body>`, que Astro reemplaza al
navegar sin recarga—, el estado va en el `aria-label`, y el área táctil se
amplía a 44px con un pseudo-elemento, para no mover el texto agrandando la
marca.

Las otras dos no tienen niveles que recordar y viven en su propio componente,
montado en el layout: `Sonido.astro` y `Juego.astro`.

- **Sonido.** El `<audio>` se crea en JavaScript y cuelga de `window`, no del
  DOM: al navegar sin recarga Astro reemplaza el `<body>` y la música se
  cortaría. Se instancia al primer clic, así que los 6 MB de la pista no se
  descargan a quien no la pidió, y suena en bucle.
- **Juego.** Snake en `<canvas>`, sin tablero dibujado: el campo es el propio
  fondo de marca, de borde a borde y desde la cabecera hasta abajo. La serpiente
  y la comida son el mismo elemento que se pulsó —se toma del `<img>` de la
  marca—, en blanco y con el lienzo en `difference`, así que toman color del
  fondo igual que las marcas del manifiesto. La rejilla se calcula por el lado
  menor de la ventana, con celdas de unos 34–72px.

  Cada partida abre con una cuenta atrás de cuatro segundos —un número por
  segundo, que crece y se encoge, con «segundos para jugar snake» debajo— para
  que no arranque de golpe. Mientras corre, el bucle ya gira pero la serpiente
  no avanza.

  Mientras se juega, `html[data-juego]` funde el `<main>` y el pie —no los
  esconde de golpe— y bloquea el scroll; queda la cabecera, que es la salida: el
  logo y la píldora cierran el juego y siguen navegando. También sale con Esc.
  Se mueve con flechas o WASD y, en táctil, deslizando: no hay ninguna línea de
  ayuda en pantalla que lo explique, por decisión de diseño.

  El panel va en `position: absolute` y no `fixed` a propósito: un elemento fijo
  se promueve a su propia capa de composición y el `difference` dejaría de ver
  el fondo de la página. Por lo mismo, la opacidad del fundido se anima en el
  lienzo y los textos, nunca en la sección que los contiene.

## Pendiente

- **Dominio del sitio.** `site` en `astro.config.mjs` apunta a `estudiobastos.cl`,
  que fue una suposición. El correo del estudio es `.com`; hay que confirmar cuál
  es el dominio real antes del primer despliegue, porque de ahí salen las URL
  canónicas y las de compartir en redes.
- **Datos por confirmar en las fichas de proyecto.** Los diez proyectos están
  cargados y con imagen, pero cuatro llevan el año supuesto —Genesal, Tisvol,
  Purever y wift, cuyo material no lo indica en ninguna página—, ningún proyecto
  nuevo tiene `enlace`, y el `rol` está redactado desde lo que muestra la pieza,
  no desde lo que se acordó con cada cliente. Cada `.md` lo deja anotado al pie.
