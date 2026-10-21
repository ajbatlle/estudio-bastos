// Copia generada por goles-messi/publicar.js. No se edita aquí: los cambios
// van en goles-messi/afiche.js y se vuelven a publicar.
// Dibuja el afiche de un gol como SVG. Es una función pura sobre un registro de
// datos/goles.json: la usan la hoja de contactos y, después, la sección del sitio,
// para que el afiche sea el mismo en los dos lados.
//
// La pieza es un homenaje a los juegos de mánager (Championship Manager,
// Football Manager, PC Fútbol) dentro del sistema de Bastos: la pantalla del
// partido en 2D montada sobre papel hueso, con su marcador de transmisión y su
// ficha de datos.

import qrcode from 'qrcode-generator';

export const TINTAS = { papel: '#F2EDE0', azul: '#003EC0', roja: '#D0452B', negra: '#1B1B1B' };

// La pantalla toma el color del equipo de Messi. El celeste y el rosa de las
// camisetas no sostienen el hueso de las líneas (contraste 2,3 y 1,8), así que
// Argentina va en un celeste más profundo e Inter Miami en su otro color, el
// negro. El segundo tono es el de las franjas de césped.
const PANTALLA = {
  'Barcelona': ['#003EC0', '#003AB5'],
  'Paris Saint-Germain': ['#0E2350', '#0B1D44'],
  'Argentina': ['#2F6FB0', '#2A66A4'],
  'Inter Miami': ['#1B1B1B', '#2A1F25'],
};

const COMPETICION = {
  'La Liga': 'La Liga', 'Champions League': 'Champions', 'FIFA World Cup': 'Mundial',
  'Copa America': 'Copa América', 'Ligue 1': 'Ligue 1', 'Major League Soccer': 'MLS',
};
const FASE = {
  'Final': 'final', 'Semi-finals': 'semifinal', 'Quarter-finals': 'cuartos de final',
  'Round of 16': 'octavos de final', 'Group Stage': 'fase de grupos',
};

// Nombre corriente en español, sin la sigla de la sociedad.
const EQUIPO = {
  'Atlético Madrid': 'Atlético de Madrid', 'Celta Vigo': 'Celta de Vigo', 'Levante UD': 'Levante',
  'RC Deportivo La Coruña': 'Deportivo de La Coruña', 'CD Numancia de Soria': 'Numancia',
  'Córdoba CF': 'Córdoba', 'Gimnàstic Tarragona': 'Gimnàstic', 'Recreativo Huelva': 'Recreativo',
  'OGC Nice': 'Niza', 'Olympique de Marseille': 'Olympique de Marsella', 'Strasbourg': 'Estrasburgo',
  'Toulouse': 'Toulouse', 'Lyon': 'Lyon', 'Paris Saint-Germain': 'PSG', 'AC Ajaccio': 'Ajaccio',
  'Clermont Foot': 'Clermont', 'New York Red Bulls': 'New York Red Bulls',
  'France': 'Francia', 'Croatia': 'Croacia', 'Iceland': 'Islandia', 'Saudi Arabia': 'Arabia Saudita',
  'Mexico': 'México', 'Poland': 'Polonia', 'Netherlands': 'Países Bajos', 'Canada': 'Canadá',
  'Peru': 'Perú',
};

