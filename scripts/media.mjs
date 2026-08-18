// Deriva las piezas de media del sitio desde el material fuente de portfolio/.
// El original nunca se sirve: pesa demasiado y dura demasiado.
//
//   npm run media
//
// Los GIF de grabación de pantalla se recortan a un bucle corto y se convierten
// a WebP animado, que comprime mucho mejor que el GIF. Un vídeo real (MP4/WebM)
// sería bastante más liviano todavía, pero exige ffmpeg instalado.

import { mkdirSync, statSync, readdirSync, rmSync, existsSync } from 'node:fs';
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
  {
    tipo: 'animacion',
    origen: 'portfolio/bastos/afiches.gif',
    destino: 'public/media/bastos-afiches.webp',
    segundos: null,
    ancho: 1400,
    calidad: 55,
  },
];

// Cada proyecto impreso se muestra como un pase: la lámina cambia cada tantos
// milisegundos sin moverse. Se derivan TODAS las páginas de cada documento, en
// el orden en que están, sin descartar ninguna.
//
// El peso se resuelve por el tamaño, no por la cantidad: las páginas se sirven
// a 900px y con una compresión más apretada que la de una imagen suelta. En el
// listado se ven a 270-500px, así que 900 cubre de sobra las pantallas densas,
// y en el visor aguantan la ampliación. A 1400px las 281 páginas pesarían
// 34 MB; así pesan unos 15.
const SERIES = [
  { carpeta: 'portfolio/techo', prefijo: 'techo-catastro' },
  { carpeta: 'portfolio/fundacion-vivienda', prefijo: 'fundacion-vivienda-reporte' },
  { carpeta: 'portfolio/meric', prefijo: 'meric-reporte' },
  { carpeta: 'portfolio/america-solidaria', prefijo: 'america-solidaria-concausa' },
  { carpeta: 'portfolio/genesal', prefijo: 'genesal-catalogo' },
  { carpeta: 'portfolio/tisvol', prefijo: 'tisvol-catalogo' },
  { carpeta: 'portfolio/purever', prefijo: 'purever-catalogo' },
  { carpeta: 'portfolio/wift', prefijo: 'wift-manual' },
];

const ANCHO_PAGINA = 900;
const CALIDAD_PAGINA = 58;

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

for (const pieza of PIEZAS) {
  const { origen, destino, segundos, ancho, calidad } = pieza;

  // Estas dos son caras —minuto y medio cada una— y casi nunca cambian: si la
  // derivada ya es más nueva que el original, no hay nada que hacer. De paso
  // se esquiva el bloqueo de Windows cuando el servidor la está sirviendo.
  if (existsSync(destino) && statSync(destino).mtimeMs >= statSync(origen).mtimeMs) {
    console.log(`${destino}\n  al día, sin tocar`);
    continue;
  }

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

// Las series viejas se barren antes de escribir: si un documento pierde
// páginas, las sobrantes se quedarían ahí sirviéndose para siempre.
//
// Un fallo aquí no detiene nada. En Windows, un servidor de desarrollo que esté
// sirviendo una imagen la deja bloqueada y el borrado da EPERM; como el sitio
// solo reconoce las láminas numeradas con tres cifras —`serie-007.webp`—, lo
// que quede sin borrar no llega a mostrarse.
const bloqueadas = [];

for (const { prefijo } of SERIES) {
  for (const archivo of readdirSync('public/media')) {
    if (!archivo.startsWith(`${prefijo}-`) || !archivo.endsWith('.webp')) continue;
    try {
      rmSync(`public/media/${archivo}`, { force: true, maxRetries: 5, retryDelay: 150 });
    } catch {
      bloqueadas.push(archivo);
    }
  }
}

if (bloqueadas.length) {
  console.log(
    `Aviso: ${bloqueadas.length} archivo(s) viejo(s) no se pudieron borrar —otro proceso ` +
      `los tiene abiertos—. No estorban, pero conviene limpiarlos:\n  ${bloqueadas.join(', ')}`,
  );
}

for (const { carpeta, prefijo } of SERIES) {
  // Orden natural: «techo (9)» va antes que «techo (10)», que es como las
  // ordena una persona y no como las ordena una máquina.
  const archivos = readdirSync(carpeta)
    .filter((n) => /\.(png|jpe?g)$/i.test(n))
    .sort((a, b) => a.localeCompare(b, 'es', { numeric: true }));

  let peso = 0;

  for (let i = 0; i < archivos.length; i++) {
    const origen = `${carpeta}/${archivos[i]}`;
    // Numeradas con ceros delante: así el orden alfabético del disco ya es el
    // orden de lectura, y la página quedó libre de tener que reordenarlas.
    const destino = `public/media/${prefijo}-${String(i + 1).padStart(3, '0')}.webp`;

    // `limitInputPixels: false`: son exportaciones de imprenta de hasta 5000px
    // de lado, por encima del tope que sharp trae de fábrica.
    await sharp(origen, { limitInputPixels: false })
      .resize({ width: ANCHO_PAGINA, withoutEnlargement: true })
      // Sin alfa: son páginas, no recortes. Aplanar contra blanco evita que un
      // PNG con transparencia salga con el fondo en negro.
      .flatten({ background: '#ffffff' })
      .webp({ quality: CALIDAD_PAGINA, effort: 5 })
      .toFile(destino);

    peso += statSync(destino).size;
  }

  console.log(
    `${prefijo}: ${archivos.length} páginas · ${mb(peso)} ` +
      `(${(peso / archivos.length / 1024).toFixed(0)} KB de media)`,
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
