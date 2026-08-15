// @ts-check
import { defineConfig } from 'astro/config';

// ⚠ Ajustar antes del primer deploy a GitHub Pages:
//
//   · Dominio propio o página de usuario (bastos.github.io):
//       site: 'https://estudiobastos.cl'   ·   base sin definir
//
//   · Repositorio de proyecto (usuario.github.io/estudio-bastos):
//       site: 'https://usuario.github.io'  ·   base: '/estudio-bastos'
//
// Todos los assets se referencian de forma relativa al `base`, así que
// cambiar estos dos valores es suficiente: no hay rutas absolutas que tocar.
export default defineConfig({
  site: 'https://estudiobastos.cl',

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
