document.addEventListener('DOMContentLoaded', function () {
  /* ——— Botón 1: cambia el peso/estilo de la frase ——— */
  var phrase = document.getElementById('cover-phrase');
  var btnType = document.getElementById('btn-action-type');
  if (phrase && btnType) {
    var PHRASE_TEXT = phrase.textContent.trim();
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
});