// Siglas de tres letras, como en las transmisiones. Van en mayúsculas porque
// son siglas: la regla de Bastos contra las versales no las alcanza.
const SIGLA = {
  'AC Ajaccio': 'ACA', 'Albacete': 'ALB', 'Almería': 'ALM', 'Angers': 'ANG', 'Argentina': 'ARG',
  'Athletic Club': 'ATH', 'Atlético Madrid': 'ATM', 'Australia': 'AUS', 'Barcelona': 'BAR',
  'CD Numancia de Soria': 'NUM', 'Canada': 'CAN', 'Celta Vigo': 'CEL', 'Clermont Foot': 'CLE',
  'Croatia': 'CRO', 'Cádiz': 'CAD', 'Córdoba CF': 'COR', 'Deportivo Alavés': 'ALA', 'Eibar': 'EIB',
  'Elche': 'ELC', 'Espanyol': 'ESP', 'France': 'FRA', 'Getafe': 'GET', 'Gimnàstic Tarragona': 'GIM',
  'Girona': 'GIR', 'Granada': 'GRA', 'Huesca': 'HUE', 'Hércules': 'HER', 'Inter Miami': 'MIA',
  'Las Palmas': 'LPA', 'Leganés': 'LEG', 'Lens': 'LEN', 'Levante UD': 'LEV', 'Lille': 'LIL',
  'Lorient': 'LOR', 'Lyon': 'LYO', 'Mallorca': 'MLL', 'Manchester United': 'MUN', 'Mexico': 'MEX',
  'Montpellier': 'MON', 'Málaga': 'MAL', 'Nantes': 'NAN', 'Netherlands': 'NED',
  'New York Red Bulls': 'NYR', 'Nigeria': 'NGA', 'OGC Nice': 'NIZ', 'Olympique de Marseille': 'MAR',
  'Osasuna': 'OSA', 'Paris Saint-Germain': 'PSG', 'RC Deportivo La Coruña': 'DEP',
  'Racing Santander': 'RAC', 'Rayo Vallecano': 'RAY', 'Real Betis': 'BET', 'Real Madrid': 'RMA',
  'Real Sociedad': 'RSO', 'Real Valladolid': 'VLL', 'Real Zaragoza': 'ZAR', 'Recreativo Huelva': 'REC',
  'Saudi Arabia': 'KSA', 'Sevilla': 'SEV', 'Sporting Gijón': 'SPO', 'Strasbourg': 'STR',
  'Tenerife': 'TEN', 'Toulouse': 'TOU', 'Troyes': 'TRO', 'Valencia': 'VAL', 'Villarreal': 'VIL',
};

// StatsBomb usa el nombre comercial de hoy: el patrocinio de 2022 no va en un
// gol de 2005. Se deja el nombre que el estadio tuvo siempre.
const ESTADIO = {
  'Spotify Camp Nou': 'Camp Nou', 'Visit Mallorca Estadi': 'Son Moix', 'Abanca-Balaídos': 'Balaídos',
  'Estadio Abanca-Riazor': 'Riazor', 'Estádio Cívitas Metropolitano': 'Metropolitano',
  'Power Horse Stadium – Estadio de los Juegos Mediterráneos': 'Estadio de los Juegos Mediterráneos',
  'Stage Front Stadium': 'Estadio de Cornellà-El Prat', 'Decathlon Arena – Stade Pierre-Mauroy': 'Stade Pierre-Mauroy',
  'Saint-Petersburg Stadium ( Gazprom Arena )': 'Estadio de San Petersburgo',
  'Sports Illustrated Stadium': 'Red Bull Arena', 'Wembley Stadium': 'Wembley',
  'Estadio Heliodoro Rodríguez Lopéz': 'Estadio Heliodoro Rodríguez López',
};

// En español de Chile, que es la voz de Bastos.
const TECNICA = { 'Lob': 'Vaselina', 'Half Volley': 'Sobrepique', 'Volley': 'Volea', 'Diving Header': 'Palomita', 'Overhead Kick': 'Chilena' };
const TIPO = { 'Penalty': 'Penal', 'Free Kick': 'Tiro libre' };
const PIERNA = { 'Left Foot': 'zurda', 'Right Foot': 'derecha' };
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

export const competicion = g => COMPETICION[g.competicion] || g.competicion;
export const equipo = n => EQUIPO[n] || n;
export const estadio = g => g.estadio && (ESTADIO[g.estadio.trim()] || g.estadio.trim());

// El minuto que se dice en la transmisión: el 91:47 del segundo tiempo es el
// «90+2», no el 91. Las prórrogas (periodos 3 y 4) siguen la misma cuenta.
export function minuto(g) {
  const m = g.minuto + 1;
  const tope = { 1: 45, 2: 90, 3: 105, 4: 120 }[g.periodo];
  return m > tope ? `${tope}+${m - tope}` : `${m}`;
}

export function fecha(g) {
  const [a, m, d] = g.fecha.split('-').map(Number);
  return `${d} de ${MESES[m - 1]} de ${a}`;
}

