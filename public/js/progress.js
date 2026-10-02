// Learned-word progress, kept in the browser's localStorage.
var Progress = (function () {
  var KEY = 'vcards.learned';

  function load() {
    try {
      return new Set(JSON.parse(localStorage.getItem(KEY)) || []);
    } catch (e) {
      return new Set();
    }
  }

  function save(set) {
    try {
      localStorage.setItem(KEY, JSON.stringify(Array.from(set)));
    } catch (e) { /* storage unavailable: progress lives only for this page */ }
  }

  var learned = load();

  return {
    isLearned: function (id) { return learned.has(id); },
    markLearned: function (id) { learned.add(id); save(learned); },
    countLearned: function (from, to) {
      var n = 0;
      learned.forEach(function (id) { if (id >= from && id <= to) n++; });
      return n;
    },
    resetRange: function (from, to) {
      learned.forEach(function (id) { if (id >= from && id <= to) learned.delete(id); });
      save(learned);
    },
    resetAll: function () { learned.clear(); save(learned); },
  };
})();
