(function () {
  var REVERSE_KEY = 'vcards.reverse';
  var $ = function (id) { return document.getElementById(id); };

  var card = $('card');
  var queue = [];
  var current = null;
  var flipped = false;
  var reverse = false;

  try { reverse = localStorage.getItem(REVERSE_KEY) === '1'; } catch (e) {}
  $('reverse').checked = reverse;

  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  }

  function buildQueue() {
    queue = shuffle(window.WORDS.filter(function (w) { return !Progress.isLearned(w.id); }));
  }

  function updateProgress() {
    var total = window.WORDS.length;
    var left = queue.length;
    $('remaining').textContent = left;
    $('progress').style.width = (100 * (total - left) / total) + '%';
  }

  function setFlipped(value, animate) {
    flipped = value;
    if (!animate) card.classList.add('no-anim');
    card.classList.toggle('flipped', value);
    if (!animate) {
      void card.offsetWidth; // apply the instant flip before re-enabling transitions
      card.classList.remove('no-anim');
    }
    $('actions-front').hidden = value;
    $('actions-back').hidden = !value;
  }

  function show() {
    updateProgress();
    if (!queue.length) {
      $('study').hidden = true;
      $('done').hidden = false;
      return;
    }
    $('study').hidden = false;
    $('done').hidden = true;
    current = queue[0];
    setFlipped(false, false);
    $('front-word').textContent = reverse ? current.uk : current.en;
    $('back-word').textContent = reverse ? current.en : current.uk;
    $('back-hint').textContent = reverse ? current.uk : current.en;
    card.focus({ preventScroll: true });
  }

  function flip() {
    if (current) setFlipped(!flipped, true);
  }

  function answer(known) {
    if (!current || !flipped) return;
    queue.shift();
    if (known) {
      Progress.markLearned(current.id);
    } else {
      // Put it back a few cards later so it doesn't repeat immediately.
      var pos = Math.min(queue.length, 3 + Math.floor(Math.random() * 5));
      queue.splice(pos, 0, current);
    }
    show();
  }

  card.addEventListener('click', flip);
  $('flip-btn').addEventListener('click', flip);
  $('known-btn').addEventListener('click', function () { answer(true); });
  $('unknown-btn').addEventListener('click', function () { answer(false); });
  $('restart-btn').addEventListener('click', function () {
    Progress.resetRange(window.DECK.from, window.DECK.to);
    buildQueue();
    show();
  });
  $('reverse').addEventListener('change', function (e) {
    reverse = e.target.checked;
    try { localStorage.setItem(REVERSE_KEY, reverse ? '1' : '0'); } catch (err) {}
    show();
  });

  document.addEventListener('keydown', function (e) {
    if (e.target.tagName === 'INPUT') return;
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); flip(); }
    else if (e.key === 'ArrowLeft') answer(false);
    else if (e.key === 'ArrowRight') answer(true);
  });

  buildQueue();
  show();
})();