export function remate(g) {
  const pierna = PIERNA[g.pierna];
  if (g.pierna === 'Head') return g.tecnica === 'Diving Header' ? 'Palomita' : 'Cabeza';
  const como = TIPO[g.tipo] || TECNICA[g.tecnica] || 'Jugada';
  return pierna ? `${como}, ${pierna}` : como;
}

const esc = t => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const f = n => n.toFixed(1);

// ——— Medidas ———
// Serie A (1:1,414) en 700 de ancho. Margen clásico: 8 % arriba y a los lados,
// 14 % abajo; ese margen inferior absorbe los 7 mm que faltan para el 50 × 70.
const W = 700, H = 990, MT = 56, MB = 98, X0 = 56, CW = W - 2 * X0;
// La cancha llena el ancho y sus líneas son las columnas de toda la hoja. Como
// mide 2:3, no cabe entera: se ven las yardas de ataque y el resto queda fuera.
const S = CW / 80, SY = MT, SH = H - MB - 100 - MT, XMIN = 120 - SH / S;
const col = y => X0 + y * S;
const px = ([x, y]) => [X0 + y * S, SY + (120 - x) * S];
const R = 8;
const Q = 72;

// Con dos `fill`, el navegador se queda con el primero: el negro va solo
// cuando no se pide otro color.
const t = (x, y, txt, tam, extra = '') =>
  `<text x="${f(x)}" y="${f(y)}" font-size="${tam}" ${/(^|\s)fill="/.test(extra) ? '' : `fill="${TINTAS.negra}" `}${extra}>${txt}</text>`;
const NUM = 'font-variant-numeric="tabular-nums"';

function cancha(franja) {
  const C = TINTAS;
  const r = (x0, y0, x1, y1) => { const [a, b] = px([x1, y0]); return `<rect x="${f(a)}" y="${f(b)}" width="${f((y1 - y0) * S)}" height="${f((x1 - x0) * S)}"/>`; };
  const [cx, cy] = px([60, 40]), [ps, py] = px([108, 40]);
  // La medialuna: la parte del círculo de 10 yardas alrededor del punto penal
  // que queda fuera del área grande.
  const [ax1, ay1] = px([102, 32]), [ax2, ay2] = px([102, 48]);
  let o = '';
  for (let x = 0; x < 120; x += 20) { const [, y1] = px([x + 10, 0]); o += `<rect x="${X0}" y="${f(y1)}" width="${CW}" height="${f(10 * S)}" fill="${franja}"/>`; }
  return o + `<g fill="none" stroke="${C.papel}" stroke-opacity=".35">${r(0, 0, 120, 80)}${r(102, 18, 120, 62)}${r(114, 30, 120, 50)}${r(0, 18, 18, 62)}
    <line x1="${X0}" y1="${f(cy)}" x2="${X0 + CW}" y2="${f(cy)}"/><circle cx="${f(cx)}" cy="${f(cy)}" r="${f(10 * S)}"/>
    <path d="M${f(ax1)} ${f(ay1)} A${f(10 * S)} ${f(10 * S)} 0 0 0 ${f(ax2)} ${f(ay2)}"/>
    <path d="M${f(X0)} ${f(SY + S)} A${f(S)} ${f(S)} 0 0 0 ${f(X0 + S)} ${f(SY)}"/><path d="M${f(X0 + CW - S)} ${f(SY)} A${f(S)} ${f(S)} 0 0 0 ${f(X0 + CW)} ${f(SY + S)}"/></g>
    <circle cx="${f(ps)}" cy="${f(py)}" r="2" fill="${C.papel}" fill-opacity=".5"/><circle cx="${f(cx)}" cy="${f(cy)}" r="2" fill="${C.papel}" fill-opacity=".5"/>`;
}

const disco = (x, y, n, fondo, tinta, borde) =>
  `<circle cx="${f(x)}" cy="${f(y)}" r="${R}" fill="${fondo}"${borde ? ` stroke="${borde}" stroke-width="1.4"` : ''}/>` +
  (n != null ? `<text x="${f(x)}" y="${f(y + 3.2)}" font-size="8.5" font-weight="700" text-anchor="middle" ${NUM} fill="${tinta}">${n}</text>` : '');

