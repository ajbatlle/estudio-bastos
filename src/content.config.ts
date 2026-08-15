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
       */
      media: z.string().optional(),
      mediaAlt: z.string().optional(),
      /** Posición en el listado, de menor a mayor. */
      orden: z.number().default(0),
    }),
});

export const collections = { proyectos };
