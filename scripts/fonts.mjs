// Convierte las fuentes variables TTF de Plus_Jakarta_Sans a WOFF2 en src/fonts.
// Solo hay que reejecutarlo si se reemplazan los TTF originales.
//
//   npm run fonts

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { compress } from 'wawoff2';

const trabajos = [
  ['Plus_Jakarta_Sans/PlusJakartaSans-VariableFont_wght.ttf', 'src/fonts/PlusJakartaSans-Variable.woff2'],
  ['Plus_Jakarta_Sans/PlusJakartaSans-Italic-VariableFont_wght.ttf', 'src/fonts/PlusJakartaSans-Italic-Variable.woff2'],
];

mkdirSync('src/fonts', { recursive: true });

for (const [origen, destino] of trabajos) {
  const ttf = readFileSync(origen);
  const woff2 = Buffer.from(await compress(ttf));
  writeFileSync(destino, woff2);

  const kb = (n) => `${Math.round(n / 1024)} KB`;
  console.log(`${destino}  ${kb(ttf.length)} → ${kb(woff2.length)}`);
}