function flecha(x1, y1, x2, y2, color, tam) {
  const a = Math.atan2(y2 - y1, x2 - x1), p = r => `${f(x2 - tam * 1.6 * Math.cos(a + r))} ${f(y2 - tam * 1.6 * Math.sin(a + r))}`;
  return `<path d="M${f(x2)} ${f(y2)} L${p(0.45)} L${p(-0.45)} Z" fill="${color}"/>`;
}

// La foto del remate: todos los que estaban, con su dorsal. Hueco es un
// compañero que no tocó la pelota; negro, un rival; el arquero, anillo doble.
// Todos llevan anillo hueso para separarse de cualquier pantalla.
function foto(g) {
  const C = TINTAS;
  return g.foto.map(p => {
    const [x, y] = px(p.a);
    if (p.c) return disco(x, y, p.d, 'none', C.papel, C.papel);
    return disco(x, y, p.d, C.negra, C.papel, C.papel) +
      (p.k ? `<circle cx="${f(x)}" cy="${f(y)}" r="${R + 3.5}" fill="none" stroke="${C.papel}" stroke-width="1"/>` : '');
  }).join('');
}

// La jugada: la pelota en líneas y un disco cada vez que cambia de dueño. El
// rojo es solo para el remate que entró; los anteriores, atajados o
// desviados, van cortados en hueso. Messi es el disco rojo.
function jugada(g, pantalla) {
  const C = TINTAS, n = g.cadena.length;
  let o = '';
  g.cadena.forEach((e, i) => {
    const [x1, y1] = px(e.a), [x2, y2] = px(e.b), l = `x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}"`;
    if (i === n - 1) o += `<line ${l} stroke="${C.roja}" stroke-width="3.5"/>${flecha(x1, y1, x2, y2, C.roja, 4)}`;
    else if (e.t === 'p') o += `<line ${l} stroke="${C.papel}" stroke-width="1.6"/>`;
    else if (e.t === 'c') o += `<line ${l} stroke="${C.papel}" stroke-width="1.2" stroke-dasharray="2 4"/>`;
    else if (e.t === 's') o += `<line ${l} stroke="${C.papel}" stroke-width="2.5" stroke-dasharray="7 4"/>`;
  });
  let messi = '';
  g.cadena.forEach((e, i) => {
    if (i && g.cadena[i - 1].j === e.j) return;
    const [x, y] = px(e.a);
    // Messi se dibuja al final para que ningún disco lo tape.
    if (e.j === 'Lionel Messi') messi += disco(x, y, e.d, C.roja, C.papel, C.papel);
    else o += disco(x, y, e.d, C.papel, pantalla);
  });
  return o + messi;
}

// Donde la jugada cruza el borde inferior de la pantalla, un triángulo sobre
// el papel avisa que viene de más atrás.
function entrada(g, pantalla) {
  for (const e of g.cadena) {
    const [lo, hi] = e.a[0] < e.b[0] ? [e.a, e.b] : [e.b, e.a];
    if (lo[0] < XMIN && hi[0] >= XMIN) {
      const y = lo[1] + (hi[1] - lo[1]) * (XMIN - lo[0]) / (hi[0] - lo[0]);
      const x = X0 + y * S, yb = SY + SH;
      return `<path d="M${f(x - 6)} ${f(yb + 12)} L${f(x + 6)} ${f(yb + 12)} L${f(x)} ${f(yb + 3)} Z" fill="${pantalla}"/>`;
    }
  }
  return '';
}

// ——— El marcador ———
// Como el de una transmisión: siglas, el resultado en ese minuto y el reloj
// aparte. Flota a 14 del borde y se pasa a la esquina derecha cuando la
// jugada ocupa la izquierda.
const AIRE = 14, FH = 30, CELDA = { chip: 12, sigla: 36, gol: 22, guion: 12, min: 58 }, HUECO = 6;
const FRANJA = 2 * (CELDA.chip + CELDA.sigla + CELDA.gol) + CELDA.guion + 16;
const FW = FRANJA + HUECO + CELDA.min;

