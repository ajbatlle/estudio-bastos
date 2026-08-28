// Comprueba que las URL absolutas de estudiobastos.com que usan los consumidores
// externos —hoy la firma de correo de docs/— siguen existiendo en public/.
//
// Existe porque la firma apuntaba a /assets/img/, una ruta que desapareció al
// reestructurar el sitio: el logo quedó roto en todos los correos y nadie se
// enteró en meses. Un correo ya enviado no se puede arreglar; el build sí.
//
// Corre solo antes de cada `npm run build`, en local y en CI.

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, extname } from 'node:path';

const DOMINIO = 'https://estudiobastos.com';

const documentos = readdirSync('docs')
  .filter((f) => extname(f) === '.html')
  .map((f) => join('docs', f));

const rotos = [];

for (const documento of documentos) {
  const html = readFileSync(documento, 'utf8');

  // Las URL del propio dominio; se ignora el ?v= de cache-busting.
  const urls = html.match(new RegExp(`${DOMINIO}/[^"'\s>)]+`, 'g')) ?? [];

  for (const url of new Set(urls)) {
    const ruta = decodeURIComponent(url.slice(DOMINIO.length).split('?')[0]);

    // Solo se verifican los ficheros servidos tal cual desde public/. Las rutas
    // de páginas las genera Astro y no tienen un fichero equivalente aquí.
    if (!extname(ruta)) continue;

    if (!existsSync(join('public', ruta))) {
      rotos.push({ documento, url, esperado: join('public', ruta) });
    }
  }
}

if (rotos.length > 0) {
  console.error('\nEnlaces rotos hacia el sitio:\n');
  for (const { documento, url, esperado } of rotos) {
    console.error(`  ${documento}`);
    console.error(`    ${url}`);
    console.error(`    falta: ${esperado}\n`);
  }
  console.error('Si el fichero se movió, actualiza el documento o devuélvelo a su sitio.');
  console.error('Estas rutas las consumen correos ya enviados: moverlas los rompe hacia atrás.\n');
  process.exit(1);
}

console.log(`enlaces externos: ${documentos.length} documento(s), todo en su sitio`);
