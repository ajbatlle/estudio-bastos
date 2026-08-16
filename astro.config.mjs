// @ts-check
import { defineConfig } from 'astro/config';

// El sitio vive en su propio dominio, así que no lleva `base`. Si alguna vez
// se sirviera desde un subdirectorio (usuario.github.io/estudio-bastos), habría
// que añadir base: '/estudio-bastos'; todos los assets se referencian de forma
// relativa al `base`, así que bastaría con eso.
//
// `site` alimenta las URL canónicas y las de compartir en redes: debe coincidir
// con el dominio real o el sitio se anuncia con una dirección que no existe.
export default defineConfig({
  site: 'https://estudiobastos.com',

  build: {
    // GitHub Pages sirve /ruta/index.html — sin barra final da 404.
    format: 'directory',
  },

  image: {
    // Las piezas del portafolio son exportaciones de imprenta muy pesadas.
    // Se procesan a WebP en el build; nunca se sirve el original.
    responsiveStyles: true,
  },

  devToolbar: {
    enabled: false,
  },
});
