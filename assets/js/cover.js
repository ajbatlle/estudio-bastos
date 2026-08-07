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

  /* ——— Botón 4: piezas dispersas ——— */
  var scatter = document.getElementById('cover-scatter');
  var btnMore = document.getElementById('btn-action-more');
  if (scatter && btnMore) {
    btnMore.addEventListener('click', function () {
      var showing = scatter.classList.toggle('visible');
      btnMore.setAttribute('aria-pressed', showing ? 'true' : 'false');
    });
  }
});