export function esquina(g) {
  const ancho = (FW + AIRE) / S, alto = (FH + AIRE) / S;
  const caja = (y0, y1) => ([x, y]) => x >= XMIN && x <= XMIN + alto && y >= y0 && y <= y1;
  const pisa = c => g.foto.some(p => c(p.a)) || g.cadena.some(e => {
    for (let i = 0; i <= 10; i++) if (c([e.a[0] + (e.b[0] - e.a[0]) * i / 10, e.a[1] + (e.b[1] - e.a[1]) * i / 10])) return true;
    return false;
  });
  const izq = pisa(caja(0, ancho)), der = pisa(caja(80 - ancho, 80));
  return { lado: izq && !der ? 'der' : 'izq', choca: izq && der };
}

function marcador(g, lado, pantalla) {
  const C = TINTAS;
  const x0 = lado === 'izq' ? X0 + AIRE : X0 + CW - AIRE - FW, y0 = SY + SH - AIRE - FH, ym = y0 + FH / 2 + 4.5;
  // Los chips repiten el código de los discos: el color del equipo de Messi
  // de un lado, negro para el rival.
  const chip = esLocal => ((g.equipo === g.local) === esLocal) ? pantalla : C.negra;
  const [gl, gv] = g.parcial || g.marcador;
  let o = `<rect x="${f(x0)}" y="${f(y0)}" width="${FRANJA}" height="${FH}" fill="${C.papel}"/>`;
  o += `<rect x="${f(x0 + 8)}" y="${f(y0 + FH / 2 - 4)}" width="8" height="8" fill="${chip(true)}"/>`;
  let x = x0 + CELDA.chip + 8;
  o += t(x, ym, SIGLA[g.local] || g.local.slice(0, 3).toUpperCase(), 13, `font-weight="700" fill="${C.azul}"`); x += CELDA.sigla;
  o += t(x + CELDA.gol - 4, ym + 1, gl, 15, `text-anchor="end" font-weight="800" ${NUM} fill="${C.azul}"`); x += CELDA.gol;
  o += t(x + CELDA.guion / 2, ym, '–', 13, `text-anchor="middle" fill="${C.azul}" fill-opacity=".6"`); x += CELDA.guion;
  o += t(x + 4, ym + 1, gv, 15, `font-weight="800" ${NUM} fill="${C.azul}"`); x += CELDA.gol;
  o += t(x, ym, SIGLA[g.visita] || g.visita.slice(0, 3).toUpperCase(), 13, `font-weight="700" fill="${C.azul}"`);
  o += `<rect x="${f(x0 + FRANJA - 16)}" y="${f(y0 + FH / 2 - 4)}" width="8" height="8" fill="${chip(false)}"/>`;
  const mx = x0 + FRANJA + HUECO;
  o += `<rect x="${f(mx)}" y="${f(y0)}" width="${CELDA.min}" height="${FH}" fill="${C.roja}"/>`;
  o += t(mx + CELDA.min / 2, ym, `${minuto(g)}’`, 13, `text-anchor="middle" font-weight="700" ${NUM} fill="${C.papel}"`);
  return o;
}

// ——— La ficha ———
// Rótulo chico arriba y dato abajo, en las columnas que salen de las líneas de
// la cancha, como las fichas de PC Fútbol. El resultado final ocupa dos
// columnas porque los nombres de equipo son largos.
function ficha(g, yb) {
  const dato = (c, fila, rot, val) =>
    t(col(c), yb + 26 + fila * 34, esc(rot), 10, 'fill-opacity=".55"') +
    t(col(c), yb + 42 + fila * 34, esc(val), 13, 'font-weight="600"');
  const final = `${equipo(g.local)} ${g.marcador[0]}–${g.marcador[1]} ${equipo(g.visita)}` +
    (g.penales ? `, ${g.penales[0]}–${g.penales[1]} en penales` : '');
  // «2008/09» y no «2008/2009»: con la fase, la Champions no cabía en su columna.
  const torneo = `${competicion(g)} ${g.temporada.replace(/^(\d{4})\/\d{2}(\d{2})$/, '$1/$2')}` + (FASE[g.fase] ? `, ${FASE[g.fase]}` : '');
  const metros = Math.round(Math.hypot(120 - g.cadena.at(-1).a[0], 40 - g.cadena.at(-1).a[1]) * 0.9144);
  const prob = `${Math.max(1, Math.round(g.xg * 100))} %`;
  return dato(0, 0, 'Resultado final', final) + dato(50, 0, 'Fecha', g.fecha.split('-').reverse().join('.')) +
    dato(0, 1, 'Competición', torneo) + dato(30, 1, 'Remate', remate(g)) +
    dato(50, 1, 'Distancia · Probabilidad', `${metros} m · ${prob}`);
}

