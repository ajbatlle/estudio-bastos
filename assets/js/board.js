document.addEventListener('DOMContentLoaded', function () {
  var COLS = 10, ROWS = 7;
  var STORAGE_KEY = 'bastos-mundo-piece';
  var START = { x: 4, y: 3 };

  var ZONES = [
    { x: 1, y: 1, label: 'proyectos', href: 'proyectos.html' },
    { x: 8, y: 1, label: 'servicios', href: 'servicios.html' },
    { x: 1, y: 5, label: 'nosotros', href: 'nosotros.html' },
    { x: 8, y: 5, label: 'archivo', href: 'archivo.html' },
    { x: 4, y: 1, label: 'afiches', action: 'game' }
  ];

  /* Cada cuarto es un corte booleano sobre el cuadrado (misma gramática que
   * assets/elements): la mordida de esquina es la puerta, y siempre mira
   * hacia el camino caminable (el centro del tablero). */
  var ROOM_SHAPES = {
    proyectos: 'M0,0h223.2v111.6c-61.6,0,-111.6,50,-111.6,111.6H0V0Z',
    servicios: 'M223.2,0h-223.2v111.6c61.6,0,111.6,50,111.6,111.6H223.2V0Z',
    nosotros: 'M0,223.2h223.2v-111.6c-61.6,0,-111.6,-50,-111.6,-111.6H0Z',
    archivo: 'M223.2,223.2h-223.2v-111.6c61.6,0,111.6,-50,111.6,-111.6H223.2Z',
    afiches: 'M0,0H223.2V223.2H195.3V27.9H27.9V223.2H0Z'
  };

  var pieces = [];
  for (var n = 1; n <= 100; n++) {
    var num = n < 10 ? '0' + n : String(n);
    pieces.push('assets/elements/element-' + num + '.svg');
  }

  var grid = document.getElementById('piece-grid');
  var startBtn = document.getElementById('btn-start');
  var screenSelect = document.getElementById('screen-select');
  var screenBoard = document.getElementById('screen-board');
  var board = document.getElementById('board');
  var player = document.getElementById('board-player');
  var playerImg = document.getElementById('board-player-img');
  var dpad = document.getElementById('dpad');
  var hint = document.getElementById('board-hint');
  if (!grid || !board) return;

  var selectedSrc = null;
  var x = START.x, y = START.y;
  var tileW = 0, tileH = 0;

  grid.innerHTML = pieces.map(function (src, i) {
    return '<button type="button" class="piece-btn" data-src="' + src + '" aria-label="Ficha ' + (i + 1) + '"><img src="' + src + '" alt="" loading="lazy"></button>';
  }).join('');

  function zoneAt(px, py) {
    for (var i = 0; i < ZONES.length; i++) {
      if (ZONES[i].x === px && ZONES[i].y === py) return ZONES[i];
    }
    return null;
  }

  function enterZoneObj(zone) {
    if (!zone) return;
    if (zone.href) window.location.href = zone.href;
    else if (zone.action === 'game') openGame();
  }

  for (var ty = 0; ty < ROWS; ty++) {
    for (var tx = 0; tx < COLS; tx++) {
      var zone = zoneAt(tx, ty);
      var tile = document.createElement('div');
      if (zone) {
        tile.className = 'tile zone-tile';
        tile.setAttribute('aria-label', zone.label);
        var shapeD = ROOM_SHAPES[zone.label] || '';
        tile.innerHTML = '<svg class="zone-shape" viewBox="0 0 223.2 223.2" aria-hidden="true"><path d="' + shapeD + '"/></svg>';
        tile.addEventListener('click', (function (z) {
          return function () { enterZoneObj(z); };
        })(zone));
      } else {
        tile.className = 'tile';
        /* El perímetro del tablero es el muro exterior de la casa: ninguna
         * de las 5 puertas cae sobre el borde mismo de la grilla, así que
         * el anillo externo queda libre para cerrar el contorno. */
        if (tx === 0) tile.classList.add('tile-wall-l');
        if (tx === COLS - 1) tile.classList.add('tile-wall-r');
        if (ty === 0) tile.classList.add('tile-wall-t');
        if (ty === ROWS - 1) tile.classList.add('tile-wall-b');
      }
      board.insertBefore(tile, player);
    }
  }

  function selectPiece(btn) {
    var current = grid.querySelector('.piece-btn.selected');
    if (current) current.classList.remove('selected');
    btn.classList.add('selected');
    selectedSrc = btn.dataset.src;
    startBtn.disabled = false;
  }

  grid.addEventListener('click', function (e) {
    var btn = e.target.closest('.piece-btn');
    if (btn) selectPiece(btn);
  });

  var saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    var savedBtn = grid.querySelector('.piece-btn[data-src="' + saved + '"]');
    if (savedBtn) selectPiece(savedBtn);
  }

  function layout() {
    var rect = board.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    tileW = rect.width / COLS;
    tileH = rect.height / ROWS;
    var pad = Math.min(tileW, tileH) * 0.14;
    player.style.width = tileW + 'px';
    player.style.height = tileH + 'px';
    playerImg.style.width = (tileW - pad * 2) + 'px';
    playerImg.style.height = (tileH - pad * 2) + 'px';
    playerImg.style.margin = pad + 'px';
    updatePlayer();
  }

  function updatePlayer() {
    player.style.left = (x * tileW) + 'px';
    player.style.top = (y * tileH) + 'px';
    var zone = zoneAt(x, y);
    if (hint) {
      hint.textContent = zone ? '↵ Enter para entrar a ' + zone.label : 'Usa las flechas o W A S D para moverte.';
      hint.classList.toggle('on-zone', !!zone);
    }
  }

  window.addEventListener('resize', function () {
    if (screenBoard.classList.contains('active')) layout();
  });

  function move(dx, dy) {
    x = Math.max(0, Math.min(COLS - 1, x + dx));
    y = Math.max(0, Math.min(ROWS - 1, y + dy));
    updatePlayer();
  }

  function enterZone() {
    enterZoneObj(zoneAt(x, y));
  }

  startBtn.addEventListener('click', function () {
    if (!selectedSrc) return;
    playerImg.src = selectedSrc;
    localStorage.setItem(STORAGE_KEY, selectedSrc);
    x = START.x; y = START.y;
    screenSelect.classList.remove('active');
    screenBoard.classList.add('active');
    layout();
  });

  var KEY_MAP = {
    ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0],
    w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0],
    W: [0, -1], S: [0, 1], A: [-1, 0], D: [1, 0]
  };

  document.addEventListener('keydown', function (e) {
    if (!screenBoard.classList.contains('active')) return;
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); enterZone(); return; }
    var delta = KEY_MAP[e.key];
    if (!delta) return;
    e.preventDefault();
    move(delta[0], delta[1]);
  });

  dpad.addEventListener('click', function (e) {
    var btn = e.target.closest('.dpad-btn');
    if (!btn) return;
    move(+btn.dataset.dx, +btn.dataset.dy);
  });

  /* ——— Casilla-juego: armar un afiche ——— */
  var screenGame = document.getElementById('screen-game');
  var gameGrid = document.getElementById('game-piece-grid');
  var gameBackBtn = document.getElementById('btn-game-back');
  var downloadBtn = document.getElementById('btn-download');
  var canvas = document.getElementById('poster-canvas');
  var bgButtons = document.querySelectorAll('.bg-btn');

  var gameBg = 'blue';
  var gameSrc = pieces[0];

  function renderPoster() {
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = gameBg === 'blue' ? '#003ec0' : '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    var img = new Image();
    img.onload = function () {
      var size = canvas.width * 0.6;
      var px = (canvas.width - size) / 2;
      var py = (canvas.height - size) / 2;
      ctx.save();
      if (gameBg === 'blue') ctx.filter = 'invert(1)';
      ctx.drawImage(img, px, py, size, size);
      ctx.restore();
    };
    img.src = gameSrc;
  }

  function openGame() {
    if (!screenGame) return;
    screenBoard.classList.remove('active');
    screenGame.classList.add('active');
    renderPoster();
  }

  if (screenGame && gameGrid && canvas) {
    gameGrid.innerHTML = pieces.map(function (src, i) {
      return '<button type="button" class="piece-btn" data-src="' + src + '" aria-label="Ficha ' + (i + 1) + '"><img src="' + src + '" alt="" loading="lazy"></button>';
    }).join('');
    gameGrid.querySelector('.piece-btn').classList.add('selected');

    bgButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        bgButtons.forEach(function (b) { b.classList.remove('selected'); });
        btn.classList.add('selected');
        gameBg = btn.dataset.bg;
        renderPoster();
      });
    });

    gameGrid.addEventListener('click', function (e) {
      var btn = e.target.closest('.piece-btn');
      if (!btn) return;
      var current = gameGrid.querySelector('.piece-btn.selected');
      if (current) current.classList.remove('selected');
      btn.classList.add('selected');
      gameSrc = btn.dataset.src;
      renderPoster();
    });

    downloadBtn.addEventListener('click', function () {
      var link = document.createElement('a');
      link.download = 'afiche-bastos.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    });

    if (gameBackBtn) {
      gameBackBtn.addEventListener('click', function () {
        screenGame.classList.remove('active');
        screenBoard.classList.add('active');
      });
    }
  }
});
