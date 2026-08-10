document.addEventListener('DOMContentLoaded', function () {
  /* ——— Entrada: la frase se escribe sola al cargar la página ——— */
  var phrase = document.getElementById('cover-phrase');
  var PHRASE_TEXT = phrase ? phrase.textContent.trim() : '';

  if (phrase) {
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      phrase.textContent = PHRASE_TEXT;
    } else {
      phrase.textContent = '';
      phrase.classList.add('is-typing');
      var caret = document.createElement('span');
      caret.className = 'cover-caret';
      phrase.appendChild(caret);
      var typeI = 0;
      var TYPE_SPEED = 32; // ms por carácter — lento y elegante
      function typeTick() {
        if (typeI < PHRASE_TEXT.length) {
          caret.insertAdjacentText('beforebegin', PHRASE_TEXT.charAt(typeI));
          typeI++;
          setTimeout(typeTick, TYPE_SPEED);
        } else {
          phrase.classList.remove('is-typing');
          setTimeout(function () { if (caret.parentNode) caret.parentNode.removeChild(caret); }, 1000);
        }
      }
      setTimeout(typeTick, 500); // pausa breve para que asiente el fondo antes de escribir
    }
  }

  /* ——— Botón 1: cambia el peso/estilo de la frase ——— */
  var btnType = document.getElementById('btn-action-type');
  if (phrase && btnType) {
    var WORDS = PHRASE_TEXT.split(/\s+/);
    var MIX_WEIGHTS = ['300', '400', '500', '600', '700', '800'];
    var TYPE_STATES = ['bold', 'regular', 'italic', 'mixed'];
    var typeIndex = 0;

    function applyTypeState() {
      var state = TYPE_STATES[typeIndex];
      phrase.classList.remove('is-regular', 'is-italic', 'is-mixed');
      if (state === 'mixed') {
        phrase.classList.add('is-mixed');
        phrase.innerHTML = WORDS.map(function (w, i) {
          return '<span style="font-weight:' + MIX_WEIGHTS[i % MIX_WEIGHTS.length] + '">' + w + '</span>';
        }).join(' ');
      } else {
        phrase.textContent = PHRASE_TEXT;
        if (state === 'regular') phrase.classList.add('is-regular');
        if (state === 'italic') phrase.classList.add('is-italic');
      }
      btnType.setAttribute('aria-pressed', state === 'bold' ? 'false' : 'true');
    }

    btnType.addEventListener('click', function () {
      typeIndex = (typeIndex + 1) % TYPE_STATES.length;
      applyTypeState();
    });
  }

  /* ——— Logo: rebota por la pantalla, como el viejo protector de pantalla ——— */
  var logoBtn = document.getElementById('btn-logo-bounce');
  if (logoBtn) {
    var bounceRaf = null;
    var bx, by, bvx, bvy, bw, bh;

    function bounceStep() {
      var vw = window.innerWidth, vh = window.innerHeight;
      bx += bvx; by += bvy;
      if (bx <= 0) { bx = 0; bvx = Math.abs(bvx); }
      if (bx + bw >= vw) { bx = vw - bw; bvx = -Math.abs(bvx); }
      if (by <= 0) { by = 0; bvy = Math.abs(bvy); }
      if (by + bh >= vh) { by = vh - bh; bvy = -Math.abs(bvy); }
      logoBtn.style.transform = 'translate(' + bx + 'px,' + by + 'px)';
      bounceRaf = requestAnimationFrame(bounceStep);
    }

    function startBounce() {
      var rect = logoBtn.getBoundingClientRect();
      bx = rect.left; by = rect.top; bw = rect.width; bh = rect.height;
      logoBtn.classList.add('bouncing');
      logoBtn.style.transform = 'translate(' + bx + 'px,' + by + 'px)';
      var speed = 2.4;
      bvx = (Math.random() < 0.5 ? -1 : 1) * (speed + Math.random());
      bvy = (Math.random() < 0.5 ? -1 : 1) * (speed + Math.random());
      bounceRaf = requestAnimationFrame(bounceStep);
    }

    function stopBounce() {
      cancelAnimationFrame(bounceRaf);
      logoBtn.classList.remove('bouncing');
      logoBtn.style.transform = '';
    }

    logoBtn.addEventListener('click', function () {
      var bouncing = logoBtn.getAttribute('aria-pressed') === 'true';
      logoBtn.setAttribute('aria-pressed', bouncing ? 'false' : 'true');
      if (bouncing) stopBounce(); else startBounce();
    });
  }

  /* ——— Botón 2: isotipo sobre el logo ——— */
  var isotipo = document.getElementById('cover-isotipo');
  var btnMark = document.getElementById('btn-action-mark');
  if (isotipo && btnMark) {
    btnMark.addEventListener('click', function () {
      var showing = isotipo.classList.toggle('visible');
      btnMark.setAttribute('aria-pressed', showing ? 'true' : 'false');
    });
  }

  /* ——— Botón 3: capa de ruido ——— */
  var noise = document.getElementById('cover-noise');
  var btnNoise = document.getElementById('btn-action-noise');
  if (noise && btnNoise) {
    btnNoise.addEventListener('click', function () {
      var showing = noise.classList.toggle('visible');
      btnNoise.setAttribute('aria-pressed', showing ? 'true' : 'false');
    });
  }

  /* ——— Botón 4: piezas dispersas, aleatorias en cada clic ——— */
  var scatter = document.getElementById('cover-scatter');
  var btnMore = document.getElementById('btn-action-more');
  if (scatter && btnMore) {
    var SCATTER_SHAPES = [
      '<rect x="127.9" y="16.3" width="78.9" height="78.9" transform="translate(9.6 134.7) rotate(-45)"/><rect x="16.3" y="16.3" width="78.9" height="78.9" transform="translate(-23.1 55.8) rotate(-45)"/><rect x="127.9" y="127.9" width="78.9" height="78.9" transform="translate(-69.3 167.4) rotate(-45)"/><rect x="16.3" y="127.9" width="78.9" height="78.9" transform="translate(-102 88.5) rotate(-45)"/>',
      '<circle cx="185.9" cy="111.6" r="37.3"/><circle cx="111.6" cy="37.3" r="37.3" transform="translate(-6 33.9) rotate(-16.8)"/><circle cx="111.6" cy="185.9" r="37.3" transform="translate(-62.7 56.9) rotate(-22.5)"/><circle cx="37.3" cy="111.6" r="37.3" transform="translate(-77.2 84.6) rotate(-58.3)"/>',
      '<path d="M223.2,87.1h0s-87.1,0-87.1,0V0h0C60.9,0,0,60.9,0,136h0s87.1,0,87.1,0v87.1h0c75.1,0,136-60.9,136-136Z"/>',
      '<polygon points="54.3 111.6 111.6 111.6 111.6 168.8 54.3 168.8 54.3 223.2 223.2 223.2 223.2 54 169.5 54 169.5 110.9 112.2 110.9 112.2 53.6 169.2 53.6 169.2 0 0 0 0 168.8 54.3 168.8 54.3 111.6"/>',
      '<path d="M0,87.1h0C48.1,87.1,87.1,48.1,87.1,0h0s-87.1,0-87.1,0v87.1Z"/>',
      '<path d="M223.2,55.8h-55.8c0-30.8-25-55.8-55.8-55.8s-55.8,25-55.8,55.8H0c0,30.8,25,55.8,55.8,55.8-30.8,0-55.8,25-55.8,55.8h55.8c0,30.8,25,55.8,55.8,55.8s55.8-25,55.8-55.8h55.8c0-30.8-25-55.8-55.8-55.8,30.8,0,55.8-25,55.8-55.8ZM128.3,94.9v33.4h-33.4v-33.4h33.4Z"/>',
      '<rect x="89.3" width="44.6" height="223.2"/>',
      '<path d="M111.6,223.2h0c61.6,0,111.6-50,111.6-111.6h0C223.2,50,173.2,0,111.6,0h0C50,0,0,50,0,111.6h0c0,61.6,50,111.6,111.6,111.6ZM111.6,39.1c40,0,72.5,32.5,72.5,72.5s-32.5,72.5-72.5,72.5-72.5-32.5-72.5-72.5S71.6,39.1,111.6,39.1Z"/>'
    ];

    /* Franjas laterales seguras: no invaden la columna central de la frase
     * ni las zonas de arriba (botones) o abajo (logo/Entrar). */
    var SCATTER_SLOTS = [
      { top: '9%', side: 'left', at: '6%' },
      { top: '9%', side: 'right', at: '7%' },
      { top: '22%', side: 'left', at: '4%' },
      { top: '22%', side: 'right', at: '5%' },
      { top: '38%', side: 'left', at: '7%' },
      { top: '38%', side: 'right', at: '4%' },
      { top: '54%', side: 'left', at: '5%' },
      { top: '54%', side: 'right', at: '6%' },
      { top: '70%', side: 'left', at: '8%' },
      { top: '70%', side: 'right', at: '5%' },
      { top: '82%', side: 'left', at: '5%' },
      { top: '82%', side: 'right', at: '7%' }
    ];

    function shuffle(arr) {
      var a = arr.slice();
      for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
      }
      return a;
    }

    function renderScatter() {
      scatter.innerHTML = '';
      var count = 3 + Math.floor(Math.random() * 5); // 3 a 7 piezas
      var slots = shuffle(SCATTER_SLOTS).slice(0, count);
      var pieces = [];

      slots.forEach(function (slot) {
        var shapeHTML = SCATTER_SHAPES[Math.floor(Math.random() * SCATTER_SHAPES.length)];
        var size = 30 + Math.floor(Math.random() * 26); // 30 a 56px
        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 223.2 223.2');
        svg.classList.add('scatter-piece');
        svg.style.width = size + 'px';
        svg.style.height = size + 'px';
        svg.style.top = slot.top;
        svg.style[slot.side] = slot.at;
        svg.innerHTML = shapeHTML;
        scatter.appendChild(svg);
        pieces.push(svg);
      });

      /* Mismo fade in que el isotipo: opacity 0 -> 1 en un frame aparte
       * para que el navegador dispare la transición. */
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          pieces.forEach(function (svg) { svg.classList.add('visible'); });
        });
      });
    }

    btnMore.addEventListener('click', renderScatter);
  }

  /* ——— Cursor a medida (element-20) ——— */
  var cursorEl = document.getElementById('custom-cursor');
  if (cursorEl && window.matchMedia && window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', function (e) {
      cursorEl.classList.add('active');
      cursorEl.style.transform = 'translate(' + (e.clientX - 11) + 'px,' + (e.clientY - 11) + 'px)';
    });
    document.addEventListener('mouseleave', function () {
      cursorEl.classList.remove('active');
    });
  }

  /* ——— Entrar / Volver: transición entre la portada y la grilla ——— */
  var btnEnter = document.getElementById('btn-enter');
  var btnGridBack = document.getElementById('btn-grid-back');
  var coverForeground = document.getElementById('cover-foreground');
  var menuGrid = document.getElementById('menu-grid');
  if (btnEnter && coverForeground && menuGrid) {
    btnEnter.addEventListener('click', function () {
      btnEnter.disabled = true;
      coverForeground.classList.add('hidden');
      setTimeout(function () {
        menuGrid.removeAttribute('aria-hidden');
        menuGrid.classList.add('visible');
        if (btnGridBack) btnGridBack.classList.add('visible');
      }, 700);
    });
  }
  if (btnGridBack && coverForeground && menuGrid && btnEnter) {
    btnGridBack.addEventListener('click', function () {
      btnGridBack.classList.remove('visible');
      menuGrid.classList.remove('visible');
      menuGrid.setAttribute('aria-hidden', 'true');
      setTimeout(function () {
        coverForeground.classList.remove('hidden');
        btnEnter.disabled = false;
      }, 700);
    });
  }
});
