// Deriva las piezas de media del sitio desde el material fuente de portfolio/.
// El original nunca se sirve: pesa demasiado y dura demasiado.
//
//   npm run media
//
// Los GIF de grabación de pantalla se recortan a un bucle corto y se convierten
// a WebP animado, que comprime mucho mejor que el GIF. Un vídeo real (MP4/WebM)
// sería bastante más liviano todavía, pero exige ffmpeg instalado.

import { mkdirSync, statSync } from 'node:fs';
import sharp from 'sharp';

const PIEZAS = [
  {
    origen: 'portfolio/huella-local/editor.gif',
    destino: 'public/media/huella-local-editor.webp',
    // null = la pieza completa.
    segundos: null,
    ancho: 1400,
    calidad: 55,
  },
];

const mb = (n) => (n / 1048576).toFixed(1) + ' MB';

mkdirSync('public/media', { recursive: true });

for (const pieza of PIEZAS) {
  const { origen, destino, segundos, ancho, calidad } = pieza;

  // El primer fotograma basta para leer los retardos de todos los demás.
  const meta = await sharp(origen).metadata();
  const retardos = meta.delay ?? [];

  // Cuántos fotogramas caben en la ventana pedida. Sin ventana, todos.
  let acumulado = 0;
  let cuadros = 0;
  const tope = segundos === null ? Infinity : segundos * 1000;
  while (cuadros < retardos.length && acumulado < tope) {
    acumulado += retardos[cuadros];
    cuadros += 1;
  }

  // Se leen solo esos fotogramas: cargar los 1002 pediría gigas de memoria.
  await sharp(origen, { animated: true, pages: cuadros, limitInputPixels: false })
    .resize({ width: ancho })
    .webp({ quality: calidad, effort: 5 })
    .toFile(destino);

  const antes = statSync(origen).size;
  const despues = statSync(destino).size;

  console.log(
    `${destino}\n` +
      `  ${cuadros}/${meta.pages} fotogramas · ${(acumulado / 1000).toFixed(1)}s de ${((retardos.reduce((a, b) => a + b, 0)) / 1000).toFixed(0)}s\n` +
      `  ${meta.width}px → ${ancho}px · ${mb(antes)} → ${mb(despues)}`,
  );
}
