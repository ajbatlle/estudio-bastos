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
    tipo: 'animacion',
    origen: 'portfolio/huella-local/editor.gif',
    destino: 'public/media/huella-local-editor.webp',
    // null = la pieza completa.
    segundos: null,
    ancho: 1400,
    calidad: 55,
  },
];

// Los retratos llegan con encuadres distintos —uno vertical, otro casi
// cuadrado—, así que se recortan todos a cuadrado. La máscara circular la pone
// el CSS: guardar el PNG ya recortado en círculo obligaría a transparencia y
// pesaría más.
const RETRATOS = [
  {
    origen: 'assets/antonio-batlle.png',
    destino: 'public/media/antonio-batlle.webp',
  },
  {
    origen: 'assets/nicolas-parra.png',
    destino: 'public/media/nicolas-parra.webp',
  },
];

const LADO_RETRATO = 480;

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

for (const { origen, destino } of RETRATOS) {
  const meta = await sharp(origen).metadata();

  await sharp(origen)
    .resize({
      width: LADO_RETRATO,
      height: LADO_RETRATO,
      fit: 'cover',
      // `attention` recorta hacia la zona de mayor detalle, que en un retrato
      // de estudio sobre fondo liso es la cara. Un recorte centrado dejaría a
      // Antonio descabezado: su foto es vertical y él no está al centro.
      position: sharp.strategy.attention,
    })
    .webp({ quality: 80 })
    .toFile(destino);

  const antes = statSync(origen).size;
  const despues = statSync(destino).size;

  console.log(
    `${destino}\n` +
      `  ${meta.width}×${meta.height} → ${LADO_RETRATO}×${LADO_RETRATO} · ${mb(antes)} → ${mb(despues)}`,
  );
}