// ——— El pie ———
// El nombre de la serie, el número y la firma. El número es el orden dentro
// de la serie, que no es la cuenta de su carrera: faltan los goles sin datos.
// StatsBomb pide citarlos con su logo. Va en negro, la única de sus versiones
// que es de una tinta y se lee sobre el papel hueso.
const LOGO = { ancho: 2258, alto: 344 };
function pie(g, total, logo) {
  // 8 de alto: más grande se come el aire que el QR necesita alrededor.
  const y = H - MB, h = 8, w = h * LOGO.ancho / LOGO.alto;
  return t(col(0), y, 'Los goles de Lionel Messi', 12, 'font-weight="700"') +
    t(col(30), y, `Nº ${g.n}${total ? ` de ${total}` : ''}`, 12, `${NUM} font-weight="600"`) +
    t(col(50), y, '<tspan font-weight="700">Bastos</tspan><tspan dx="8" font-size="10" fill-opacity=".55">Datos:</tspan>', 12) +
    `<image href="${logo}" x="${f(col(50) + 88)}" y="${f(y - h + 0.5)}" width="${f(w)}" height="${h}" preserveAspectRatio="xMinYMid meet"/>`;
}

// El QR lleva a estudiobastos.com/messi/<n> y no directo al video: si el
// video se cae, se cambia el destino en el sitio y el afiche impreso sigue
// sirviendo. Corrección M: aguanta un 15 % de daño, que en papel colgado es
// un pliegue o una mancha.
export const enlace = g => `https://estudiobastos.com/messi/${g.n}`;

function qr(g) {
  const c = qrcode(0, 'M');
  c.addData(enlace(g));
  c.make();
  const n = c.getModuleCount(), m = Q / n, x0 = col(80) - Q, y0 = H - MB - Q;
  // Un solo trazado con todos los módulos: imprime nítido a cualquier tamaño
  // y pesa poco más que un rectángulo.
  let d = '';
  for (let r = 0; r < n; r++) for (let k = 0; k < n; k++)
    if (c.isDark(r, k)) d += `M${f(x0 + k * m)} ${f(y0 + r * m)}h${f(m)}v${f(m)}h${f(-m)}z`;
  return `<path d="${d}" fill="${TINTAS.negra}" shape-rendering="crispEdges"/>`;
}

// `logo` es la ruta del logo de StatsBomb vista desde la página que muestra el
// afiche; para el PDF, exportar.js lo pasa incrustado.
export function afiche(g, total, { logo = 'terceros/statsbomb-negro.png' } = {}) {
  const C = TINTAS;
  const [pantalla, franja] = PANTALLA[g.equipo] || PANTALLA.Barcelona;
  const { lado, choca } = esquina(g);
  const titulo = `${equipo(g.local)} ${g.marcador[0]}–${g.marcador[1]} ${equipo(g.visita)}, gol de Messi en el minuto ${minuto(g)}`;
  const k = `p${g.n}`;
  // En los pocos goles cuya jugada pasa por las dos esquinas, el marcador va
  // debajo de la jugada: el gol manda.
  const m = marcador(g, lado, pantalla);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" font-family="Plus Jakarta Sans, system-ui, sans-serif" role="img" aria-label="${esc(titulo)}">
  <rect width="${W}" height="${H}" fill="${C.papel}"/>
  <clipPath id="${k}"><rect x="${X0}" y="${SY}" width="${CW}" height="${f(SH)}"/></clipPath>
  <rect x="${X0}" y="${SY}" width="${CW}" height="${f(SH)}" fill="${pantalla}"/>
  <g clip-path="url(#${k})">${cancha(franja)}${choca ? m : ''}${foto(g)}${jugada(g, pantalla)}</g>
  ${choca ? '' : m}${entrada(g, pantalla)}
  ${ficha(g, SY + SH)}${pie(g, total, logo)}${qr(g)}
</svg>`;
}
