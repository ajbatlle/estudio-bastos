import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Un archivo .md por proyecto en src/content/proyectos/.
// Todo el contenido vive en el frontmatter: el cuerpo del archivo queda
// libre por si más adelante hace falta texto largo por proyecto.
const proyectos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/proyectos' }),
  schema: () =>
    z.object({
      /** Encabezado de la fila. Ej. "Editor gráfico – Huella Local". */
      titulo: z.string(),
      /** Párrafo de descripción. Una idea, sin hipérbole. */
      descripcion: z.string(),
      /** Naturaleza de la pieza. Ej. "Herramienta interna / editor gráfico". */
      tipo: z.string(),
      /** Qué hizo el estudio. Ej. "Desarrollo del editor". */
      rol: z.string(),
      anio: z.number().int(),
      /** URL pública del proyecto, si la tiene. */
      enlace: z.string().url().optional(),
      /** Cómo se muestra el enlace. Ej. "www.huellalocal.cl". */
      enlaceTexto: z.string().optional(),
      /**
       * Archivo dentro de public/media/, con extensión. Sin él se muestra el
       * marcador blanco. Se sirve desde public/ y no por astro:assets porque
       * el WebP animado perdería la animación al reprocesarse.
       * Generar con: npm run media
       *
       * Para una pieza suelta: una grabación de pantalla, un archivo animado.
       */
      media: z.union([z.string(), z.array(z.string())]).optional(),
      /**
       * Prefijo de una serie de láminas en public/media/ —`serie-001.webp`,
       * `serie-002.webp`…—. El sitio las busca solo, en orden, y las pasa una
       * tras otra. No hay que enumerarlas: un documento puede tener cien.
       * Generar con: npm run media
       */
      serie: z.string().optional(),
      mediaAlt: z.string().optional(),
      /**
       * Logo del cliente: nombre del archivo en public/media/logos/, sin
       * extensión. Se muestra en una pestaña blanca sobre la ficha, que es el
       * fondo para el que están hechos —sobre el azul varios se desvanecen—.
       */
      logo: z.string().optional(),
      /** Posición en el listado, de menor a mayor. */
      orden: z.number().default(0),
    }),
});

export const collections = { proyectos };
