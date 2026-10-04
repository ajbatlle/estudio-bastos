// Deriva las imágenes fijas del sitio desde el material fuente: los retratos del
// equipo y los logos de clientes. El original nunca se sirve: pesa demasiado.
//
//   npm run media
//
// Los videos de /proyectos no pasan por aquí: se montan aparte, ya en su tamaño
// final, y se dejan como MP4 en public/media/.

import { mkdirSync, statSync, readdirSync } from 'node:fs';
import sharp from 'sharp';

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

// Los logos van a color y sobre fondo transparente, tal como llegan: se
// muestran sobre un recuadro blanco, que es su fondo natural.
const LOGOS_ORIGEN = 'portfolio/logos';
const LOGOS_DESTINO = 'public/media/logos';
const ALTO_LOGO = 120; // 2× del tamaño de pantalla, para pantallas densas.

const mb = (n) => (n / 1048576).toFixed(1) + ' MB';

mkdirSync('public/media', { recursive: true });

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

mkdirSync(LOGOS_DESTINO, { recursive: true });

const logos = readdirSync(LOGOS_ORIGEN).filter((n) => /\.(png|jpe?g|webp)$/i.test(n));

for (const archivo of logos) {
  const origen = `${LOGOS_ORIGEN}/${archivo}`;
  const nombre = archivo.replace(/^logo[_-]/, '').replace(/\.\w+$/, '');
  const destino = `${LOGOS_DESTINO}/${nombre}.webp`;

  await sharp(origen)
    .resize({ height: ALTO_LOGO })
    // `alphaQuality` alto: los logos tienen bordes recortados y una alfa
    // comprimida de más los deja sucios contra el blanco.
    .webp({ quality: 90, alphaQuality: 100 })
    .toFile(destino);

  const { width, height } = await sharp(destino).metadata();
  console.log(`${destino}  ${width}×${height} · ${(statSync(destino).size / 1024).toFixed(1)} KB`);
}
